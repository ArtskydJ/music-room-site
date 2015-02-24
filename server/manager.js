var JustLogin = require('just-login-core')
var bypass = require('just-login-bypass')
var SessionManager = require('just-login-example-session-manager')
var Spaces = require('level-spaces')
var SocketManager = require('./socket-manager.js')
var RoomManager = require('./room-manager.js')

module.exports = function SessMng(io, db) {
	var socketSessionDb = Spaces(db, 'socket-session')
	var sessionManagerDb = Spaces(db, 'session-manager')

	var core = JustLogin(db)
	var manager = SessionManager(core, sessionManagerDb)

	io.on('connect', SocketManager(socketSessionDb, manager))
	io.on('connect', RoomManager(socketSessionDb, io, core))

	bypass(core)
	return core
}
