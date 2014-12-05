var Webtorrent = require('webtorrent')
var config = require('./src/config.json').musicRoom
var sux = require('sux')
//var metadataparserthing = require('um')
//var stream = require('readable-stream') //do i need this?

module.exports = function ServerStorage() {
	var torrenter = new Webtorrent()

	function putSong(infoHash, ) {
		torrenter.download({
			infoHash: infoHash,
			announce: config.announce
		}, function onTorrent(torrent) {
			//run sox, get length, etc

			//this seems like a bad idea:
			torrent.files.forEach(function (file) {
				var inputSource = file.createReadStream()
				var inputDurationInSec = 0
				var inputFormat = file.name.split('.').pop()

				var toMp3 = new Sux({
					type: inputFormat,
					rate: 44100,
					channels: 2,
					depth: 16,
					"int": "signed", //I think
					bitrate: 192, //*1024 //idk
					input: {
						type: "mp3",
						source: inputSource
					}
				})
				//map output to client.seed somehow
				toMp3.start()
			})
		})
	}

	function getSong() {
		return null
	}

	return {
		put: putSong,
		get: getSong
	}
}

/*
song_id: {
	mp3: asdf,
	ogg: hjkl
}

put_song(id, infohash)
get_song(id)
*/
