module.exports = function authHelpers(socket) {

	function resolve(data, parameters, cb) {
		console.log('auth.resolve')
		socket.emit('session isAuthenticated', function (err, address) {
			console.log('auth.resolved')
			cb(null, { // why doesn't the error get applied???
				err: err,
				loggedIn: address
			})
		})
	}

	function activate(context) {
		console.log('auth-helpers activate!')
		var ractive = context.domApi
		var content = context.content
		var data = context.data
		if (data) ractive.set(data)
		ractive.set(content)
	}

	return {
		resolve: resolve,
		activate: activate
	}
}
