var Ractive = require('ractive')
var partials = require('./partials.js')

module.exports = function Views(data) {
	return Object.keys(data).reduce(function (views, key) {
		views[key] = new Ractive({
			el: '#' + key + 'View',
			template: '#' + key + 'Template',
			data: data[key],
			partials: partials
		})
		return views
	}, {})
}
