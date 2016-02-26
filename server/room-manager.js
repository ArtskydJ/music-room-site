function cbIfErr(reject, fulfill) {
	return function (err) {
		if (err && !err.notFound) {
			reject(err)
		} else {
			fulfill.apply(null, [].slice.call(arguments, 1)) //the error is not applied
		}
	}
}

function cbIfNotAuth(action, reject, fulfill) {
	return function (err, addr) {
		if (err) {
			reject(err)
		} else if (!addr) {
			reject(new Error('Can not ' + action + ' while unauthenticated.'))
		} else {
			fulfill.apply(null, [].slice.call(arguments, 1)) //the error is not applied
		}
	}
}

module.exports = function roomManager(sessionContactDb, io, core) {
	return function (socket) {

		// Chat Relay
		function validRoom(room) {
			return room !== socket.id
		}

		socket.on('chat send', function chatsend(text, cb) {
			if (!cb) cb = noop

			core.isAuthenticated(socket.mySessionId, cbIfNotAuth('send chat', cb, function (addr) {
				var messageObj = {
					label: addr,
					item: text
				}
				socket.rooms.filter(validRoom).forEach(function emit(room) {
					io.in(room).emit('chat receive', messageObj)
				})
				cb(null, messageObj)
			}))
		})

		// Room Connection and Disconnection
		socket.on('join', function(room, cb) {
			if (!cb) cb = noop
			core.isAuthenticated(socket.mySessionId, cbIfNotAuth('join a room', cb, function (addr) {
				socket.join(room, function (err) {
					setTimeout(function () {
						addUserThenEmit(room, addr, socket.mySessionId)
					}, 100)
					cb(err)
				})
			}))
		})
		socket.on('leave', function (room, cb) {
			cb = cb || noop
			socket.leave(room, cbIfErr(cb, function () {
				removeUserThenEmit(room, socket.mySessionId)
				cb(null)
			}))
		})
		socket.on('disconnect', function () {
				socket.rooms.forEach(function (room) {
				removeUserThenEmit(room, socket.mySessionId)
			})
		})

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

function noop() {}
