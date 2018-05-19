let randomWords = require('random-words'),
	fs = require('fs');

// Settings/defaults
let numKeyVals = 100,
	types = ['word', 'words', 'string', 'integer', 'decimal', 'date', 'boolean', 'null'];
	filename = 'result.json',
	wordsMin = 1,
	wordsMax = 10,
	stringMin = 1,
	stringMax = 100,
	integerMin = 0,
	integerMax = 1000000000,
	decimalMin = 0,
	decimalMax = 1000000,
	dateMin = new Date(1900, 0, 1),
	dateMax = new Date();

// Functions for generating different values

function getWord() {
	return randomWords({ exactly: 1, join: ' ' });
}

function getWords(num) {
	num = num ? num : getInteger(wordsMin, wordsMax);
	return randomWords({ exactly: num, join: ' ' });
}

function getString(minLen) {
	minLen = minLen ? minLen : getInteger(stringMin, stringMax);
	let str = '';
	while (minLen >= str.length) {
		str += randomWords();
	}
	return str;
}

// Integers and decimals: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getInteger(min, max) {
	min = min ? min : integerMin;
	max = max ? max : integerMax;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDecimal(min, max) {
	min = min ? min : decimalMin;
	max = max ? max : decimalMax;
	return Math.random() * (max - min) + min;
}

// Dates: https://stackoverflow.com/questions/9035627/elegant-method-to-generate-array-of-random-dates-within-two-dates
function getDate(min, max) {
	min = min ? min : dateMin;
	max = max ? max : dateMax;
	return new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
}

function getBoolean() {
	return getInteger(0, 1) === 0;
}

function getNull() {
	return null;
}

function getType() {
	return types[getInteger(0, types.length-1)];
}

function getRandom() {
	let result = '';
	switch(getType()) {
	    case 'word':
	        result = '"' + getWord() + '"';
	        break;
	    case 'words':
	        result = '"' + getWords() + '"';
	        break;
	    case 'string':
	        result = '"' + getString() + '"';
	        break;
	    case 'integer':
	        result = getInteger();
	        break;
	    case 'decimal':
	        result = getDecimal();
	        break;
	    case 'date':
	        result = '"' + getDate() + '"';
	        break;
	    case 'boolean':
	        result = getBoolean();
	        break;
	    case 'null':
	        result = getNull();
	        break;
	    default:
	        break;
	}
	return result;
} 

// Generate and save random JSON file

let json = '{\n';
let arr = [];
for (let i = 0; i <= numKeyVals; i++) {
	let kv = '"' + getWord() + '"'; // key
	kv += ': ';
	kv += getRandom(); // value
	arr.push(kv);
}
json += arr.join(',\n');
json += '\n}\n';

let file = __dirname + '/' + filename;

fs.writeFile(file, json, function(err) {
    if(err) { return console.log(err); }
    console.log('Saved: ' + file);
}); 
