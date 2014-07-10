var edda = (function(){
	"use strict"

	var Tools = {};

	Tools.exists = function(obj) {
		if(!_.isObject(obj)) return false;

		for(var key in obj) {
			if(obj.hasOwnProperty(key) && _.isObject(obj[key])) {
				return true;
			}
		}

		return false;
	};

	Tools.resources = function(api,callback) {
		if(_.isArray(api)) {
			var comma = false;
			for (var i=0;i<api.length;i++) {
				callback(api[i],api[i].name,(comma)?',':'');
				comma = true;
			}
		}
	}

	Tools.methods = function(resource,callback) {
		if(_.isArray(resource.methods)) {
			var comma = false;
			console.log(resource);
			var methods = resource.methods;
			for (var i=0;i<methods.length;i++) {
				callback(methods[i],methods[i].name,(comma)?',':'');
				comma = true;
			}
		}
	};

	Tools.method = function(route) {

		var verb = 'COLLECTION';
		if (route && route.name) {
			switch (route.name.toLowerCase()) {
				case 'post': verb = 'ADD'; break;
				case 'put' : verb = 'SAVE'; break;
				case 'delete': verb = 'REMOVE'; break;
				case 'entry': verb = 'ENTRY'; break;
				case 'collection': verb = 'COLLECTION'; break;
				case 'add': verb = 'ADD'; break;
				case 'save': verb = 'SAVE'; break;
				case 'remove': verb = 'REMOVE'; break;
				case 'get' : verb = Tools.exists(route.params)?'ENTRY':'COLLECTION'; break;
				default: verb = 'COLLECTION'; break;
			}
		}
		return verb;
	};

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

	return Tools;
})();

if(typeof module !== "undefined" && module.exports) {
  //Node
  module.exports = edda;
  var _ = require('underscore');
} else if (typeof window!=="undefined") {
  //Browser
  window.edda = edda;
}