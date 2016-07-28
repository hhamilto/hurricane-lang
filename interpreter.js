'use strict'


var Lexer = require('simpler-lexer').default
var fp = require('lodash/fp')
var fs = require('fs')
var util = require('util')
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
	'/': (n1)=>{
		return (n2)=>Math.floor(n1/n2)
	},
	'-': (n1)=>{
		return (n2)=>n1-n2
	},
	'%': (n1)=>{
		return (n2)=>n1%n2
	},
	'=': (n1)=>{
		return (n2)=>n1==n2
	},
	concat: piece1=>piece2=> ''+piece1+piece2,
	compose: fp.compose,
	if: trueFun=>falseFun=>boolean=>boolean?trueFun():falseFun(),
	wrap: fun=>{
		return args=>{
			return ()=>fun.apply(null, args)
		}
	},
	cons: list=>{
		if(list instanceof Array)
			return item=>list.concat(item)
		else
			return [list]
	},
	list: function(){
		return Array.prototype.slice.call(arguments)
	}
}

let lexer = new Lexer([
	{name:'startFunctionCallArgs', rule: /:/},
	{name:'endFunctionCallArgs', rule: /;/},
	{name:'argSeparator', rule: /,/},
	{name:'string', rule: /'[^']*'/},
	{name:'whitespace', rule: /\s+/},
	{name:'number', rule: /\d+/},
	{name:'functionIdentifier', rule: /(\w+|\+|\*|\/|-|%|=)/}
])


var types = ['string', 'number', 'function', 'list']


var evl = function(tokens){
	var nextToken = tokens.shift()
	logger.debug('evl called with next token of: '+nextToken.value+' '+nextToken.type)
	
	if(nextToken.type == "string"){
		return {
			type:'string',
			value: nextToken.value.slice(1,-1)//trim dem quotes
		}
	}
	if(nextToken.type == 'startFunctionCallArgs' ){
		logger.debug('parsing function call')
		var args = []
		while ( tokens.length != 0 ) {
			var arg = evl(tokens)
			if(arg.type != 'backup')
				args.push(arg)
			var comma = tokens.shift()
			if(comma.type == 'endFunctionCallArgs')
				break
			if(comma.type != 'argSeparator')
				throw new Error('Expected comma found value:'+util.inspect(comma))
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
	if(nextToken.type == 'number'){
		logger.debug('found number: '+nextToken.value)
		return {
			type: 'number',
			value: parseFloat(nextToken.value)
		}
	}
	if(nextToken.type == 'argSeparator'){
		throw Error('unexpected comma: '+util.inspect(nextToken))
	}
	if(nextToken.type == 'endFunctionCallArgs'){
		tokens.unshift(nextToken)
		return {
			type: 'backup',
			value: null
		}
	}
	if(nextToken.type == 'functionIdentifier'){
		var stdLibFunction = standardLib[nextToken.value]
		if(stdLibFunction){
			logger.debug('found function: '+nextToken.value)
			return {
				type:'function',
				value: stdLibFunction
			}
		}
		throw new Error('Could not find function with name: '+nextToken.value)
	}
	if(nextToken.end != true){
		logger.debug('falling off the end with token: ')
		logger.debug(nextToken)
	}

}

var tokens = lexer.tokenize(fs.readFileSync(process.argv[2]).toString())
evl(fp.filter(token=>token.type!='whitespace')(tokens))