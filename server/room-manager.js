module.exports = function roomManager(socketSessionDb, sessionContactDb, io, core) {
	return function (socket) {

		// Chat Relay
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(text, cb) {
			cb = cb || noop
			socketSessionDb.get(socket.id, function (err, sessionId) {
				core.isAuthenticated(sessionId, function (err, address) {
					var messageObj = {
						label: address,
						item: text
					}
					socket.rooms.filter(validRoom).forEach(function emit(room) {
						io.in(room).emit('chat receive', messageObj)
					})
					cb(err, messageObj)
				})
			})
		})

		// Room Connection and Disconnection
		socket.on('join', function(room, cb) {
			cb = cb || noop
			socketSessionDb.get(socket.id, function (err, sessionId) {
				if (err) {
					cb(err)
				} else {
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
				}
			})
		})
		socket.on('leave', socket.leave.bind(socket))

		function addUserThenEmit(room, addr, sessionId) {
			sessionContactDb.put(room + '\x00' + sessionId, addr, function (err) {
				emitUserList(room)
			})
		}
		function removeUserThenEmit(room, sessionId) {
			sessionContactDb.del(room + '\x00' + sessionId, function (err) {
				emitUserList(room)
			})
		}
		function emitUserList(room) {
			var userList = []
			sessionContactDb.createValueStream({
				gte: room + '\x00',
				lt: room + '\x00~'
			}).on('data', function (value) {
				userList.push({ item: value })
			}).on('end', function () {
				io.in(room).emit('user list', userList)
			})
		}
	}
}
