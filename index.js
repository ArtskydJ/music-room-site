var http = require('http')
var crypto = require('crypto')
var Ecstatic = require('ecstatic')
var Socket = require('socket.io')
var xtend = require('xtend')
var webtorrent = require('webtorrent')
var uploadIsValid = require('./uploadIsValid.js')
var config = require('./config.json').musicRoom
var transcode = require('sox').transcode


config.ecstatic.root = __dirname + config.ecstatic.root
var serve = Ecstatic(config.ecstatic)
var server = http.createServer(serve)
var io = Socket(server)


server.listen(80)
io.on('connection', function (socket) {
	socket.emit('greeting', 'why, hullo thar')
	socket.on('upload', upload)

	function upload(file, meta) {
		if (uploadIsValid(meta)) {
			var id = hash(file)
			socket.emit('uploaded', true, meta.name)
			convert(file, id)
		} else {
			socket.emit('uploaded', false, meta.name)
		}
	}
})

function convert(file, id) {
	var fs = require('fs')
	Object.keys(config.sox).forEach(function (ext) {
		var writePath = config.convertedPath + id + '.' + ext
		console.log('creating: ' + writePath)
		var soxOpts = xtend(config.sox[ext], {
			input: file,
			output: fs.createWriteStream(writePath)
		})
		var convert = transcode(soxOpts)
		convert.on('error', logErr)
		convert.on('warning', logErr)
		convert.start()
	})
}

function cbIfErr(errCb, noErrCb) {
	return function (err) {
		if (err) { errCb(err) }
		else { noErrCb.apply(null, [].slice.call(arguments, 1)) }
	}
}

function logErr(err) {
	if (err) {
		console.log('Error: ' + (err && err.message))
	}
}

function hash(data) {
	return crypto.createHash('md5').update(data.toString()).digest('hex')
}
