module.exports = function audio() {
	var el = document.createElement('audio')
	document.body.appendChild(el)
	el.autoplay = true
	return el
}
