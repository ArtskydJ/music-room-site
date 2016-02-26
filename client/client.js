var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var Ractive = require('ractive')
var fs = require('fs')
var path = require('path')
var formatTime = require('./format-time.js')
var addAppState = require('./app/app.js')
var addLoginState = require('./login/login.js')
var Client = require('socket.io-client')
var connectSession = require('./connect-session.js')
var sortable = require('../vendor/Ractive-decorators-sortable')

var socket = new Client('localhost:80')

// Don't change the following line much; brfs won't like it
var listPartial = fs.readFileSync( path.join(__dirname, 'list-partial.html'), { encoding: 'utf8' } )
var renderer = RactiveRenderer(Ractive, {
	data: { formatTime: formatTime },
	partials: { list: listPartial },
	decorators: { sortable: sortable }
})
var stateRouter = StateRouter(renderer, 'body')
addAppState(stateRouter, socket)
addLoginState(stateRouter, socket)

socket.once('connect', function() {
	connectSession(socket)
		.then(function () {
			return stateRouter.evaluateCurrentRoute('app.overview')
		})
})

//setTimeout(window.close, 5000)
