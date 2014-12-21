/**
 * Export Emitter class with static API methods by default
 *
 * @module  emmy
 */


//TODO: normalize cross-browser events like animationend
//TODO: handle arg redirects in Emitter



var	on = require('./on'),
	off = require('./off'),
	once = require('./once'),
	emit = require('./emit'),
	// keypass = require('./keypass'),
	// throttle = require('./throttle'),
	// later = require('./later'),
	// delegate = require('./delegate'),
	// not = require('./not'),
	slice = require('sliced'),
	emitter = require('component-emitter').prototype;



/**
 * @constructor
 *
 * Main Emitter interface.
 */
function Emmy(target){
	if (!target) return;

	//create emitter methods on target
	for (var meth in proto){
		target[meth] = proto[meth];
	}

	return target;
}

var proto = Emmy.prototype = Object.create(emitter);


/* Return chaining method */
function getWrappedMethod(fn){
	return function(){
		fn.apply(this, [this].concat(slice(arguments)));
		return this;
	};
}

/* Return chaining fn */
function getWrapped(fn){
	return function(){
		fn.apply(this, arguments);
		return this;
	};
}


/** Prototype methods are wrapped so to return target for chaining calls */
proto.on = getWrappedMethod(on);
proto.once = getWrappedMethod(once);
proto.off = getWrappedMethod(off);
proto.emit = getWrappedMethod(emit);


//add static API
Emmy.on = getWrapped(on);
Emmy.once = getWrapped(once);
Emmy.off = getWrapped(off);
Emmy.emit = getWrapped(emit);
Emmy.listeners = getWrapped(emitter.listeners);
Emmy.hasListeners = getWrapped(emitter.hasListeners);


module.exports = Emmy;