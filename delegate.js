/**
 * @module  emmy/delegate
 */

module.exports = delegate;

var on = require('./on');
var off = require('./off');
var redirect = require('./src/redirect');
var closest = require('query-relative/closest');


/**
 * Bind listener to a target
 * listening for all events from it’s children matching selector
 *
 * @param {string} selector A selector to match against
 *
 * @return {function} A callback
 */
function delegate(target, evt, fn, selector){
	if (redirect(throttle, arguments)) return;

	var cb = function(e){
		var el = e.target;

		var holderEl = closest(el, selector);

		if (holderEl) {
			//save source of event
			e.delegateTarget = el;

			//NOTE: PhantomJS && IE8 fails on that:
			// evt.currentTarget = el;
			// Object.defineProperty(evt, 'currentTarget', {
			// 	get: function(){
			// 		return el;
			// 	}
			// });

			return fn.apply(this, arguments);
		}
	};

	cb.fn = fn;

	on(target, evt, cb);

	return cb;
}