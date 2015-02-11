var fs = require('fs')
var path = require('path')
var Room = require('./chat.js')
var Audio = require('./audio.js')
var data = require('./data.js')

function resolve(data, parameters, cb) {
	cb()
}

function activate(context) {
	console.log(context.parameters)
}

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs doesn't like it
	var template = fs.readFileSync( path.join(__dirname, 'room.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.room',
		route: '/room/:room',
		template: template,
		data: data,
		resolve: resolve,
		activate: activate
	})
}


function activate(context) {
	console.log('dom api ... parameters')
	console.log(context.domApi)
	console.log(context.parameters)

	var room = Room(context.parameters) //it needs to know what room it's in
	var audio = Audio()

	window.j = audio
	window.onresize = scrollToBottom
	//file.createReadStream().pipe(audio) //future

	room.on('chat receive', function pushMessage(msgObj) {
		views.chat.push('array', msgObj)
		scrollToBottom()
	})

	room.on('new song', function (song) {
		views.albumArt.set({
			source: song.cover
		})
		views.music.set({
			title: song.title,
			artist: song.artist,
			album: song.album
		})
		audio.src = song.src
	})

	views.chat.on('text-submit', function ts() {
		var text = this.get('input')
		this.set('input', '')
		if (text) {
			room.emit('chat send', {
				label: 'Joseph',
				item: text
			})
		}
		return false
	})

	setInterval(function () {
		views.music.set({
			currentSec: audio.currentTime,
			durationSec: audio.duration || 0.1 //no div by zero
		})
	}, 100)

	views.music.on('mute', function () {
		var toggled = !this.get('muted')
		audio.muted = toggled
		this.set('muted', toggled)
	})

	context.on('destroy', function() {
		delete window.j
		delete window.onresize
	})
}

function scrollToBottom() {
	// http://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
	var div = document.getElementById('chatView')
	div.scrollTop = div.scrollHeight
}
