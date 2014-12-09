/**
 * @module  emmy/delay
 */

module.exports = delay;


/**
 * Postpone callback call for N ms
 *
 * @return {Function} Wrapped handler
 */
function delay(target, evt, fn, interval) {
	var cb = function(){
		var args = arguments;
		var self = this;

		setTimeout(function(){
			fn.apply(self, args);
		}, interval);
	};

	cb.fn = fn;

	on(target, evt, cb);

	return cb;
}