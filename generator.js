function Generator(){

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

		var length = RandomInRange(2, 10);
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

		var length = RandomInRange(1, 3);
		//var useStack = Math.round(Math.random());
		var symbols = "+-|["
		var constants = "";

		var cons = "";
		for(var i = 0; i < length; i++){
			cons = symbols[RandomInRange(0, symbols.length - 1)];
			// Re-roll if already in constants
			if(!constants.includes(cons))
				constants += cons;
			else
				i--;
		}

		return constants;
	};

	this.GenerateRules = function(){

		var rules = [];
		var options = this.alphabet + this.constants;
		console.log("Options: " + options);

		for(var i = 0; i < this.alphabet.length; i++){
			rules.push(this.CreateRule(this.alphabet[i], options));
		}

		return rules;
	};

	this.CreateRule = function(character, options){

		var length = RandomInRange(1, 6);
		var rule = "";

		for(var i = 0; i < length; i++){
			rule += options[RandomInRange(0, options.length - 1)];
		}

		console.log("Raw rule: " + rule);

		// Match any pushes with pops
		rule = this.MatchPushes(rule);

		var result = [];
		result[0] = character;
		result[1] = rule;

		return [character, rule];
	};

	this.ChooseAxiom = function(options){

		var length = RandomInRange(0, 3);

		var axiom = "";
		for(var i = 0; i < length; i++){
			axiom += options[RandomInRange(0, options.length - 1)];
		}

		axiom = this.MatchPushes(axiom);

		return axiom;
	};

	this.ChooseAngle = function(){
		var angles = [36, 45, 60, 90, 120];
		return angles[RandomInRange(0, angles.length - 1)];
	};

	this.GenerateCommands = function(options) {

		var commands = [
			["Draw", 5],
			["Rotate", -this.angle],
			["Rotate", this.angle]
		];

		options = options.replace("\\[", "").replace("\\]","");

		var result = [];
		for(var i = 0; i < options.length; i++){
			result.push({variable: options[i], command: commands[RandomInRange(0, commands.length - 1)]});
		}

		result.push({variable: "[", command: ["Push", null]});
		result.pop({variable: "]", command: ["Push", null]});

		return result;
	}

	this.MatchPushes = function(string){

		var ind = string.indexOf('[');
		var insertAt = null;

		while(ind !== -1){
			insertAt = RandomInRange(ind, string.length);
			string = string.slice(0, insertAt) + ']' + string.slice(insertAt);
			ind = string.indexOf('[', ind + 1);
		}

		return string;
	};
}