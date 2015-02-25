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
	io.in = function (room) {
		return rooms[room] = rooms[room] || new EventEmitter()
	}
	return io
}

function Client(io) {
	var socket = new EventEmitter()
	socket.id = id()
	socket.rooms = [] // Used in server/room-manager.js:18 at function chatsend(text)
	var relay = function (msg) {
		socket.emit('chat receive', msg)
	}
	socket.join = function (room, cb) {
		socket.rooms.push(room)
		io.in(room).on('chat receive', relay)
		cb && cb(null)
	}
	socket.leave = function (room, cb) {
		socket.rooms = socket.rooms.filter(function (x) { return x !== room })
		io.in(room).removeListener('chat receive', relay)
		cb && cb(null)
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
