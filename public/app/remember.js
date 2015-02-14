// There is probably an npm module that does exactly this

function remember() {
	var mem = null
	return {
		get: function get() { return mem },
		set: function set(x) { mem = x }
	}
}

module.exports = remember
