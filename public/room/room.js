var fs = require('fs')
var path = require('path')
var Socket = require('./socket.js')
var Audio = require('./audio.js')
var data = require('./data.js')

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'room.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'room',
		route: '/room/:room',
		template: template,
		data: data,
		activate: activate
	})
}


function activate(context) {
	var socket = Socket(context.parameters.room)
	var audio = Audio()
	console.log(context.domApi)
	var views = context.domApi

	console.log('data')
	console.log(views.data)

	window.j = audio
	window.onresize = scrollToBottom
	//file.createReadStream().pipe(audio) //future

	socket.on('chat receive', function pushMessage(msgObj) {
		views.chat.push('array', msgObj)
		scrollToBottom()
	})

	socket.on('new song', function (song) {
		views.set({
			'albumArt': song.cover,
			'music.title': song.title,
			'music.artist': song.artist,
			'music.album': song.album
		})
		audio.src = song.src
	})

	views.on('text-submit', function ts() {
		var text = this.get('chat.input')
		this.set('chat.input', '')
		if (text) {
			room.emit('chat send', {
				label: 'Joseph',
				item: text
			})
		}
		return false
	})

	setInterval(function () {
		views.set({
			'music.currentSec': audio.currentTime,
			'music.durationSec': audio.duration || 0.1 //no div by zero
		})
	}, 100)

	views.on.bind(views, 'mute', function () {
		console.log('toggled mute')
		var toggled = !this.get('music.muted')
		audio.muted = toggled
		this.set('music.muted', toggled)
	})

	context.on('destroy', function() {
		console.log('getting destroyed')
		delete window.j
		delete window.onresize
	})
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('chatView')
	div.scrollTop = div.scrollHeight
}
