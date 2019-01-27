/**
 * A storage for per-target callbacks.
 * WeakMap is the most safe solution.
 *
 * @module emmy/listeners
 */

var WeakMap = require('weak-map')
var globalCache = require('global-cache')

// target: {evt: callbacks}
var LISTENERS = globalCache.get('emmy')
if (!LISTENERS) {
	LISTENERS = new WeakMap()
	globalCache.set('emmy', LISTENERS)
}


/**
 * Get listeners for the target/evt (optionally).
 *
 * @param {object} target a target object
 * @param {string}? evt an evt name, if undefined - return object with events
 *
 * @return {(object|array)} List/set of listeners
 */
function get (target, evt, tags) {
	var cbs = LISTENERS.get(target);
	var result;

	if (!evt) {
		result = cbs || {};

		// filter cbs by tags
		if (tags && tags.length) {
			var filteredResult = {};
			for (var evt in result) {
				filteredResult[evt] = result[evt].filter(function (cb) {
					return hasTags(cb, tags);
				});
			}
			result = filteredResult;
		}

		return result;
	}

	if (!cbs || !cbs[evt]) {
		return [];
	}

	result = cbs[evt];

	// if there are evt namespaces specified - filter callbacks
	if (tags && tags.length) {
		result = result.filter(function (cb) {
			return hasTags(cb, tags);
		});
	}

	return result;
}


/**
 * Remove listener, if any
 */
function remove (target, evt, cb, tags) {
	// get callbacks for the evt
	var evtCallbacks = LISTENERS.get(target);
	if (!evtCallbacks || !evtCallbacks[evt]) return false;

	var callbacks = evtCallbacks[evt];

	// if tags are passed - make sure callback has some tags before removing
	if (tags && tags.length && !hasTags(cb, tags)) return false;

	// remove specific handler
	for (var i = 0; i < callbacks.length; i++) {
		// once method has original callback in .cb
		if (callbacks[i] === cb) {
			callbacks.splice(i, 1);
			break;
		}
	}
};


/**
 * Add a new listener
 */
function add (target, evt, cb, tags) {
	if (!cb) return;

	var targetCallbacks = LISTENERS.get(target);

	// ensure set of callbacks for the target exists
	if (!targetCallbacks) {
		targetCallbacks = {}
		LISTENERS.set(target, targetCallbacks)
	}

	// save a new callback
	(targetCallbacks[evt] = targetCallbacks[evt] || []).push(cb);

	// save ns for a callback, if any
	if (tags && tags.length) {
		cb._ns = tags;
	}
};


/** Detect whether an cb has at least one tag from the list */
function hasTags (cb, tags) {
	if (!cb._ns) return false

	// if cb is tagged with a ns and includes one of the ns passed - keep it
	for (var i = tags.length; i--;) {
		if (cb._ns.indexOf(tags[i]) >= 0) return true;
	}
}


module.exports = {
	get: get, remove: remove, add: add
};
