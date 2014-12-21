/**
 * @module emmy/emit
 */
var icicle = require('icicle');
var slice = require('sliced');
var isString = require('mutype/is-string');
var emitter = require('component-emitter').prototype;


/**
 * A simple wrapper to handle stringy/plain events
 */
module.exports = function(target, evt){
	if (!target) return;

	var args = arguments;
	if (isString(evt)) {
		args = slice(arguments, 2);
		evt.split(/\s+/).forEach(function(evt){
			emit.apply(this, [target, evt].concat(args));
		});
	} else {
		return emit.apply(this, args);
	}
};


/** detect env */
var $ = typeof jQuery === 'undefined' ? undefined : jQuery;
var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;


/**
 * Emit an event, optionally with data or bubbling
 * Accept only single elements/events
 *
 * @param {string} eventName An event name, e. g. 'click'
 * @param {*} data Any data to pass to event.details (DOM) or event.data (elsewhere)
 * @param {bool} bubbles Whether to trigger bubbling event (DOM)
 *
 *
 * @return {target} a target
 */
function emit(target, eventName, data, bubbles){
	var emitMethod, evt = eventName;

	//Create proper event for DOM objects
	if (target.nodeType || target === doc || target === win) {
		//NOTE: this doesnot bubble on off-DOM elements

		if (eventName instanceof Event) {
			evt = eventName;
		} else {
			//IE9-compliant constructor
			evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(eventName, bubbles, true, data);

			//a modern constructor would be:
			// var evt = new CustomEvent(eventName, { detail: data, bubbles: bubbles })
		}

		emitMethod = target.dispatchEvent;
	}

	//create event for jQuery object
	else if ($ && target instanceof $) {
		//TODO: decide how to pass data
		evt = $.Event( eventName, data );
		evt.detail = data;

		//FIXME: reference case where triggerHandler needed (something with multiple calls)
		emitMethod = bubbles ? targte.trigger : target.triggerHandler;
	}

	//detect target events
	else {
		emitMethod = target['emit'] || target['trigger'] || target['fire'] || target['dispatchEvent'];
	}


	var args = [evt].concat(slice(arguments, 2));

	//use locks to avoid self-recursion on objects wrapping this method
	if (emitMethod) {
		if (icicle.freeze(target, 'emit' + eventName)) {
			//use target event system, if possible
			emitMethod.apply(target, args);
			icicle.unfreeze(target, 'emit' + eventName);

			return target;
		}

		//if event was frozen - probably it is emitter instance
		//so perform normal callback
	}


	//fall back to default event system
	emitter.emit.apply(target, args);

	return target;
}