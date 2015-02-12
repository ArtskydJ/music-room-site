module.exports = function formatTime(seconds) {
	var min = Math.floor(seconds  / 60)
	var sec = (Math.floor(seconds  % 60) / 100).toFixed(2).slice(2)
	return '' + min + ':' + sec
}
