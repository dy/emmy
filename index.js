/**
 * Export Emitter class with static API methods by default
 *
 * @module  emmy
 */


//TODO: normalize cross-browser events like animationend
//TODO: handle redirects in emitter


var Emmy = require('./Emitter');


var	_on = require('./on'),
	_off = require('./off'),
	_once = require('./once'),
	_emit = require('./emit'),
	_keypass = require('./keypass'),
	_throttle = require('./throttle'),
	_later = require('./later'),
	_delegate = require('./delegate'),
	_not = require('./not'),
	listeners = require('./listeners'),
	invoke = require('./src/invoke');


//add static wrapper API
var on = Emmy['on'] = function(){
	invoke(_on, arguments);
	return Emmy;
};
var once = Emmy['once'] = function(){
	invoke(_once, arguments);
	return Emmy;
};
var off = Emmy['off'] = function(){
	invoke(_off, arguments);
	return Emmy;
};
var emit = Emmy['emit'] = function(){
	invoke(_emit, arguments, true);
	return Emmy;
};
var delegate = Emmy['delegate'] = function(){
	invoke(_delegate, arguments);
	return Emmy;
};
var later = Emmy['later'] = function(){
	invoke(_later, arguments);
	return Emmy;
};
var keypass = Emmy['keypass'] = function(){
	invoke(_keypass, arguments);
	return Emmy;
};
var throttle = Emmy['throttle'] = function(){
	invoke(_throttle, arguments);
	return Emmy;
};
var not = Emmy['not'] = function(){
	invoke(_not, arguments);
	return Emmy;
};

Emmy['listeners'] = listeners;
Emmy['hasListeners'] = function(a,b,c){
	return !!listeners(a,b,c).length;
};

module.exports = Emmy;