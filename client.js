var Ractive = require('ractive')
//reordering code
//http://ractivejs.github.io/Ractive-decorators-sortable/

var chatView = new Ractive({
	el: '#chat-view',
	template: '#chat-template',
	data: require('./test-chat-data.json')
})

var chatInputView = new Ractive({
	el: '#chat-input-view',
	template: '#chat-input-template',
	data: {
		input: ''
	}
})

chatInputView.on('text-submit', function ts(event) {
	window.watinput = event
})

var musicView = new Ractive({
	el: '#music-metadata-view',
	template: '#music-metadata-template',
	data: {
		title: 'A Dark Knight',
		artist: 'Hans Zimmer and James Newton Howard',
		album: 'The Dark Knight Soundtrack',
		lengthSec: 975,
		elapsedSec: 761,
		percent: 78
	},
	append: true
})

setTimeout(function () {
	musicView.set({
		elapsedSec: 974,
		percent: 99
	})
}, 2000)

var roomView = new Ractive({
	el: '#room-view',
	template: '#list-template',
	data: {
		array: [
			{name: 'room1'},
			{name: 'room2', active: true},
			{name: 'room3'},
			{name: 'room4'}
		],
		emptyMessage: 'You are not a member of any rooms.'
	}
})

var queueView = new Ractive({
	el: '#queue-view',
	template: '#list-template',
	data: {
		array: [
		],
		emptyMessage: 'Drag songs here to upload!!'
	}
})

var albumArtView = new Ractive({ //does not work
	el: '#album-art-view',
	template: '#album-art-template',
	data: {
		source: 'the-dark-knight-ost.jpg'
	}
})
