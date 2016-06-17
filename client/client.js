var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var Ractive = require('ractive')
var formatTime = require('./format-time.js')
var Client = require('socket.io-client')
var establishSession = require('./establish-session.js')
var sortable = require('../vendor/Ractive-decorators-sortable')
var createAllStates = require('./create-all-states.js')
var port = require('../package.json').port || 80

var socket = new Client('localhost:' + port)

var renderer = RactiveRenderer(Ractive, {
	data: { formatTime: formatTime },
	partials: { list: require('./list-partial.html') },
	decorators: { sortable: sortable }
})
var stateRouter = StateRouter(renderer, '#state-router')
createAllStates(stateRouter, socket)

socket.once('connect', function() {
	stateRouter.evaluateCurrentRoute('nli.splash-page')
	establishSession(socket, function (err, sessionId) {
		if (err) console.error(err)
		else console.log('connected with session ' + sessionId)
		// stateRouter.go('fail or something')
	})
})

socket.on('error', function (err) {
	console.error(err)
})

//setTimeout(window.close, 5000)
