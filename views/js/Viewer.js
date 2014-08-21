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


	var update = function(object){
		var prevX = x;
		var prevY = y;
		var prevZ = z;
		var prevQX = qx;
		var prevQY = qy;
		var prevQZ = qz;
		var prevQW = qw;
		x = object.position.x;
		y = object.position.y;
		z = object.position.z;
		qx = object.quaternion.x;
		qy = object.quaternion.y;
		qz = object.quaternion.z;
		qw = object.quaternion.w;
		qx = parseFloat(qx.toFixed(5));
		qy = parseFloat(qy.toFixed(5));
		qz = parseFloat(qz.toFixed(5));
		qw = parseFloat(qw.toFixed(5));
		prevQX = parseFloat(prevQX.toFixed(5));
		prevQY = parseFloat(prevQY.toFixed(5));
		prevQZ = parseFloat(prevQZ.toFixed(5));
		prevQW = parseFloat(prevQW.toFixed(5));
		return (prevX !== x || prevY !== y || prevZ !== z || prevQX !== qx || prevQY !== qy || prevQZ !== qz || prevQW !== qw) ? true : false;
	};

	return {
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
		id: id,
		update: update
	}
};