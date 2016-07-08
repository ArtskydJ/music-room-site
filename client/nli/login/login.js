module.exports = function (stateRouter, socket) {

	stateRouter.addState({
		name: 'nli.login',
		route: '/login',
		template: require('./login.html'),
		querystringParameters: [ 'action', 'redirectState', 'redirectParams' ],
		resolve: function resolve(data, parameters, cb) {
			var action = parameters.action

			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (action === 'logout') {
					socket.emit('session unauthenticate', cb)
				} else if (err || !emailAddress) {
					cb(null)
				} else if (parameters.redirectState) {
					console.log('coool redirect to ' + parameters.redirectState)
					cb.redirect(parameters.redirectState, parameters.redirectParams || {})
				} else {
					console.log('redirect to dashboard because ' + parameters.redirectState)
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

}