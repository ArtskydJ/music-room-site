var StateHolder = require('state-holder')
var Promise = require('promise')
var connectSession = require('../../client/connect-session.js')
var Manager = require('./manager.js')

function establishSession() {
	var socket = Manager()
	var state = StateHolder()
	return connectSession(socket, state).then(function (sessionId) {
		return Promise.resolve(socket)
	})
}

module.exports = establishSession
