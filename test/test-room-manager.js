var test = require('tape')
var establishSession = require('./helpers/establish-session.js')

test('room-manager', function (t) {
	t.plan(3)

	establishSession(function (err, socket) {
		if (err) return handle(t, err)

		socket.on('chat receive', function (msg) {
			t.equal(msg.item, 'ok', 'Received messsage: "' + msg.item + '"')
		})

		socket.emit('chat send', 'not authenticated', function (err) {
			if (err) {
				var index = err.message.indexOf('unauthenticated')
				t.notEqual(index, -1, 'error message says "unauthenticated"')
			} else {
				t.pass('already authenticated')
			}
			socket.emit('session beginAuthentication', 'joe', function (err) {
				if (err) return handle(t, err)
				socket.emit('chat send', 'not joined yet', function (err) {
					if (err) return handle(t, err)
					socket.emit('join', 'room-whatever', function (err) {
						if (err) return handle(t, err)
						socket.emit('chat send', 'ok', function (err) {
							if (err) return handle(t, err)
							socket.emit('leave', 'room-whatever', function (err) {
								if (err) return handle(t, err)
								socket.emit('chat send', 'left room', function (err) {
									if (err) return handle(t, err)
									t.pass('got to the end')
									t.end()
								})
							})
						})
					})
				})
			})
		})
	})
})

function handle(t, err) {
	t.ifError(err)
	t.end()
}
