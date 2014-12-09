/**
 * Export Emitter class with static API methods by default
 *
 * @module  emmy
 */

var Emmy = require('./Emitter');

var	on = require('./on'),
	off = require('./off'),
	once = require('./once'),
	emit = require('./emit'),
	listeners = require('./listeners');

//add static wrapper API
Emmy['on'] = function(a,b,c){
	on(a,b,c);
	return Emmy;
};
Emmy['once'] = function(a,b,c){
	once(a,b,c);
	return Emmy;
};
Emmy['off'] = function(a,b,c){
	off(a,b,c);
	return Emmy;
};
Emmy['emit'] = function(a,b,c,d){
	emit(a,b,c,d);
	return Emmy;
};
Emmy['listeners'] = listeners;
Emmy['hasListeners'] = function(a,b,c){
	return !!listeners(a,b,c).length;
};

module.exports = Emmy;