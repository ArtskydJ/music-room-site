var http = require('http')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var socketStream = require('socket.io-stream')
var PlaylistCombinator = require('playlist-combinator')
var config = require('./src/config.json').musicRoom
var Convertor = require('./src/serverConvert.js')
var crypto = require('crypto')
var concat = require('concat-stream')

config.ecstatic.root = process.cwd() + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)
var playlist = PlaylistCombinator()
var convert = Convertor()

var upcomingSongs = [] //playing and upcoming
server.listen(80)

console.log('___RESTARTING___')
io.sockets.on('connect', function co(socket) {
	var userId = socket.id //non-persistent
	socket.join('room')
	
	tryPlaying()

	playlist.addUser(userId)
	socket.emit('chat', 'why hullo thar')
	socket.emit('download', upcomingSongs)

	socketStream(socket).on('upload', function up(stream, meta, fnReturn) { //TODO add auth here
		console.log('on upload')
		convert(stream, meta, function (err, tagData, mp3Stream, oggStream) { //thisFile instead of file?
			console.log('done converting,', err)
			if (!err) {
				stream.pipe(crypto.createHash('md5')).pipe(concat(function (md5) {
					var songId = 'songid_' + md5.toString('hex')
					console.log(songId)
					fnReturn(songId, tagData, mp3Stream, oggStream) //bad idea?
					playlist.addSong(userId, songId)
				}))
			}
			tryPlaying()
		})
	})

	socket.on('chat', function ch(msg) {
		socket.broadcast.emit('chat', msg)
	})

	console.log('=JOIN=')
	socket.on('disconnect', function di() {
		console.log('=LEAVE=')
	})
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
		var nextSongBundle = null //convert.get(nextSongId)
		console.log(nextSongId)
		console.log(nextSongBundle)

		var meta = (nextSongBundle && nextSongBundle.metadata) || {artist:[]}
		io.sockets.emit('download', nextSongBundle)
		io.sockets.emit('chat', 'Now playing '+meta.title+' by '+meta.artist[0]+' from '+meta.album+'.')
		if (upcomingSongs.length) {
			console.log('play')
			io.sockets.emit('play', nextSongBundle)
		}
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
