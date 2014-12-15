/**
 * Iterate method for args.
 * Ensure that final method is called with single arguments,
 * so that any list/object argument is iterated.
 *
 * Supposed to be used internally by emmy.
 *
 * @module emmy/invoke
 */


module.exports = invoke;


var isArrayLike = require('mutype/is-array-like');
var isArray = require('mutype/is-array');
var isObject = require('mutype/is-object');
var isString = require('mutype/is-string');
var isNodeList = require('mutype/is-node-list');
var isFn = require('mutype/is-fn');
var slice = require('sliced');


function invoke(method, args, ignoreFn) {
	var target = args[0], evt = args[1], fn = args[2], param = args[3];

	//batch events
	if (isObject(evt)) {
		for (var evtName in evt){
			invoke(method, [target, evtName, evt[evtName]]);
		}
		return;
	}

	//Swap params, if callback & param are changed places
	if (isFn(param) && !isFn(fn)) {
		invoke(method, [target, evt, param, fn].concat(slice(args, 4)));
		return;
	}

	//bind all callbacks, if passed a list (and no ignoreFn flag)
	if (isArrayLike(fn) && !ignoreFn) {
		args = slice(args, 3);
		for (var i = fn.length; i--;){
			// method(target, evt, fn[i]);
			invoke(method, [target, evt, fn[i]].concat(args));
		}
		return;
	}

	//bind all events, if passed a list
	if (isArrayLike(evt)) {
		args = slice(args, 2);
		for (var i = evt.length; i--;){
			// method(target, evt[i], fn);
			invoke(method, [target, evt[i]].concat(args));
		}
		return;
	}

	//bind all targets, if passed a list
	if (isArray(target) || isNodeList(target)) {
		args = slice(args, 1);
		for (var i = target.length; i--;){
			invoke(method, [target[i]].concat(args));
		}
		return;
	}


	//invoke method for each space-separated event from a list
	if (isString(evt)) {
		evt.split(/\s+/).forEach(function(evt){
			method.apply(this, [target, evt].concat(slice(args, 2)));
		});
	} else {
		method.apply(this, args);
	}
}