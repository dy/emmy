/**
 * A storage of per-target callbacks.
 * WeakMap is the most safe solution.
 *
 * @module emmy/listeners
 */

var cache = new WeakMap;



/**
 * Get listeners for the target/evt (optionally)
 *
 * @param {object} target a target object
 * @param {string}? evt an evt name, if undefined - return object with events
 *
 * @return {(object|array)} List/set of listeners
 */
function listeners(target, evt){
	var listeners = cache.get(target);
	if (!evt) return listeners || {};
	return listeners && listeners[evt] || [];
}


/**
 * Add a new listener
 */
listeners.add = function(target, evt, cb){
	//ensure set of callbacks for the target exists
	if (!cache.has(target)) cache.set(target, {});
	var targetCallbacks = cache.get(target);

	//save a new callback
	(targetCallbacks[evt] = targetCallbacks[evt] || []).push(cb);
};


module.exports = listeners;