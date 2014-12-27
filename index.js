/**
 * Event Emitter.
 *
 * @module  emmy
 */


//TODO: normalize cross-browser events like animationend
//TODO: implement unobtrusize approach to store callbacks (unlike component-emitter)
//TODO: implement classes scoping


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


module.exports = Emmy;