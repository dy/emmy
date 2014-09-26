var icicle = require('icicle');


/** jquery guarant */
var $ = typeof jQuery === 'undefined' ? undefined : jQuery;



/**
 * @constructor
 *
 * Main EventEmitter interface
 */
function Emmy(){}

var proto = Emmy.prototype;


/** set of target callbacks, {target: [cb1, cb2, ...]} */
var targetCbCache = new WeakMap;


/**
* Bind fn to the target
* @todo  recognize jquery object
* @chainable
*/
proto.on = function(evt, fn){
	var target = this;

	//walk by list of instances
	if (fn instanceof Array){
		for (var i = fn.length; i--;){
			proto.on.call(target, evt, fn[i]);
		}
		return;
	}


	//DOM events
	if (isDOMEventTarget(target)) {
		//bind target fn
		if ($){
			//delegate to jquery
			$(target).on(evt, fn);
		} else {
			//listen to element
			target.addEventListener(evt, fn);
		}
		//FIXME: old IE
	}

	//target events
	else {
		var onMethod = getMethodOneOf(target, onNames);

		//use target event system, if possible
		//avoid self-recursions from the outside
		if (onMethod) {
			//if it’s frozen - ignore call
			if (!icicle.freeze(target, onFlag)) return this;
			onMethod.call(target, evt, fn);
			icicle.unfreeze(target, onFlag);
		}
	}


	//Save callback
	//ensure callbacks array for target exist
	if (!targetCbCache.has(target)) targetCbCache.set(target, {});
	var targetCallbacks = targetCbCache.get(target);

	(targetCallbacks[evt] = targetCallbacks[evt] || []).push(fn);


	return this;
};



/**
* Bind fn to a target
* @chainable
*/
proto.off = function (evt, fn){
	var target = this;

	//unbind all listeners passed
	if (fn instanceof Array){
		for (var i = fn.length; i--;){
			proto.off.call(target, evt, fn[i]);
		}
		return;
	}


	//unbind all listeners if no fn specified
	if (fn === undefined) {
		var callbacks = targetCbCache.get(target);
		if (!callbacks) return;
		//unbind all if no evtRef defined
		if (evt === undefined) {
			for (var evtName in callbacks) {
				proto.off.call(target, evtName, callbacks[evtName]);
			}
		}
		else if (callbacks[evt]) {
			proto.off.call(target, evt, callbacks[evt]);
		}
		return;
	}


	//DOM events
	if (isDOMEventTarget(target)) {
		//delegate to jquery
		if ($){
			$(target).off(evt, fn);
		}

		//listen to element
		else {
			target.removeEventListener(evt, fn);
		}
	}

	//target events
	else {
		var offMethod = getMethodOneOf(target, offNames);

		//use target event system, if possible
		//avoid self-recursion from the outside
		if (offMethod) {
			//if it’s frozen - ignore call
			if (!icicle.freeze(target, offFlag)) return this;
			offMethod.call(target, evt, fn);
			icicle.unfreeze(target, offFlag);
		}
	}


	//Forget callback
	//ignore if no event specified
	if (!targetCbCache.has(target)) return;

	var evtCallbacks = targetCbCache.get(target)[evt];

	if (!evtCallbacks) return;

	//remove specific handler
	for (var i = 0; i < evtCallbacks.length; i++) {
		if (evtCallbacks[i] === fn) {
			evtCallbacks.splice(i, 1);
			break;
		}
	}

	return this;
};



/**
* Event trigger
* @chainable
*/
proto.emit = function(eventName, data, bubbles){
	var target = this;

	if (!target) return;

	//DOM events
	if (isDOMEventTarget(target)) {
		if ($){
			//TODO: decide how to pass data
			var evt = $.Event( eventName, data );
			evt.detail = data;
			bubbles ? $(target).trigger(evt) : $(target).triggerHandler(evt);
		} else {
			//NOTE: this doesnot bubble on disattached elements
			var evt;

			if (eventName instanceof Event) {
				evt = eventName;
			} else {
				evt =  document.createEvent('CustomEvent');
				evt.initCustomEvent(eventName, bubbles, true, data);
			}

			// var evt = new CustomEvent(eventName, { detail: data, bubbles: bubbles })

			target.dispatchEvent(evt);
		}
	}

	//no-DOM events
	else {
		//Target events
		var emitMethod = getMethodOneOf(target, emitNames);

		//use locks to avoid self-recursion on objects wrapping this method (e. g. mod instances)
		if (emitMethod) {
			if (icicle.freeze(target, emitFlag)) {
				//use target event system, if possible
				emitMethod.call(target, eventName, data);
				icicle.unfreeze(target, emitFlag);
				return this;
			}
			//if event was frozen - perform normal callback
		}


		//fall back to default event system
		//ignore if no event specified
		if (!targetCbCache.has(target)) return this;

		var evtCallbacks = targetCbCache.get(target)[eventName];

		if (!evtCallbacks) return this;

		//copy callbacks to fire because list can change in some handler
		var fireList = evtCallbacks.slice();
		for (var i = 0; i < fireList.length; i++ ) {
			fireList[i] && fireList[i].call(target, {
				detail: data,
				type: eventName
			});
		}
	}

	return this;
};


/** Static aliases for old API compliance */
Emmy.on = function(a,b,c){proto.on.call(a,b,c)};
Emmy.off = function(a,b,c){proto.off.call(a,b,c)};
Emmy.emit = function(a,b,c){proto.emit.call(a,b,c)};


/**
 * detect whether DOM element implements EventTarget interface
 * @todo detect eventful objects in a more wide way
 */
function isDOMEventTarget (target){
	return target && target.addEventListener;
}


/** List of methods */
var onNames = ['on', 'bind', 'addEventListener', 'addListener'];
var offNames = ['off', 'unbind', 'removeEventListener', 'removeListener'];
var emitNames = ['emit', 'trigger', 'fire', 'dispatchEvent'];


/** Locker flags */
var emitFlag = emitNames[0], onFlag = onNames[0], offFlag = offNames[0];


/**
 * Return target’s method one of passed list, if it is eventable
 */
function getMethodOneOf(target, list){
	var result;
	for (var i = 0, l = list.length; i < l; i++) {
		result = target[list[i]];
		if (result) return result;
	}
}



/** @module muevents */
module.exports = Emmy;