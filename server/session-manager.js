var JustLogin = require('just-login-core')
var SessionManager = require('just-login-example-session-manager')
var Spaces = require('level-spaces')
var bypass = require('just-login-bypass')

function noop() {}

module.exports = function SessMng(io, db) {
	var sessionManagerDb = Spaces(db, 'session-manager')
	var socketSessionDb = Spaces(db, 'socket-session')

	var core = JustLogin(db)
	var manager = SessionManager(core, sessionManagerDb)

	var idToAddressMap = {}

	io.on('connect', function (socket) {
		// Establishing a Session
		socket.on('session create', function create(cb) {
			manager.createSession(onSession(cb))
		})
		socket.on('session continue', function continu(sessId, cb) {
			manager.continueSession(sessId, onSession(cb))
		})

		function onSession(cb) {
			return function onSess(err, loginApi, sessId) {
				api = loginApi || api
				sessionId = sessId || sessionId

				if (err) {
					cb(err)
				} else {
					socketSessionDb.put(socket.id, sessId, function (err) {
						cb(err, err ? null : sessId)
					})
				}
			}
		}

		// Authentication API
		var sessionId = null
		var api = {
			isAuthenticated: noop,
			beginAuthentication: noop,
			unauthenticate: noop
		}

		socket.on('session isAuthenticated', function si(cb) {
			api.isAuthenticated(cb || noop)
		})
		socket.on('session unauthenticate', function su(cb) {
			api.unauthenticate(cb || noop)
		})
		socket.on('session beginAuthentication', function sb(email, cb) {
			cb = cb || noop
			api.beginAuthentication(email, function (err, authReq) {
				cb(err, authReq && authReq.contactAddress)
			})
		})

		// Teardown (is it necessary?)
		socket.on('disconnect', function () {
			socketSessionDb.del(socket.id)
		})

		// Chat Relay
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(text) {
			api.isAuthenticated(function (err, address) {
				var messageObj = {
					label: address,
					item: text
				}
				socket.rooms.filter(validRoom).forEach(function emit(room) {
					io.in(room).emit('chat receive', messageObj)
				})
			})
		})

		// Room Connection and Disconnection
		socket.on('join', function(room, cb) {
			cb = cb || noop
			api.isAuthenticated(function (err, addr) {
				if (err) {
					cb(err)
				} else if (!addr) {
					cb(new Error('You tried to join a room while unauthenticated'))
				} else {
					socket.join(room, function (err) {
						setTimeout(function () {
							addUserThenEmit(room, addr)
						})
						cb(err)
					})
				}
			})
		})
		socket.on('leave', socket.leave.bind(socket))

		function addUserThenEmit(room, addr) {
			idToAddressMap[room] = idToAddressMap[room] || {}
			idToAddressMap[room][sessionId] = addr
			emitUserList(room)
		}
		function removeUserThenEmit(room) {
			delete idToAddressMap[room][sessionId]
			emitUserList(room)
		}
		function emitUserList(room) {
			var userList = Object.keys( idToAddressMap[room] ).map(function (sessId) {
				return { item: idToAddressMap[room][sessId] }
			})
			io.in(room).emit('user list', userList)
		}
	})

	bypass(core)

	return core
}
