/**
 * Throttle function call.
 *
 * @module emmy/throttle
 */


module.exports = throttle;

var on = require('./on');
var off = require('./off');



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
function throttle (target, evt, fn, interval) {
	//FIXME: find cases where objects has own throttle method, then use target’s throttle

	//bind wrapper
	return on(target, evt, throttle.wrap(target, evt, fn, interval));
}


/** Return wrapped with interval fn */
throttle.wrap = function (target, evt, fn, interval) {
	//swap params, if needed
	if (interval instanceof Function) {
		var tmp = interval;
		interval = fn;
		fn = tmp;
	}

	//wrap callback
	var cb = function () {
		//opened state
		if (!cb.closedInterval) {
			//clear closed call flag
			cb.closedCall = false;

			//do call
			fn.apply(target, arguments);

			//close till the interval is passed
			cb.closedInterval = setTimeout(function () {
				//reset interval
				cb.closedInterval = null;

				//do after-call
				if (cb.closedCall) cb.apply(target, arguments);
			}, interval);
		}

		//closed state
		else {
			//if trigger happened during the pause - defer it’s call
			cb.closedCall = true;
		}
	};

	cb.fn = fn;

	return cb;
};
