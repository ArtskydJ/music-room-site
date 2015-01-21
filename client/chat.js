var Client = require('socket.io-client')
var EventEmitter = require('events').EventEmitter

module.exports = function () {
	var emitter = new EventEmitter

	var io = Client('/')
	io.on('receive', function (msgObj) {
		emitter.emit('receive', msgObj)
	})
	emitter.on('send', function (msgObj) {
		io.emit('send', msgObj)
	})

	return emitter
}
