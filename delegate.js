/**
 * @module  emmy/delegate
 */

module.exports = delegate;

var on = require('./on');
var isFn = require('is-function');
var contains = require('contains');
var isString = require('is-string');


/**
 * Bind listener to a target
 * listening for all events from it’s children matching selector
 *
 *
 * @param {string} selector A selector to match against
 *
 * @return {function} A callback
 */
function delegate(target, evt, fn, selector){
	return on(target, evt, delegate.wrap(target, evt, fn, selector));
}


delegate.wrap = function(target, evt, fn, selector){
	//ignore non-DOM
	if (!closest) return;

	//swap params, if needed
	if (isFn(selector)) {
		var tmp = selector;
		selector = fn;
		fn = tmp;
	}

	return on.wrap(target, evt, fn, function(e){
		var el = e.target;

		//deny self instantly
		if (el === target) return;


		//find at least one element in-between delegate target and event source
		var holderEl = isString(selector) ? el.closest(selector) : selector;

		if (holderEl && target !== holderEl && contains(target, holderEl)) {
			//save source of event
			e.delegateTarget = holderEl;
			return true;
		}
	});
};