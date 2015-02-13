var StateRouter = require('abstract-state-router')
var RactiveRenderer = require('ractive-state-router')
var fs = require('fs')
var path = require('path')
var formatTime = require('./format-time.js')
var app = require('./app/app.js')

// Don't change the following line much; brfs won't like it
var listPartial = fs.readFileSync( path.join(__dirname, 'list-partial.html'), { encoding: 'utf8' } )

var renderer = RactiveRenderer({
	data: { formatTime: formatTime },
	partials: { list: listPartial }
})

var stateRouter = StateRouter(renderer, 'body')

app(stateRouter)

setTimeout(window.close, 5000)
