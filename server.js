var usingNode0_10 = /0\.10\./.test(process.version)
console.log('Server started, running on ', usingNode0_10 ? 'node 0.10' : 'node 0.12 / iojs')
var http = require('http')
var Socketio = require('socket.io')
var Level = require(usingNode0_10 ? 'level' : 'level-mem')
var St = require('st')
var AutoplayRoom = require('./server/room-autoplay.js')
var SessionManager = require('./server/session-manager.js')

var router = St({
	path: './public/',
	url: '/',
	index: 'index.html'
})
var db = new Level('./database')
var server = http.createServer(router)
var io = new Socketio()

io.attach(server)
server.listen(80)

var core = SessionManager(io, db)
AutoplayRoom(io, process.argv[2] === '-t')
