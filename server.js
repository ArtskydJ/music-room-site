var http = require('http')
var ecstatic = require('ecstatic')
var io = require('socket.io')()
var xtend = require('xtend')
//var PlaylistCombinator = require('playlist-combinator')

var ecstaticOpts = {
	root: './static',
	showDir: false
}
var server = http.createServer( ecstatic(ecstaticOpts) )
server.listen(80)
//var playlist = PlaylistCombinator()

io.attach(server)
io.on('connect', function conn(socket) {
	//var userId = socket.id //non-persistent
	//socket.join('room')
	//playlist.addUser(userId)

	// CHAT
	socket.emit('receive', createMessage(arrivalMsg))
	socket.broadcast.emit('receive', createMessage(joinMsg))
	socket.on('send', function ch(msg) {
		socket.broadcast.emit('receive', fixMessage(msg))
	})
	io.on('disconnect', function () {
		socket.broadcast.emit('receive', createMessage(leaveMsg))
	})

})

function fixMessage(msg) {
	return xtend(
		{ name: 'unknown', message: '' }, //provide default name and message
		msg,
		{ date: new Date().toISOString() } //overwrite the date
	)
}
function createMessage(text) {
	return fixMessage({ name: 'server', message: text })
}

var arrivalMsg = 'why hullo thar'
var joinMsg = 'Weird Person joined the room.'
var leaveMsg = 'Weird Person left the room.'
