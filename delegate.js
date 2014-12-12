/**
 * @module  emmy/delegate
 */

module.exports = delegate;

var redirect = require('./src/redirect');
var closest = typeof document !== 'undefined' ? require('query-relative/closest') : null;


/**
 * Bind listener to a target
 * listening for all events from it’s children matching selector
 *
 * @param {string} selector A selector to match against
 *
 * @return {function} A callback
 */
function delegate(target, evt, fn, selector){
	if (redirect(delegate, arguments)) return;
	if (!closest) return;

	return on(target, evt, fn, function(e){
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

			return true;
		}
	});
}