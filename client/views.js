var Ractive = require('ractive')
//reordering elements
//http://ractivejs.github.io/Ractive-decorators-sortable/
//https://github.com/Nijikokun/ractive.drag.drop.js
//https://github.com/Nijikokun/ractive.sortable.js


var chatOptions = {
	el: '#chat-view',
	template: '#chat-template',
	data: {
		messages: [],
		message: ''
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


var usersInRoomOptions = {
	el: '#users-in-room-view',
	template: '#list-template',
	data: {
		array: [
			{name: 'user1'},
			{name: 'user2', number: 2},
			{name: 'user3'},
			{name: 'user4'}
		],
		emptyMessage: 'You are alooooooone...',
		showNumbers: true
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
	var musicView = new Ractive(musicOptions)
	var usersInRoomView = new Ractive(usersInRoomOptions)
	var queueView = new Ractive(queueOptions)
	var albumArtView = new Ractive(albumArtOptions)

	return {
		chat: chatView,
		music: musicView,
		usersInRoom: usersInRoomView,
		queue: queueView,
		albumArt: albumArtView
	}
}
