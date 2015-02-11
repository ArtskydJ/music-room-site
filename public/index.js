var StateRouter = require('abstract-state-router')
var ractiveRenderer = require('ractive-state-router')
var domready = require('domready')

var stateRouter = StateRouter(ractiveRenderer, 'ui-view')

require('./overview/overview.js')(stateRouter)
require('./room/room.js')(stateRouter)

domready(function() {
	/*stateRouter.go('overview').then(function() {
		console.log('went to overview')
	})*/
	stateRouter.evaluateCurrentRoute('overview').then(console.log.bind(null, 'eval\'ed'))
})

setTimeout(window.close, 5000)
