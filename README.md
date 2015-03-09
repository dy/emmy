# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy) [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy) ![size](https://img.shields.io/badge/size-1.35kb-brightgreen.svg) <a href="UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

<!--
[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)
-->

Event functions for green components.
It uses target’s events, if possible, and falls back to own unobtrusive implementation of events.
It also recognizes multiple events `on(el, 'click touchstart', cb)` and [namespaces](http://api.jquery.com/on/#event-names) `on(el, 'click.x', cb); off(el, 'click.x');`.

Use as an universal way to bind events to anything: plain objects, elements, jQuery objects, Backbone models, [color](https://github.com/dfcreative/color), webWorkers etc.


# Use

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


## Emitter

To use Emmy as EventEmitter, just `require('emmy')`. Thought it is recommended to use [native Emitter](https://npmjs.org/package/events), as a more conventional solution.


# API

Process single target/event/callback.

Function | Description
---|---
`on(target, event, callback)` | Bind event handler to a target.
`once(target, event, callback)` | Bind single-shot event handler to a target.
`off(target, event?, callback?)` | Unbind event handler from a target. If calback isn’t passed - unbind all callbacks for an event. If no event passed - unbind all.
`emit(target, event, callback, data1, data2, ...)` | Emit an event on a target, passing _dataN_. If target is an element then _data1_ is _e.details_, _data2_ is _bubbles_. So to fire bubbling event, call `emit(element, 'click', null, true)`.
`later(target, event, callback, delay)` | Bind an event handler which triggers a _delay_ later than actual event occures.
`throttle(target, event, callback, interval)` | Bind an event handler which won’t be called more often than an _interval_.
`delegate(target, event, callback, selector)` | Bind an event handler catching bubbling events from target’s descendants.
`not(target, event, callback, selector)` | Bind an event handler catching events from target’s descendants ignoring ones that match selector.
`keypass(target, event, callback, keylist)` | Bind an event handler which triggers only if `e.which` or `e.keyCode` is one from the defined _keylist_. Any [keyname](http://github.com/dfcreative/keyname) can be declared instead of a code.
`listeners(target, event?)` | Get list of listeners registered for an event.



# Afterword

Emmy implements maximally minimal coverage for main use-cases. It’s not supposed to recognize broad range of input values. For that take a look at [ENot (event notation system)](https://github.com/dfcreative/enot) — an easy wrapper for emmy with humanized event notation.

There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events nor DOM-events, it does not provide an Emitter class and a bunch of useful methods.


[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)