function Rotate(vector, degrees){

	var result = {x:0,y:0};
	var radian = DegToRad(degrees);

	result.x = vector.x * Math.cos(radian) - vector.y * Math.sin(radian);
	result.y = vector.x * Math.sin(radian) + vector.y * Math.cos(radian);

	return result;
}

function DegToRad(degrees){
	return degrees * Math.PI / 180;
}

// Inclusive of min and max, intended for whole integers
function RandomInRange(min, max){
	return Math.floor(min + Math.random() * (max - min + 1));
}