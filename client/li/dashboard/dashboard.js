module.exports = function (stateRouter) {
	stateRouter.addState({
		name: 'li.dashboard',
		route: '/dashboard',
		template: require('./dashboard.html'),
		data: require('./data.json'),
		activate: function(context) {
			console.log(context.domApi.get('loggedIn'))
		}
	})
}
