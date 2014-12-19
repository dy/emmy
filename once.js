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
	if (!target) return;

	//get target once method, if any
	var onceMethod = target['once'] || target['one'] || target['addOnceEventListener'] || target['addOnceListener'], cb;


	//use own events
	//wrap callback to once-call
	cb = once.wrap(target, evt, fn, off);


	//invoke method for each space-separated event from a list
	evt.split(/\s+/).forEach(function(evt){
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

		//bind wrapper default way - in case of own emit method
		on(target, evt, cb);
	});

	return cb;
}


/** Return once wrapper, with optional special off passed */
once.wrap = function (target, evt, fn, off) {
	var cb = function() {
		off(target, evt, cb);
		fn.apply(target, arguments);
	};

	cb.fn = fn;

	return cb;
};