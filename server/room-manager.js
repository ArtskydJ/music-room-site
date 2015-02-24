module.exports = function roomManager(socketSessionDb, io, core) {
	return function (socket) {
		var idToAddressMap = {}

		// Chat Relay
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(text) {
			socketSessionDb.get(socket.id, function (err, sessionId) {
				core.isAuthenticated(sessionId, function (err, address) {
					var messageObj = {
						label: address,
						item: text
					}
					socket.rooms.filter(validRoom).forEach(function emit(room) {
						io.in(room).emit('chat receive', messageObj)
					})
				})
			})
		})

		// Room Connection and Disconnection
		socket.on('join', function(room, cb) {
			cb = cb || noop
			socketSessionDb.get(socket.id, function (err, sessionId) {
				core.isAuthenticated(sessionId, function (err, addr) {
					if (err) {
						cb(err)
					} else if (!addr) {
						cb(new Error('You tried to join a room while unauthenticated'))
					} else {
						socket.join(room, function (err) {
							setTimeout(function () {
								addUserThenEmit(room, addr, sessionId)
							}, 100)
							cb(err)
						})
					}
				})
			})
		})
		socket.on('leave', socket.leave.bind(socket))

		function addUserThenEmit(room, addr, sessionId) {
			idToAddressMap[sessionId] = addr
			emitUserList(room)
		}
		function removeUserThenEmit(room) {
			delete idToAddressMap[sessionId]
			emitUserList(room)
		}
		function emitUserList(room) {
			var userList = Object.keys( idToAddressMap ).map(function (sessId) {
				return { item: idToAddressMap[sessId] }
			})
			io.in(room).emit('user list', userList)
		}
	}
}
