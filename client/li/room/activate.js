var dragDrop = require('drag-drop/buffer')

module.exports = function activator(socket) {
	return function activate(context) {
		var ractive = context.domApi
		var room = context.parameters.room

		var audio = document.getElementById('audio-element')

		window.r = ractive
		window.j = audio
		window.onresize = scrollToBottom
		//file.createReadStream().pipe(audio) //future

		ractive.set(context.data)
		socket.on('chat receive', chatReceive)
		socket.on('new song', newSong)
		socket.on('user list', userList)
		ractive.on('text-submit', textSubmit)
		ractive.on('mute', toggleMute)
		context.on('destroy', destroy)
		dragDrop('body', onFiles)

		toggleMute() //sanity purposes
		updateTimeView()
		var ivUpdate = setInterval(updateTimeView, 50) // too often?

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
			var newFiles = files.filter(isAudio).map(listify)
			ractive.set('queue.array', oldFiles.concat(newFiles))
		}

		function destroy() {
			socket.emit('leave', room, console.log.bind(console, 'left', room))

			window.da = null
			window.j = null
			window.onresize = null
			audio = null
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
	return name.replace(/\.[^\.]+/, '') // use path.parse()?
}

function isAudio(file) {
	return file.type.split('/').shift() === 'audio'
}

function typeofAudio(file) {
	return file.type.split('/').pop()
}

function listify(file) {
	// Formats file for ../../list-partial.js
	return {
		label: typeofAudio(file),
		item: removeExtension(file.name)
	}
}
