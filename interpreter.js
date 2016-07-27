'use strict'

var fp = require('lodash/fp')
var fs = require('fs')
var util = require('util')
var Slexer = require('slexer').default
var logger = require('log4js').getLogger()
logger.setLevel('debug')
logger.info('Running file: '+process.argv[2])

var standardLib = {
	print: (text)=>{
		console.log(text)
	},
	'+': (n1)=>{
		return (n2)=>n1+n2
	},
	'*': (n1)=>{
		return (n2)=>n1*n2
	},
	concat: (piece1)=>(piece2)=> ''+piece1+piece2,
	compose: fp.compose
}

const slexer = Slexer({
	lexicon: [':', ';', "'", 'print', ' ', '\t', '\n', ',', '\d+', '+', '*']
})

var types = ['string', 'number', 'function']

fs.createReadStream(process.argv[2]).pipe(slexer);

var evl = function(tokens){
	var nextToken = tokens.shift()
	logger.debug('evl called with next token of: '+util.inspect(nextToken))
	
	if(nextToken.lexeme == "'"){
		var string = ''
		while ( tokens.length != 0 ) {
			var stringPart = tokens.shift()
			if(stringPart.lexeme == "'"){
				logger.debug('parsed string: '+string)
				return {
					type: 'string',
					value: string
				}
			}
			string+=stringPart.lexeme
		}
	}
	if(nextToken.lexeme == ' ')
		throw new Error('whitespace encountered during parsing')
	if(nextToken.lexeme == '\t')
		throw new Error('whitespace encountered during parsing')
	if(nextToken.lexeme == ':' ){
		logger.debug('parsing function call')
		var args = []
		while ( tokens.length != 0 ) {
			var arg = evl(tokens)
			args.push(arg)
			var comma = tokens.shift()
			if(comma.lexeme == ';')
				break
			if(comma.lexeme != ',')
				throw new Error('Expected comma found lexeme:'+util.inspect(comma))
		}
		var fun = evl(tokens)
		if(fun.type != 'function')
			throw new Error(fun.type +' cannot be evaluated')
		logger.debug('applying with args: ')
		logger.debug(args)
		var returnVal = fun.value.apply(null, fp.map('value', args))
		return {
			type: typeof returnVal,
			value: returnVal  
		}
	}
	if(/^\d+$/.test(nextToken.lexeme)){
		logger.debug('found number: '+nextToken.lexeme)
		return {
			type: 'number',
			value: parseFloat(nextToken.lexeme)
		}
	}
	if(nextToken.lexeme == ','){
		throw Error('unexpected comma: '+util.inspect(nextToken))
	}
	var stdLibFunction = standardLib[nextToken.lexeme]
	if(stdLibFunction){
		logger.debug('found function: '+nextToken.lexeme)
		return {
			type:'function',
			value: stdLibFunction
		}
	}
	if(nextToken.end != true){
		logger.debug('falling off the end with token: ')
		console.log(nextToken)
	}

}

var tokens = []
slexer.on('readable', () => {
	let token = slexer.read();
	while (token) {
		tokens.push(token)
		token = slexer.read();
	}
});

slexer.on('end', function(){
	evl(fp.filter(token => !/^\s+$/.test(token.lexeme), tokens))
})
