var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var xtend = require('xtend')
var uploadIsValid = require('./uploadIsValid.js')
var config = require('./config.json').musicRoom


config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)


server.listen(80)
io.on('connection', function (socket) {
	socket.emit('greeting', 'why, hullo thar')

})

function cbIfErr(errCb, noErrCb) {
	return function (err) {
		if (err) { errCb(err) }
		else { noErrCb.apply(null, [].slice.call(arguments, 1)) }
	}
}

function logErr(err) {
	if (err) {
		console.log('Error: ' + (err && err.message))
	}
}

