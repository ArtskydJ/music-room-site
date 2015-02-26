var test = require('tape')
var StateHolder = require('state-holder')
var connectSession = require('../client/connect-session.js')
var Manager = require('./helpers/manager.js')
var handle = require('./helpers/handle-error.js')

test('client/connect-session.js', function (t) {
	t.plan(1)

	var socket = Manager()
	var state = StateHolder()

	connectSession(socket, state).then(function (sessionId1) {
		connectSession(socket, state).then(function (sessionId2) {
			t.equal(sessionId1, sessionId2, 'session IDs are identical')
			t.end()
			if (typeof window !== 'undefined') {
				window.close()
			}
		}).catch( handle(t) )
	}).catch( handle(t) )
})
