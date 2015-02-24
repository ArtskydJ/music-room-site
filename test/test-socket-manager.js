var test = require('tape')
var EventEmitter = require('events').EventEmitter
var Manager = require('../server/manager.js')
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
	var socket = new EventEmitter()
	socket.id = Math.random().toString().slice(2)
	socket.join = function join(room) {
		socket.emit('_join', room)
	}
	socket.leave = function leave(room) {
		socket.emit('_leave', room)
	}
	io.emit('connect', socket) // timeout?
	return socket
}

function makeSessionManager(t) {
	var db = new Level()
	var io = makeIo()
	var core = Manager(io, db)
	// Enable these when the just-login-emailer
	// is implemented in '../server/manager.js'
	// core.removeAllListeners('authentication initiated')
	// bypass(core)
	return makeSocket(io)
}

function establishSession(t) {
	var socket = makeSessionManager(t)
	var state = StateHolder()
	return connectSession(socket, state).then(function (sessionId) {
		return Promise.resolve(socket)
	})
}

function timeout(ms) {
	return function (val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, ms, val)
		})
	}
}

function handle(t) {
	return function (err) {
		t.notOk(err, (err && err.message) ? err.message : 'no error')
		t.end()
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
	}).catch(handle(t))
})

test('client/connect-session.js', function (t) {
	t.plan(3)

	establishSession(t)
	.then(function (socket) {
		var socketEmit = Promise.denodeify( socket.emit.bind(socket) )

		socketEmit('session isAuthenticated')
		.then(function (addr) {
			t.notOk(addr, 'is not authenticated')
		})

		.then(function () {
			return socketEmit('session beginAuthentication', 'joe')
		})
		.then(function (addr) {
			t.equal(addr, 'joe', 'begin authentication')
		})
		.then(timeout(100))

		.then(function () {
			return socketEmit('session isAuthenticated')
		})
		.then(function (addr) {
			t.equal(addr, 'joe', 'is authenticated')
			t.end()
		})
		.catch(handle(t))
	})
	.catch(handle(t))
})
