var Level = require('level-mem')
var EventEmitter = require('events').EventEmitter
var ServerManager = require('../../server/manager.js')
// var bypass = require('just-login-bypass')

function id() {
	return Math.random().toString().slice(2)
}

function Server() {
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

function Client(io) {
	var socket = new EventEmitter()
	socket.id = id()
	socket.join = function join(room) {
		socket.emit('_join', room)
	}
	socket.leave = function leave(room) {
		socket.emit('_leave', room)
	}
	io.emit('connect', socket)
	return socket
}

function Manager() {
	var db = new Level()
	var io = Server()
	var core = ServerManager(io, db)
	// Enable these when the just-login-emailer is implemented in the server
	// core.removeAllListeners('authentication initiated')
	// bypass(core)
	return Client(io)
}

module.exports = Manager
