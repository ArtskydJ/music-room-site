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
	socket.emit('receive', createMessage(messages.selfJoin))
	socket.broadcast.emit('receive', createMessage(messages.otherJoin))
	socket.on('send', function ch(msg) {
		io.emit('receive', fixMessage(msg)) //socket.broadcast.emit
	})
	io.on('disconnect', function () {
		socket.broadcast.emit('receive', createMessage(messages.otherLeave))
	})
})

function fixMessage(msg) {
	var defaultObj = { name: 'unknown', message: '' }
	var overwrite = { date: new Date().toISOString() }
	return xtend(defaultObj, msg, overwrite)
}
function createMessage(text) {
	return fixMessage({ name: 'server', message: text })
}

var messages = {
	selfJoin: 'why hullo thar',
	otherJoin: 'Weird Person joined the room.',
	otherLeave: 'Weird Person left the room.'
}
