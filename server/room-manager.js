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

			if (!socket._musicRoom) {
				return cb(new Error('You are not connected to a room.'))
			}

			core.isAuthenticated(socket.mySessionId, cbIfNotAuth('send chat', cb, function (addr) {
				var messageObj = {
					label: addr,
					item: text
				}
				io.in(socket._musicRoom).emit('chat receive', messageObj)
				cb(null, messageObj)
			}))
		})

		// Room Connection and Disconnection
		socket.on('join', function(room, cb) {
			if (!cb) cb = noop
			core.isAuthenticated(socket.mySessionId, cbIfNotAuth('join a room', cb, function (addr) {
				if (socket._musicRoom) {
					socket.leave(socket._musicRoom)
				}
				socket._musicRoom = room
				socket.join(room, function (err) {
					// setTimeout(function () {
						addUserThenEmit(room, addr, socket.mySessionId)
					// }, 100)
					cb(err)
				})
			}))
		})
		socket.on('leave', function (room, cb) {
			if (!cb) cb = noop

			socket._musicRoom = null
			socket.leave(socket._musicRoom, cbIfErr(cb, function () {
				removeUserThenEmit(socket._musicRoom, socket.mySessionId)
				cb(null)
			}))
		})
	}
}

function noop() {}
