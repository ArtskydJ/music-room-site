module.exports = function createSession(socket, cb) {
	var existingSessionId = localStorage.getItem('sessionid')

	if (existingSessionId) {
		socket.emit('session continue', existingSessionId, function (err, sessionId) {
			if (err) return requestNewSession()

			cb(null, sessionId)
		})
	} else {
		requestNewSession()
	}

	function requestNewSession() {
		socket.emit('session create', function (err, sessionId) {
			if (err) return cb(err)
			
			localStorage.setItem('sessionid', sessionId)
			cb(null, sessionId)
		})
	}
}
