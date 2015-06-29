/**
 * @module  emmy/delegate
 */

module.exports = delegate;

var on = require('./on');
var isFn = require('is-function');
var isString = require('mutype/is-string');
var isArrayLike = require('mutype/is-array-like');


/**
 * Bind listener to a target
 * listening for all events from it’s children matching selector
 *
 *
 * @param {string} selector A selector to match against
 *
 * @return {function} A callback
 */
function delegate (target, evt, fn, selector) {
	return on(target, evt, delegate.wrap(target, evt, fn, selector));
}


delegate.wrap = function (target, evt, fn, selector) {
	//swap params, if needed
	if (isFn(selector)) {
		var tmp = selector;
		selector = fn;
		fn = tmp;
	}

	return on.wrap(target, evt, fn, function cb(e) {
		var el = e.target;

		//deny self instantly
		if (el === target) {
			return;
		}

		//wrap to detect list of selectors
		if (!isArrayLike(selector)) {
			selector = [selector];
		}

		return selector.some(function (selector) {
			//find at least one element in-between delegate target and event source
			var holderEl = isString(selector) ? el.closest(selector) : selector;

			if (holderEl && target !== holderEl && target.contains(holderEl)) {
				//save source of event
				e.delegateTarget = holderEl;
				return true;
			}
		});
	});
};