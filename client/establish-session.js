module.exports = function createSession(socket, cb) {
	var existingSessionId = localStorage.getItem('sessionid')

	socket.emit('session establish', existingSessionId, function (err, sessionId) {
		if (err) return cb(err)

		localStorage.setItem('sessionid', sessionId)
		cb(null, sessionId)
	})
}
