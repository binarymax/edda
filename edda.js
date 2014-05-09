/****************************************************************************
*
* Edda - Output generator for restlang
* (c)Copyright 2014, Max Irwin
* MIT License
*
****************************************************************************/

var fs = require('fs');
var rest = require('restlang');
var _ = require('underscore');

var Edda = module.exports = {};

var load = function(path,callback) {

	var api = [];

	var revar = /\w+\.rest$/i;
	fs.readdir(path,function(err,files){
		if(err) {
			callback([err]);
		} else {
			var file, name, done=0, total=0, errors = [];
			for (var i=0,l=files.length;i<l;i++) {
				file = files[i];
				if (revar.test(file)) {
					total++;
					console.log('Edda found restlang specification',file);
					fs.readFile(path+file,'utf8',function(err,source){
						if (err) {
							errors.push(err);
						} else {
							var spec = null;
							try { 
								spec = rest(source);
							} catch (ex) {
								errors.push(ex);
							}
							if (spec) api = api.concat(spec);
						}
						if(++done===total) {
							errors.length ? callback(errors,api) : callback(null,api);
						}
					});
				}
			}
		}
	});

};

var generate = function(api,template,callback) {
	fs.readFile(template,'utf8',function(err,source){
		if (err) {
			callback(err);
		} else {
			template = _.template(source);
			source = template({api:api});
			callback(null,source);
		}
	});
};

var run = Edda.run = function(path,template,settings,outfile) {
	if(settings) {
		_.templateSettings = {
		  interpolate: /\{\{(.+?)\}\}/g
		};
	}

	load(path,function(err,api){
		generate(api,template,function(err,out){
			if(err) {
				console.error(err);
			} else {
				console.log(out);
			}
		})
	});
};