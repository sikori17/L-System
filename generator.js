function Generator(alphabetRange, constantsRange, ruleRange, axiomRange, anglesArray){

	this.alphabetRange = alphabetRange;
	this.constantsRange = constantsRange;
	this.ruleRange = ruleRange;
	this.axiomRange = axiomRange;
	this.angles = anglesArray;

	// Hack - hard coded right now
	this.constantsSet = "+-|[";
	// Hack - hard coded right now
	this.colors = [
		"#000000", // Black
		"#FF0000", // Red
		"#00FF00", // Green
		"#0000FF", // Blue
		"#FF8D00", // Orange
		"#F8FF00", // Yellow
		"#1EFF00", // Green
		"#E400FF"  // Purle
	];

	this.GenerateSystem = function(){

		this.alphabet = this.ChooseAlphabet();
		console.log("alphabet: " + this.alphabet);
		this.constants = this.ChooseConstants();
		console.log("constants: " + this.constants);
		this.rules = this.GenerateRules();
		console.log("rules: " + JSON.stringify(this.rules));
		this.axiom = this.ChooseAxiom(this.alphabet + this.constants);
		console.log("axiom: " + this.axiom);
		this.angle = this.ChooseAngle();
		console.log("angle: " + this.angle);
		this.commands = this.GenerateCommands(this.alphabet + this.constants);
		console.log("commands: " + JSON.stringify(this.commands));

		console.log("system");
		return new System(this.commands, this.rules, this.constants, this.axiom);
	};

	this.ChooseAlphabet = function(){

		var length = RandomInRange(1, this.alphabetRange);
		var alphabet = "";

		var letter = "";
		for(var i = 0; i < length; i++){
			// A-Z
			letter = String.fromCharCode(RandomInRange(65, 90));
			// Re-roll if already in the alphabet
			if(!alphabet.includes(letter)) 
				alphabet += letter;
			else 
				i--;
		}

		return alphabet;
	};

	this.ChooseConstants = function(){

		var length = RandomInRange(1, this.constantsRange);
		var result = "";

		var cons = "";
		for(var i = 0; i < length; i++){
			cons = this.constantsSet[RandomInRange(0, this.constantsSet.length - 1)];
			// Re-roll if already in constants
			if(!result.includes(cons))
				result += cons;
			else
				i--;
		}

		return result;
	};

	this.GenerateRules = function(){

		var rules = [];
		var options = this.alphabet + this.constants;

		for(var i = 0; i < this.alphabet.length; i++){
			rules.push(this.CreateRule(this.alphabet[i], options));
		}

		return rules;
	};

	this.CreateRule = function(character, options){

		var length = RandomInRange(1, this.ruleRange);

		// Hack - only include pushes in initial set
		// Makes enforcing push / pop symmetry easier in a bit
		options = options.replace("]", "");

		var rule = "";
		for(var i = 0; i < length; i++){
			rule += options[RandomInRange(0, options.length - 1)];
		}

		// Match any pushes with pops
		rule = this.MatchPushes(rule);

		return [character, rule];
	};

	this.ChooseAxiom = function(options){

		var length = RandomInRange(0, this.axiomRange);

		var axiom = "";
		for(var i = 0; i < length; i++){
			axiom += options[RandomInRange(0, options.length - 1)];
		}

		axiom = this.MatchPushes(axiom);

		return axiom;
	};

	this.ChooseAngle = function(){
		return this.angles[RandomInRange(0, this.angles.length - 1)];
	};

	this.GenerateCommands = function(options) {

		var commands = [
			["Draw", 5],
			["Rotate", -this.angle],
			["Rotate", this.angle],
			["ChangeColor", null]
		];

		// Hack - remove push / pop from options set, don't want them to be random
		options = options.replace("[", "").replace("]","");

		var result = [];
		for(var i = 0; i < options.length; i++){

			var com = commands[RandomInRange(0, commands.length - 1)].slice();
			var color = this.colors[RandomInRange(0, this.colors.length - 1)];
			// Hack - hard coded check for randomizing color
			if(com[0] == "ChangeColor") com[1] = color;

			result.push({variable: options[i], command: com});
		}

		// Manually adding push / pop commands
		result.push({variable: "[", command: ["Push", null]});
		result.push({variable: "]", command: ["Pop", null]});

		return result;
	}

	// Iterate to find pushes, randomly add a matching pop later in string
	this.MatchPushes = function(string){

		var ind = string.indexOf('[');
		var insertAt = null;

		while(ind !== -1){
			insertAt = RandomInRange(ind + 1, string.length);
			string = string.slice(0, insertAt) + ']' + string.slice(insertAt);
			ind = string.indexOf('[', ind + 1);
		}

		return string;
	};
}