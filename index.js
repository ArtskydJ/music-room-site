var http = require('http')
var fs = require('fs')
var crypto = require('crypto')
var Ecstatic = require('ecstatic')
var level = require('level')
var space = require('level-spaces')
var Socket = require('socket.io')

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
	socket.on('upload', upload.bind(null, socket))
	socket.on('ls', listUploads.bind(null, socket))
	socket.on('del', deleteUploads.bind(null, function (err, n) {
		if (err) {
			console.error(err)
		} else {
			socket.emit('deleted', n)
		}
	}))
})

function upload(socket, file, meta) {
	var md5 = hash(file)
	var str = JSON.stringify(meta)
	console.log('stringified:', str)
	metaDb.put(md5, str, logErr)
	fileDb.put(md5, file, function (err) {
		if (err) {
			console.error(err)
		} else {
			socket.emit('uploaded', meta.name)
		}
	})
}

function listUploads(socket) {
	getFilenames(function (hashnames) {
		getHashMap(function (hashMap) {
			var filenames = hashnames.map(function (e) {
				return hashMap[e]
			})
			socket.emit('filenames', filenames)
		})
	})
}

function deleteUploads(cb) {
	var remove = getFilenames().map(function (key) {
		return {type: 'del', key: key}
	})
	fileDb.batch(remove, cb) //number out remove.length
}

function getFilenames(cb) {
	var filenames = []
	fileDb.createKeyStream().on('data', function (key) {
		filenames.push(key)
	}).on('end', function () {
		cb(filenames)
	})
}

function getHashMap(cb) {
	var hashMap = {}
	metaDb.createReadStream().on('data', function (pair) {
		try {
			hashMap[pair.key] = JSON.parse(pair.value)
			console.dir(hashMap[pair.key])
		} catch (e) {
			console.log(e)
		}
	}).on('end', function () {
		cb(hashMap)
	})
}

function logErr(err) {
	if (err) {
		console.error(err)
	}
}

function hash(data) {
	return crypto.createHash('md5').update(data).digest('hex')
}
