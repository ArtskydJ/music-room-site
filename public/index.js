var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var domready = require('domready')
var fs = require('fs')
var path = require('path')
var formatTime = require('./format-time.js')
// Don't change the following line much; brfs won't like it
var listPartial = fs.readFileSync( path.join(__dirname, 'list-partial.html'), { encoding: 'utf8' } )

var renderer = RactiveRenderer({
	data: { formatTime: formatTime },
	partials: { list: listPartial }
})
var stateRouter = StateRouter(renderer, 'ui-view')

require('./overview/overview.js')(stateRouter)
require('./room/room.js')(stateRouter)

domready(function() {
	/*stateRouter.go('overview').then(function() {
		console.log('went to overview')
	})*/
	stateRouter.evaluateCurrentRoute('overview').then(console.log.bind(null, 'eval\'ed'))
})

setTimeout(window.close, 5000)
