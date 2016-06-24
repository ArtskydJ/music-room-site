module.exports = function (stateRouter) {
	stateRouter.addState({
		name: 'li.room',
		route: '/room/:room',
		template: require('./room.html'),
		resolve: require('./resolve.js'),
		data: require('./data.json'),
		activate: require('./activate.js')
	})
}
