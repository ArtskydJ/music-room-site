var Socket = process.env.test ?
	reqiure('mock-socket.io').Client :
	require('socket.io-client')
var FileTransfer = require('./fileTransfer.js')
var cfg = require('./config.json').musicRoom

var socket = Socket(cfg.socketIoUrl)
var fileTransfer = new FileTransfer()

socket.on('download', function (songBundles) {
	fileTransfer.download(songBundles)
})

var chat = console.log.bind(console, 'chat:')
socket.on('chat', chat)

socket.on('play', play)

if (typeof document !== 'undefined') { //if in browser
	window.play = play
}

function play(songId) {
	var audioElement = document.getElementById('playAudio')
	audioElement.src = fileTransfer.get(songId)
	audioElement.load()
	//must load if src changed:
	//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Methods
	audioElement.play()
	return audioElement
}
