module.exports = function authHelpers(socket) {
	function logIn(address, cb) {
		socket.emit('session beginAuthentication', address, cb)
	}

	function logOut(cb) {
		socket.emit('session unauthenticate', cb)
	}

	function isLoggedIn(cb) {
		socket.emit('session isAuthenticated', cb)
	}

	function resolve(data, parameters, cb) {
		isLoggedIn(function (err, address) {
			cb(err, { loggedIn: address })
		})
	}

	function activate(context) {
		var ractive = context.domApi
		var data = context.data
		var content = context.content
		if (data) ractive.set(data)
		ractive.set(content)
	}

	return {
		logIn: logIn,
		logOut: logOut,
		isLoggedIn: isLoggedIn,
		resolve: resolve,
		activate: activate
	}
}
