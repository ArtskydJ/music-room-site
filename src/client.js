var Socket = require('socket.io-client')
var dragDrop = require('drag-drop') // /buffer
var Webtorrent = require('webtorrent')
var crypto = require('crypto')
var musicMetadata = require('musicmetadata')
var uploadIsValid = require('./uploadIsValid.js')
var reflect = require('./reflect.js')
var config = require('./config.json').musicRoom

var socket = Socket(config.socketIoUrl)
var transfer = new Webtorrent()

socket.on('greeting', function (greeting) {
	console.log(greeting)
})
transfer.on('torrent', function (torrent) {
	console.log(torrent)
	//socket.emit('torrent', torrent)
})

dragDrop('#dragDropUpload', function (files, pos) {
	console.log(files)
	files.filter(uploadIsValid).forEach(function (file) {
		transfer.seed(file, {
			name: hash(file)
		}, function (torrent) {
			console.log('torrent cb:', torrent)
		})
	})
})

function parseMetadataFromFile(file) {
	var metadata = musicMetadata(file)
	metadata.on('metadata', function (result) {
		console.log(result)
	})
	metadata.on('done', function (err) {
		if (err) throw err
	})
}

function hash(data) {
	return crypto.createHash('md5').update(data.toString()).digest('hex')
}
