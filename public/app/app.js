var fs = require('fs')
var path = require('path')
var domready = require('domready')
var Socketio = require('socket.io-client')
var overview = require('./overview/overview.js')
var room = require('./room/room.js')

module.exports = function(stateRouter) {
	var socket = Socketio()

	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'app.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: template
	})
	overview(stateRouter)
	room(stateRouter, socket)

	domready(function() {
		stateRouter.evaluateCurrentRoute('app.overview')
			.then(console.log.bind(null, 'evaluated'))
			.catch(console.log.bind(null, 'failure: '))
	})
}
