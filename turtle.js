function Turtle(vector, pos){

	this.vector = (vector == null) ? {x:1, y:0} : vector;
	this.pos = (pos == null) ? {x:0, y:0} : pos;

	this.color = "#000000";

	this.lastPos = {x:this.pos.x, y:this.pos.y};
	this.posStack = [];
	this.vecStack = [];
	this.colorStack = [];

	this.trail = [];

	this.min = {x:0, y:0};
	this.max = {x:0, y:0};

	this.svg = null;

	this.Init = function(){

		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;

		//var firstPos = [];
		//firstPos[0] = this.pos.x;
		//firstPos[1] = this.pos.y;
		this.trail.push([this.pos.x, this.pos.y]);

		this.svg = SVG('svg').size('100%', '100%');
		this.svg.spof();
	};

	this.Reset = function(){

		this.vector = {x:0,y:-1};
		this.pos = {x:0, y:0};
		this.lastPos = {x:0, y:0};
		this.min = {x:0, y:0};
		this.max = {x:0, y:0};
		this.posStack = [];
		this.vecStack = [];
		this.ResetTrail();

		this.svg.clear();
	};

	this.Run = function(string, commandMap){

		var command = null;

		for(var i = 0; i < string.length; i++){
			command = commandMap[string[i]];
			// if command exists, call command with parameter
			if(command != null) this[command[0]](command[1]);
		}

		if(this.trail.length > 0) this.RenderTrail();

		var width = this.max.x - this.min.x;
		var height = this.max.y - this.min.y;

		this.svg.viewbox(this.min.x - width * 0.1, this.min.y - height * 0.1, width * 1.2, height * 1.2);
	};

	this.Draw = function(distance){

		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;

		this.pos.x += (this.vector.x * distance); 
		this.pos.y += (this.vector.y * distance);

		if(this.pos.x > this.max.x) this.max.x = this.pos.x;
		if(this.pos.x < this.min.x) this.min.x = this.pos.x;
		if(this.pos.y > this.max.y) this.max.y = this.pos.y;
		if(this.pos.y < this.min.y) this.min.y = this.pos.y;

		//this.svg.line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y).stroke({width:2});
		var nextPos =[];
		nextPos[0] = this.pos.x;
		nextPos[1] = this.pos.y;

		this.trail.push(nextPos);
	};

	this.RenderTrail = function(){
		//console.log("Render: " + this.color);
		this.svg.polyline(this.trail).fill("none").stroke({width:1, color: this.color});
	};

	this.Rotate = function(degrees){
		this.vector = Rotate(this.vector, degrees);
	};

	this.Push = function(){

		var posCopy = {};
		posCopy.x = this.pos.x;
		posCopy.y = this.pos.y;

		var vecCopy = {};
		vecCopy.x = this.vector.x;
		vecCopy.y = this.vector.y;

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

		var nextPos = [];
		nextPos[0] = this.pos.x;
		nextPos[1] = this.pos.y;
		this.trail = [];
		this.trail.push(nextPos);
	};

	this.ChangeColor = function(color) {
		//console.log("ChangeColor: " + color);

		this.RenderTrail();
		this.ResetTrail();

		this.color = color;
	};

	this.ResetTrail = function(){
		this.trail = [[this.pos.x, this.pos.y]];
	}

}

/*
var turtle = {

	vector : {x:0,y:-1},
	pos : {x:0, y:0},
	lastPos : {x:0, y:0},

	posStack : [],
	vecStack : [],

	min : {x:0, y:0},
	max:{x:0, y:0},

	svg: null,

	Init : function(){

		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;

		this.svg = SVG('svg').size('100%', '100%');
	},

	Reset : function(){

		this.vector = {x:0,y:-1};
		this.pos = {x:0, y:0};
		this.lastPos = {x:0, y:0};
		this.min = {x:0, y:0};
		this.max = {x:0, y:0};
		this.posStack = [];
		this.vecStack = [];

		this.svg.clear();
	},

	commands : {
		"Draw" : function(params){this.Draw(params.distance);},
		"Rotate" : function(params){this.Rotate(params.degrees);}
	},

	Run : function(string, commandMap){

		var command = null;

		for(var i = 0; i < string.length; i++){
			command = commandMap[string[i]];
			// if command exists, call command with parameter
			if(command != null) this[command[0]](command[1]);
		}

		var width = this.max.x - this.min.x;
		var height = this.max.y - this.min.y;
		//this.svg.viewbox(0, this.max.y, this.max.x, -this.max.y);
		//this.svg.viewbox(0, this.max.y, this.max.x, -this.max.y);
		this.svg.viewbox(this.min.x - width * 0.1, this.min.y - height * 0.1, width * 1.2, height * 1.2);
		console.log(JSON.stringify(this.max));
		console.log(this.svg.viewbox().zoom);

		//var rect = this.svg.rect(width, height);
		//rect.move(this.min.x, this.min.y);
	},

	Draw : function(distance){

		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;

		this.pos.x += (this.vector.x * distance); 
		this.pos.y += (this.vector.y * distance);

		if(this.pos.x > this.max.x) this.max.x = this.pos.x;
		if(this.pos.x < this.min.x) this.min.x = this.pos.x;
		if(this.pos.y > this.max.y) this.max.y = this.pos.y;
		if(this.pos.y < this.min.y) this.min.y = this.pos.y;

		this.svg.line(this.lastPos.x, this.lastPos.y, this.pos.x, this.pos.y).stroke({width:2});
	},

	Rotate : function(degrees){
		this.vector = Rotate(this.vector, degrees);
	},

	Push : function(){

		var posCopy = {};
		posCopy.x = this.pos.x;
		posCopy.y = this.pos.y;

		var vecCopy = {};
		vecCopy.x = this.vector.x;
		vecCopy.y = this.vector.y;

		this.posStack.push(posCopy);
		this.vecStack.push(vecCopy);
	},

	Pop : function(){
		this.pos = this.posStack.pop();
		this.vector = this.vecStack.pop();
	}
}
*/