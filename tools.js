var Tools = module.exports = {};

Tools.route = function(resource,route) {
	var str = '/' + resource + '/';
	if (route && route.params) {
		for(var param in route.params) {
			str+=':'+param+'/';
		}
	}
	return str;
};

Tools.mock = function(resource,route) {
	var str = '/' + resource + '/';
	if (route && route.params) {
		for(var param in route.params) {
			str+=fake(route.params[param]) + '/';
		}
	}
	return str;	
};

var fake = function(param) {
	var val = '';
	switch (param.type) {
		case 'int64': val=1; break;
		default: val = 'hi'; break;
	}
	return val;
};