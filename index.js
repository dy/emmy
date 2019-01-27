/**
 * Event Emitter.
 *
 * @module  emmy
 */
'use strict'

var	on = require('./on'),
	off = require('./off'),
	emit = require('./emit');

/**
 * Emitter class.
 *
 * @constructor
 */
function events(target){
	if (!target) return events({});

	target.on = on.bind(target, target)
	target.off = off.bind(target, target)
	target.emit = emit.bind(target, target)

	return target;
}

events.on = on;
events.off = off;
events.emit = emit;

module.exports = events;
