var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var config = require('./src/config.json').musicRoom

config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)

server.listen(80)
io.on('connection', function (socket) {
	socket.emit('greeting', 'why, hullo thar')
	socket.on('new file', function (infoHash) {
		socket.broadcast.emit('new file', infoHash)
	}) //do stuff here
})
