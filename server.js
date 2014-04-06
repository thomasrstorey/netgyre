var fs = require('node-fs');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var exec = require('child_process').exec;
var Viewer = require("./Viewer").Viewer;

var ipadd;
var viewers = [];

server.listen(3000);


app.use(express.compress());

app.get("/", function(req, res, next){
	console.log("loaded root");

	ipadd = req.ip;
	exec('phantomjs capture.js google.com', function(error, stdout, stderr){
		console.log("rendered url");
	});

	next();
});

app.use(express.static(__dirname + '/views'));

io.sockets.on('connection', function(socket){
	var socketid = socket.id;
	console.log("socket id: " + socket.id);
	fs.readdir("./views/textures", function(err, files){
		socket.emit('news', {
			textures: files,
			id: socketid
		});
	});

	socket.on('send', function(data){
			fs.readdir("./views/textures", function(err, files){
				var num = pad(files.length, 4);
				fs.writeFile("./views/textures/pages/trace_" + num + ".html",
				"<body style='background-color:#FFF;'>" +
				"<p style='font-size:15em;'>" + data.version + "</p>" +
				"<p style='font-size:15em;'>" + ipadd + "</p>" +
				"</body>", 
				function(err){
				if(err){
					console.log(err);
				} else{
					console.log("The file was saved!");
						exec('phantomjs capture.js views/textures/pages/trace_' + num + '.html', function(error, stdout, stderr){
						console.log("rendered url");
					});
				}
			});
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
	this.broadcast.emit("new viewer", {
		id: newViewer.id, 
		x: newViewer.getX(), 
		y: newViewer.getY(), 
		z:newViewer.getZ()
	});
	var i, existingViewer;
	for(i = 0; i<viewers.length; i++){
		existingViewer = viewers[i];
		this.emit("new viewer", {
			id: existingViewer.id,
			x: existingViewer.getX(),
			y: existingViewer.getY(),
			z: existingViewer.getZ()
		});
	};
	viewers.push(newViewer);
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
	this.broadcast.emit("move viewer", {
		id: moveViewer.id,
		x: moveViewer.getX(),
		y: moveViewer.getY(),
		z: moveViewer.getZ()
	})

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

