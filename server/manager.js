var JustLogin = require('just-login-core')
var bypass = require('just-login-bypass')
var SessionManager = require('just-login-example-session-manager')
var Spaces = require('level-spaces')
var SocketManager = require('./socket-manager.js')
var RoomManager = require('./room-manager.js')

module.exports = function SessMng(io, db) {
	var sessionManagerDb = Spaces(db, 'session-manager')
	var sessionContactDb = Spaces(db, 'session-contact')

	var core = JustLogin(db)
	var manager = SessionManager(core, sessionManagerDb)

	io.on('connect', SocketManager(manager))
	io.on('connect', RoomManager(sessionContactDb, io, core))

	bypass(core)
	return core
}
