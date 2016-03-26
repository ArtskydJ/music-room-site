var JustLogin = require('just-login-core')
var bypass = require('just-login-bypass')
var SessionState = require('just-login-session-state')
var Spaces = require('level-spaces')
var RoomManager = require('./room-manager.js')
var socketSessionState = require('./socket-session-state.js')

module.exports = function SessMng(io, db) {
	var sessionStateDb = Spaces(db, 'session-manager')
	var sessionContactDb = Spaces(db, 'session-contact')

	var core = JustLogin(db)
	var sessState = SessionState(core, sessionStateDb)
	var onSocket2 = RoomManager(sessionContactDb, io, core)

	io.on('connect', function (socket) {
		socketSessionState(socket, core, sessState)
		onSocket2(socket)
	})

	bypass(core)
	return core
}
