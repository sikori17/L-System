function Turtle(vector, pos){

	// See Reset for list of properties

	this.Init = function(vector, pos){

		this.svg = SVG('svg').size('100%', '100%');
		this.svg.spof();

		this.Reset(vector, pos);
	};

	this.Reset = function(vector, pos){

		this.vector = (vector == null) ? {x:1, y:0} : vector;
		this.pos = (pos == null) ? {x:0, y:0} : pos;

		this.color = "#000000";

		this.lastPos = {x: this.pos.x, y: this.pos.y};
		this.min = {x:0, y:0};
		this.max = {x:0, y:0};
		this.posStack = [];
		this.vecStack = [];
		this.colorStack = [];
		this.ResetTrail();

		this.svg.clear();
	};

	this.Run = function(string, commandMap){

		var command = null;

		// Iterate and execute commands
		for(var i = 0; i < string.length; i++){
			command = commandMap[string[i]];
			// if command exists, call command with parameter
			if(command != null) this[command[0]](command[1]);
		}

		// Render last trail 
		if(this.trail.length > 0) this.RenderTrail();

		// Calculate and set display area
		var width = this.max.x - this.min.x;
		var height = this.max.y - this.min.y;

		this.svg.viewbox(this.min.x - width * 0.1, this.min.y - height * 0.1, width * 1.2, height * 1.2);
	};

	this.Draw = function(distance){

		this.lastPos = Object.assign({}, this.pos);

		this.pos.x += (this.vector.x * distance); 
		this.pos.y += (this.vector.y * distance);

		this.UpdateBounds();

		var nextPos =[this.pos.x, this.pos.y];

		this.trail.push(nextPos);
	};

	this.UpdateBounds = function(){
		if(this.pos.x > this.max.x) this.max.x = this.pos.x;
		if(this.pos.x < this.min.x) this.min.x = this.pos.x;
		if(this.pos.y > this.max.y) this.max.y = this.pos.y;
		if(this.pos.y < this.min.y) this.min.y = this.pos.y;
	}

	this.RenderTrail = function(){
		this.svg.polyline(this.trail).fill("none").stroke({width:1, color: this.color});
	};

	this.Rotate = function(degrees){
		this.vector = Rotate(this.vector, degrees);
	};

	this.Push = function(){

		var posCopy = Object.assign({}, this.pos);
		var vecCopy = Object.assign({}, this.vector);
		var colorCopy = this.color;

		this.posStack.push(posCopy);
		this.vecStack.push(vecCopy);
		this.colorStack.push(colorCopy);
	};

	this.Pop = function(){

		this.RenderTrail();

		this.pos = this.posStack.pop();
		this.vector = this.vecStack.pop();
		this.color = this.colorStack.pop();

		this.ResetTrail();
	};

	this.ChangeColor = function(color) {

		this.RenderTrail();
		this.ResetTrail();

		this.color = color;
	};

	this.ResetTrail = function(){
		this.trail = [[this.pos.x, this.pos.y]];
	}

}