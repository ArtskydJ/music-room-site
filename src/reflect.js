module.exports = function reflect(eventNames, from, to, newEventName) {
	if (typeof eventNames === 'string') {
		eventNames = [eventNames]
	}
	eventNames.forEach(function reflectEvent(eventName) {
		from.on(eventName, to.emit.bind(to, newEventName || eventName))
	})
}
