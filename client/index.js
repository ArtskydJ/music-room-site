var Views = require('./views.js')
var Chat = require('./chat.js')

var views = Views()
var chat = Chat()

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
		elapsedSec: views.music.get('elapsedSec') + 1
	})
}, 1000)

//http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
function scrollToBottom() {
	var div = document.getElementById('chat-style')
	div.scrollTop = div.scrollHeight
}

setTimeout(function () {
	clearInterval(iv)
}, 65500)
