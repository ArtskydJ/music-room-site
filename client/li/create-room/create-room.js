module.exports = function (stateRouter) {
	stateRouter.addState({
		name: 'li.create-room',
		route: '/create-room',
		template: require('./create-room.html'),
		resolve: function (d, p, cb) {
			console.log('create room resolve')
			cb(null, {})
		},
		activate: function () {}
	})
}
