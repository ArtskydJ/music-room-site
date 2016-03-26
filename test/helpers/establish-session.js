var onetime = require('onetime')
var connectSession = require('../../client/connect-session.js')
var Manager = require('./manager.js')
var Client = require('socket.io-client')
global.localStorage = require('mock-dom-storage')()

function establishSession(cb) {
	var socket = (typeof window === 'undefined') ? Manager() : Client('http://localhost:80/', { multiplex: false })

	cb = onetime(cb)

	socket.once('connect', function () {
		connectSession(socket, function (err, sessionId) {
			if (err) return cb(err)
			cb(null, socket)
		})
	})
	socket.once('connect_error', cb)
	var unref = setTimeout(cb, 5500, new Error('Took too long!')).unref
	if (unref) unref()
}

module.exports = establishSession
