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
	listeners = require('./listeners');


//add static wrapper API
var on = Emmy['on'] = function(a,b,c,d){
	_on(a,b,c,d);
	return this;
};
var once = Emmy['once'] = function(a,b,c,d){
	_once(a,b,c,d);
	return this;
};
var off = Emmy['off'] = function(a,b,c){
	_off(a,b,c);
	return this;
};
var emit = Emmy['emit'] = function(){
	_emit.apply(this, arguments);
	return this;
};
var delegate = Emmy['delegate'] = function(a,b,c,d){
	_delegate(a,b,c,d);
	return this;
};
var later = Emmy['later'] = function(a,b,c,d){
	_later(a,b,c,d);
	return this;
};
var keypass = Emmy['keypass'] = function(a,b,c,d){
	_keypass(a,b,c,d);
	return this;
};
var throttle = Emmy['throttle'] = function(a,b,c,d){
	_throttle(a,b,c,d);
	return this;
};
var not = Emmy['not'] = function(a,b,c,d){
	_not(a,b,c,d);
	return this;
};

Emmy['listeners'] = listeners;
Emmy['hasListeners'] = function(a,b,c){
	return !!listeners(a,b,c).length;
};

module.exports = Emmy;