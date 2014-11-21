var http = require('http')
var fs = require('fs')
var crypto = require('crypto')
var Ecstatic = require('ecstatic')
var level = require('level')
var space = require('level-spaces')
var Socket = require('socket.io')
var uploadIsValid = require('./uploadIsValid.js')

console.log(__dirname + '/public')
var serve = Ecstatic({
	root: __dirname + '/public',
	showDir: false,
	gzip: true
})
var server = http.createServer(serve)
var io = Socket(server)
var db = level('./database')

var fileDb = space(db, 'file')
var metaDb = space(db, 'meta')
server.listen(80)

io.on('connection', function (socket) {
	socket.emit('startup', 'why, hullo thar')
	socket.on('upload', upload)
	socket.on('ls', listUploads)
	socket.on('del', deleteUploads)

	function upload(file, meta) {
		if (uploadIsValid(meta)) {
			var md5 = hash(file)
			metaDb.put(md5, JSON.stringify(meta), cbIfErr(logErr, function () {
				fileDb.put(md5, file, cbIfErr(logErr, function () {
					socket.emit('uploaded', true, meta.name)
					//console.log('emit: uploaded; ' + meta.name)
				}))
			}))
		} else {
			socket.emit('uploaded', false, meta.name)
		}
	}

	function listUploads() {
		getFilenames(function (hashnames) {
			getMetadata(function (hashToMetadata) {
				var uploadedFilenames = hashnames.map(function (e) {
					return hashToMetadata[e].name
				})
				socket.emit('list uploads', uploadedFilenames)
				//console.log('emit: list uploads; ' + uploadedFilenames.join(', '))
			})
		})
	}

	function deleteUploads() {
		deleteAll(fileDb, cbIfErr(logErr, function () {
			deleteAll(metaDb, cbIfErr(logErr, function () {
				socket.emit('deleted')
				//console.log('emit: deleted')
			}))
		}))
	}
})

function deleteAll(db, cb) {
	var batch = db.batch()
	var read = fileDb.createKeyStream()
	read.on('data', function (key) { batch.del(key) })
	read.on('end', function () { batch.write(cb) })
}

function getFilenames(cb) {
	var filenames = []
	var read = fileDb.createKeyStream()
	read.on('data', function (key) { filenames.push(key) })
	read.on('end', function () { cb(filenames) })
}

function getMetadata(cb) {
	var hashMap = {}
	metaDb.createReadStream().on('data', function (pair) {
		try {
			hashMap[pair.key] = JSON.parse(pair.value)
		} catch (e) {
			logErr(e)
		}
	}).on('end', cb.bind(null, hashMap))
}

function cbIfErr(onErr, noErr) {
	return function (err) {
		if (err) onErr(err)
		else noErr.apply(null, [].slice.call(arguments, 1))
	}
}

function logErr(err) {
	if (err) {
		console.log('Error: ' + (err && err.message))
	}
}

function hash(data) {
	return crypto.createHash('md5').update(data).digest('hex')
}
