var config = require('./config.json').musicRoom
var Sox = require('sox-stream')
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

	return function convert(stream, meta) {
		var fileName = meta.name
		var inputType = path.extname(meta.name).toLowerCase()

		if (inputType === newType) {
			return stream
		} else {
			var opts = xtend( config.presets[newType], { type: newType })
			var sox = new Sox(opts)
			return stream.pipe(sox)
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
				console.log('mp3Stream', mp3Stream.toString().slice(0, 80))
				console.log('oggStream', oggStream.toString().slice(0, 80))
				cb(null, tagData, mp3Stream, oggStream)
			}
		})
	}
}
