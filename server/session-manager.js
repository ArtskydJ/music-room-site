var JustLogin = require('just-login-core')
var SessionManager = require('just-login-example-session-manager')
var Spaces = require('level-spaces')
var bypass = require('just-login-bypass')

function noop() {}

module.exports = function SessMng(io, db) {
	var sessionManagerDb = Spaces(db, 'session-manager')

	var core = JustLogin(db)
	var manager = SessionManager(core, sessionManagerDb)

	io.on('connect', function (socket) {
		// Establishing a Session
		socket.on('session create', function create(cb) {
			manager.createSession(onSession(cb))
		})
		socket.on('session continue', function continu(sessionId, cb) {
			manager.continueSession(sessionId, onSession(cb))
		})

		function onSession(cb) {
			return function onSess(err, loginApi, sessionId) {
				api = loginApi || api
				cb(err, sessionId)
			}
		}

		// Authentication API
		var api = {
			isAuthenticated: noop,
			beginAuthentication: noop,
			unauthenticate: noop
		}

		socket.on('session isAuthenticated', function si() {
			api.isAuthenticated.apply(null, [].slice.call(arguments))
		})
		socket.on('session unauthenticate', function su() {
			api.unauthenticate.apply(null, [].slice.call(arguments))
		})
		socket.on('session beginAuthentication', function sb(email, cb) {
			api.beginAuthentication(email, function (err, authReq) {
				cb && cb(err, err ? null : authReq.contactAddress)
			})
		})

		// Chat Relay
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(messageObj) {
			socket.rooms.filter(validRoom).forEach(function emit(room) {
				io.in(room).emit('chat receive', messageObj)
			})
		})

		// Room Connection and Disconnection
		socket.on('join', function(sessionId, room, cb) {
			cb = cb || noop
			core.isAuthenticated(sessionId, function (err, addr) {
				if (!err && addr) {
					socket.join(room)
					cb(null)
				} else {
					cb(new Error('You tried to join a room while unauthenticated'))
				}
			})
		})
		socket.on('leave', socket.leave.bind(socket))
	})

	bypass(core)

	return core
}
