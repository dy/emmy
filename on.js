/**
 * @module emmy/on
 */
module.exports = on;

var icicle = require('icicle');
var listeners = require('./listeners');
var isArray = require('mutype/is-array');


/**
 * Bind fn to the target
 *
 * @param {string} evt An event name
 * @param {Function} fn A callback
 * @chainable
 *
 * @return {object} A target
 */
function on(target, evt, fn){
	//bind all callbacks, if passed a list
	if (isArray(fn)){
		for (var i = fn.length; i--;){
			on(target, evt, fn[i]);
		}
		return target;
	}

	//bind all events, if passed a list
	if (isArray(evt)) {
		for (var i = evt.length; i--;){
			on(target, evt[i], fn);
		}
		return target;
	}

	//get target on method, if any
	var onMethod = target['on'] || target['addEventListener'] || target['addListener'];

	//use target event system, if possible
	if (onMethod) {
		//avoid self-recursions
		//if it’s frozen - ignore call
		if (icicle.freeze(target, 'on' + evt)){
			onMethod.call(target, evt, fn);
			icicle.unfreeze(target, 'on' + evt);
		}
		else {
			return target;
		}
	}

	//save the callback anyway
	listeners.add(target, evt, fn);


	return target;
}