/**
 * Export Emitter class with static API methods by default
 *
 * @module  emmy
 */

var Emmy = require('./Emitter');

var	_on = require('./on'),
	_off = require('./off'),
	_once = require('./once'),
	_emit = require('./emit'),
	listeners = require('./listeners'),
	redirect = require('./src/redirect');

//add static wrapper API
var on = Emmy['on'] = function(a,b,c){
	if (redirect(on, arguments)) return Emmy;
	_on.apply(this, arguments);
	return Emmy;
};
var once = Emmy['once'] = function(a,b,c){
	if (redirect(once, arguments)) return Emmy;
	_once(a,b,c);
	return Emmy;
};
var off = Emmy['off'] = function(a,b,c){
	if (redirect(off, arguments)) return Emmy;
	_off(a,b,c);
	return Emmy;
};
var emit = Emmy['emit'] = function(a,b,c,d){
	if (redirect(emit, arguments, true)) return Emmy;
	_emit.apply(this, arguments);
	return Emmy;
};

Emmy['listeners'] = listeners;
Emmy['hasListeners'] = function(a,b,c){
	return !!listeners(a,b,c).length;
};

module.exports = Emmy;