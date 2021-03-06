// Constructor for System
function System(commandMap, rules, constants, axiom, startVector, startPos){

	this.vector = startVector;
	this.pos = startPos;

	this.constants = constants;
	this.axiom = axiom;

	this.alphabet = [];
	this.commandMap = {};

	for(var i = 0; i < commandMap.length; i++){
		// Extract alphabet from command map
		this.alphabet[i] = commandMap[i].variable;
		// letter to command array creation
		this.commandMap[commandMap[i].variable] = commandMap[i].command;
	}

	this.rules = {

		Init : function(constants){
			for(var i = 0; i < constants.length; i++){
				this[constants[i]] = constants[i];
			}
		}
	};

	for(var i = 0; i < rules.length; i++){
		this.rules[rules[i][0]] = rules[i][1];
	}

	this.Init = function(){
		this.rules.Init(this.constants);
	};

	this.Run = function(iterations){

		var product = this.axiom;

		for(var i = 0; i < iterations; i++){
			product = this.ApplyRules(product);
		}

		return product;
	};

	this.ApplyRules = function(string){

		var result = ""

		for(var i = 0; i < string.length; i++){
			result += this.rules[string[i]];
		}

		return result;
	};
}