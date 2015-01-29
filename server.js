var http = require('http')
var Io = require('socket.io')
var Router = require('./router.js')
var Room = require('./room.js')
var TEST = (process.argv[2] === '-t')

var router = Router()
var server = http.createServer( router )
var io = new Io()
io.attach(server)
var roomAutoplay = Room(io, 'autoplay')

server.listen(80)

if (true) { //autoplay stuff
	var songs = require('./test-song-data.json')

	var play = function playSong(index) {
		var song = songs[index]
		roomAutoplay.emit('new song', song)
		setTimeout(playSong, song.len * 1000, (index + 1) % songs.length)
		roomAutoplay.emit('receive',
			{ label: 'Now Playing', item: song.title, highlight: true }
		)
		play = function () {console.log('already playing')}
	}
	if (TEST) {
		setTimeout(process.exit, 10000) //i don't like this "solution"
	}
	roomAutoplay.on('connect', function conn(socket) {
		play(0)

		socket.emit('receive', {
			label: 'server',
			item: 'why hullo thar',
			highlight: true
		})
	})
}

