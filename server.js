var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var PlaylistCombinator = require('playlist-combinator')
var config = require('./src/config.json').musicRoom

config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)
var playlist = PlaylistCombinator()

server.listen(80)

io.on('connection', function (socket) {
	var userId = socket.id //I don't think these are persistent between shutdowns
	playlist.addUser(userId)

	socket.emit('greeting', 'why, hullo thar')
	socket.on('new file', function (infoHash) { //add auth here
		playlist.addSong(userId, infoHash)
		socket.broadcast.emit('new file', infoHash)
	})
})


playlist.on('error', console.log.bind(null, 'playlist error'))
