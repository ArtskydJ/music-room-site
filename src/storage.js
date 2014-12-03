var AV = require('av')
var concat = require('concat-stream')

function fail() {
	console.log('failure')
}
var mock = {
	play: fail,
	preload: fail
}

module.exports = function () {
	var storage = {} //AV.Player instances stored under their `torrent`s `infoHash`s

	function put(torrent) { //Assumes 1 song per torrent
		var file = torrent.files[0]
		file.createReadStream().pipe(concat(function (buf) {
			storage[torrent.infoHash] = AV.Player.fromBuffer(buf)
		}))
	}

	function get(infoHash) {
		return storage[infoHash] || mock
	}

	return {
		put: put,
		get: get
	}
}
