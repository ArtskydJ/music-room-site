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
		empty: "Drag songs onto this page to upload!",
		sortable: true
	},

	usersInRoom: {
		array: []
	}
}
