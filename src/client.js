var Socket = require('socket.io-client')
var dragDrop = require('drag-drop/buffer')
var Webtorrent = require('webtorrent')
var uploadIsInvalid = require('./uploadIsInvalid.js')
var SongStorage = require('./storage.js')
var config = require('./config.json').musicRoom

var socket = Socket(config.socketIoUrl)
var torrenter = new Webtorrent()
var songStorage = new SongStorage()

socket.on('greeting', function (str) { console.log(str) })

socket.on('download', function (infoHashes) {
	if (typeof infoHashes === 'string') infoHashes = [infoHashes]
	infoHashes.forEach(function (infoHash) {
		console.log('attempting to download: ' + infoHash)
		torrenter.download({
			infoHash: infoHash,
			announce: config.announce
		}, function onTorrent(torrent) {
			console.log('window.play(\'' + infoHash + '\')')
			console.log('downloaded ' + infoHash + ' from ' + torrent.swarm.wires.length + ' peers.')
			songStorage.put(torrent)
		})
	})
})

socket.on('play', function (playInfoHash) {
	songStorage.get(playInfoHash).play()
	//deleteSong(oldInfoHash)
})

if (typeof document !== 'undefined') { //if in browser

	window.play = function play(s) {
		return songStorage.get(s).play()
	}
	console.log('window.play()')

	dragDrop('#dragDropUpload', function (files, pos) {
		files.forEach(function (file) {
			var err = uploadIsInvalid(file)
			if (!err) {
				torrenter.seed(file, function onSeed(torrent) {
					torrent.discovery.on('peer', function () {
						console.log('connected to peer')
					})
					var infoHash = torrent.infoHash
					console.log('window.play(\'' + infoHash + '\')')
					console.log('created torrent: ' + infoHash)
					socket.emit('upload', infoHash) //add auth here; emit username too
					songStorage.put(torrent)
				})
			} else {
				console.log(err && err.message)
			}
		})
	})
}

function deleteSong(infoHash) {
	torrenter.remove(infoHash)
	songStorage.get(infoHash).stop()
}
