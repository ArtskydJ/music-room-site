var test = require('tape')
var inBrowser = require('in-browser')
var Chat = require('../client/room/chat.js')

test('server sends a "new song" event', function (t) {
	t.plan(1)
	var chat = Chat()

	chat.on('new song', function (song) { //find a way to make this not in ./chat.js
		t.pass('"new song" event')
		t.end()
	})
})

test('sending a chat will come back to me', function (t) {
	t.plan(1)
	var chat = Chat()
	var msg = {label: 'Joseph', item: 'cool'}

	//setTimeout(function () {
		chat.emit('send', msg)
		chat.on('receive', function (msgObj) {
			t.deepEqual(msgObj, msg, 'should be the same')
			t.end()
			inBrowser && window.close()
		})
	//}, 50)
})


