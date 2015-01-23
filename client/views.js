var Ractive = require('ractive')
var camelCase = require('camelcase')
var listPartialString = require('./list-partial.json').join('')

module.exports = function Views(data) {
	return Object.keys(data).reduce(function (views, key) {
		views[camelCase(key)] = new Ractive({
			el: '#' + key + '-view',
			template: '#' + key + '-template',
			partials: {list: listPartialString},
			data: data[key]
		})
		return views
	}, {})
}
