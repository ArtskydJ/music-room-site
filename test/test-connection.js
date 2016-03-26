var test = require('tape')
var connectSession = require('../client/connect-session.js')
var Manager = require('./helpers/manager.js')
var Client = require('socket.io-client')
global.localStorage = require('mock-dom-storage')()

test('test-connection', function (t) {
	t.plan(3)

	var inNode = (typeof window === 'undefined')
	var socket = inNode ? Manager() : Client('http://localhost:80/', { multiplex: false })

	connectSession(socket, function (err, sessionId1) {
		t.ifError(err)
		connectSession(socket, function (err, sessionId2) {
			t.ifError(err)
			t.equal(sessionId1, sessionId2, 'session IDs are identical')
			t.end()
		})
	})
})
