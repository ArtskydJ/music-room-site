var test = require('tape')
var Promise = require('promise')
var timeout = require('./helpers/promise-timeout.js')
var handle = require('./helpers/handle-error.js')
var establishSession = require('./helpers/establish-session.js')

test('socket-manager', function (t) {
	t.plan(4)

	establishSession()
	.then(function (socket) {
		var socketEmit = Promise.denodeify( socket.emit.bind(socket) )

		socketEmit('session isAuthenticated')
		.then(function (addr) {
			t.notOk(addr, 'is not authenticated')
			return socketEmit('session beginAuthentication', 'joe')
		}).then(function (addr) {
			t.equal(addr, 'joe', 'begin authentication')
		}).then(
			timeout(0)
		).then(function () {
			return socketEmit('session isAuthenticated')
		}).then(function (addr) {
			t.equal(addr, 'joe', 'is authenticated')
			return socketEmit('session unauthenticate')
		}).then(function () {
			return socketEmit('session isAuthenticated')
		}).then(function (addr) {
			t.notOk(addr, 'is not authenticated')
			t.end()
		}).catch( handle(t) )
	}).catch( handle(t) )
})
