var test = require('tape')
var StateHolder = require('state-holder')
var connectSession = require('../client/connect-session.js')
var Manager = require('./helpers/manager.js')
var handle = require('./helpers/handle-error.js')

test('test-connection', function (t) {
	t.plan(1)

	var socket = Manager()
	var state = StateHolder()

	connectSession(socket, state).then(function (sessionId1) {
		connectSession(socket, state).then(function (sessionId2) {
			t.equal(sessionId1, sessionId2, 'session IDs are identical')
			t.end()
		}).catch( handle(t) )
	}).catch( handle(t) )
})
