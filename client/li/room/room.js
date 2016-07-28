module.exports = function (stateRouter, socket) {
	stateRouter.addState({
		name: 'li.room',
		route: '/room/:room',
		template: require('./room.html'),
		resolve: require('./resolve.js')(socket),
		data: require('./data.json'),
		activate: require('./activate.js')(socket)
	})
}
