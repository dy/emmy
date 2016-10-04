/**
 * @module emmy/on
 */


var icicle = require('icicle');
var listeners = require('./listeners');
var isObject = require('is-plain-obj');

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
function on(target, evt, fn){
	if (!target) return target;

	//consider object of events
	if (isObject(evt)) {
		for(var evtName in evt) {
			on(target, evtName, evt[evtName]);
		}
		return target;
	}

	//get target `on` method, if any
	//prefer native-like method name
	//user may occasionally expose `on` to the global, in case of browserify
	//but it is unlikely one would replace native `addEventListener`
	var onMethod =  target['addEventListener'] || target['addListener'] || target['attachEvent'] || target['on'];

	var cb = fn;

	evt = '' + evt;

	//invoke method for each space-separated event from a list
	evt.split(/\s+/).forEach(function(evt){
		var evtParts = evt.split('.');
		evt = evtParts.shift();

		//use target event system, if possible
		if (onMethod) {
			//avoid self-recursions
			//if it’s frozen - ignore call
			if (icicle.freeze(target, 'on' + evt)){
				onMethod.call(target, evt, cb);
				icicle.unfreeze(target, 'on' + evt);
			}
			else {
				return target;
			}
		}

		//save the callback anyway
		listeners.add(target, evt, cb, evtParts);
	});

	return target;
}


/**
 * Wrap an fn with condition passing
 */
on.wrap = function(target, evt, fn, condition){
	var cb = function() {
		if (condition.apply(target, arguments)) {
			return fn.apply(target, arguments);
		}
	};

	cb.fn = fn;

	return cb;
};
