var StreamToBlob = require('blob-stream')
var Webtorrent = require('webtorrent')
var domready = require('domready')
var uploadIsInvalid = require('./uploadIsInvalid.js')

var torrenter = new Webtorrent()

var mock = {
	play: console.log.bind(null, 'play failure'),
	load: console.log.bind(null, 'load failure'),
	stop: console.log.bind(null, 'stop failure')
}

function logDownloaded(torrent) {
	console.log('window.play("' + torrent.infoHash + '")')
	console.log('downloaded from ' + torrent.swarm.wires.length + ' peers.')
}

function logCreate(torrent) {
	torrent.discovery.on('peer', function () {
		console.log('peer!')
	})
	console.log('seeding: ' + torrent.infoHash)
}

module.exports = function () {
	var supportedType = 'mp3'

	if (typeof document !== 'undefined') {
		domready(function decideType() {
			function canPlay(t) {
				return document.getElementById('playAudio').canPlayType(t).length
			}
			supportedType = (canPlay('audio/ogg') > canPlay('audio/mp3')) ? 'ogg' : 'mp3'
		})
	}
	var storage = {}

	function create(file, cb) {
		var err = uploadIsInvalid(file)
		if (!err) {
			torrenter.seed(file, function onSeed(torrent) {
				logCreate(torrent)
				cb(torrent.infoHash)
			})
		} else {
			console.log(err && err.message)
		}

	}

	function get(songBundle) {
		if (!songBundle) return null
		var infoHash = songBundle[supportedType]
		console.log('attempting to download: ' + infoHash)	
		torrenter.download({ //Assumes 1 song per torrent
			infoHash: infoHash,
			announce: config.announce
		}, function whenDownloaded(torrent) {
			logDownloaded(torrent)
			var file = torrent.files[0]
			file.createReadStream().pipe(
				StreamToBlob()
			).on('finish', function () {
				storage[torrent.infoHash] = this.toBlobURL()
			})
		})
	}

	function load(songId) {
		var audioElement = document.getElementById('playAudio')
		audioElement.src = storage[songId]
		//must load if src changed:
		//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#Methods
		audioElement.load()
		return audioElement
	}

	function remove(songId) {
		torrenter.remove(storage)
		storage[songId].stop()
		delete storage[songId]
	}

	return {
		create: create,
		get: get,
		remove: remove,
		load: load
	}
}
