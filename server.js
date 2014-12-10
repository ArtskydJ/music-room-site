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

var upcomingSongs = [] //playing and upcoming
server.listen(80)

io.sockets.on('connect', function co(socket) {
	var userId = socket.id //non-persistent
	socket.join('room')

	tryPlaying()

	playlist.addUser(userId)
	socket.emit('chat', 'why hullo thar')
	socket.emit('download', upcomingSongs)

	socket.on('upload', function up(infoHash) { //TODO add auth here
		var songId = 'songid_' + infoHash
		playlist.addSong(userId, songId)
		storage.put(songId, infoHash)
		tryPlaying()
	})

	socket.on('chat', function ch(msg) {
		socket.broadcast.emit('chat', msg)
	})

	socket.on('disconnect', function di() {})
})


playlist.on('error', console.log.bind(null, 'playlist error'))

function tryPlaying() {
	if (io.engine.clientsCount > 1) { //&& upcomingSongs.length === 0) {
		nextSong()
	} else console.log('not enough users')
}

function nextSong() {
	//var lastPlayed = upcomingSongs.shift() //"pop" first ele
	var nextSongId = playlist.getNextSong()
	if (nextSongId) {
		var nextSongBundle = storage.get(nextSongId)
		var meta = (nextSongBundle && nextSongBundle.metadata) || {artist:[]}
		io.sockets.emit('download', nextSongBundle)
		io.sockets.emit('chat', 'Now playing '+meta.title+' by '+meta.artist[0]+' from '+meta.album+'.')
		if (upcomingSongs.length) {
			io.sockets.emit('play', nextSongBundle)
		} else console.log('no registered songs')
		upcomingSongs.push(nextSongBundle)
	} else console.log('no upload')
}

/*
TODO
#on join
- give songs
- once: 'downloaded' or timeout at 30 sec:
	- start music
	- start timer


#when timer "rings" //next song
- post message in chat
- grab next song
- emit startsong with [message, song, songtodownload]

#on leave
- if users < 2, stop music for everyone

*/
