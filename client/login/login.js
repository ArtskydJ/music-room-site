module.exports = function activator(auth) {
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
