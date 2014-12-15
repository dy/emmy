/**
 * @module  emmy/keypass
 */

module.exports = keypass;

var keyDict = require('key-name');
var lower = require('mustring/lower');
var isArray = require('mutype/is-array');
var on = require('./on');
var isString = require('mutype/is-string');


/**
 * Fire event passing key condition
 *
 * @param {Array|String|Number} keys A keys to filter
 *
 * @return {Function} Wrapped handler
 */
function keypass(target, evt, fn, keys){
	//ignore empty keys
	if (!keys) return;

	//prepare keys list to match against
	keys = isArray(keys) ? keys : isString(keys) ? keys.split(/\s*,\s*/) : [keys];
	keys = keys.map(lower);

	return on(target, evt, fn, function(e){
		var key, which = e.which !== undefined ? e.which : e.keyCode;
		for (var i = keys.length; i--;){
			key = keys[i];
			if (which == key || keyDict[key] == which) return true;
		}
	});
}