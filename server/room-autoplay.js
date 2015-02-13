var Room = require('./room.js')
var songs = require('./test-song-data.json')

module.exports = function autoplayRoom(io, testMode) {
	if (testMode) {
		setTimeout(process.exit, 10000) //i don't like this "solution"
	}

	var roomAutoplay = Room(io, 'autoplay')

	function chat(what, from, message) {
		what.emit('chat receive', {
			label: from,
			item: message,
			highlight: true
		})
	}

	var play = function playSong(index) {
		var song = songs[index]
		roomAutoplay.emit('new song', song)
		setTimeout(playSong, song.len * 1000, (index + 1) % songs.length)
		chat(roomAutoplay, 'Now Playing', song.title)
	}

	roomAutoplay.on('connect', function conn(socket) {
		play(0)
		play = console.log.bind(null, 'already playing')

		chat(socket, 'server', 'why hullo thar')
	})
}
