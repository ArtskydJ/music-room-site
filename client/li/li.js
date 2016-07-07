var createCreateRoomState = require('./create-room/create-room.js')
var createRoomState = require('./dashboard/dashboard.js')
var createDashboardState = require('./room/room.js')

module.exports = function (stateRouter, socket) {
	stateRouter.addState({
		name: 'li',
		defaultChild: 'dashboard',
		template: require('./navbar.html'),
		querystringParameters: [ 'redirect' ],
		resolve: function resolve(data, parameters, cb) {
			console.log('am I authed?')
			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (err || !emailAddress) {
					console.log('NOPE redirect to login screen')
					cb.redirect('nli.login', { redirect: 'ASK JOSH ABOUT THIS!!!!!!!!!!!!!!!!!!!!!!!' })
				} else {
					console.log('YES I am authed')
					cb(null, { emailAddress: emailAddress })
				}
			})
		},
		activate: function loggedInActivate(context) {
			var ractive = context.domApi
			var resolved = context.content

			console.log('activating li state')

			ractive.set({
				emailAddress: resolved.emailAddress,
				loggingIn: false
			})
		}
	})

	createCreateRoomState(stateRouter, socket)
	createRoomState(stateRouter, socket)
	createDashboardState(stateRouter, socket)
}
