var fs = require('fs')
var path = require('path')
var domready = require('domready')
var Socketio = require('socket.io-client')
var addOverviewState = require('./overview/overview.js')
var addRoomState = require('./room/room.js')
var addLoginState = require('./login/login.js')
var connectSession = require('./connect-session.js')
var Remember = require('./remember.js')

module.exports = function(stateRouter) {
	var socket = Socketio()
	var sessId = Remember()

	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'app.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: template
	})
	addOverviewState(stateRouter)
	addRoomState(stateRouter, socket, sessId.get)
	addLoginState(stateRouter)

	socket.once('connect', function() {
		connectSession(socket)
			.then(sessId.set)
			.then(function () {
				return stateRouter.evaluateCurrentRoute('app.overview')
			})
	})
}
