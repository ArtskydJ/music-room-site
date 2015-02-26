var test = require('tape')
var StateHolder = require('state-holder')
var connectSession = require('../client/connect-session.js')
var Manager = require('./helpers/manager.js')
var handle = require('./helpers/handle-error.js')
var Client = require('socket.io-client')

test('test-connection', function (t) {
	t.plan(1)

	var inNode = (typeof window === 'undefined')
	var socket = inNode ? Manager() : Client('http://localhost:80/', { multiplex: false })
	var state = inNode && StateHolder()

	connectSession(socket, state).then(function (sessionId1) {
		connectSession(socket, state).then(function (sessionId2) {
			t.equal(sessionId1, sessionId2, 'session IDs are identical')
			t.end()
		}).catch( handle(t) )
	}).catch( handle(t) )
})
