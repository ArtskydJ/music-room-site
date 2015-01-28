module.exports = function resolve(namespace) {
	return '/' + (namespace ? namespace.toString() : '')
}
