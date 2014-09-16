/** @module muevents */
module.exports = {
	on: bind,
	off: unbind,
	emit: fire
};


/** jquery guarant */
var $ = typeof jQuery === 'undefined' ? undefined : jQuery;


/** set of target callbacks, {target: [cb1, cb2, ...]} */
var targetCbCache = new WeakMap;


/**
* Bind fn to the target
* @chainable
*/
function bind(target, evt, fn){
	//walk by list of instances
	if (fn instanceof Array){
		for (var i = fn.length; i--;){
			bind(target, evt, fn[i]);
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
		var onMethod = getOn(target);

		//use target event system, if possible
		if (onMethod) {
			onMethod.call(target, evt, fn);
		}
	}


	//Save callback
	//ensure callbacks array for target exist
	if (!targetCbCache.has(target)) targetCbCache.set(target, {});
	var targetCallbacks = targetCbCache.get(target);

	(targetCallbacks[evt] = targetCallbacks[evt] || []).push(fn);


	return this;
}



/**
* Unbind fn from the target
* @chainable
*/
function unbind(target, evt, fn){
	//unbind all listeners passed
	if (fn instanceof Array){
		for (var i = fn.length; i--;){
			unbind(target, evt, fn[i]);
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
				unbind(target, evtName, callbacks[evtName]);
			}
		}
		else if (callbacks[evt]) {
			unbind(target, evt, callbacks[evt]);
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
		var offMethod = getOff(target);

		//use target event system, if possible
		if (offMethod) {
			offMethod.call(target, evt, fn);
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
}



/**
* Event trigger
* @chainable
*/
function fire(target, eventName, data, bubbles){
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
		var emitMethod = getEmit(target);

		//use target event system, if possible
		if (emitMethod) {
			return emitMethod.call(target, eventName, data);
		}


		//fall back to default event system
		//ignore if no event specified
		if (!targetCbCache.has(target)) return;

		var evtCallbacks = targetCbCache.get(target)[eventName];

		if (!evtCallbacks) return;

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
}



/**
 * detect whether DOM element implements EventTarget interface
 * @todo detect eventful objects in a more wide way
 */
function isDOMEventTarget (target){
	return target && (!!target.addEventListener);
}


/**
 * Return target’s `on` method, if it is eventable
 */
function getOn (target){
	return target.on || target.bind || target.addEventListener || target.addListener;
}


/**
 * Return target’s `off` method, if it is eventable
 */
function getOff (target){
	return target.off || target.unbind || target.removeEventListener || target.removeListener;
}


/**
 * Return target’s `emit` method, if it is eventable
 */
function getEmit (target){
	return target.emit || target.trigger || target.fire || target.dispatchEvent || target.dispatch;
}
