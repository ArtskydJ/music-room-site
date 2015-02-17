var fs = require('fs')
var path = require('path')

module.exports = function(stateRouter, socket, mediator) {
	// Don't change the following line much; brfs won't like it
	var template = fs.readFileSync( path.join(__dirname, 'login.html'), { encoding: 'utf8' } )

	stateRouter.addState({
		name: 'app.login',
		route: '/login',
		template: template,
		resolve: resolver(socket),
		activate: activator(socket)
	})
}

function logIn(socket, address, cb) {
	socket.emit('session beginAuthentication', address, cb)
}

function logOut(socket, cb) {
	socket.emit('session unauthenticate', cb)
}

function isLoggedIn(socket, cb) {
	socket.emit('session isAuthenticated', cb)
}

function resolver(socket) {
	return function resolve(data, parameters, cb) {
		isLoggedIn(socket, function (err, address) {
			cb(err, { loggedIn: address, loggingIn: false })
		})
	}
}

function activator(socket) {
	return function activate(context) {
		var ractive = context.domApi
		ractive.set(context.content)

		function update(err, address) {
			ractive.set({ loggedIn: address })
		}

		setInterval(isLoggedIn, 2000, socket, update)

		ractive.on('email-submit', function () {
			ractive.set('loggingIn', true)
			logIn(socket, ractive.get('emailAddressInput'), update)
		})

		ractive.on('logout-btn', function () {
			logOut(socket, function (err) {
				ractive.set({
					loggedIn: false,
					loggingIn: false
				})
			})
		})
	}
}
