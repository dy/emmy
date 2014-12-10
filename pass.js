/**
 * Invoke callback if condition passes.
 *
 * @param {Function} condition A condition checker
 * @alias filter
 *
 * @module  emmy/pass
 */

module.exports = function(target, evt, fn, condition){
	var cb = function(e){
		if (condition.apply(this, arguments)) {
			return fn.apply(this, arguments);
		}
	};

	cb.fn = fn;

	on(target, evt, cb);

	return cb;
};