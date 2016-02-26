var fs = require('fs')
var path = require('path')
var AuthHelpers = require('../auth-helpers.js')

module.exports = function(stateRouter, socket, mediator) {
	var auth = AuthHelpers(socket)
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'login.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'login',
		route: '/login',
		template: template,
		resolve: auth.resolve,
		activate: activator(auth)
	})
}

function activator(auth) {
	return function activate(context) {
		var ractive = context.domApi
		var content = context.content

		function set(loggedIn, loggingIn) {
			if (loggingIn === undefined) {
				ractive.set('loggedIn', loggedIn)
			} else {
				ractive.set({
					loggedIn: loggedIn,
					loggingIn: loggingIn
				})
			}
		}

		set(content.loggedIn, false)

		setInterval(auth.isLoggedIn, 2000, function (err, address) {
			set(address)
		})

		ractive.on('email-submit', function () {
			auth.logIn(ractive.get('emailAddressInput'), function (err, address) {
				set(address, true)
			})
			return false
		})

		ractive.on('logout-btn', function () {
			auth.logOut(function (err) {
				set(false, false)
			})
		})
	}
}
