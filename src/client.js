var Socket = process.env.test?
	reqiure('mock-socket.io').Client
	require('socket.io-client')
var dragDrop = require('drag-drop') // /buffer
var ClientStorage = require('./clientStorage.js')
var config = require('./config.json').musicRoom
var uploadIsInvalid = require('./uploadIsInvalid.js')
//var fileToStream = require('filestream/read') //filereader-stream
var socketStream = require('socket.io-stream')
var xtend = require('xtend')

var socket = Socket(config.socketIoUrl)
var songStorage = new ClientStorage()

socket.on('download', function (songBundles) {
	if (!Array.isArray(songBundles)) {
		songBundles = [songBundles] //[{id: '0z2', mp3: 'fp9', ogg: '4bi', metadata: {}}]
	}
	songBundles.forEach(function (songBundle) {
		console.log('download bundle: ' + songBundle)
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
		files.filter(validUpload).forEach(function (file) {
			var meta = copyProperties(file, ['name', 'size', 'type'])
			console.log('meta:', meta)
			//console.log(fileToStream(file))
			console.log('emitting upload')
			var uploadStream = socketStream.createStream() //create an empty stream
			socketStream(socket).emit('upload', uploadStream, meta,
					function results(songId, tagData, mp3Stream, oggStream) {
				console.log('songId: ', songId)
				console.log('tagData: ', tagData)
				console.log(mp3Stream, mp3Stream && mp3Stream.pipe)
				console.log(oggStream, oggStream && oggStream.pipe)
			}) //add auth here; emit username too
			socketStream.createBlobReadStream(file).pipe(uploadStream) //fill the stream
		})
	})
}

function validUpload(file) {
	var err = uploadIsInvalid(file)
	if (err) console.log(err && err.message)
	return !err
}

function copyProperties(src, keys) {
	return keys.reduce(function (dest, key) {
		dest[key] = src[key]
		return dest
	}, {})
}
