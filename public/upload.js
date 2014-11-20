var socket = io('http://localhost')
socket.on('uploaded', function (filename) {
	console.log('uploaded:', filename)
})
socket.on('filenames', function (filenames) {
	console.log('files:')
	filenames.forEach(function (filename) { console.log(filename) })
})
socket.on('deleted', console.log.bind('Deleted %d files.'))

//**********BUTTONS INTERFACE**********//
function ls() {
	socket.emit('ls')
}

function del() {
	socket.emit('del')
}

//**********DRAGGING INTERFACE**********//
function onDrag(evnt) {
	evnt.stopPropagation()
	evnt.preventDefault()
}

function upload(evnt) {
	var files = evnt.dataTransfer.files
	console.log(evnt.dataTransfer.files)
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

var lastOutput = ''
function output(text, clear) {
	if (clear) {
		lastOutput = document.getElementById("output").textContent
		document.getElementById("output").textContent = ''
	}
	document.getElementById("output").textContent += text;
	//dump(text);
}
