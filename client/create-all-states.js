/*
- nli
	- splash-page
	- login
- li
	- dashboard
	- room
- 404
*/


module.exports = function addStates(stateRouter, socket, mediator) {

	/*
	If you click a link to a auth-only page, then get redirected to a login
	page, it should redirect you back to the page you attempted to go to at
	first.
	*/

	stateRouter.addState({
		name: 'nli',
		template: require('./nli/navbar.html'),
		defaultChild: 'splash-page'
	})

	stateRouter.addState({
		name: 'li',
		defaultChild: 'dashboard',
		template: require('./li/navbar.html'),
		resolve: function resolve(data, parameters, cb) {
			console.log('am I authed?')
			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (err || !emailAddress) {
					console.log('NOPE redir to login screen')
					cb.redirect('nli.login') // figure out what to do about this
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

	stateRouter.addState({
		name: 'li.dashboard',
		route: '/dashboard',
		template: require('./li/dashboard/dashboard.html'),
		data: require('./li/dashboard/data.json'),
		activate: function(context) {
			console.log(context.domApi.get('loggedIn'))
		}
	})

	stateRouter.addState({
		name: 'li.create-room',
		route: '/create-room',
		template: require('./li/create-room/create-room.html'),
		resolve: function (d, p, cb) {
			console.log('create room resolve')
			cb(null, {})
		},
		activate: function () {}
	})

	stateRouter.addState({
		name: 'li.room',
		route: '/room/:room',
		template: require('./li/room/room.html'),
		resolve: require('./li/room/resolve.js'),
		data: require('./li/room/data.json'),
		activate: require('./li/room/activate.js')
	})

	stateRouter.addState({
		name: 'nli.splash-page',
		route: '/',
		template: require('./nli/splash-page/splash-page.html')
	})

	stateRouter.addState({
		name: 'nli.login',
		route: '/login',
		template: require('./nli/login/login.html'),
		resolve: function resolve(data, parameters, cb) {
			var action = parameters.action

			socket.emit('session isAuthenticated', function (err, emailAddress) {

				if (action === 'logout') {
					socket.emit('session unauthenticate', cb)
				} else if (err || !emailAddress) {
					cb(null)
				} else {
					cb.redirect('li.dashboard')
				}
			})
		},
		activate: function (context) {
			var ractive = context.domApi

			ractive.on('login-event', function (ev) {
				ev.original.preventDefault()

				var emailAddress = ractive.get('emailAddress')

				ractive.set('errorMessage', '')

				socket.emit('session beginAuthentication', emailAddress, function (err, contactAddress) {
					if (err) {
						ractive.set('errorMessage', err) // sending a string as the error
						setTimeout(function () {
							ractive.set('errorMessage', '')
						}, 5000)
					} else {
						ractive.set('errorMessage', '')
						stateRouter.go('li.dashboard')
					}
				})
			})
		}
	})

	stateRouter.addState({
		name: 'nli.404',
		route: '/404',
		template: require('./nli/404.html'),
		activate: function (context) {
			var ractive = context.domApi
			var parameters = context.parameters

			ractive.set('route', parameters.route)
		}
	})

	stateRouter.on('routeNotFound', function (route, parameters) {
		parameters.route = route
		stateRouter.go('nli.404', parameters)
	})
	stateRouter.on('stateChangeError', function (err) {
		console.error(err)
	})
	stateRouter.on('stateError', function (err) {
		console.error(err)
	})
	stateRouter.on('stateChangeCancelled', function (err) {
		console.error(err)
	})
}
