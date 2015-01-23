var Ractive = require('ractive')
var camelCase = require('camelcase')
var readFileSync = require('fs').readFileSync
//reordering elements
//http://ractivejs.github.io/Ractive-decorators-sortable/
//https://github.com/Nijikokun/ractive.drag.drop.js
//https://github.com/Nijikokun/ractive.sortable.js

var list = [
	'album-art',
	'chat',
	'music',
	'queue',
	'users-in-room'
]
var templateMap = {
	'queue': 'list',
	'users-in-room': 'list'
}
var appendMap = {
	'music': true
}

var options = list.reduce(function (options, key) {
	var template = templateMap[key] || key
	options[key] = {
		el: '#' + key + '-view',
		template: readFileSync('./templates/' + template + '.ract'),
		data: JSON.parse(readFileSync('./data/' + key + '.json')),
		append: appendMap[key]
	}
	return options
}, {})

options.chat = {
	el: '#chat-view',
	template: '#chat-template',
	data: {
		messages: [],
		message: ''
	}
}


options.music = {
	el: '#music-view',
	template: '#music-template',
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


options.usersInRoom = {
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


options.queue = {
	el: '#queue-view',
	template: '#list-template',
	data: {
		array: [],
		emptyMessage: 'Drag songs here to upload!! (Coming soon.)'
	}
}


options.albumArt = { //does not work
	el: '#album-art-view',
	template: '#album-art-template',
	data: {source: 'temp/portal-2.jpg'}
}


module.exports = function Views() {
	var views = {}

	views.chat =        new Ractive(options.chat)
	views.music =       new Ractive(options.music)
	views.usersInRoom = new Ractive(options.usersInRoom)
	views.queue =       new Ractive(options.queue)
	views.albumArt =    new Ractive(options.albumArt)

	return views
}
