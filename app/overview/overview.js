var fs = require('fs')
var path = require('path')
var data = require('./data.js')

function resolve(data, parameters, cb) {
	cb()
}

function activate(context) {
	console.log(context.domApi)
}

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs doesn't like it
	var template = fs.readFileSync( path.join(__dirname, 'overview.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.overview',
		template: template,
		data: data,
		resolve: resolve,
		activate: activate
	})
}
