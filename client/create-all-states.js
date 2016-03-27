var AuthHelpers = require('./auth-helpers.js')

module.exports = function addStates(stateRouter, socket, mediator) {
	var auth = AuthHelpers(socket)

	stateRouter.addState({
		name: 'app',
		defaultChild: 'overview',
		template: require('./app/app.html'),
		resolve: auth.resolve,
		activate: require('./app/app.js')(socket)
	})

	stateRouter.addState({
		name: 'app.overview',
		route: '/',
		template: require('./app/overview/overview.html'),
		data: require('./app/overview/data.json')
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
		name: 'app.404',
		route: '/404',
		template: '<div style="text-align:center;"><h1>404</h1></div>'
	})
}
