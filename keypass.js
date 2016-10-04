/**
 * @module  emmy/keypass
 */

module.exports = keypass;

var keyDict = require('key-name');
var on = require('./on');


/**
 * Fire event passing key condition
 *
 * @param {Array|String|Number} keys A keys to filter
 *
 * @return {Function} Wrapped handler
 */
function keypass(target, evt, fn, keys){
	return on(target, evt, keypass.wrap(target, evt, fn, keys));
}

/** Return wrapped callback filtering keys */
keypass.wrap = function(target, evt, fn, keys){
	//ignore empty keys
	if (!keys) return;

	//prepare keys list to match against
	keys = Array.isArray(keys) ? keys : (typeof keys === 'string') ? keys.split(/\s*,\s*/) : [keys];
	keys = keys.map(function (v) { return (v+'').toLowerCase(); });

	return on.wrap(target, evt, fn, function(e){
		var key, which = e.which !== undefined ? e.which : e.keyCode;
		for (var i = keys.length; i--;){
			key = keys[i];
			if (which == key || keyDict[key] == which) return true;
		}
	});
};
