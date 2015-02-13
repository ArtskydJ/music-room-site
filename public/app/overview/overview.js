var fs = require('fs')
var path = require('path')
var data = require('./data.js')

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'overview.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.overview',
		route: '/',
		template: template,
		data: data
	})
}
