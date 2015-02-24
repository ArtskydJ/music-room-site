module.exports = function SocketManager(socketSessionDb, manager) {
	return function onsock(socket) {
		socket.on('session create', function create(cb) {
			manager.createSession(onSession(cb))
		})
		socket.on('session continue', function continu(sessId, cb) {
			manager.continueSession(sessId, onSession(cb))
		})

		function onSession(cb) {
			return function onSess(err, loginApi, sessId) {
				api = loginApi || api

				if (err) {
					cb(err)
				} else {
					socketSessionDb.put(socket.id, sessId, function (err) {
						cb(err, err ? null : sessId)
					})
				}
			}
		}

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

		socket.on('disconnect', function () {
			socketSessionDb.del(socket.id)
		})
	}
}

function noop() {}
