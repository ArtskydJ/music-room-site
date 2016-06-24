module.exports = function (stateRouter) {
	stateRouter.addState({
		name: 'nli.splash-page',
		route: '/',
		template: require('./splash-page.html')
	})

}