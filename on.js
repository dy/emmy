/**
 * @module emmy/on
 */


var icicle = require('icicle');
var listeners = require('./listeners');


module.exports = on;


/**
 * Bind fn to a target.
 *
 * @param {*} targte A single target to bind evt
 * @param {string} evt An event name
 * @param {Function} fn A callback
 * @param {Function}? condition An optional filtering fn for a callback
 *                              which accepts an event and returns callback
 *
 * @return {object} A target
 */
function on(target, evt, fn, condition){
	//get target on method, if any
	var onMethod = target['on'] || target['addEventListener'] || target['addListener'];

	var cb;

	//apply condition wrapper
	if (condition) {
		cb = on.wrap(fn, condition);
	} else {
		cb = fn;
	}

	//use target event system, if possible
	if (onMethod) {
		//avoid self-recursions
		//if it’s frozen - ignore call
		if (icicle.freeze(target, 'on' + evt)){
			onMethod.call(target, evt, cb);
			icicle.unfreeze(target, 'on' + evt);
		}
		else {
			return cb;
		}
	}

	//save the callback anyway
	listeners.add(target, evt, cb, condition);


	return cb;
}


/**
 * Wrap an fn with condition passing
 */
on.wrap = function(target, evt, fn, condition){
	var cb = function() {
		if (condition.apply(target, arguments)) {
			return fn.apply(target, arguments);
		}
	};

	cb.fn = fn;

	return cb;
}