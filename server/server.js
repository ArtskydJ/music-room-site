var http = require('http')
var Socketio = require('socket.io')
var Level = require('level-mem')
var St = require('st')
var AutoplayRoom = require('./autoplay/room-autoplay.js')
var Manager = require('./manager.js')

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
server.listen(80)

var core = Manager(io, db)
AutoplayRoom(io, process.argv[2] === '-t')
