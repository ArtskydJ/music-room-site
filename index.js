var http = require('http')
var crypto = require('crypto')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var xtend = require('xtend')
var webtorrent = require('webtorrent')
//var uploadIsValid = require('./uploadIsValid.js')
var config = require('./config.json').musicRoom
var Sux = require('sux')


config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)


server.listen(80)
io.on('connection', function (socket) {
	socket.emit('greeting', 'why, hullo thar')
})

function convert(inStream) {
	var convert = new Sux(config.sux)
	convert.in(inStream).start() //.out()
}

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

function hash(data) {
	return crypto.createHash('md5').update(data.toString()).digest('hex')
}
