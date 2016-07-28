module.exports = function (stateRouter, socket) {

	stateRouter.addState({
		name: 'nli.login',
		route: '/login',
		template: require('./login.html'),
		querystringParameters: [ 'action', 'redirectState', 'redirectParams' ],
		defaultQuerystringParameters: {
			action: 'login',
			redirectState: 'li.dashboard',
			redirectParams: '{}'
		},
		resolve: function resolve(data, parameters, cb) {
			var action = parameters.action
			var redirectState = parameters.redirectState
			var redirectParams = JSON.parse(parameters.redirectParams)

			if (action === 'logout') {
				// If you're logging out, then log out, and then proceed to the login page
				socket.emit('session unauthenticate', cb)
			} else {
				// If you're logging in, then check if you're logged in
				socket.emit('session isAuthenticated', function (err, emailAddress) {
					if (err || !emailAddress) {
						// If you're not logged in, proceed to the login page
						cb(null)
					} else {
						// If you're already logged in
						cb.redirect(redirectState, redirectParams)
					}
				})
			}
		},
		activate: function (context) {
			var ractive = context.domApi
			var parameters = context.parameters
			var action = parameters.action
			var redirectState = parameters.redirectState
			var redirectParams = JSON.parse(parameters.redirectParams)

			var previousTimeout = null

			console.log('planning to redirect to ' + redirectState)

			ractive.set({
				errorMessage: '',
				logout: action === 'logout'
			})

			ractive.on('login-event', function (ev) {
				ev.original.preventDefault()

				var emailAddress = ractive.get('emailAddress')

				ractive.set('errorMessage', '')

				socket.emit('session beginAuthentication', emailAddress, function (err, contactAddress) {
					if (err) {
						ractive.set('errorMessage', err) // sending a string as the error
						if (previousTimeout !== null) {
							clearTimeout(previousTimeout)
						}
						previousTimeout = setTimeout(function () {
							ractive.set('errorMessage', '')
						}, 5000)
					} else {
						ractive.set('errorMessage', '')
						console.log('redirect params:')
						console.log(redirectParams)
						stateRouter.go(redirectState, redirectParams)
					}
				})
			})
		}
	})

}