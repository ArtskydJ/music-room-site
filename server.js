var http = require('http')
var ecstatic = require('ecstatic')
var io = require('socket.io')()
//var PlaylistCombinator = require('playlist-combinator')
var TEST = true

var ecstaticOpts = {
	root: './static',
	showDir: false
}
var server = http.createServer( ecstatic(ecstaticOpts) )
server.listen(80)
//var playlist = PlaylistCombinator()

io.attach(server)
io.on('connect', function conn(socket) {
	//var userId = socket.id //non-persistent
	//socket.join('room')
	//playlist.addUser(userId)

	// CHAT
	socket.emit('receive', createMessage(messages.selfJoin))
	socket.on('send', function ch(msg) {
		io.emit('receive', msg)
	})
	play(0)
	play = function () {}
})

function createMessage(text) {
	return { label: 'server', item: text, highlight: true }
}

var messages = {
	selfJoin: 'why hullo thar'
}


if (TEST) {
	var songs = [{
		title: 'Answering Machine',
		album: 'MacGyver OST',
		artist: 'MacGyver OST',
		cover: 'temp/MacGyver.jpg',
		src: 'temp/macgyvers_answer_phone.mp3',
		len: 6
	}, {
		title: 'Welcome to Markov Geist',
		album: 'Frozen Synapse OST',
		artist: 'nervous_testpilot',
		cover: 'temp/Frozen_Synapse_Original_Soundtrack.jpg',
		src: 'temp/01-Welcome-to-Markov-Geist.mp3',
		len: 74
	}, {
		title: 'Science is Fun',
		album: 'Portal 2 - Volume 1',
		artist: 'Aperture Science',
		cover: 'temp/portal-2.jpg',
		src: 'temp/Portal2-01-Science_is_Fun.mp3',
		len: 173
	}]

	var play = function playSong(index) {
		var song = songs[index]
		io.emit('new song', song)
		setTimeout(playSong, song.len * 1000, (index + 1) % songs.length)
		io.emit('receive', { label: 'Now Playing', item: song.title, highlight: true })
	}
}
