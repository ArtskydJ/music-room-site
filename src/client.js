var Socket = require('socket.io-client')
var dragDrop = require('drag-drop/buffer')
var Webtorrent = require('webtorrent')
var crypto = require('crypto')
var uploadIsValid = require('./uploadIsValid.js')
var reflect = require('./reflect.js')
var SongStorage = require('./storage.js')
var config = require('./config.json').musicRoom
var typedArrayToBuffer = require('typedarray-to-buffer')
var AV = require('av')

var socket = Socket(config.socketIoUrl)
var torrent = new Webtorrent()
var songStorage = new SongStorage()

socket.on('greeting', function (str) { console.log(str) })

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

if (typeof document !== 'undefined') { //if in browser

	window.play = function play(infoHash) {
		if (!infoHash) {
			infoHash = Object.keys(songStorage._storage)[0]
		}
		console.log(infoHash)
		songStorage.get(infoHash).play()
	}
	window.get = function get() {return songStorage._storage}
	console.log('window.play(), window.get()')

	dragDrop('#dragDropUpload', function (files, pos) {
		files.filter(uploadIsValid).forEach(function (file) {

			/*var player = AV.Player.fromBuffer(file) //THIS WORKS
			player.play()
			console.log(player)
			setTimeout(console.log.bind(console, player), 5000)*/

			torrent.seed(file, function onSeed(torrent) { //{name: hash(file)}, 
				var infoHash = torrent.infoHash
				if (torrent.discovery && typeof torrent.discovery.on === 'function') {
					console.log('watching torrent.discovery for peer event')
					torrent.discovery.on('peer', function () {
						console.log('connected to peer')
					})
				}
				console.log('created torrent: ' + infoHash)
				socket.emit('new file', infoHash) //add auth here; emit username too
				console.log(torrent)
				songStorage.put(torrent)
				/*setTimeout(function () {
					console.log('play attempt')
					songStorage.get(torrent.infoHash).play()
				}, 1000)*/
			})
		})
	})
}

