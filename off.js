/**
 * @module emmy/off
 */
module.exports = off;

var icicle = require('icicle');
var listeners = require('./listeners');
var redirect = require('./src/redirect');


/**
 * Remove listener[s] from the target
 *
 * @param {[type]} evt [description]
 * @param {Function} fn [description]
 *
 * @return {[type]} [description]
 */
function off(target, evt, fn){
	//parse args
	if (redirect(off, arguments)) return target;

	var callbacks, i;

	//unbind all listeners if no fn specified
	if (fn === undefined) {
		//try to use target removeAll method, if any
		var allOff = target['removeAll'] || target['removeAllListeners'];

		//call target removeAll
		if (allOff) {
			allOff.call(target, evt, fn);
		}

		//then forget own callbacks, if any
		callbacks = listeners(target);

		//unbind all if no evtRef defined
		if (evt === undefined) {
			for (var evtName in callbacks) {
				off(target, evtName, callbacks[evtName]);
			}
		}
		else if (callbacks[evt]) {
			off(target, evt, callbacks[evt]);
		}

		return target;
	}


	//target events (string notation to advanced_optimizations)
	var offMethod = target['off'] || target['removeEventListener'] || target['removeListener'];


	//use target `off`, if possible
	if (offMethod) {
		//avoid self-recursion from the outside
		if (icicle.freeze(target, 'off' + evt)){
			offMethod.call(target, evt, fn);
			icicle.unfreeze(target, 'off' + evt);
		}

		//if it’s frozen - ignore call
		else {
			return target;
		}
	}


	//forget callback
	var evtCallbacks = listeners(target, evt);

	//remove specific handler
	for (i = 0; i < evtCallbacks.length; i++) {
		//once method has original callback in .fn
		if (evtCallbacks[i] === fn || evtCallbacks[i].fn === fn) {
			evtCallbacks.splice(i, 1);
			break;
		}
	}

	return target;
}


