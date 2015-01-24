module.exports = {
	list: '{{#array}}' +
		'<a class="list-group-item{{#highlight}} active{{/highlight}}">' +
			'{{#label}}' +
				'<small class="text-muted">{{label}}</small>&nbsp;&nbsp;' +
			'{{/}}' +
			'{{item}}' +
			'{{#badge}}' +
				'<span class="badge">{{badge}}</span>' +
			'{{/}}' +
		'</a>' +
	'{{else}}' +
		'{{#empty}}' +
			'<a class="list-group-item">{{empty}}</a>' +
		'{{/}}' +
	'{{/}}'
}


/* This partial is expecting data in the following form:
data: {
	array: [
		{item:'welcome!', label: 'server says', badge: 3, highlight: true},
		{item:'welcome!', label: 'server says',           highlight: true},
		{item:'welcome!',                       badge: 3, highlight: true},
		{item:'welcome!',                                 highlight: true},
		{item:'welcome!', label: 'server says', badge: 3},
		{item:'welcome!', label: 'server says'},
		{item:'welcome!',                       badge: 3},
		{item:'welcome!'}
	],
	empty: 'no messages here.'
}
*/
