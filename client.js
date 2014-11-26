var socket = require('socket.io-client')('http://localhost')
var dragDrop = require('drag-drop')
var musicMetadata = require('musicmetadata')
var uploadIsValid = require('./uploadIsValid.js')

dragDrop('#dragDropUpload', function (files, pos) {
	files.forEach(function (file) {
		if (uploadIsValid(file)) {
			console.log(file)

			var metadata = musicMetadata(file)
			metadata.on('metadata', function (result) {
				console.log(result)
			})
			metadata.on('done', function thrower(err) {
				if (err) throw err
			})

			console.time(file.name)
			socket.emit('upload', file, {
				name: file.name,
				size: file.size,
				type: file.type
			})
		} else {
			console.log('Blocked upload: ' + file.name) // tell then why it was blocked?
		}
	})
})

socket.on('greeting', function (greeting) {
	console.log(greeting)
})
socket.on('uploaded', function (success, filename) {
	console.timeEnd(filename)
	console.log((success ? 'Uploaded: ' : 'File not allowed: ') + filename)
})
socket.on('list uploads', function (filenames) {
	if (filenames.length) {
		var join = '\n- '
		console.log('Files:' + join + filenames.join(join))
	} else {
		console.log('No files found.')
	}
})
socket.on('deleted', function () {
	console.log('Deleted all files.')
})

window.ls =  function ls()  { socket.emit('ls')  }
