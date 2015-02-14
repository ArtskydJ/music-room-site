var fs = require('fs')
var path = require('path')

module.exports = function(stateRouter) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'login.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.login',
		route: '/login',
		template: template,
		activate: activate
	})
}

function activate(context) {
	var ractive = context.domApi

	ractive.on('email-submit', function () {
		ractive.set('loggingIn', true)
		var input = ractive.get('emailAddressInput')
		console.log('login input: ' + input)
	})
}
