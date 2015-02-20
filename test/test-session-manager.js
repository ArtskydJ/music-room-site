var test = require('tape')
var EventEmitter = require('events').EventEmitter
var SessionManager = require('../server/session-manager.js')
var Level = require('level-mem')

function makeIo(t) {
	var rooms = {}
	var io = new EventEmitter()
	io.in = function ioin(room) {
		if (!rooms[room]) {
			rooms[room] = new EventEmitter()
		}
		return rooms[room]
	}
	return io
}

function makeSocket(io) {
	var inRooms = []
	var socket = new EventEmitter()
	socket.join = function join(room) {
		socket.emit('_join', room)
	}
	socket.leave = function leave(room) {
		socket.emit('_leave', room)
	}
	io.emit('connect', socket)
	return socket
}

function makeSessionManager(t) {
	var io = makeIo()
	var socket = makeSocket(io)
	var core = SessionManager(io, new Level())
	return socket
}

test('session manager', function (t) {
	t.plan(1)

	var socket = makeSessionManager()

	socket.emit('join', 'autoplay', function (err) {
		t.notOk(err, err ? err.message : 'no error')

		t.end()
	})

	setTimeout(function () {}, 100)

})
