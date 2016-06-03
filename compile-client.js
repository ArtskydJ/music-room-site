var browserify = require('browserify')
var fs = require('fs')
var tinylr = require('tiny-lr')

if (dev) {
	var tinyReloadServer = tinylr()

	tinyReloadServer.listen(35729)

	function emitChangedFile(file) {
		console.log('emitting reload', file)
		tinyReloadServer.changed({
			body: {
				files: [file]
			}
		})
	}
}

var b = buildBrowserifyPipeline(dev)
function bundle() {
	buildGlobbed(() => {
		console.log('rebuilding', new Date())
		var writeToDiskStream = fs.createWriteStream('static/build.js')
		b.bundle().pipe(writeToDiskStream)
		if (dev) {
			writeToDiskStream.on('finish', () => {
				emitChangedFile('static/build.js')
			})
		}
	})
}

b.on('update', bundle)
