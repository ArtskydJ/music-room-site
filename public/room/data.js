module.exports = {
	albumArt: '',

	chat: {
		array: [],
		input: ''
	},

	music: {
		title: '',
		artist: '',
		album: '',
		currentSec: 0,
		durationSec: 0.1, //no div by zero
		muted: false
	},

	queue: {
		array: [],
		empty: "Drag songs here to upload!! (Coming soon.)"
	},

	usersInRoom: {
		array: [
			{item: 'user1'},
			{item: 'user2', 'badge': 2},
			{item: 'user3'},
			{item: 'user4'}
		],
		empty: 'You are alooooooone...'
	}
}
