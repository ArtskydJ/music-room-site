module.exports = function handle(t) {
	return function (err) {
		t.notOk(err, (err && err.message) ? err.message : 'no error')
		t.end()
	}
}
