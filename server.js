var http = require('http')
var ecstatic = require('ecstatic')

http.createServer(ecstatic({
	root: __dirname + '/static'
})).listen(80)
