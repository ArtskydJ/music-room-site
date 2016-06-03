module.exports = function addStates(stateRouter, socket, mediator) {
	

	function activate(context) {
		console.log('auth-helpers activate!')
		var ractive = context.domApi
		var content = context.content
		var data = context.data
		if (data) ractive.set(data)
		ractive.set(content)
	}

	

	stateRouter.addState({
		name: 'logged-in',
		route:'/a',
		template: require('./app/logged-in-navbar.html'),
		resolve: function resolve(data, parameters, cb) {
			console.log('resolving')
			socket.emit('session isAuthenticated', function (err, emailAddress) {
				if (err || !emailAddress) {
					console.log('not logged in')
					cb.redirect('not-logged-in')
				} else {
					console.log('setting email')
					cb(null, { emailAddress: emailAddress })
				}
			})
		},
		activate: loggedInActivate.bind(null, socket)
	})

	stateRouter.addState({
		name: 'not-logged-in',
		//defaultChild: 'overview',
		template: require('./app/not-logged-in-navbar.html'),
		resolve: function (a,b,cb) {
			console.log('resolving')
			cb(null)
		},
		activate: notLoggedInActivate.bind(null, socket)
	})

	stateRouter.addState({
		name: 'logged-in.overview',
		route: '/a/b',
		template: require('./app/logged-in-overview/overview.html'),
		data: require('./app/logged-in-overview/data.json')
	})
/*
	stateRouter.addState({
		name: 'not-logged-in.overview',
		//route: '/',
		template: require('./app/not-logged-in-overview/overview.html')
	})*/

	var room = require('./app/room/room.js')
	stateRouter.addState({
		name: 'logged-in.room',
		route: '/room/:room',
		template: require('./app/room/room.html'),
		resolve: room.resolver(socket),
		data: require('./app/room/data.json'),
		activate: room.activator(socket)
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
		throw err
	})
	stateRouter.on('stateError', function (err) {
		throw err
	})
	stateRouter.on('stateChangeCancelled', function (err) {
		process.nextTick(function () {
			console.log(err)
		})
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



function loggedInActivate(socket, context) {
	var ractive = context.domApi
	var resolved = context.content

	ractive.set({ emailAddress: resolved.emailAddress, loggingIn: false })

	ractive.on('logout-btn', function () {
		socket.emit('session unauthenticate', function (err) {
			ractive.set({ emailAddress: null, loggingIn: false })
		})
	})
}


function notLoggedInActivate(socket, context) {
	var ractive = context.domApi
	var resolved = context.content

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


