var songs = require('./test-song-data.json')

module.exports = function autoplayRoom(io, testMode) {
	if (testMode) {
		setTimeout(process.exit, 10000) //i don't like this "solution"
	}

	var roomAutoplay = io.in('autoplay')

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
		chat(roomAutoplay, 'Now Playing', song.title)

		setTimeout(playSong, song.len * 1000, (index + 1) % songs.length)
		play = function(){ console.log('already playing') }
	}

	io.on('connect', function(socket) {
		socket.on('join', function(room) {
			if (room === 'autoplay') {
				setTimeout(function(){
					play(0)
				}, 10)
			}
		})
	})
}
