module.exports = function establishSession(core, sessState, socket) {
	socket._sessionId = null
	socket._allowBeginAuth = true

	socket.on('session establish', function sessionEstablish(existingSessionId, cb) {

		function onSession(err, sessionId) {
			if (err) return cb(err)

			socket._sessionId = sessionId
			cb(null, sessionId)
		}

		if (existingSessionId) {
			sessState.sessionExists(existingSessionId, function (err, sessionDate) {
				if (err) return sessState.createSession(onSession)

				onSession(null, existingSessionId)
			})
		} else {
			sessState.createSession(onSession)
		}
	})

	socket.on('session isAuthenticated', function si(cb) {
		sessState.isAuthenticated(socket._sessionId, cb || noop)
	})
	socket.on('session unauthenticate', function su(cb) {
		sessState.unauthenticate(socket._sessionId, cb)
	})
	socket.on('session beginAuthentication', function sb(email, cb) {
		if (!cb) cb = noop

		if (socket._allowBeginAuth) {
			core.beginAuthentication(socket._sessionId, email, function (err, authReq) {
				if (err) return cb(err)

				cb(null, authReq && authReq.contactAddress)
			})

			// Disallow for 30 seconds
			socket._allowBeginAuth = false
			setTimeout(function () {
				socket._allowBeginAuth = true
			}, 30 * 1000)
		} else {
			cb('You must wait up to 30 seconds before trying again.') // sending a string as the error
		}
	})

	socket.on('disconnect', function () {
		socket._sessionId = null
	})

	//socket.on('error', console.error)
}

function noop() {}
