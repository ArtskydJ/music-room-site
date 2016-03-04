var AuthHelpers = require('./auth-helpers.js')

module.exports = function addStates(stateRouter, socket, mediator) {
	var auth = AuthHelpers(socket)

	stateRouter.addState({
		name: 'login',
		route: '/login',
		template: require('./login/login.html'),
		resolve: auth.resolve,
		activate: require('./login/login.js')(auth)
	})

	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: require('./app/app.html'),
		resolve: auth.resolve,
		activate: auth.activate
	})

	var room = require('./app/room/room.js')
	stateRouter.addState({
		name: 'app.room',
		route: '/room/:room',
		template: require('./app/room/room.html'),
		resolve: room.resolver(socket),
		data: require('./app/room/data.json'),
		activate: room.activator(socket)
	})

	stateRouter.addState({
		name: 'app.overview',
		route: '/',
		template: require('./app/overview/overview.html'),
		data: require('./app/overview/data.json'),
		resolve: auth.resolve,
		activate: auth.activate
	})
}
