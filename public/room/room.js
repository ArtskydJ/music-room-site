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
	var ractive = context.domApi
	var socket = Socket(context.parameters.room)
	var audio = Audio()
	audio.muted = true //sanity purposes

	window.r = ractive
	window.j = audio
	window.onresize = scrollToBottom
	//file.createReadStream().pipe(audio) //future

	ractive.set(context.data) //this doesn't work because it renders then activates.

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
			'music.currentSec': audio.currentTime || 0,
			'music.durationSec': audio.duration || 0.1 // no div by zero
		})
	}, 50)

	ractive.on('mute', function toggleMute() {
		var toggled = !this.get('music.muted')
		audio.muted = toggled
		this.set('music.muted', toggled)
	})

	context.on('destroy', function() {
		delete window.da
		delete window.j
		delete window.onresize
	})
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('autoscroll')
	div.scrollTop = div.scrollHeight
}
