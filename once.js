/**
 * @module emmy/once
 */
module.exports = once;

var icicle = require('icicle');
var on = require('./on');
var off = require('./off');


/**
 * Add an event listener that will be invoked once and then removed.
 *
 * @return {target}
 */
function once(target, evt, fn){
	//get target once method, if any
	var onceMethod = target['once'] || target['one'] || target['addOnceEventListener'] || target['addOnceListener'];

	//use target event system, if possible
	if (onceMethod) {
		//avoid self-recursions
		if (icicle.freeze(target, 'one' + evt)){
			var res = onceMethod.call(target, evt, fn);

			//FIXME: save callback, just in case of removeListener
			// listeners.add(target, evt, fn);
			icicle.unfreeze(target, 'one' + evt);

			return res;
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

	return cb;
}