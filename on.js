/**
 * @module emmy/on
 */
'use strict'

var icicle = require('icicle');
var listeners = require('./listeners');
var isObject = require('is-plain-obj');

module.exports = on;


var doc = global.document;


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
function on(target, evt, cb, o){
	if (!target) return target;

	// swap last two arguments
	if (typeof o === 'function') {
		var tmp = o;
		o = cb;
		cb = tmp;
	}

	if (typeof o === 'number') {
		o = { throttle: o }
	}
	else if (typeof o === 'string' || (doc && ((o instanceof Node) || Array.isArray(o)))) {
		o = { delegate: o }
	}

	// wrap throttle/delegate
	if (o) {
		while (cb.__wrapFn) cb = cb.__wrapFn;
		if (o.throttle != null) {
			cb.__wrapFn = throttle.bind({target: target, o: o, cb: cb});
			cb.__wrapFn.__origFn = cb;
			cb = cb.__wrapFn;
		}
		if (o.delegate != null) {
			cb.__wrapFn = delegate.bind({target: target, o: o, cb: cb});
			cb.__wrapFn.__origFn = cb;
			cb = cb.__wrapFn;
		}
	}

	//consider object of events
	if (isObject(evt)) {
		for(var evtName in evt) {
			on(target, evtName, evt[evtName]);
		}
		return target;
	}

	if (!Array.isArray(evt)) evt = (evt + '').split(/\s+/)

	// get target `on` method, if any
	// prefer native method name
	var onMethod =  target.addEventListener || target.addListener || target.attachEvent || target.on;

	// invoke method for each space-separated event from a list
	evt.forEach(function (evt) {
		var evtParts = evt.split('.');
		evt = evtParts.shift();

		// use target event system, if possible
		if (onMethod) {
			// avoid self-recursions
			// if it is frozen - ignore call
			// FIXME: do better by comparing with self
			if (icicle.freeze(target, 'on' + evt)){
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

	return target;
}



// callback wrappers to enable utility
function throttle (e) {
	var cb = this.cb;
	var interval = this.o.throttle;
	var target = this.target;

	//opened state
	if (!cb.__blocked) {
		//do call
		cb.apply(target, arguments);

		var self = this

		//close till the interval is passed
		cb.__blocked = setTimeout(function () {
			//reset interval
			cb.__blocked = false;

			//do after-call
			if (cb.__planned) {
				throttle.apply(self, arguments);
				cb.__planned = null;
			}
		}, interval);
	}

	//closed state
	else {
		//if trigger happened during the pause - defer it’s call
		cb.__planned = true;
	}
}

function delegate (e) {
	var cb = this.cb;
	var selector = this.o.delegate;
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
