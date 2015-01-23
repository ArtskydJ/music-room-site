var Ractive = require('ractive')
//reordering elements
//http://ractivejs.github.io/Ractive-decorators-sortable/
//https://github.com/Nijikokun/ractive.drag.drop.js
//https://github.com/Nijikokun/ractive.sortable.js


var chatOptions = {
	el: '#chat-view',
	template: '#chat-template',
	data: []
}


var chatInputOptions = {
	el: '#chat-input-view',
	template: '#chat-input-template',
	data: {
		input: ''
	}
}


var musicOptions = {
	el: '#music-metadata-view',
	template: '#music-metadata-template',
	data: {
		title: 'Science is Fun',
		artist: 'Aperture Science',
		album: 'Portal 2 - Volume 1',
		currentSec: 0,
		durationSec: 0,
		muted: false
	},
	append: true
}


var roomOptions = {
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
}


var queueOptions = {
	el: '#queue-view',
	template: '#list-template',
	data: {
		array: [],
		emptyMessage: 'Drag songs here to upload!! (Coming soon.)'
	}
}


var albumArtOptions = { //does not work
	el: '#album-art-view',
	template: '#album-art-template',
	data: {source: 'temp/portal-2.jpg'}
}


module.exports = function Views() {
	var chatView = new Ractive(chatOptions)
	var chatInputView = new Ractive(chatInputOptions)
	var musicView = new Ractive(musicOptions)
	var roomView = new Ractive(roomOptions)
	var queueView = new Ractive(queueOptions)
	var albumArtView = new Ractive(albumArtOptions)

	return {
		chat: chatView,
		chatInput: chatInputView,
		music: musicView,
		room: roomView,
		queue: queueView,
		albumArt: albumArtView
	}
}
