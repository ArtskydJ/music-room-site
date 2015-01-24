var Ractive = require('ractive')
Ractive.partials = require('./partials.js')

module.exports = function Views(data) {
	return Object.keys(data).reduce(function (views, key) {
		views[key] = new Ractive({
			el: '#' + key + 'View',
			template: '#' + key + 'Template',
			data: data[key]
		})
		return views
	}, {})
}
