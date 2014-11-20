var socket = io('http://localhost')

//*****************LOG*ON*EVENT*****************//
console.log('client.js imported.')

socket.on('startup', function (text) {
	console.log('startup: ' + text)
})
socket.on('uploaded', function (success, filename) {
	console.timeEnd(filename)
	console.log((success ? 'uploaded: ' : 'did not upload: ') + filename)
})
socket.on('list uploads', function (filenames) {
	if (filenames.length) {
		var join = '\n- '
		console.log('files:' + join + filenames.join(join))
	} else {
		console.log('No files found.')
	}
})
socket.on('deleted', function () {
	console.log('Deleted all files.')
})

//*******************EMITTERS*******************//
function ls()  { socket.emit('ls')  }
function del() { socket.emit('del') }

function upload(files) {
	for (var i=0; i < files.length; i++) { //do not use forEach
		var file = files.item(i)
		console.time(file.name)
		socket.emit('upload', file, {
			name: file.name,
			size: file.size,
			type: file.type
		})
	}
}

// ^^^^^^^^^
// Socket IO

// -------------------------------------------- //

// Beautiful Interface :D
// vvvvvvvvvvvvvvvvvvv

//**************DRAGGING*INTERFACE**************//
function onDragEnter(evnt) {
	document.getElementById("upload").style['background-color'] = '#3f3'
	_dragging(evnt)
	_output()
}

function onDragOver(evnt) {
	_dragging(evnt)
}

function onDragLeave() {
	document.getElementById("upload").style['background-color'] = '#ddd'
	_output('UPLOAD', true)
}

function onDrop(evnt) {
	document.getElementById("upload").style['background-color'] = '#ddd'
	_dragging(evnt)
	_drop(evnt)
	upload(evnt.dataTransfer.files)
}

//***************HELPER*FUNCTIONS***************//

function _dragging(evnt) {
	evnt.stopPropagation()
	evnt.preventDefault()
}

function _drop(evnt) {
	var files = evnt.dataTransfer.files
	var plural = (files.length === 1 ? '' : 's')
	var text = files.length + " File" + plural + ":\n"
	_output(text, true)
	for(var i=0; i < files.length; i++) { //do not bind forEach
		var file = files.item(i)
		_output(file.name + ", " + file.size + "bytes, " + file.type + "\n")
	}
}

var lastOutput = ''
function _output(text, clear) {
	if (typeof text === 'undefined' || clear) {
		lastOutput = document.getElementById("upload").textContent
		document.getElementById("upload").textContent = ''
	}
	document.getElementById("upload").textContent += text ? text : lastOutput;
}
