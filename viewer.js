var Viewer = function(startX, startY, startZ, startQX, startQY, startQZ, startQW){
	var x = startX,
		y = startY,
		z = startZ,
		qx = startQX,
		qy = startQY,
		qz = startQZ,
		qw = startQW,
		ip,
		id;

	var getX = function(){
		return x;
	};

	var getY = function(){
		return y;
	};

	var getZ = function(){
		return z;
	};

	var setX = function(newX){
		x = newX;
	};

	var setY = function(newY){
		y = newY;
	};

	var setZ = function(newZ){
		z = newZ;
	};

	var getQX = function(){
	return qx;
	};

	var getQY = function(){
		return qy;
	};

	var getQZ = function(){
		return qz;
	}

	var getQW = function(){
	return qw;
	};

	var setQX = function(newX){
		qx = newX;
	};

	var setQY = function(newY){
		qy = newY;
	};

	var setQZ = function(newZ){
		qz = newZ;
	}

	var setQW = function(newW){
		qw = newW;
	}

	return{
		getX: getX,
		getY: getY,
		getZ: getZ,
		setX: setX,
		setY: setY,
		setZ: setZ,
		getQX: getQX,
		getQY: getQY,
		getQZ: getQZ,
		getQW: getQW,
		setQX: setQX,
		setQY: setQY,
		setQZ: setQZ,
		setQW: setQW,
		ip: ip,
		id: id
	}
};

exports.Viewer = Viewer;