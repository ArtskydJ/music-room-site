var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var fs = require('fs')
var path = require('path')
var formatTime = require('./format-time.js')
var Remember = require('remember.js')
var addAppState = require('./app/app.js')
var addLoginState = require('./login/login.js')
var Socketio = require('socket.io-client')
var connectSession = require('./connect-session.js')

var socket = new Socketio()
var sessId = Remember()

// Don't change the following line much; brfs won't like it
var listPartial = fs.readFileSync( path.join(__dirname, 'list-partial.html'), { encoding: 'utf8' } )
var renderer = RactiveRenderer({
	data: { formatTime: formatTime },
	partials: { list: listPartial }
})
var stateRouter = StateRouter(renderer, 'body')
addAppState(stateRouter, socket, sessId.get)
addLoginState(stateRouter, socket)

socket.once('connect', function() {
	connectSession(socket)
		.then(sessId.set)
		.then(function () {
			return stateRouter.evaluateCurrentRoute('app.overview')
		})
})

//setTimeout(window.close, 5000)
