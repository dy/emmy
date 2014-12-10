/**
 * Invoke callback if condition passes.
 *
 * @param {Function} condition A condition checker
 * @alias filter
 *
 * @module  emmy/pass
 */


module.exports = pass;


var redirect = require('./src/redirect');
var on = require('./on');


function pass(target, evt, fn, condition){
	if (redirect(pass, arguments)) return;

	var cb = function(e){
		if (condition.apply(this, arguments)) {
			return fn.apply(this, arguments);
		}
	};

	cb.fn = fn;

	on(target, evt, cb);

	return cb;
};