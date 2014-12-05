var AV = require('av')
var concat = require('concat-stream')

var mock = {
	play:    console.log('play failure'),
	preload: console.log('preload failure'),
	stop:    console.log('stop failure')
}

module.exports = function () {
	var storage = {} //AV.Player instances stored under their `torrent`s `infoHash`s

	function put(torrent) { //Assumes 1 song per torrent
		var file = torrent.files[0]
		file.createReadStream().pipe(concat(function (buf) {
			storage[torrent.infoHash] = AV.Player.fromBuffer(buf)
			//storage[torrent.infoHash].preload()
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
