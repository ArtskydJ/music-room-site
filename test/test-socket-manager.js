var test = require('tape')
var Promise = require('promise')
var timeout = require('./helpers/promise-timeout.js')
var handle = require('./helpers/handle-error.js')
var establishSession = require('./helpers/establish-session.js')

test('client/connect-session.js', function (t) {
	t.plan(3)

	establishSession()
	.then(function (socket) {
		var socketEmit = Promise.denodeify( socket.emit.bind(socket) )

		socketEmit('session isAuthenticated')
		.then(function (addr) {
			t.notOk(addr, 'is not authenticated')
		}).then(function () {
			return socketEmit('session beginAuthentication', 'joe')
		}).then(function (addr) {
			t.equal(addr, 'joe', 'begin authentication')
		}).then(
			timeout(100)
		).then(function () {
			return socketEmit('session isAuthenticated')
		}).then(function (addr) {
			t.equal(addr, 'joe', 'is authenticated')
			t.end()
			if (typeof window !== 'undefined') {
				window.close()
			}
		}).catch( handle(t) )
	}).catch( handle(t) )
})
