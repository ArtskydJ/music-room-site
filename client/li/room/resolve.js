module.exports = function resolver(socket) {
	return function (data, parameters, cb) {
		var room = parameters.room

		console.log('resolving room ' + room)
		if (room === 'new') throw new Error('went to the wrong stinkin\' state!')

		socket.emit('join', room, function (err) {
			console.log('joining', room)
			if (err) {
				console.error(err)
				cb.redirect('login')
			} else {
				// At some point, this should return the current music, users, etc.
				cb()
			}
		})
	}
}
