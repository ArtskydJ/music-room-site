module.exports = function SocketManager(sessState) {
	return function onsock(socket) {
		socket.on('session create', function create(cb) {
			sessState.createSession(onSession(cb))
		})
		socket.on('session continue', function continu(sessId, cb) {
			sessState.sessionExists(sessId, onSession(cb))
		})

		function onSession(cb) {
			return function onSess(err, loginApi, sessId) {
				if (err) return cb(err)
				api = loginApi // || api

				socket.mySessionId = sessId
				cb(null, sessId)
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
			if (!cb) cb = noop
			api.beginAuthentication(email, function (err, authReq) {
				if (err) return cb(err)
				cb(null, authReq && authReq.contactAddress)
			})
		})

		socket.on('disconnect', function () {
			socket.mySessionId = null
		})
	}
}

function noop() {}
