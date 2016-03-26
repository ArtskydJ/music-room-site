module.exports = function authHelpers(socket) {

	function resolve(data, parameters, cb) {
		socket.emit('session isAuthenticated', function (err, address) {
			cb(null, { // why doesn't the error get applied???
				err: err,
				loggedIn: address
			})
		})
	}

	function activate(context) {
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
