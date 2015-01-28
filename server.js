var http = require('http')
var ecstatic = require('ecstatic')
var io = require('socket.io')()
var Room = require('./room.js')
var TEST = true //process.env.test

var ecstaticOpts = {
	root: './static',
	showDir: false
}
var server = http.createServer( ecstatic(ecstaticOpts) )
server.listen(80)
io.attach(server)
var room = Room(io)

if (TEST) {
	var songs = require('./test-song-data.json')

	var play = function playSong(index) {
		var song = songs[index]
		room.emit('new song', song)
		setTimeout(playSong, song.len * 1000, (index + 1) % songs.length)
		room.emit('receive', { label: 'Now Playing', item: song.title, highlight: true })
		play = function () {console.log('already playing')}
	}

	setTimeout(process.exit, 9000) //i don't like this "solution"

	room.on('connect', function conn(socket) {
		play(0)

		socket.emit('receive', {
			label: 'server',
			item: 'why hullo thar',
			highlight: true
		})
	})
}
