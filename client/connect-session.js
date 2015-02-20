var Promise = require('promise')

function createSession(socket, replaceLocal) {
	var local = replaceLocal || {
		get: localStorage.getItem.bind(localStorage, 'sessionid'),
		set: localStorage.setItem.bind(localStorage, 'sessionid')
	}

	var existingSessionId = local.get()

	var emit = Promise.denodeify( socket.emit.bind(socket) )

	var sessionPromise = emit('session continue', existingSessionId)
		.catch(function() { return emit('session create') })

	sessionPromise.then(function (sessionId) {
		local.set(sessionId)
	})

	return sessionPromise
}

module.exports = createSession
