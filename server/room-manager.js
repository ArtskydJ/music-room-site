var uuid = require('random-uuid-v4')

module.exports = function roomManager(core, sessState, io, socket) {

	// Chat Relay
	socket.on('chat send', function chatsend(text, cb) {
		if (!cb) cb = noop

		if (!socket._musicRoom) {
			return cb(new Error('You are not connected to a room.'))
		}

		sessState.isAuthenticated(socket._sessionId, function (err, addr) {
			if (err) return cb(err)
			if (!addr) return cb(new Error('Can not send a chat while unauthenticated'))

			var messageObj = {
				label: addr,
				item: text
			}
			io.in(socket._musicRoom).emit('chat receive', messageObj)
			cb(null, messageObj)
		})
	})

	function leaveRoom(cb) {
		var currentRoom = socket._musicRoom
		socket._musicRoom = null

		if (currentRoom) {
			socket.leave(currentRoom, cb)
		} else {
			process.nextTick(cb)
		}
	}
	function joinRoom(roomId, cb) {
		leaveRoom(function (err) {
			if (err) return cb(err)

			socket._musicRoom = roomId
			socket.join(roomId, cb)
		})
	}

	// Rooms
	socket.on('room create', function(name, callback) {
		var roomId = makeRoomId()

		sessState.isAuthenticated(socket._sessionId, function (err, addr) {
			if (err) return cb(err)
			if (!addr) return cb('Can not create a room while unauthenticated')

			// create the room here!

			joinRoom(roomId, cb)
		})

		function cb(err) {
			if (callback) {
				if (err) callback(String(err))
				else callback(null, roomId)
			}
		}
	})

	socket.on('room join', function(roomId, callback) {
		sessState.isAuthenticated(socket._sessionId, function (err, addr) {
			if (err) return cb(err)
			if (!addr) return cb('Can not join a room while unauthenticated')

			// ENSURE THE ROOM EXISTS FIRST! OTHERWISE
			// SOMEONE CAN JUST GO TO /rooms/wheeeeee
			// AND A NEW ROOM WILL BE CREATED! DERP!
			joinRoom(roomId, cb)
		})

		function cb(err) {
			if (callback) {
				if (err) callback(String(err))
				else callback(null, roomId)
			}
		}
	})
	socket.on('room leave', function (cb) {
		if (!cb) cb = noop
		leaveRoom(cb)
	})
}

function makeRoomId() {
	return uuid().replace(/-/g, '')
}

function noop() {}
