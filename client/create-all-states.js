module.exports = function addStates(stateRouter, socket, mediator) {

	/*
	I'm thinking I'll add a login page, rather than the navbar login. The
	navbar login isn't standard practice, and loading a login page should be
	ridiculously fast.

	If you click a link to a auth-only page, then get redirected to a login
	page, it should redirect you back to the page you attempted to go to at
	first.
	*/

	stateRouter.addState({
		name: 'app',
		template: require('./app/navbar.html'),
		defaultChild: 'splash-page',
		activate: function notLoggedInActivate(context) {
			var ractive = context.domApi
			// var resolved = context.content

			console.log('activation')

			ractive.on('email-submit', function () {
				var emailAddress = ractive.get('emailAddressInput')

				ractive.set({ emailAddress: emailAddress, loggingIn: true })
				
				socket.emit('session beginAuthentication', emailAddress, function (err, address) {
					if (err) throw err
				})

				return false // not sure what this is for
			})
		}
	})

	stateRouter.addState({
		name: 'app.logged-in',
		defaultChild: 'dashboard',
		resolve: function resolve(data, parameters, cb) {
			console.log('resolving')
			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (err || !emailAddress) {
					console.log('not logged in')
					cb.redirect('not-logged-in') // figure out what to do about this
				} else {
					console.log('setting email')
					cb(null, { emailAddress: emailAddress })
				}
			})
		},
		activate: function loggedInActivate(context) {
			var ractive = context.domApi
			var resolved = context.content

			ractive.set({ emailAddress: resolved.emailAddress, loggingIn: false })

			ractive.on('logout-btn', function () {
				socket.emit('session unauthenticate', function (err) {
					ractive.set({ emailAddress: null, loggingIn: false })
				})
			})
		}
	})

	stateRouter.addState({
		name: 'app.logged-in.dashboard',
		route: '/dashboard',
		template: require('./app/dashboard/dashboard.html'),
		data: require('./app/dashboard/data.json')
	})

	stateRouter.addState({
		name: 'app.logged-in.room',
		route: '/room/:room',
		template: require('./app/room/room.html'),
		resolve: require('./app/room/resolve.js'),
		data: require('./app/room/data.json'),
		activate: require('./app/room/activate.js')
	})

	stateRouter.addState({
		name: 'app.splash-page',
		route: '/',
		template: require('./app/splash-page/splash-page.html')
	})

	stateRouter.addState({
		name: 'app.404',
		route: '/404',
		template: '<div style="text-align:center;"><h1>404</h1></div>'
	})

	stateRouter.on('routeNotFound', function (route, parameters) {
		console.log('routeNotFound!')
		stateRouter.go('404', {
			route: route,
			parameters: parameters
		})
	})
	stateRouter.on('stateChangeError', function (err) {
		console.log(err)
	})
	stateRouter.on('stateError', function (err) {
		console.log(err)
	})
	stateRouter.on('stateChangeCancelled', function (err) {
		console.log(err)
	})


	var previousAddress = 'unknown'
	setInterval(function () {
		socket.emit('session isAuthenticated', function (err, address) {
			if (previousAddress !== 'unknown' && address !== previousAddress) {
				stateRouter.go(address ? 'logged-in' : 'not-logged-in')
			}
			previousAddress = address
		})
	}, 10000)
}
