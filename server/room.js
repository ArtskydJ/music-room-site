var PlaylistCombinator = require('playlist-combinator')

module.exports = function room(io, namespace) {
	var playlist = PlaylistCombinator()
	var room = io.of( '/' + namespace )

	room.on('connect', function conn(socket) {
		//socket.on('auth', function (contactAddress, token) {
		var userId = socket.id //non-persistent, this must change
		playlist.addUser(userId)
		room.emit('user join')
		//socket.emit('users')
		//socket.emit('upcoming')
		//})

		// The Chat Relay
		socket.on('chat send', function ch(msg) {
			room.emit('chat receive', msg)
		})

		socket.on('disconnect', function () {
			if (userId) {
				playlist.removeUser(userId)
				room.emit('user leave')
			}
		})
	})

	return room
}
