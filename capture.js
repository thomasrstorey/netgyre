console.log("capture");
var system = require("system");
var fs = require("fs");

var renderUrlToFile = function(url, callback){

	var n = url.indexOf("pages");
	var m = url.indexOf("_");
	var num = url.slice(m+1, m+5);
	var filename = url.slice(0, n) + 'rendered-trace_' + num + '.jpg';
	console.log(filename);
	var webpage = require("webpage");
	page = webpage.create();
	page.viewportSize={width:1024, height:1024};
	page.settings.userAgent = "phantomjs bot";
	page.evaluate(function(){
		document.body.bgColor = 'white';
	});
	var fullpath = fs.workingDirectory + "/" + url;
	console.log(fullpath);

    page.open(fullpath, function(status){
    	if(status === "success"){
    		page.render(filename);
    		return callback();
    	}
    });
};

if(system.args.length === 2){
	var url = system.args[1];
	renderUrlToFile(url, function(){
		console.log("done");
		return phantom.exit();
	});
}