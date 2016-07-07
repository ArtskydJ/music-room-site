var http = require('http')
var Socketio = require('socket.io')
var Level = require('level-mem')
var St = require('st')
var Instance = require('./instance.js')

var port = require('../package.json').port || process.argv[2] || 80

var router = St({
	cache: false,
	path: __dirname + '/../static',
	url: '/',
	index: 'index.html'
})
var db = new Level(__dirname + '/../database')
var server = http.createServer(router)
var io = new Socketio()

io.attach(server)
server.listen(port)
console.log('Listening on localhost:' + port)

Instance(io, db)
