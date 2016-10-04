/**
 * @module  emmy/not
 */

module.exports = not;

var on = require('./on');


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
	//swap params, if needed
	if (selector instanceof Function) {
		var tmp = selector;
		selector = fn;
		fn = tmp;
	}

	return on.wrap(target, evt, fn, function(e){
		var el = e.target;

		//if element is not in the DOM - ignore evt
		if (!target.contains(el)) return false;

		//If source element or anything in-between it and delegate element matches passed selector - ignore that event

		var res;
		if (typeof selector != 'string') {
			if (!selector.contains(el)) return false;
			res = selector;
		}
		//find at least one element in-between delegate target and event source
		else {
			res = el.closest && el.closest(selector);
		}

		if (res && target.contains(res)) return false;
		return true;
	});
};
