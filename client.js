var Socket = require('socket.io-client')
var dragDrop = require('drag-drop') // /buffer
var Webtorrent = require('webtorrent')
var crypto = require('crypto')
var musicMetadata = require('musicmetadata')
var uploadIsValid = require('./uploadIsValid.js')
var reflect = require('./reflect.js')
var config = require('./config.json').musicRoom

var socket = Socket(config.socketIoUrl)
var client = new Webtorrent()

socket.on('greeting', function (greeting) {
	console.log(greeting)
})
socket.on('uploaded', function (success, filename) {
	console.timeEnd(filename)
	console.log((success ? 'Uploaded: ' : 'File not allowed: ') + filename)
})
reflect('torrent', client, socket)

dragDrop('#dragDropUpload', function (files, pos) {
	console.log(files)
	files.filter(uploadIsValid).forEach(function (file) {
		client.seed(file, {
			name: hash(file)
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
