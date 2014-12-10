var Webtorrent = require('webtorrent')
var config = require('./config.json').musicRoom
var sux = require('sux')
var xtend = require('xtend')
var runParallel = require('run-parallel')
var musicMetadata = require('musicmetadata')

function getMetadata(file, cb) {
	var opts = { duration: true, fileSize: file.size }
	var metadata = musicMetadata(file.createReadStream(), opts)
	var timeout = setTimeout(finish.bind(null, new Error('timeout')), 5000)
	metadata.once('metadata', finish.bind(null, null))
	metadata.once('done', finish)
	function finish(err, data) {
		metadata.removeAllListeners('done')
		if (err || data) {
			clearTimeout(timeout)
			cb.call(null, err, data)
		}
	}
}

function ConvertAndSeed(torrenter, newType) {
	newType = newType.toLowerCase()
	var opts = xtend.bind(null, config.presets[newType])

	return function convertAndSeed(file, defaultResult, callback) {
		var fileName = file.name
		var inputType = file.name.split('.').pop().toLowerCase()
		var inputSource = file.createReadStream()

		if (inputType !== newType) {
			var conversion = new Sux(opts({
				type: newType,
				input: {
					type: inputType,
					source: inputSource
				}
			}))
			var seedStream = conversion.out()

			conversion.start()

			torrenter.seed(seedStream, {
				name: fileName,
				pieceLength: 16*1024 //16 kb
			}, function onTorrent(newTorrent) {
				callback(null, newTorrent.infoHash)
			})
		} else {
			process.nextTick(function finish() {
				callback(null, defaultResult)
			})
		}
	}
}

module.exports = function ServerStorage() {
	var torrenter = new Webtorrent()
	var convertToMp3 = ConvertAndSeed(torrenter, 'mp3')
	var convertToOgg = ConvertAndSeed(torrenter, 'ogg')

	var map = {}
	//looks like { songId1: {mp3: 'infoHash1', ogg: 'infoHash2', duration: 187} } //3min 7sec

	function put(songId, infoHash, cb) {
		torrenter.download({
			infoHash: infoHash,
			announce: config.announce
		}, function onTorrent(torrent) {
			var file = torrent.files[0]
			var defaultInfoHash = torrent.infoHash
			
			runParallel({
				mp3: convertToMp3.bind(null, torrent, defaultInfoHash),
				ogg: convertToOgg.bind(null, torrent, defaultInfoHash),
				metadata: getMetadata(file)
			}, function end(err, songBundle) {
				err ?
					cb(err) :
					cb(null, map[songId] = songBundle)
			})

		})
	}

	function get(songId) {
		return map[songId]
	}

	function get2(songId, type) {
		return map[songId] && map[songId][type]
	}

	function del(songId) {
		torrenter.remove(songId.mp3)
		torrenter.remove(songId.ogg)
	}

	return {
		del: del,
		put: put,
		get: get
	}
}
