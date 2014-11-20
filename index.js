var Ecstatic = require('ecstatic')

var reqHandler = Ecstatic({ root: __dirname + '/public', showDir: false, gzip: true })
/*
function (req, res) {
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500)
			return res.end('Error loading index.html')
		}
		res.writeHead(200)
		res.end(data)
	})
}
*/

var server = require('http').createServer(reqHandler)
var io = require('socket.io')(server)
var fs = require('fs')

server.listen(80)

io.on('connection', function (socket) {
	socket.emit('news', 'hullo wurld.')
	socket.on('upload', function (files) {
		files.forEach(function (file) {console.log(file.name)})
	});
});
