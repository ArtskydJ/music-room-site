module.exports = function chatRelay(io) {
	io.on('connection', function onconn(socket) {
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(messageObj) {
			socket.rooms.filter(validRoom).forEach(function emit(room) {
				io.in(room).emit('chat receive', messageObj)
			})
		})

		socket.on('join', socket.join.bind(socket))
		socket.on('leave', socket.leave.bind(socket))
	})
}
