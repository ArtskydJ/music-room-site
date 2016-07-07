var JustLogin = require('just-login-core')
var bypass = require('just-login-bypass')
var SessionState = require('just-login-session-state')
var Spaces = require('level-spaces')
var roomManager = require('./room-manager.js')
var socketSessionState = require('./socket-session-state.js')

module.exports = function SessMng(io, db) {
	var sessionStateDb = Spaces(db, 'session-manager')
	// var sessionContactDb = Spaces(db, 'session-contact')

	var core = JustLogin(db)
	bypass(core)
	var sessState = SessionState(core, sessionStateDb)

	io.on('connect', function (socket) {
		socketSessionState(core, sessState, socket)
		roomManager(core, sessState, io, socket) // arguments are out of order!!!!!!!!!!!!!
	})
}
