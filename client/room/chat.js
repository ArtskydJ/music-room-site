var Client = require('socket.io-client')
var resolve = require('../../resolve-namespace.js')
var EventEmitter = require('events').EventEmitter

module.exports = function (namespace) {
	var io = Client(resolve(namespace))
	var em = new EventEmitter

	io.on('receive', em.emit.bind(em, 'receive'))
	em.on('send',    io.emit.bind(io, 'send'))

	io.on('new song', em.emit.bind(em, 'new song'))
	
	return em
}
