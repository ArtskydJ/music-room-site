var Views = require('./views.js')
var Chat = require('./chat.js')
var Audio = require('./audio.js')

var views = Views()
var chat = Chat()
var audio = Audio()

audio.src = 'temp/Portal2-01-Science_is_Fun.mp3' //testing purposes
window.j = audio //testing purposes
//file.createReadStream().pipe(audio) //future

function pushMessage(msgObj) {
	views.chat.push('.', msgObj)
	scrollToBottom()
}

chat.on('receive', pushMessage)

views.chatInput.on('text-submit', function ts(evnt) {
	var text = this.get('message')
	this.set('message', '')
	if (text) {
		chat.emit('send', {
			name: 'Joseph',
			message: text
		})
	}
	return false
})

var iv = setInterval(function () {
	views.music.set({
		currentSec: audio.currentTime,
		durationSec: audio.duration || 0
	})
}, 100)

//http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
function scrollToBottom() {
	var div = document.getElementById('chat-style')
	div.scrollTop = div.scrollHeight
}

views.music.on('button-mute', function ( evnt ) {
	var toggled = !this.get('muted')
	audio.muted = toggled
	this.set('muted', toggled)
})
