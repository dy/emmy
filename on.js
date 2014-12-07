/**
 * @module emmy/on
 */
module.exports = on;

var icicle = require('icicle');
var listeners = require('./listeners');
var redirect = require('./src/redirect');

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
	//parse args
	if (redirect(on, arguments)) return target;

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