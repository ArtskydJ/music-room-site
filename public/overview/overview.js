var fs = require('fs')
var path = require('path')
var data = require('./data.js')

function resolve(data, parameters, cb) {
	console.log('resolving overview')
	cb()
}

function activate(context) {
	console.log('params:', context.parameters)
}

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'overview.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'overview',
		route: '/',
		template: template,
		data: data,
		resolve: resolve,
		activate: activate
	})
}
