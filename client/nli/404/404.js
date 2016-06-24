module.exports = function (stateRouter) {
	stateRouter.addState({
		name: 'nli.404',
		route: '/404',
		template: require('./404.html'),
		activate: function (context) {
			var ractive = context.domApi
			var parameters = context.parameters

			ractive.set('route', parameters.route)
		}
	})
}
