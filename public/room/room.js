var fs = require('fs')
var path = require('path')
var Socket = require('./socket.js')
var Audio = require('./audio.js')
var data = require('./data.js')

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'room.html'), { encoding: 'utf8' } )

	console.log('start data')
	console.log(data)

	stateRouter.addState({
		name: 'room',
		route: '/room/:room',
		template: template,
		data: data,
		resolve: function (data, p, cb) {
			console.log('mid data')
			console.log(data)
			cb()
		},
		activate: activate
	})
}


function activate(context) {
	var socket = Socket(context.parameters.room)
	var audio = Audio()

	context.domApi.data = context.data
	var views = context.domApi
	window.da = context.domApi
	window.j = audio
	window.onresize = scrollToBottom
	//file.createReadStream().pipe(audio) //future

	console.log('vgm')
	console.log(views.data)

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
			'music.durationSec': audio.duration || 0.1 // no div by zero
		})
	}, 100)

	views.on('mute', function () {
		var toggled = !this.get('music.muted')
		audio.muted = toggled
		this.set('music.muted', toggled)
	})

	context.on('destroy', function() {
		console.log('getting destroyed')
		delete window.da
		delete window.j
		delete window.onresize
	})
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('chatView')
	div.scrollTop = div.scrollHeight
}
