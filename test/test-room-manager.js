var test = require('tape')
var EventEmitter = require('events').EventEmitter
var connectSession = require('../client/connect-session.js')
var StateHolder = require('state-holder')
var Promise = require('promise')
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

// Add tests!!!
