/**
 * @module emmy/emit
 */
var icicle = require('icicle');
var listeners = require('./listeners');
var isArrayLike = require('mutype/is-array');
var slice = require('sliced');
var isObject = require('mutype/is-object');


module.exports = emit;

//TODO: think to pass list of args to `emit`


/** detect env */
var $ = typeof jQuery === 'undefined' ? undefined : jQuery;
var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;


/**
 * Emit an event, optionally with data or bubbling
 *
 * @param {string} eventName An event name, e. g. 'click'
 * @param {*} data Any data to pass to event.details (DOM) or event.data (elsewhere)
 * @param {bool} bubbles Whether to trigger bubbling event (DOM)
 *
 * @chainable
 *
 * @return {target} a target
 */
function emit(target, eventName, data, bubbles){
	//ignore empty arg (falsy global case etc)
	//honestly IDK where is this issue from
	// if (!target) return;

	var emitMethod, evt = eventName;

	//batch events
	if (isObject(evt)){
		for (var evtName in evt){
			emit.apply(target, evtName, evt[evtName]);
		}
		return target;
	}

	var args = slice(arguments, 1), dataArgs = args.slice(1);

	//emit each event, if passed a list
	if (isArrayLike(eventName)) {
		for (var i = eventName.length; i--;){
			emit.apply(this, target, eventName[i], dataArgs);
		}
		return target;
	}

	//emit on all targets, if passed a list
	if (isArrayLike(target)) {
		for (var i = target.length; i--;){
			emit.apply(this, target[i], args);
		}
		return target;
	}


	//Create proper event for DOM objects
	if (target.nodeType || target === doc || target === win) {
		//NOTE: this doesnot bubble on off-DOM elements

		if (eventName instanceof Event) {
			evt = eventName;
		} else {
			//IE9-compliant constructor
			evt =  document.createEvent('CustomEvent');
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


	//use locks to avoid self-recursion on objects wrapping this method
	if (emitMethod) {
		if (icicle.freeze(target, 'emit' + eventName)) {
			//use target event system, if possible
			emitMethod.call(target, evt, data, bubbles);
			icicle.unfreeze(target, 'emit' + eventName);

			return target;
		}

		//if event was frozen - probably it is Emitter instance
		//so perform normal callback
	}


	//fall back to default event system
	//ignore if no event specified
	var evtCallbacks = listeners(target, evt);

	//copy callbacks to fire because list can be changed by some callback (like `off`)
	var fireList = slice(evtCallbacks);
	for (var i = 0; i < fireList.length; i++ ) {
		fireList[i] && fireList[i].apply(target, dataArgs);
	}

	return target;
}