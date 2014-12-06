/**
 * @module emmy/once
 */
module.exports = once;

var icicle = require('icicle');
var isArrayLike = require('mutype/is-array-like');
var listeners = require('./listeners');
var off = require('./off');
var on = require('./on');


/**
 * Add an event listener that will be invoked once and then removed.
 *
 * @return {target}
 * @chainable
 */
function once(target, evt, fn){
	//bind all callbacks, if passed a list
	if (isArrayLike(fn)){
		for (var i = fn.length; i--;){
			once(target, evt, fn[i]);
		}
		return target;
	}

	//bind all events, if passed a list
	if (isArrayLike(evt)) {
		for (var i = evt.length; i--;){
			once(target, evt[i], fn);
		}
		return target;
	}

	//bind all targets, if passed a list
	if (isArrayLike(target)) {
		for (var i = target.length; i--;){
			once(target[i], evt, fn);
		}
		return target;
	}

	//get target once method, if any
	var onceMethod = target['once'] || target['one'] || target['addOnceEventListener'] || target['addOnceListener'];

	//use target event system, if possible
	if (onceMethod) {
		//avoid self-recursions
		if (icicle.freeze(target, 'one' + evt)){
			onceMethod.call(target, evt, fn);

			//FIXME: save callback, just in case of removeListener
			// listeners.add(target, evt, fn);
			icicle.unfreeze(target, 'one' + evt);

			return target;
		}

		//if still called itself second time - do default routine
	}

	//use own events
	//wrap callback to once-call
	var cb = function() {
		off(target, evt, cb);
		fn.apply(target, arguments);
	};

	cb.fn = fn;

	//bind wrapper default way - in case of own emit method
	on(target, evt, cb);

	return target;
};