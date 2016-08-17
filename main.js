var koch = new System(
	[	
		{variable : "F", command : ["Draw", 5]},
		{variable : "+", command : ["Rotate", -90]},
		{variable : "-", command : ["Rotate", 90]}
	],
	[
		["F", "F+F-F-F+F"]
	],
	["+", "-"],
	"F"
);

var sierpenski = new System(
	[
		{variable : "A", command : ["Draw", 5]},
		{variable : "B", command : ["Draw", 5]},
		{variable : "+", command : ["Rotate", -60]},
		{variable : "-", command : ["Rotate", 60]}
	],
	[
		["A", "+B-A-B+"],
		["B", "-A+B+A-"]
	],
	["+", "-"],
	"A"
);

var dragonCurve = new System(
	[
		{variable : "F", command : ["Draw", 5]},
		{variable : "-", command : ["Rotate", -90]},
		{variable : "+", command : ["Rotate", 90]},
	],
	[
		["X", "X+YF+"],
		["Y", "-FX-Y"]
	],
	["F", "+", "-"],
	"FX"
);

var pythagorasTree = new System(
	[
		{variable : "0", command : ["Draw", 5]},
		{variable : "1", command : ["Draw", 5]},
		{variable : "[", command : ["Push", null]},
		{variable : "]", command : ["Pop", null]},
		{variable : "L", command : ["Rotate", -45]},
		{variable : "R", command : ["Rotate", 45]},
	],
	[
		["1", "11"],
		["0", "1[L0]R0"]
	],
	["[", "]", "L", "R"],
	"0"
);

//var sys = koch;
var generator = new Generator();

var sys = generator.GenerateSystem();
sys.Init();

var turtle = new Turtle(sys.vector, sys.pos);
turtle.Init();

var iterations = 3;

Repaint();

function Repaint(){

	turtle.Reset();
	console.log("Create string");
	var string = sys.Run(iterations);
	console.log("Run");
	turtle.Run(string, sys.commandMap);
}

function Regenerate(){

}

window.addEventListener("keypress", HandleKeyPress, false);

function HandleKeyPress(e){

	var redraw = false;

	// Space
	if(e.charCode == "32"){
		iterations = 3;
		sys = generator.GenerateSystem();
		Repaint();
	}
	// +
	else if(e.charCode == "61"){
		iterations++;
		redraw = true;
	}
	// -
	else if(e.charCode == "45"){
		iterations--;
		redraw = true;
	}

	if(redraw) Repaint();
}