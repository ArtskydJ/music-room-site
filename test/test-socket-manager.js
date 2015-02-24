var test = require('tape')
var EventEmitter = require('events').EventEmitter
var SocketManager = require('../server/socket-manager.js')
var connectSession = require('../client/connect-session.js')
var Level = require('level-mem')
var StateHolder = require('state-holder')
var bypass = require('just-login-bypass')
var Promise = require('promise')

function expect(t, x, msg) {
	return function (y) {
		t.equal(x, y, msg)
	}
}

function id() {
	return Math.random().toString().slice(2)
}

function makeSession(t) {
	// I don't think this makes much sense...
	// Try getting 8 hours of sleep, and then figuring it out.
	var fullApi = {
		isAuthenticated: expect(t, 0, 'is auth'),
		beginAuthentication: expect(t, 1, 'begin auth'),
		unauthenticate: expect(t, 2, 'unauth')
	}
	var sid = id()
	return function (cb1, cb2) {
		var cb = cb2 || cb1
		process.nextTick(function () {
			cb(null, fullApi, sid)
		})
	}
}

function makeSocket() {
	var socket = new EventEmitter()
	socket.id = id()
	socket.join = function join(room) {
		socket.emit('_join', room)
	}
	socket.leave = function leave(room) {
		socket.emit('_leave', room)
	}
	return socket
}

function makeSessionManager(t) {
	var db = new Level()
	var manager = {
		createSession: makeSession(t),
		continueSession: makeSession(t)
	}
	var socket = makeSocket()
	SocketManager(db, manager)(socket)
	return socket
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
