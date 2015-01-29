module.exports = function resolve(namespace) {
	var arr = (namespace || '').split('/').filter(Boolean)
	return '/' + (arr.pop() || '')
}

//  /              ->  /
//  /path/subpath  ->  /sub
//  /end/slash/    ->  /slash
//  /wa/th/in/gs/  ->  /gs
