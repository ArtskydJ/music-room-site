var config = require('./config.json').musicRoom
var Sux = require('sux')
var xtend = require('xtend')
var createTagData = require('musicmetadata')
//var filereaderStream = require('filereader-stream')
var path = require('path')
//var stream = require('readable-stream')

function getTagData(stream, meta, cb) {
	var opts = { duration: true, fileSize: meta.size }
	var tagData = createTagData(stream, opts)
	var timeout = setTimeout(finish.bind(null, new Error('timeout')), 5000)
	tagData.once('metadata', finish.bind(null, null))
	tagData.once('done', finish)
	function finish(err, data) {
		tagData.removeAllListeners('done')
		if (err || data) {
			clearTimeout(timeout)
			cb.call(null, err, data || {})
		}
	}
}

function Convert(newType) {
	newType = newType.toLowerCase()
	var opts = xtend.bind(null, config.presets[newType])

	return function convert(stream, meta) {
		var fileName = meta.name
		var inputType = path.extname(meta.name).toLowerCase()

		if (inputType !== newType) {
			var cnvrt = new Sux(opts({
				type: newType,
				input: {
					type: inputType,
					source: stream
				}
			}))
			process.nextTick(function () {
				//cnvrt.start.bind(cnvrt)
			})
			cnvrt.start()
			return cnvrt.out()
		} else {
			return stream
		}
	}
}

module.exports = function MultiConvertor() {
	var convertToMp3 = Convert('mp3')
	var convertToOgg = Convert('ogg')
	//[ '-t', '.mp3', '-', '-c', 2, '-b', 16, '-r', 44100, '-t', 'ogg', '-' ]

	return function multiConvert(stream, meta, cb) {
		var mp3Stream = convertToMp3(stream, meta)
		var oggStream = convertToOgg(stream, meta)
		getTagData(stream, meta, function end(err, tagData) {
			if (err && err.message !== 'Could not find metadata header') {
				cb(err)
			} else {
				console.log('mp3Stream', (''+mp3Stream).slice(0, 100))
				console.log('oggStream', (''+oggStream).slice(0, 100))
				cb(null, tagData, mp3Stream, oggStream)
			}
		})
	}
}
