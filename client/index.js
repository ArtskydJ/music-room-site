var Views = require('./views.js')
var Chat = require('./chat.js')

var views = Views()
var chat = Chat()

chat.on('receive', function (msgObj) {
	views.chat.push('.', msgObj)
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
	}
	return false
})

setTimeout(function () {
	views.music.set({
		elapsedSec: 974,
		percent: 99
	})
}, 2000)
