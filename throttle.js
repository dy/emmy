/**
 * Throttle function call.
 *
 * @module emmy/throttle
 */

module.exports = throttle;

var on = require('./on');
var off = require('./off');
var redirect = require('./src/redirect');



/**
 * Throttles call by rebinding event each N seconds
 *
 * @param {Object} target Any object to throttle
 * @param {string} evt An event name
 * @param {Function} fn A callback
 * @param {int} interval A minimum interval between calls
 *
 * @return {Function} A wrapped callback
 */
function throttle(target, evt, fn, interval){
	if (redirect(throttle, arguments)) return;

	//FIXME: find cases where objects has own throttle method, then use target’s throttle

	//wrap callback
	var cb = function() {
		//do call
		fn.apply(target, arguments);

		//ignore calls
		off(target, evt, cb);

		//till the interval is passed
		setTimeout(function(){
			on(target, evt, cb);
		}, interval);
	};

	cb.fn = fn;

	//bind wrapper
	on(target, evt, cb);

	return cb;
}