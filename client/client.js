var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var Ractive = require('ractive')
var formatTime = require('./format-time.js')
var Client = require('socket.io-client')
var connectSession = require('./connect-session.js')
var sortable = require('../vendor/Ractive-decorators-sortable')
var createAllStates = require('./create-all-states.js')

var socket = new Client('localhost:80')

var renderer = RactiveRenderer(Ractive, {
	data: { formatTime: formatTime },
	partials: { list: require('./list-partial.html') },
	decorators: { sortable: sortable }
})
var stateRouter = StateRouter(renderer, 'body')
createAllStates(stateRouter, socket)

socket.once('connect', function() {
	stateRouter.evaluateCurrentRoute('app.overview')
	connectSession(socket, null, function (err, sessionId) {
		if (err) console.error(err)
		// stateRouter.go('fail or something')
	})
})

socket.on('error', function (err) {
	console.error(err)
})

//setTimeout(window.close, 5000)
