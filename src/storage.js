var AV = require('av')
var concat = require('concat-stream')

function fail() {
	console.log('failure')
}

module.exports = function () {
	var storage = {} //AV.Player instances stored under their `torrent`s `infoHash`s

	function put(torrent) { //Assumes 1 song per torrent
		var file = torrent.files[0]
		file.createReadStream().pipe(concat(function (buf) {
			storage[torrent.infoHash] = AV.Player.fromBuffer(buf)
		}))
		
		// AV.Player.fromBuffer(torrent.files) // returned nothing, and didn't hear audio
		// new AV.Player(new AV.Asset(file))
		// new AV.Player(file)                     //this.asset is defined but this.asset.start is undefined and not a function
		// new AV.Player.fromFile(new File([file], torrent.infoHash)) //somethin doesn't work.
		// AV.Player.fromBuffer(file)          //throws error about AV being undefined
		// AV.Player(file.createReadStream())  //returns undefined
		// AV.Player.fromFile(file)            //returns a Player obj, but throws when .play() is called
	}

	function get(infoHash) {
		return storage[infoHash] || {
			play: fail,
			preload: fail
		}
	}

	return {
		put: put,
		get: get,
		_storage: storage
	}
}
