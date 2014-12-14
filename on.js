/**
 * @module emmy/on
 */
module.exports = on;


var icicle = require('icicle');
var listeners = require('./listeners');


/**
 * Bind fn to the target
 *
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
		cb = function(){
			if (condition.apply(this, arguments)) {
				return fn.apply(this, arguments);
			}
		};
		cb.fn = fn;
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
			return;
		}
	}

	//save the callback anyway
	listeners.add(target, evt, cb);


	return;
}