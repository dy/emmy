# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy) [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy)

High-level event functions for green components.

It uses target events, if possible, and then falls back to own safe implementation.

It handles multiple events `on(el, 'click touchstart', cb)` and [namespaces](http://api.jquery.com/on/#event-names) `on(el, 'click.x', cb); off(el, 'click.x');`.

It is best as an universal way to bind events to anything: plain objects, elements, jQuery objects, Backbone models, [color](https://github.com/dfcreative/color), webWorkers etc.


## Use

`$ npm install emmy`


```js
var on = require('emmy/on');
var once = require('emmy/once');
var off = require('emmy/off');
var emit = require('emmy/emit');

on(target, 'evt', function(){});
emit(target, 'evt', data1, data2);
off(target, 'evt');

//typical use-case
once(webWorker, 'message', function(){...});
```


## API

### `on(target, event, callback)`

Bind an event handler to a target.


### `once(target, event, callback)`

Bind single-shot event handler to a target.


### `off(target, event?, callback?)`

Unbind event handler from a target. If calback isn’t passed - unbind all callbacks for an event. If no event passed - unbind all known callbacks for any events.


### `emit(target, event, callback, data1, data2, ...)`

Emit an event on a target, passing `dataN`. If target is an element then `data1` is `e.details`, `data2` is `bubbles`. So to fire bubbling event, call `emit(element, 'click', null, true)`.


### `later(target, event, callback, delay)`

Bind an event handler which triggers a `delay` later than actual event occures.


### `throttle(target, event, callback, interval)`

Bind an event handler which won’t be called more often than an `interval`.


### `delegate(target, event, callback, selector)`

Bind an event handler catching bubbling events from target’s descendants.


### `not(target, event, callback, selector)`

Bind an event handler catching events from target’s descendants ignoring ones that match selector.


### `keypass(target, event, callback, keylist)`

Bind an event handler which triggers only if `e.which` or `e.keyCode` is one from the defined `keylist`. Any [keyname](http://github.com/dfcreative/key-name) can be declared instead of a code.


### `listeners(target, event?)`

Get list of listeners registered for an event.



# Afterword

Emmy implements maximally minimal coverage for main use-cases. It’s not supposed to recognize broad range of input values. For that take a look at [enot (event notation system)](https://github.com/dfcreative/enot) — an easy wrapper for emmy with humanized event notation.

There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events nor DOM-events, it does not provide an Emitter class and a bunch of useful methods.


[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)