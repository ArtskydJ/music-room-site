var Remember = require('../remember.js')

function rememberMediator(mediator) {
	var sessId = Remember()
	mediator.on('session getId', function(cb) {
		cb( sessId.get() )
	})
	mediator.on('session setId', sessId.set)
}

module.exports = rememberMediator
