var Ractive = require('ractive')
var camelCase = require('camelcase')

module.exports = function Views(data, list) {
	return list.reduce(function (views, key) {
		views[camelCase(key)] = new Ractive({
			el: '#' + key + '-view',
			template: '#' + key + '-template',
			data: data[key]
		})
		return views
	}, {})
}
