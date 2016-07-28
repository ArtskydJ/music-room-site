module.exports = function (stateRouter, socket) {
	stateRouter.addState({
		name: 'li.create-room',
		route: '/create-room',
		template: require('./create-room.html'),
		resolve: function (data, parameters, cb) {
			console.log('create room resolve')
			cb(null, {})
		},
		activate: function (context) {
			var ractive = context.domApi

			var previousTimeout = null

			ractive.on('new-room-event', function (ev) {
				ev.original.preventDefault()

				var newRoomName = ractive.get('newRoomName')

				ractive.set('errorMessage', '')

				socket.emit('room create', newRoomName, function (err, id) {
					if (err) {
						console.log('arguments:')
						console.log(arguments)
						ractive.set('errorMessage', err) // sending a string as the error
						if (previousTimeout !== null) {
							clearTimeout(previousTimeout)
						}
						previousTimeout = setTimeout(function () {
							ractive.set('errorMessage', '')
						}, 5000)
					} else {
						ractive.set('errorMessage', '')
						console.log('going to li.room, { room: ' + id + ' }')
						stateRouter.go('li.room', { room: id })
					}
				})
			})
		}
	})
}
