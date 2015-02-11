var http = require('http')
var Io = require('socket.io')
var St = require('st')
var Room = require('./server/room.js')
var TEST = (process.argv[2] === '-t')

var router = St({
	path: './app/',
	url: '/',
	index: 'index.html',
	passthrough: true
})
var server = http.createServer( function (req, res) {
	router(req, res, function (e) {
		res.write('oh noes')
		res.end()
	})
} )
var io = new Io()
io.attach(server)
var roomAutoplay = Room(io, 'autoplay')

server.listen(80)

server.on('request', function(req, res) {
	console.log(req.url)
})

if (true) { //autoplay stuff
	var songs = require('./server/test-song-data.json')

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
