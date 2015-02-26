var test = require('tape')
var Promise = require('promise')
var handle = require('./helpers/handle-error.js')
var establishSession = require('./helpers/establish-session.js')

test('room-manager', function (t) {
	t.plan(2)

	establishSession()
	.then(function (socket) {
		var socketEmit = Promise.denodeify( socket.emit.bind(socket) )

		socket.on('chat receive', function (msg) {
			t.equal(msg.item, 'ok', 'RECEIVED MESSAGE: "' + msg.item + '"')
		})

		socketEmit('chat send', 'not authenticated')
		.then(function () {
			return socketEmit('session beginAuthentication', 'joe')
		}).then(function () {
			return socketEmit('chat send', 'not joined yet')
		}).then(function () {
			return socketEmit('join', 'room-whatever')
		}).then(function () {
			return socketEmit('chat send', 'ok')
		}).then(function () {
			return socketEmit('leave', 'room-whatever')
		}).then(function () {
			return socketEmit('chat send', 'left room')
		}).then(function () {
			t.pass('got to the end')
			t.end()
		}).catch( handle(t) )
	}).catch( handle(t) )
})
