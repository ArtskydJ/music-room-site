var createSplashPageState = require('./splash-page/splash-page.js')
var create404State = require('./404/404.js')
var createLoginState = require('./login/login.js')

module.exports = function (stateRouter, socket) {
	stateRouter.addState({
		name: 'nli',
		template: require('./navbar.html'),
		defaultChild: 'splash-page'
	})
	
	create404State(stateRouter, socket)
	createSplashPageState(stateRouter, socket)
	createLoginState(stateRouter, socket)
}
