var edda = require('./edda');
edda.run('/Users/max/apps/restlang/examples/','/Users/max/apps/edda/targets/heimdall.template.js',{},null,function(err,out){
	console.log(JSON.stringify(out,null,4));
});