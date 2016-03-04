function createSession(socket, replaceLocal, cb) {
	var local = replaceLocal || {
		get: localStorage.getItem.bind(localStorage, 'sessionid'),
		set: localStorage.setItem.bind(localStorage, 'sessionid')
	}

	var existingSessionId = local.get()

	if (existingSessionId) {
		continueASession()
	} else {
		requestNewSession()
	}

	function continueASession() {
		socket.emit('session continue', existingSessionId, function (err, sessionId) {
			if (err) return requestNewSession()

			cb(null, sessionId)
		})
	}

	function requestNewSession() {
		socket.emit('session create', function (err, sessionId) {
			if (err) return cb(err)
			
			local.set(sessionId)
			cb(null, sessionId)
		})
	}
}

module.exports = createSession
