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
var tools = require('./tools');

var Edda = module.exports = {};

var load = function(path,callback) {

	var data = {};

	data.api = [];
	data.files = [];

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
					data.files.push(path+file);
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
							if (spec) data.api = data.api.concat(spec);
						}
						if(++done===total) {
							errors.length ? callback(errors,data) : callback(null,data);
						}
					});
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
			template = _.template(source);
			source = template(data);
			callback(null,source);
		}
	});
};

var run = Edda.run = function(path,template,data,settings,callback) {
	if(settings) {
		_.templateSettings = {
		  interpolate: /\{\{(.+?)\}\}/g
		};
	}

	load(path,function(err,loaded){
		data.edda = tools;
		data.api = loaded.api;
		data.files = loaded.files;
		generate(data,template,callback);
	});
};