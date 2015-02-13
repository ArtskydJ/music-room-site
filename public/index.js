var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var Socketio = require('socket.io-client')
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
var socket = Socketio()

require('./overview/overview.js')(stateRouter)
require('./room/room.js')(stateRouter, socket)

domready(function() {
	stateRouter.evaluateCurrentRoute('overview')
		.then(console.log.bind(null, 'eval\'ed'))
		.catch(console.log.bind(null, 'failure: '))
})

setTimeout(window.close, 5000)
