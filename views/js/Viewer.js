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
		}

		var setX = function(newX){
			x = newX;
		};

		var setY = function(newY){
			y = newY;
		};

		var setZ = function(newZ){
			z = newZ;
		}


	var update = function(object){
		var prevX = x;
		var prevY = y;
		var prevZ = z;
		x = object.position.x;
		y = object.position.y;
		z = object.position.z;
		return (prevX !== x || prevY !== y || prevZ !== z) ? true : false;
	};

	return {
		getX: getX,
		getY: getY,
		getZ: getZ,
		setX: setX,
		setY: setY,
		setZ: setZ,
		id: id,
		update: update
	}
};