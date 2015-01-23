var Views = require('../views.js')
var data = require('./data.json')

var views = Views(data, [
	'starred',
	'overview'
])

//views.overview
//views.starred
