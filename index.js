/**
 * Event Emitter.
 *
 * @module  emmy
 */


var	on = require('./on'),
	off = require('./off'),
	once = require('./once'),
	emit = require('./emit'),
	listeners = require('./listeners'),
	keypass = require('./keypass'),
	throttle = require('./throttle'),
	later = require('./later'),
	delegate = require('./delegate'),
	not = require('./not'),
	slice = require('sliced');


//TODO: pass context as a last argument


/**
 * Emitter class.
 *
 * @constructor
 */
function Emmy(target){
	if (!target) return;

	//create emitter methods on target
	for (var meth in proto){
		target[meth] = proto[meth];
	}

	return target;
}

var proto = Emmy.prototype;


/** Return chaining method */
function getWrappedMethod(fn){
	return function(){
		fn.apply(this, [this].concat(slice(arguments)));
		return this;
	};
}


/** Prototype methods are wrapped so to return target for chaining calls */
proto.on = getWrappedMethod(on);
proto.once = getWrappedMethod(once);
proto.off = getWrappedMethod(off);
proto.emit = getWrappedMethod(emit);
proto.listeners = function(a){
	return listeners(this, a);
};
proto.hasListeners = function(a){
	return !!listeners(this, a).length;
};


/**
 * Provide static methods
 */
Emmy.on = on;
Emmy.off = off;
Emmy.once = once;
Emmy.emit = emit;
Emmy.listeners = listeners;
Emmy.keypass = keypass;
Emmy.throttle = throttle;
Emmy.later = later;
Emmy.delegate = delegate;
Emmy.not = not;
Emmy.slice = slice;


module.exports = Emmy;