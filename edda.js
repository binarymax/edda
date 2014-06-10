/****************************************************************************
*
* Edda - Output generator for restlang
* (c)Copyright 2014, Max Irwin
* MIT License
*
****************************************************************************/

var fs    = require('fs');
var rest  = require('restlang');
var _     = require('underscore');
var tools = require('./tools');

var Edda = module.exports = {};

var load = function(path,callback) {

	var data = {};

	data.api = [];
	data.files = [];

	var revar = /\w+\.api$/i;
	fs.readdir(path,function(err,files){
		if(err) {
			callback([err]);
		} else {
			var file, name, done=0, total=0, errors = [];
			for (var i=0,l=files.length;i<l;i++) {
				file = files[i];
				if (revar.test(file)) {
					total++;
					data.files.push(path+file);
					(function(path,file){
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
								if (spec && spec instanceof Array) {
									spec = spec.map(function(resource){
										resource.file=file;
										resource.path=path;
										return resource;
									});
									data.api = data.api.concat(spec);
								}
							}
							if(++done===total) {
								errors.length ? callback(errors,data) : callback(null,data);
							}
						});
					})(path,file);
				}
			}
		}
	});

};

var generate = function(data,template,callback) {
	fs.readFile(template,'utf8',function(err,source){
		if (err) {
			callback(err);
		} else {
			var resources = [];
			template = _.template(source);
			for(var i=0,l=data.api.length;i<l;i++) {
				var resource = data.api[i];
				resource.output = template({api:[resource],edda:tools});
				resource.output = resource.output.replace(/(\n\s+\n)+/g,'\n');
				resources.push(resource);
			}
			callback(null,resources);
		}
	});
};

var run = Edda.run = function(path,template,data,settings,callback) {
	if(settings) {
		_.templateSettings = {
		  interpolate: /\{\{(.+?)\}\}/g
		};
	}

	template = (~template.indexOf('/')?'':(__dirname+'/targets/')) + template;

	load(path,function(err,loaded){
		data.edda = tools;
		data.api = loaded.api;
		data.files = loaded.files;
		generate(data,template,callback);
	});
};