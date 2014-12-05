var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var PlaylistCombinator = require('playlist-combinator')
var config = require('./src/config.json').musicRoom
var Storage = require('./src/serverStorage.js')

config.ecstatic.root = process.cwd() + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)
var playlist = PlaylistCombinator()
var storage = Storage()

//var userCount = 0
var upcomingSongs = []
server.listen(80)

io.on('connect', function (socket) {
	var userId = socket.id //I don't think these are persistent between shutdowns
	socket.join('room')
	//userCount++

	playlist.addUser(userId)

	socket.emit('greeting', 'why, hullo thar')

	socket.on('upload', function (infoHash) { //TODO add auth here
		playlist.addSong(userId, infoHash)
		storage.put(infoHash, infoHash) //yes, infoHash 2x
		socket.broadcast.emit('download', infoHash) //TODO do this elsewhere
	})

	socket.emit('download', upcomingSongs)

	socket.on('disconnect', function () {
		//userCount--
	})
})


playlist.on('error', console.log.bind(null, 'playlist error'))

/*
TODO
#on join
- evaluatestate

#when songshouldbedone
- post message in chat
- grab next song
- emit startsong with [message, song, songtodownload]

#on leave
- evaluatestate

evaluatestate(users) if enough users, play a song or something
*/
