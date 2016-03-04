var StateHolder = require('state-holder')
var Promise = require('promise')
var connectSession = require('../../client/connect-session.js')
var Manager = require('./manager.js')
var Client = require('socket.io-client')

function establishSession() {
	var inNode = (typeof window === 'undefined')
	var socket = inNode ? Manager() : Client('http://localhost:80/', { multiplex: false })
	var state = inNode? { replaceLocal: StateHolder() } : {}
	return new Promise(function (resolve, reject) {
		socket.once('connect', function () {
			connectSession(socket, state, function (err, sessionId) {
				if (err) return reject(err)
				resolve(socket)
			})
		})
		socket.once('connect_error', reject)
		var unref = setTimeout(reject, 5500, new Error('Took too long!')).unref
		if (unref) unref()
	})
}

module.exports = establishSession
