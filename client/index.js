var Views = require('./views.js')
var Chat = require('./chat.js')
var Audio = require('./audio.js')

var views = Views()
var chat = Chat()
var audio = Audio()

//file.createReadStream().pipe(audio)
//audio.volume = 0.85
audio.src = 'temp/Portal2-01-Science_is_Fun.mp3'
window.j = audio
//console.log(audio.paused?'paused':'playing')
//audio.muted = true
//audio.pause(); audio.play()

chat.on('receive', function (msgObj) {
	views.chat.push('.', msgObj) //push it to my message list
	scrollToBottom()
})

views.chatInput.on('text-submit', function ts(evnt) {
	var text = this.get('message')
	if (text) {
		this.set('message', '')
		console.log(text)
		var msgObj = {
			name: 'Joseph',
			date: new Date().toISOString(),
			message: text
		}
		views.chat.push('.', msgObj) //push it to my message list
		chat.emit('send', msgObj)
		scrollToBottom()
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
