/**
 * @module emmy/off
 */
'use strict'

module.exports = off;

var icicle = require('icicle');
var listeners = require('./listeners');

/**
 * Remove listener[s] from the target
 *
 * @param {[type]} evt [description]
 * @param {Function} fn [description]
 *
 * @return {[type]} [description]
 */
function off(target, evt, fn) {
	if (!target) return target;

	var callbacks, i;

	// unbind all listeners if no fn specified
	if (fn === undefined) {
		var args = [].slice.call(arguments, 1);

		// try to use target removeAll method, if any
		var allOff = target.removeAll || target.removeAllListeners;

		// call target removeAll
		if (allOff) {
			allOff.apply(target, args);
		}

		// then forget own callbacks, if any

		// unbind all evts
		if (!evt) {
			callbacks = listeners.get(target);
			for (evt in callbacks) {
				off(target, evt);
			}
			return target
		}

		// unbind passed callback from all listeners
		if (typeof evt === 'function') {
			fn = evt
			evt = null
			callbacks = listeners.get(target);
			for (evt in callbacks) {
				if (callbacks[evt].indexOf(fn) >= 0) {
					off(target, evt, fn)
				}
			}
			return target
		}

		// unbind all callbacks for an evt
		evt = '' + evt;

		// invoke method for each space-separated event from a list
		evt.split(/\s+/).forEach(function (evt) {
			var evtParts = evt.split('.');
			evt = evtParts.shift();
			callbacks = listeners.get(target, evt, evtParts);

			// returned array of callbacks (as event is defined)
			if (evt) {
				var obj = {};
				obj[evt] = callbacks;
				callbacks = obj;
			}

			// for each group of callbacks - unbind all
			for (var evtName in callbacks) {
				[].slice.call(callbacks[evtName]).forEach(function (cb) {
					off(target, evtName, cb);
				});
			}
		});

		return target;
	}

	if (!Array.isArray(evt)) evt = (evt + '').split(/\s+/)

	// target events (string notation to advanced_optimizations)
	var offMethod = target.removeEventListener || target.removeListener || target.detachEvent || target.off;

	// invoke method for each space-separated event from a list
	evt.forEach(function (evt) {
		var evtParts = evt.split('.');
		evt = evtParts.shift();

		// use target `off`, if possible
		if (offMethod) {
			// avoid self-recursion from the outside
			if (icicle.freeze(target, 'off' + evt)) {
				offMethod.call(target, evt, fn);
				icicle.unfreeze(target, 'off' + evt);
			}

			// if it’s frozen - ignore call
			else {
				return target;
			}
		}

		// forget callback
		listeners.remove(target, evt, fn, evtParts);
	});

	if (fn.__wrapFn) {
		var cb = fn.__wrapFn;
		fn.__wrapFn = null;
		off(target, evt, cb)
	}
	if (fn.__origFn) {
		var cb = fn.__origFn;
		fn.__origFn = null;
		off(target, evt, cb)
	}

	return target;
}
