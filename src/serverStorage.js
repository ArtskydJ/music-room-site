var Webtorrent = require('webtorrent')
var config = require('./config.json').musicRoom
var sux = require('sux')
var xtend = require('xtend')
var runParallel = require('run-parallel')
//var metadata = require('') //find module

function ConvertAndSeed(newType) {
	newType = newType.toLowerCase()
	var opts = xtend.bind(null, config.presets[newType])

	return function convertAndSeed(torrent, callback) {
		var file = torrent.files[0]
		var fileName = file.name
		var inputType = file.name.split('.').pop().toLowerCase()
		var inputSource = file.createReadStream()

		if (inputType !== newType) {
			var toMp3 = new Sux(opts({
				type: newType,
				input: {
					type: inputType,
					source: inputSource
				}
			}))
			var seedStream = toMp3.out()

			toMp3.start()

			torrenter.seed(seedStream, {
				name: fileName,
				pieceLength: 16*1024 //16 kb
			}, function onTorrent(newTorrent) {
				callback(null, newTorrent.infoHash)
			})
		} else {
			process.nextTick(function () {
				callback(null, torrent.infoHash)
			})
		}
	}
}

module.exports = function ServerStorage() {
	var torrenter = new Webtorrent()
	var convertToMp3 = ConvertAndSeed('mp3')
	var convertToOgg = ConvertAndSeed('ogg')

	var map = {}
	//should look like { songId1: {mp3: 'infoHash1', ogg: 'infoHash2'} }

	function put(songId, infoHash) {
		torrenter.download({
			infoHash: infoHash,
			announce: config.announce
		}, function onTorrent(torrent) {
			//get duration...
			
			var convertors = {
				mp3: convertToMp3.bind(null, torrent),
				ogg: convertToOgg.bind(null, torrent)
			}
			runParallel(convertors, function end(err, results) {
				if (!err) {
					map[songId] = results
				}
			})

		})
	}

	function get(songId) {
		return map[songId]
	}

	return {
		put: put,
		get: get
	}
}
