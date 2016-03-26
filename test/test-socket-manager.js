var test = require('tape')
var establishSession = require('./helpers/establish-session.js')

test('socket-manager', function (t) {
	t.plan(4)

	establishSession(function (err, socket) {
		if (err) {
			t.ifError(err)
			t.end()
		}

		socket.emit('session isAuthenticated', function (err, addr) {
			t.ifError(err)
			t.notOk(addr, 'is not authenticated')

			socket.emit('session beginAuthentication', 'joe', function (err, addr) {
				t.ifError(err)
				t.equal(addr, 'joe', 'begin authentication')

				setTimeout(function () {
					socket.emit('session isAuthenticated', function (err, addr) {
						t.ifError(err)
						t.equal(addr, 'joe', 'is authenticated')

						socket.emit('session unauthenticate', function (err) {
							t.ifError(err)

							socket.emit('session isAuthenticated', function (err, addr) {
								t.ifError(err)
								t.notOk(addr, 'is not authenticated')

								t.end()
							})
						})
					})
				}, 0)
			})
		})
	})
})
