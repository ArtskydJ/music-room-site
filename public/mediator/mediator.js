var EventEmitter = require('events').EventEmitter

function Mediator() {
	var mediator = new EventEmitter()
	Object.keys(mediator.__proto__).forEach(function (method) {
		mediator[method + 'Bind'] = function binding() {
			var args1 = [].slice.call(arguments)
			return function bound() {
				var args2 = [].slice.call(arguments)
				mediator[method].apply(mediator, args1.concat(args2))
			}
		}
	})
	return mediator
}

module.exports = Mediator
