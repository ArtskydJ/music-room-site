var Socket = require('socket.io-client')
var dragDrop = require('drag-drop/buffer')
var Webtorrent = require('webtorrent')
var crypto = require('crypto')
var uploadIsValid = require('./uploadIsValid.js')
var reflect = require('./reflect.js')
var config = require('./config.json').musicRoom
var typedArrayToBuffer = require('typedarray-to-buffer')

var socket = Socket(config.socketIoUrl)
var torrent = new Webtorrent()
var songStorage = require('./storage.js')

socket.on('greeting', function (s) { console.log(s) })

socket.on('new file', function (infoHash) {
	console.log('found new file: ' + infoHash)
	var options = {
		infoHash: infoHash,
		announce: config.announce
	}
	torrent.download(options, function onTorrent(torrent) {
		console.log('downloaded ' + infoHash + ' from ' + torrent.swarm.wires.length + ' peers.')
		console.log(torrent)
		songStorage.put(torrent)
	})
})

socket.on('play song', function (playInfoHash, preloadInfoHash) {
	songStorage.get(playInfoHash).play()
	songStorage.get(preloadInfoHash).preload()
})

if (typeof document !== 'undefined') {
	dragDrop('#dragDropUpload', function (files, pos) {
		files.filter(uploadIsValid).forEach(function (file) {
			torrent.seed(file, function onSeed(torrent) { //{name: hash(file)}, 
				var infoHash = torrent.infoHash
				if (torrent.discovery && typeof torrent.discovery.on === 'function') {
					console.log('watching torrent.discovery for peer event')
					torrent.discovery.on('peer', function () {
						console.log('connected to peer')
					})
				}
				console.log('created torrent: ' + infoHash)
				socket.emit('new file', infoHash)
				console.log(torrent)
			})
		})
	})
}

