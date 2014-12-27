/**
 * @module emmy/off
 */
module.exports = off;

var icicle = require('icicle');
var slice = require('sliced');
var listeners = require('./listeners');


/**
 * Remove listener[s] from the target
 *
 * @param {[type]} evt [description]
 * @param {Function} fn [description]
 *
 * @return {[type]} [description]
 */
function off(target, evt, fn){
	if (!target) return target;

	var callbacks, i;

	//unbind all listeners if no fn specified
	if (fn === undefined) {
		var args = slice(arguments, 1);

		//try to use target removeAll method, if any
		var allOff = target['removeAll'] || target['removeAllListeners'];

		//call target removeAll
		if (allOff) {
			allOff.apply(target, args);
		}


		//then forget own callbacks, if any
		//FIXME: find better way to access target callbacks
		callbacks = listeners(target);

		//ignore empty callbacks
		if (!callbacks) return;

		//unbind all evts
		if (!evt) {
			for (evt in callbacks) {
				off(target, evt);
			}
		}
		//unbind all callbacks for an evt
		else {
			//invoke method for each space-separated event from a list
			evt.split(/\s+/).forEach(function(evt){
				if (callbacks[evt]) {
					for (var i = callbacks[evt].length; i--;){
						off(target, evt, callbacks[evt][i]);
					}
				}
			});
		}

		return target;
	}


	//target events (string notation to advanced_optimizations)
	var offMethod = target['off'] || target['removeEventListener'] || target['removeListener'];


	//invoke method for each space-separated event from a list
	evt.split(/\s+/).forEach(function(evt){

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
	});


	return target;
}