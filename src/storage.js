var AV = require('av')

function fail() {
	console.log('failure')
}

module.exports = (function () {
	var storage = {} //AV.Player instances stored under their `torrent`s `infoHash`s

	function put(method, torrent) { //Assumes 1 song per torrent
		var file = torrent.files[0]
		storage[torrent.infoHash] = method ?
			AV.Player.fromBuffer(file) :
			AV.Player(file.createReadStream()) //I think this might be better but I don't actually know
	}

	function get(infoHash) {
		return storage[infoHash] || {
			play: fail,
			preload: fail
		}
	}

	return {
		put: put.bind(null, true),
		get: get
	}
}())
