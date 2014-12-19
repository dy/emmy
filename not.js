/**
 * @module  emmy/not
 */

module.exports = not;

var on = require('./on');
var closest = typeof document !== 'undefined' ? require('query-relative/closest') : null;
var isFn = require('mutype/is-fn');
var contains = require('contains');


/**
 * Bind listener to a target
 * listening for all events from it’s children matching selector
 *
 * @param {string} selector A selector to match against
 *
 * @return {function} A callback
 */
function not(target, evt, fn, selector){
	return on(target, evt, not.wrap(target, evt, fn, selector));
}


/** Return wrapper calling fn in case if selector passes */
not.wrap = function(target, evt, fn, selector){
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

		//if element is not in the DOM - ignore evt
		if (!contains(target, el)) return false;

		//If source element or anything in-between it and delegate element matches passed selector - ignore that event

		var res = closest(el, selector);
		if (res && contains(target, res)) return false;
		return true;
	});
};