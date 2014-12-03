var Socket = require('socket.io-client')
var dragDrop = require('drag-drop/buffer')
var Webtorrent = require('webtorrent')
var uploadIsValid = require('./uploadIsValid.js')
var SongStorage = require('./storage.js')
var config = require('./config.json').musicRoom

var socket = Socket(config.socketIoUrl)
var torrent = new Webtorrent()
var songStorage = new SongStorage()
var latestUploadInfoHash = null

socket.on('greeting', function (str) { console.log(str) })

socket.on('new file', function (infoHash) {
	console.log('attempting to download: ' + infoHash)
				latestUploadInfoHash = infoHash //for window.play()
	var options = {
		infoHash: infoHash,
		announce: config.announce
	}
	torrent.download(options, function onTorrent(torrent) {
		console.log('downloaded ' + infoHash + ' from ' + torrent.swarm.wires.length + ' peers.')
		songStorage.put(torrent)
	})
})

socket.on('play song', function (playInfoHash, preloadInfoHash) {
	songStorage.get(playInfoHash).play()
	songStorage.get(preloadInfoHash).preload()
})

if (typeof document !== 'undefined') { //if in browser

	window.play = function play() {
		return songStorage.get( latestUploadInfoHash ).play()
	}
	console.log('window.play()')

	dragDrop('#dragDropUpload', function (files, pos) {
		files.filter(uploadIsValid).forEach(function (file) {
			torrent.seed(file, function onSeed(torrent) {
				torrent.discovery.on('peer', function () {
					console.log('connected to peer')
				})
				var infoHash = torrent.infoHash
				latestUploadInfoHash = infoHash //for window.play()
				console.log('created torrent: ' + infoHash)
				socket.emit('new file', infoHash) //add auth here; emit username too
				songStorage.put(torrent)
			})
		})
	})
}
