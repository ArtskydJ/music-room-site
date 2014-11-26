module.exports = function uploadIsValid(meta) {
	//Rule of thumb: 1mb/min (give or take)
	//1mb = 1,000,000 bytes
	return (
		meta && meta.size && typeof meta.size === 'number' &&
		meta.size < 1000 * 1000 * 10 && //10 mb or smaller
		meta.type && typeof meta.type === 'string' &&
		meta.type.split('/')[0] === 'audio'
	)
}