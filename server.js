var fs = require('node-fs');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var exec = require('child_process').exec;
var Viewer = require("./Viewer").Viewer;

var ipadd;
var color;
var viewers = [];
var tempid;




//server.listen(8124, "128.227.217.26");
server.listen(8124);


	app.use(express.compress());
	app.use(express.bodyParser({uploadDir:'./uploads'}));
	app.use(express.multipart());


app.get('/', function(req, res, next){
	console.log("loaded root");
    ipadd = req.ip;
	color = ipadd.split(".");
	next();
});

app.use(express.static(__dirname + '/views'));

app.post('/uploads', function(req, res, next){
	console.log(req.files);
	var tmpPath = req.files.webcam.path;
	var targetPath = './views/webcam/' + req.ip + ".jpg";
	fs.rename(tmpPath, targetPath, function(err){
		if(err) throw err;
		fs.unlink(tmpPath, function(){
			if(err) throw err;
			res.send('File uploaded to: ' + targetPath + ' - ' + req.files.webcam.size + ' bytes');
		});
	});
});

io.sockets.on('connection', function(socket){

	socket.on('send', function(data){
		fs.readdir("./views/textures", function(err, files){
			socket.emit('test', {
				files: files
			});
			if(files){
				var num = pad(files.length, 4);
				fs.writeFile("./views/textures/pages/trace_" + num + ".html",
					"<body style='background-color:rgba("+ color[0] +
													", " + color[1] + 
													", " + color[2] + 
													", " + color[3] + "); width: 1024px; height: 1024px; overflow: none; margin: none; padding: none;'>" +
					"<div style='width: 1024px; height: 1024px;'>" +
					"<p style='font-size:6em; color:#FFF;'>" + ipadd + ipadd + ipadd + "<br>" +
					 ipadd + ipadd + ipadd + "<br>" +
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" + 
					 ipadd + ipadd + ipadd + "<br>" +"</p>" +
					"</div>"+
					"<div style='width: 1024px; height: 1024px; position: absolute; top: 0px; left: 0px;'>" +
					"<p style='font-size:5em; color: #FFF;'>" + tempid + "<br>" +
					 tempid + "<br>" +
					 tempid + "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" + 
					 tempid +  "<br>" +"</p>" +
					"</div>"+
					"</body>", 
					function(err){
					if(err){
						console.log(err);
					} else{
						console.log("The file was saved!");
							exec('phantomjs capture.js views/textures/pages/trace_' + num + '.html', function(error, stdout, stderr){
							console.log("rendered url");
							fs.readdir("./views/textures", function(err, files){
								var socketid = socket.id;
								tempid = socketid;
								console.log("socket id: " + socket.id);

								socket.emit('news', {
									textures: files,
									id: socketid
								});
							});
						});
					}
				});
			} else if(err){
				console.log(err);
			}
		});
		
	});

	socket.on("disconnect", onSocketDisconnect);
	socket.on("new viewer", onNewViewer);
	socket.on("move viewer", onMoveViewer);
	socket.on("remove viewer", onRemoveViewer);

});

function onSocketDisconnect(){
	console.log("Viewer has disconnected: " + this.id);

	var removeViewer = viewerById(this.id);
	if(!removeViewer){
		console.log("Viewer not found: " + this.id);
		return;
	}
	viewers.splice(viewers.indexOf(removeViewer), 1);
	this.broadcast.emit("remove viewer", {id: this.id});

};

function onNewViewer(data){
	var newViewer = new Viewer(data.x, data.y, data.z);
	newViewer.id = this.id;
	newViewer.ip = this.handshake.address.address
	var currentsocket = this;

	fs.readdir("./views/textures", function(err, files){
		var textureurl = files[files.length - 1];
		console.log(textureurl);
		currentsocket.broadcast.emit("new viewer", {
			id: newViewer.id,
			ip: newViewer.ip, 
			x: newViewer.getX(), 
			y: newViewer.getY(), 
			z:newViewer.getZ(),
			qx: newViewer.getQX(), 
			qy: newViewer.getQY(), 
			qz:newViewer.getQZ(),
			qw:newViewer.getQW(),
			texture: textureurl,
		});
		var i, existingViewer;
		for(i = 0; i<viewers.length; i++){
			existingViewer = viewers[i];
			currentsocket.emit("new viewer", {
				id: existingViewer.id,
				x: existingViewer.getX(),
				y: existingViewer.getY(),
				z: existingViewer.getZ(),
				qx: existingViewer.getQX(),
				qy: existingViewer.getQY(),
				qz: existingViewer.getQZ(),
				qw: existingViewer.getQW(),
				ip: existingViewer.ip,
				texture: files[files.length - (i + 1)]
			});
		};

		viewers.push(newViewer);
	});
};

function onMoveViewer(data){
	var moveViewer = viewerById(data.id);
	if(!moveViewer){
		console.log("could not find viewer: " + data.id);
		return;
	}

	moveViewer.setX(data.x);
	moveViewer.setY(data.y);
	moveViewer.setZ(data.z);
	moveViewer.setQX(data.qx);
	moveViewer.setQY(data.qy);
	moveViewer.setQZ(data.qz);
	moveViewer.setQW(data.qw);
	this.broadcast.emit("move viewer", {
		id: moveViewer.id,
		x: moveViewer.getX(),
		y: moveViewer.getY(),
		z: moveViewer.getZ(),
		qx: moveViewer.getQX(),
		qy: moveViewer.getQY(),
		qz: moveViewer.getQZ(),
		qw: moveViewer.getQW()
	});

};

function onRemoveViewer(){
	var removeViewer = viewerById(this.id);
	if(!removeViewer){
		console.log("Viewer not found: " + this.id);
		return;
	}
	viewers.splice(viewers.indexOf(removeViewer), 1);
	this.broadcast.emit("remove viewer", {id: this.id});
};

function viewerById(id){
	var i;
	for (i = 0; i < viewers.length; i++){
		if(viewers[i].id === id) return viewers[i];
	};

	return false;
};

function pad(num, size){
	var s = num+"";
	while(s.length < size) s = "0" + s;
	return s;
};

