var Promise = require('promise')

function createSession(socket, replaceLocal) {
	var local = replaceLocal || {
		get: localStorage.getItem.bind(localStorage, 'sessionid'),
		set: localStorage.setItem.bind(localStorage, 'sessionid')
	}

	var existingSessionId = local.get()

	var emit = Promise.denodeify( socket.emit.bind(socket) )

	return emit('session continue', existingSessionId)
		.catch(function() { return emit('session create') })
		.then(function (sessionId) {
			local.set(sessionId)
			return sessionId
		})
}

module.exports = createSession
