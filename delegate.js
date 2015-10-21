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


delegate.wrap = function (container, evt, fn, selector) {
	//swap params, if needed
	if (isFn(selector)) {
		var tmp = selector;
		selector = fn;
		fn = tmp;
	}

	return on.wrap(container, evt, fn, function cb(e) {
		var srcEl = e.target;

		//deny self instantly
		if (srcEl === container) {
			return;
		}

		//wrap to detect list of selectors
		if (!isArrayLike(selector)) {
			selector = [selector];
		}

		return selector.some(function (selector) {
			var delegateTarget;
			if (!isString(selector)) {
				if (!selector.contains(srcEl)) return false;
				delegateTarget = selector;
			}
			//find at least one element in-between delegate target and event source
			else {
				delegateTarget = srcEl.closest && srcEl.closest(selector);
			}

			if (delegateTarget && container !== delegateTarget && container.contains(delegateTarget)) {
				//save source of event
				e.delegateTarget = delegateTarget;
				return true;
			}

			return false;
		});
	});
};