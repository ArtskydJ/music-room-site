var St = require('st')
/*var JustLogin = require('just-login-core')
var SessionManager = require('just-login-example-session-manager')
var Level = require('level')
var Spaces = require('level-spaces')*/

var stOpts = {
	//cache: false,
	path: './static/',
	passthrough: true,
	url: '/',
	index: 'index.html'
}
var roomRegex = /\/room\/(\w+)\/?$/i

function fourOhFour(req, res) {
	res.writeHead(404)
	res.end('404, oh yeah!')
	return true
}

module.exports = function Router() {
	/*var db = Level('./database')
	var ssnMngDb = Spaces(db, 'session-manager')
	var core = JustLogin(db)
	var manager = SessionManager(core, ssnMngDb)*/

	var mnt = St(stOpts)
	return function (req, res) {
		//roomRegex.test(req.url) && console.error( roomRegex.exec(req.url)[1] )
		req.url = req.url.replace(roomRegex, '/room/')
		mnt(req, res, function () {
			fourOhFour(req, res)
		})
	}
}
