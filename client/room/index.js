var Views = require('../views.js')
var Chat = require('./chat.js')
var Audio = require('./audio.js')
var data = require('./data.js')

var views = Views(data)
var chat = Chat()
var audio = Audio()

audio.src = 'temp/Portal2-01-Science_is_Fun.mp3' //testing purposes
//audio.muted = true //sanity purposes
window.j = audio //testing purposes
window.onresize = scrollToBottom
//file.createReadStream().pipe(audio) //future

function scrollToBottom() {
	//http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('chatView')
	div.scrollTop = div.scrollHeight
}

chat.on('receive', function pushMessage(msgObj) {
	views.chat.push('array', msgObj)
	scrollToBottom()
})

views.chat.on('text-submit', function ts(evnt) {
	var text = this.get('input')
	this.set('input', '')
	if (text) {
		chat.emit('send', {
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
