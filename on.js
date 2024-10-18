/**
 * @module emmy/on
 */
'use strict'

var icicle = require('icicle');
var listeners = require('./listeners');
var off = require('./off')

module.exports = on;


/**
 * Bind fn to a target.
 *
 * @param {*} targte A single target to bind evt
 * @param {string} evt An event name
 * @param {Function} fn A callback
 * @param {Function}? condition An optional filtering fn for a callback
 *                              which accepts an event and returns callback
 *
 * @return {object} A target
 */
function on(target, evt, cb, o = {}) {
	if (!target) return target;

	// wrap delegate
	if (typeof target === 'string' || o.target) {
		while (cb.__wrapFn) cb = cb.__wrapFn;

		var selector = target
		target = o.target || document
		cb.__wrapFn = delegate.bind({ target: target, selector: selector, cb: cb });
		cb.__wrapFn.__origFn = cb;
		cb = cb.__wrapFn;
	}

	if (!Array.isArray(evt)) evt = (evt + '').split(/\s+/)

	// get target `on` method, if any
	// prefer native method name
	var onMethod = target.addEventListener || target.addListener || target.attachEvent || target.on;

	// invoke method for each space-separated event from a list
	evt.forEach(function (evt) {
		var evtParts = evt.split('.');
		evt = evtParts.shift();

		// use target event system, if possible
		if (onMethod) {
			// avoid self-recursions
			// if it is frozen - ignore call
			// FIXME: do better by comparing with self
			if (icicle.freeze(target, 'on' + evt)) {
				onMethod.call(target, evt, cb);
				icicle.unfreeze(target, 'on' + evt);
			}
			else {
				return target;
			}
		}

		// save the callback
		listeners.add(target, evt, cb, evtParts);
	});

	return function () { off(target, evt, cb) };
}

function delegate(e) {
	var cb = this.cb;
	var selector = this.selector;
	var container = this.target;

	var srcEl = e.target;

	//deny self instantly
	if (srcEl === container) {
		return;
	}

	//wrap to detect list of selectors
	if (!Array.isArray(selector)) {
		selector = [selector];
	}

	if (selector.some(function (selector) {
		var delegateTarget;
		if (typeof selector != 'string') {
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
	})) {
		cb.apply(srcEl, arguments)
	}
}
