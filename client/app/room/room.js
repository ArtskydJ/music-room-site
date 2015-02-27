var fs = require('fs')
var path = require('path')
var Audio = require('./audio.js')
var data = require('./data.js')
var dragDrop = require('drag-drop/buffer')

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
	return function (data, parameters, cb) {
		var room = parameters.room

		socket.emit('join', room, function (err) {
			console.log('joining', room, '| err =', err)
			err ? cb.redirect('login') : cb()
		})
	}
}

function activator(socket) {
	return function activate(context) {
		var ractive = context.domApi
		var room = context.parameters.room

		var audio = Audio()

		window.r = ractive
		window.j = audio
		window.onresize = scrollToBottom
		//file.createReadStream().pipe(audio) //future

		ractive.set(context.data)
		toggleMute() //sanity purposes
		socket.on('chat receive', chatReceive)
		socket.on('new song', newSong)
		socket.on('user list', userList)
		ractive.on('text-submit', textSubmit)
		ractive.on('mute', toggleMute)

		dragDrop('body', onFiles)
		var ivUpdate = setInterval(updateTimeView, 50) // too often?

		context.on('destroy', destroy)

		function chatReceive(msgObj) {
			ractive.get('chat.array').push(msgObj)
			scrollToBottom()
		}

		function newSong(song) {
			console.log('new song! src:', song.src)
			ractive.set('music', song)
			audio.src = song.src
		}

		function userList(list) {
			console.log('user list', list)
			ractive.set('usersInRoom.array', list)
		}

		function textSubmit() {
			var text = ractive.get('chat.input')
			socket.emit('chat send', text)
			ractive.set('chat.input', '')
			return false
		}

		function toggleMute() {
			audio.muted = !audio.muted
		}

		function updateTimeView() {
			ractive.set({
				'music.muted': audio.muted,
				'music.currentSec': audio.currentTime || 0,
				'music.durationSec': audio.duration || 0.1 // no div by zero
			})
		}

		function onFiles(files, pos) {
			var oldFiles = ractive.get('queue.array')
			var newFiles = files.map(function (file) {
				return { item: removeExtension(file.name) }
			})
			ractive.set('queue.array', oldFiles.concat(newFiles))
		}

		function destroy() {
			socket.emit('leave', room, console.log.bind(console, 'left', room))
			delete window.da
			delete window.j
			delete window.onresize
			delete audio
			clearInterval(ivUpdate)

			socket.removeAllListeners()
		}
	}
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('autoscroll')
	div.scrollTop = div.scrollHeight
}

function removeExtension(name) {
	return path.basename(name, path.extname(name)) // path.parse() is in node 0.12
}
