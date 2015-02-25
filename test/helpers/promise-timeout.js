var Promise = require('promise')

function timeout(ms) {
	return function tmt(val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, ms, val)
		})
	}
}

module.exports = timeout
