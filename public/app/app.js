var fs = require('fs')
var path = require('path')
var addOverviewState = require('./overview/overview.js')
var addRoomState = require('./room/room.js')
var AuthHelpers = require('auth-helpers.js')

module.exports = function(stateRouter, socket) {
	var auth = AuthHelpers(socket)
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'app.html'), { encoding: 'utf8' } )
	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: template,
		activate: auth.activate
	})

	addOverviewState(stateRouter, socket)
	addRoomState(stateRouter, socket)
}
