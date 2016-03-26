module.exports = function activator(socket) {
	return function activate(context) {
		var ractive = context.domApi
		var content = context.content

		function setLoggedInState(loggedIn, loggingIn) {
			if (loggingIn === undefined) {
				ractive.set('loggedIn', loggedIn)
			} else {
				ractive.set({
					loggedIn: loggedIn,
					loggingIn: loggingIn
				})
			}
		}

		setLoggedInState(content.loggedIn, false)

		ractive.on('email-submit', function () {
			var emailAddress = ractive.get('emailAddressInput')
			console.log('session beginAuthentication')
			socket.emit('session beginAuthentication', emailAddress, function (err, address) {
				if (err) throw err

				console.log('session beginAuthentication ' + arguments)

				setLoggedInState(address, true)

				var interval = setInterval(function () {
					socket.emit('session isAuthenticated', function (err, address) {
						if (address) clearInterval(interval)
						setLoggedInState(address)
					})
				}, 2000)
			})
			return false // not sure what this is for
		})

		ractive.on('logout-btn', function () {
			socket.emit('session unauthenticate', function (err) {
				setLoggedInState(false, false)
			})
		})
	}
}
