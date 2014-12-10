var Socket = require('socket.io-client')
var dragDrop = require('drag-drop/buffer')
var ClientStorage = require('./clientStorage.js')
var config = require('./config.json').musicRoom

var socket = Socket(config.socketIoUrl)
var songStorage = new ClientStorage()

socket.on('download', function (songBundles) {
	if (!Array.isArray(songBundles)) {
		songBundles = [songBundles] //[{id: '0z2', mp3: 'fp9', ogg: '4bi', metadata: {}}]
	}
	songBundles.forEach(function (songBundle) {
		console.log('haz bundle: ' + !!songBundle)
		songStorage.get(songBundle)
	})
})

var chat = console.log.bind(console, 'chat:')
socket.on('chat', chat)

socket.on('play', play)
function play(songId) {
	var element = songStorage.load(songId)
	element.play()
	//songStorage.remove(oldId)
	return element
}

if (typeof document !== 'undefined') { //if in browser
	window.play = play

	dragDrop('#dragDropUpload', function (files, pos) {
		files.forEach(function (file) {
			songStorage.create(file, function (infoHash) {
				socket.emit('upload', infoHash) //add auth here; emit username too
			})
		})
	})
}
