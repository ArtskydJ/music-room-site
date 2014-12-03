var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var Webtorrent = require('webtorrent')
var PlaylistCombinator = require('playlist-combinator')
var config = require('./src/config.json').musicRoom

config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)
var playlist = PlaylistCombinator()
var torrenter = new Webtorrent()

server.listen(80)

io.on('connection', function (socket) {
	var userId = socket.id //I don't think these are persistent between shutdowns
	socket.join('room')

	playlist.addUser(userId)

	socket.emit('greeting', 'why, hullo thar')
	socket.on('upload', function (infoHash) { //TODO add auth here
		playlist.addSong(userId, infoHash)
		torrenter.download({ //act as a seeder
			infoHash: infoHash,
			announce: config.announce
		})
		socket.broadcast.emit('download', infoHash) //TODO do this elsewhere
	})
	socket.on('disconnect', function () {

	})
})

/*setInterval(function poll() {

}, 100)*/


playlist.on('error', console.log.bind(null, 'playlist error'))

/*
gets uplaod:
	add upload to playlist

no songs are playing:
	there are enough people to play a song:
		enough people have the song:
			tell everyone to play the song
		ELSE:
			give everyone the song

onsongend:
	delete just played song (torrent.remove())
	have all play next song


*/
