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


proto['on'] = function(a,b){
	return on(this, a,b);
};

proto['once'] = function(a,b){
	return once(this, a,b);
};

proto['off'] = function(a,b){
	return off(this, a,b);
};

proto['emit'] = function(a,b,c){
	return emit(this, a,b,c);
};

proto['listeners'] = function(a){
	return listeners(this, a);
};

proto['hasListeners'] = function(a){
	return !!listeners(this, a).length;
};