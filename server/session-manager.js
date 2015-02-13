var JustLogin = require('just-login-core')
var SessionManager = require('just-login-example-session-manager')
var Spaces = require('level-spaces')
var chatRelay = require('./chat-relay.js')

function noop() {}

module.exports = function SessMng(io, db) {
	chatRelay(io)
	var sessionManagerDb = Spaces(db, 'session-manager')

	var core = JustLogin(db)
	var manager = SessionManager(core, sessionManagerDb)

	io.on('connect', function (socket) {
		var api = {
			isAuthenticated: noop,
			beginAuthentication: noop,
			unauthenticate: noop
		}

		function onSession(cb) {
			return function onSess(err, loginApi, sessionId) {
				api = loginApi || api
				cb(err, sessionId)
			}
		}

		socket.on('session create', function create(cb) {
			manager.createSession(onSession(cb))
		})
		socket.on('session continue', function continu(sessionId, cb) {
			manager.continueSession(sessionId, onSession(cb))
		})
		socket.on('session isAuthenticated',     api.isAuthenticated)
		socket.on('session beginAuthentication', api.beginAuthentication)
		socket.on('session unauthenticate',      api.unauthenticate)
	})

	core.on('authentication initiated', function auth1(credentials) {
		core.authenticate(credentials.token, function auth2(err, contactAddress) {
			console.log(err ? ('Error: ' + err.message) : ('Signed in as: ' + contactAddress))
		})
	})

	return core
}
