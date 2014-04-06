var Viewer = function(startX, startY, startZ){
	var x = startX,
		y = startY,
		z = startZ,
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

	return{
		getX: getX,
		getY: getY,
		getZ: getZ,
		setX: setX,
		setY: setY,
		setZ: setZ,
		id: id
	}
};

exports.Viewer = Viewer;