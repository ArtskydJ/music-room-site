var test = require('tape')
var StateHolder = require('state-holder')
var Promise = require('promise')
var connectSession = require('../client/connect-session.js')
var Manager = require('./helpers/manager.js')

function establishSession() {
	var socket = Manager()
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

	var socket = Manager()
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
