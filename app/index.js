var StateRouter = require('abstract-state-router')
var ractiveRenderer = require('ractive-state-router')
var domready = require('domready')

var stateRouter = StateRouter(ractiveRenderer, '#main')

stateRouter.addState({
	name: 'app',
	defaultChild: 'overview',
	resolve: function(data, parameters, cb) {
		// this should check if logged in
		cb()
	}, activate: function(context) {

	}
})

require('./overview/overview.js')(stateRouter)
require('./room/room.js')(stateRouter)

domready(function() {
	stateRouter.evaluateCurrentRoute('app')
})
