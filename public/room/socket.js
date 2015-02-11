var Client = require('socket.io-client')
var EventEmitter = require('events').EventEmitter

module.exports = function (room) {
	return Client( '/' + room )
	/*var io = Client( room )
	var em = new EventEmitter

	io.on('chat receive', em.emit.bind(em, 'receive'))
	em.on('send',         io.emit.bind(io, 'chat send'))

	io.on('new song', em.emit.bind(em, 'new song'))

	return em*/
}
