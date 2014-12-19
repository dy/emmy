/**
 * Throttle function call.
 *
 * @module emmy/throttle
 */


module.exports = throttle;

var on = require('./on');
var off = require('./off');
var isFn = require('mutype/is-fn');



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
	//FIXME: find cases where objects has own throttle method, then use target’s throttle

	//bind wrapper
	return on(target, evt, throttle.wrap(target, evt, fn, interval));
}


/** Return wrapped with interval fn */
throttle.wrap = function(target, evt, fn, interval){
	//swap params, if needed
	if (isFn(interval)) {
		var tmp = interval;
		interval = fn;
		fn = tmp;
	}

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

	return cb;
};