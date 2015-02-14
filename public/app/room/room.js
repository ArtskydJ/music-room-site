var Promise = require('promise')
var fs = require('fs')
var path = require('path')
var Audio = require('./audio.js')
var data = require('./data.js')

module.exports = function(stateRouter, socket) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'room.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.room',
		route: '/room/:room',
		template: template,
		resolve: resolver(socket),
		data: data,
		activate: activator(socket)
	})
}

function resolver(socket) {
	var connected = new Promise(function(resolve, reject) {
		socket.on('connect', resolve)
		socket.on('error', reject)
	})

	return function resolve() {
		var authenticated = Promise.denodeify( socket.emit )('session isAuthenticated')
		return Promise.all([ connected, authenticated ])
			.then(function (arr) {
				return arr.every(Boolean)
			})
	}
}

function activator(socket) {
	return function activate(context) {
		var ractive = context.domApi
		var audio = Audio()
		var room = context.parameters.room

		window.r = ractive
		window.j = audio
		window.onresize = scrollToBottom
		//file.createReadStream().pipe(audio) //future
		ractive.set(context.data)

		toggleMute() //sanity purposes

		socket.on('chat receive', function pushMessage(msgObj) {
			ractive.get('chat.array').push(msgObj)
			scrollToBottom()
		})

		socket.on('new song', function (song) {
			ractive.set('music', song)
			audio.src = song.src
		})

		ractive.on('text-submit', function ts() {
			var text = this.get('chat.input')
			this.set('chat.input', '')
			if (text) {
				socket.emit('chat send', {
					label: 'Joseph',
					item: text
				})
			}
			return false
		})

		setInterval(function updateTimeView() {
			ractive.set({
				'music.muted': audio.muted,
				'music.currentSec': audio.currentTime || 0,
				'music.durationSec': audio.duration || 0.1 // no div by zero
			})
		}, 50)

		ractive.on('mute', toggleMute)

		socket.emit('join', room)
		context.on('destroy', function dest() {
			socket.emit('leave', room)
			delete window.da
			delete window.j
			delete window.onresize
		})

		function toggleMute() {
			audio.muted = !audio.muted
		}
	}
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('autoscroll')
	div.scrollTop = div.scrollHeight
}
