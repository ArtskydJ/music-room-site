module.exports = function (stateRouter, socket) {
	stateRouter.addState({
		name: 'li.create-room',
		route: '/create-room',
		template: require('./create-room.html'),
		resolve: function (d, p, cb) {
			console.log('create room resolve')
			cb(null, {})
		},
		activate: function (context) {
			var ractive = context.domApi

			ractive.on('new-room-event', function (ev) {
				ev.original.preventDefault()

				var newRoomName = ractive.get('newRoomName')

				ractive.set('errorMessage', '')

				socket.emit('room create', newRoomName, function (err, id) {
					if (err) {
						ractive.set('errorMessage', err) // sending a string as the error
						setTimeout(function () {
							ractive.set('errorMessage', '')
						}, 5000)
					} else {
						ractive.set('errorMessage', '')
						stateRouter.go('li.room', { id: id })
					}
				})
			})
		}
	})
}
