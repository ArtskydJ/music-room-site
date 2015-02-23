var test = require('tape')
var EventEmitter = require('events').EventEmitter
var SessionManager = require('../server/session-manager.js')
var connectSession = require('../client/connect-session.js')
var Level = require('level-mem')
var StateHolder = require('state-holder')
var bypass = require('just-login-bypass')
var Promise = require('promise')

function makeIo() {
	var rooms = {}
	var io = new EventEmitter()
	io.in = function ioin(room) {
		if (!rooms[room]) {
			rooms[room] = new EventEmitter()
		}
		return rooms[room]
	}
	return io
}

function makeSocket(io) {
	var inRooms = []
	var socket = new EventEmitter()
	socket.join = function join(room) {
		socket.emit('_join', room)
	}
	socket.leave = function leave(room) {
		socket.emit('_leave', room)
	}
	io.emit('connect', socket)
	return socket
}

function makeSessionManager() {
	var io = makeIo()
	var core = SessionManager(io, new Level())
	if (false) {
		// delete the if block when the just-login-emailer
		// is implemented in session-manager.js
		io.removeAllListeners('authentication initiated')
		bypass(core)
	}
	var socket = makeSocket(io)
	return socket
}

function establishSession() {
	var socket = makeSessionManager()
	var state = StateHolder()
	return connectSession(socket, state).then(function (sessionId) {
		return Promise.resolve({
			socket: socket,
			sessionId: sessionId
		})
	})
}

function timeout(ms) {
	return function (val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, ms, val)
		})
	}
}

test('client/connect-session.js', function (t) {
	t.plan(1)

	var socket = makeSessionManager()
	var state = StateHolder()

	connectSession(socket, state).then(function (sessionId1) {
		connectSession(socket, state).then(function (sessionId2) {
			t.equal(sessionId1, sessionId2, 'session IDs are identical')
		})
	})
})

test('client/connect-session.js', function (t) {
	t.plan(3)

	establishSession()
	.then(function (obj) {
		var sessionId = obj.sessionId
		var socket = obj.socket
		var socketEmit = Promise.denodeify( socket.emit.bind(socket) )

		socketEmit('session isAuthenticated')
		.then(function (addr) {
			t.notOk(addr, 'not authenticated')
		})

		.then(function () {
			return socketEmit('session beginAuthentication', 'joe')
		})
		.then(function (addr) {
			t.equal(addr, 'joe', 'authenticated')
		})
		.then(timeout(100))

		.then(function () {
			return socketEmit('session isAuthenticated')
		})
		.then(function (addr) {
			t.equal(addr, 'joe', 'authenticated')
			t.end()
		})
		.catch(function (err) {
			t.notOk(err, err ? err.message : 'no error')
			t.end()
		})
	})
})
