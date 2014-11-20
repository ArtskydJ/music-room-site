var socket = io('http://localhost')

//*****************LOG ON EVENT*****************//
console.log('upload.js imported.')

socket.on('startup', function (text) {
	console.log('startup: ' + text)
})
socket.on('uploaded', function (filename) {
	console.log('uploaded: ' + filename)
})
socket.on('list uploads', function (filenames) {
	console.log('files:\n' + filenames.join('\n'))
})
socket.on('deleted', function () {
	console.log('Deleted all files.')
})

//*****************EMIT ON CLICK****************//
function ls()  { socket.emit('ls')  }
function del() { socket.emit('del') }

// ^^^^^^^^^
// Socket IO

// -------------------------------------------- //

// Beautiful Interface :D
// vvvvvvvvvvvvvvvvvvv

//**************DRAGGING INTERFACE**************//
function onDrag(evnt) {
	evnt.stopPropagation()
	evnt.preventDefault()
}

function upload(evnt) {
	var files = evnt.dataTransfer.files
	console.log(files)

	output(files.length + " files:\n")
	for(var i=0; i < files.length; i++) { //do not bind forEach
		var file = files.item(i)
		console.log(file.name, typeof file.slice())
		socket.emit('upload', file, {
			name: file.name,
			size: file.size,
			type: file.type
		})
		output(file.name + ", " + file.size + "bytes, " + file.type + "\n")
	}
}

//********************OUTPUT********************//
var lastOutput = ''
function output(text, clear) {
	if (!text || clear) {
		lastOutput = document.getElementById("output").textContent
		document.getElementById("output").textContent = ''
	}
	document.getElementById("output").textContent += text ? text : lastOutput;
}
