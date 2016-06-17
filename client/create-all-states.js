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
			console.log('resolving')
			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (err || !emailAddress) {
					console.log('not logged in')
					cb.redirect('nli.login') // figure out what to do about this
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
		name: 'li.dashboard',
		route: '/dashboard',
		template: require('./li/dashboard/dashboard.html'),
		data: require('./li/dashboard/data.json'),
		activate: function(context) {
			console.log(context.domApi.get('loggedIn'))
		}
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
		activate: function (context) {
			var ractive = context.domApi

			ractive.on('login-event', function (ev) {
				ev.original.preventDefault()

				var emailAddress = ractive.get('emailAddress')
				console.log('email submit = ' + emailAddress)

				ractive.set({
					loggingIn: true,
					loggedIn: false
				})
				socket.emit('session beginAuthentication', emailAddress, function (err, contactAddress) {
					ractive.set({
						loggingIn: false,
						loggedIn: true,
						emailAddress: contactAddress
					})
					stateRouter.go('li.dashboard')
				})
			})
		}
	})

	stateRouter.addState({
		name: '404',
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

	/*
	var previousAddress = 'unknown'
	setInterval(function () {
		socket.emit('session isAuthenticated', function (err, address) {
			if (previousAddress !== 'unknown' && address !== previousAddress) {
				stateRouter.go(address ? 'logged-in' : 'not-logged-in')
			}
			previousAddress = address
		})
	}, 10000)
	*/
}
