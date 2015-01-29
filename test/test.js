var test = require('tape')
var inBrowser = require('in-browser')
var Room = require('../client/room/room.js')
var resolve = require('../resolve-namespace.js')

test('resolve works', function (t) {
	t.equal(resolve(''),                   '/',          'emptystring')
	t.equal(resolve('/room/autoplay'),     '/autoplay',  'expected use case')
	t.equal(resolve('room/undefined/'),    '/undefined', 'ending slash')
	t.equal(resolve('/hey/gg/3//neat///'), '/neat',      'extra slashes')
	t.equal(resolve('/so /wow /'),         '/wow ',      'spaces')
	t.end()
})

test('server sends a "new song" event', function (t) {
	t.plan(1)
	var room = Room('/room/autoplay')

	room.once('new song', function (song) { //on
		t.pass('"new song" event')
		t.end()
	})
})

test('sending a chat will come back to me', function (t) {
	t.plan(3)
	var room = Room('/room/autoplay')
	var msg = {label: 'Joseph', item: 'cool'}

	//setTimeout(function () {
		room.on('chat receive', function (msgObj) {
			t.ok(msgObj, 'msgObj is truthy')
			t.equal(msgObj.item, 'cool', 'the message is: ' + msgObj.item)
			t.deepEqual(msgObj, msg, 'should be the same')
			t.end()
			inBrowser && window.close()
		})
		room.emit('chat send', msg)
	//}, 50)
})


