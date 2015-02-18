var fs = require('fs')
var path = require('path')
var data = require('./data.js')
var AuthHelpers = require('auth-helpers.js')

module.exports = function(stateRouter, socket, mediator) {
	var auth = AuthHelpers(socket)
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'overview.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.overview',
		route: '/',
		template: template,
		data: data,
		resolve: auth.resolve
	})
}
