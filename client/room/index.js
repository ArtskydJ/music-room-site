var Views = require('../views.js')
var Room = require('./room.js')
var Audio = require('./audio.js')
var data = require('./data.js')

var namespace = window.location.pathname
var views = Views(data)
var room = Room(namespace)
var audio = Audio()


window.j = audio
window.onresize = scrollToBottom
//file.createReadStream().pipe(audio) //future


function scrollToBottom() {
	//http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('chatView')
	div.scrollTop = div.scrollHeight
}


room.on('chat receive', function pushMessage(msgObj) {
	views.chat.push('array', msgObj)
	scrollToBottom()
})


room.on('new song', function (song) {
	views.albumArt.set({
		source: song.cover
	})
	views.music.set({
		title: song.title,
		artist: song.artist,
		album: song.album
	})
	audio.src = song.src
})


views.chat.on('text-submit', function ts(evnt) {
	var text = this.get('input')
	this.set('input', '')
	if (text) {
		room.emit('chat send', {
			label: 'Joseph',
			item: text
		})
	}
	return false
})


setInterval(function () {
	views.music.set({
		currentSec: audio.currentTime,
		durationSec: audio.duration || 0.1 //no div by zero
	})
}, 100)


views.music.on('mute', function ( evnt ) {
	var toggled = !this.get('muted')
	audio.muted = toggled
	this.set('muted', toggled)
})
