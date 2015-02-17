var fs = require('fs')
var path = require('path')
var addOverviewState = require('./overview/overview.js')
var addRoomState = require('./room/room.js')
var addLoginState = require('./login/login.js')

module.exports = function(stateRouter, socket, mediator) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'app.html'), { encoding: 'utf8' } )
	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: template
	})

	addOverviewState(stateRouter, socket, mediator)
	addRoomState(stateRouter, socket, mediator)
	addLoginState(stateRouter, socket, mediator)
}
