/**
 * Emitter class to mixin/inherit emitters
 * Just like node Emitter or component/emitter.
 *
 * @module emmy/Emitter
 */

module.exports = Emitter;


var on = require('./on');
var off = require('./off');
var emit = require('./emit');
var once = require('./once');
var listeners = require('./listeners');

/**
 * @constructor
 *
 * Main Emitter interface.
 */
function Emitter(target){
	if (!target) return;

	//create emitter methods on target
	for (var meth in proto){
		target[meth] = proto[meth];
	}

	return target;
}

var proto = Emitter.prototype;


/** Prototype methods are whapper so to return target for chaining calls */
proto['on'] = function(a,b){
	on(this, a,b);
	return this;
};

proto['once'] = function(a,b){
	once(this, a,b);
	return this;
};

proto['off'] = function(a,b){
	off(this, a,b);
	return this;
};

proto['emit'] = function(a,b,c){
	emit(this, a,b,c);
	return this;
};

proto['listeners'] = function(a){
	return listeners(this, a);
};

proto['hasListeners'] = function(a){
	return !!listeners(this, a).length;
};