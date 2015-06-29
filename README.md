# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy) [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy)

Event helpers toolkit.

It uses target events, if possible, and then falls back to own safe implementation.

It handles multiple events `on(el, 'click touchstart', cb)` and [namespaces](http://api.jquery.com/on/#event-names) `on(el, 'click.x', cb); off(el, 'click.x');`.

It may bind events to anything: plain objects, elements, jQuery objects, Backbone models, [color](https://github.com/dfcreative/color), webWorkers etc.

It is a useful tiny replacement for jquery events.


## Use

[![npm install emmy](https://nodei.co/npm/emmy.png?mini=true)](https://npmjs.org/package/emmy)


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

You might need to polyfill `Element.contains`, `Element.closest` and `Array.some` for old browsers:

```
https://cdn.polyfill.io/v1/polyfill.js?features=default,Node.prototype.contains,Element.prototype.closest,Array.prototype.some,
```


## API

### `on(target, event, callback)`

Bind an event handler to a target. `event` may contain a class suffix: `click.my-element`.

### `on(target, events)`

Bind all events defined in object.

### `once(target, event, callback)`

Bind single-shot event handler to a target.


### `off(target, event?, callback?)`

Unbind event handler from a target. If calback isn’t passed - unbind all callbacks for an event. If no event passed - unbind all known callbacks for any events.

Also you can pass only class suffix to unbind all events for a class: `off(target, '.my-element')`.


### `emit(target, event, callback, data1, data2, ...)`

Emit an event on a target, passing `dataN`. If target is an element then `data1` is `e.details`, `data2` is `bubbles`. So to fire bubbling event, call `emit(element, 'click', null, true)`.


### `later(target, event, delay, callback)`

Bind an event handler which triggers a `delay` later than actual event occures.


### `throttle(target, event, interval, callback)`

Bind an event handler which won’t be called more often than an `interval`.


### `delegate(target, event, selector, callback)`

Bind an event handler catching bubbling events from target’s descendants. `selector` can be a string, an element or a list of elements/selectors.


### `not(target, event, selector, callback)`

Bind an event handler catching events from target’s descendants ignoring ones that match selector.


### `keypass(target, event, keylist, callback)`

Bind an event handler which triggers only if `e.which` or `e.keyCode` is one from the defined `keylist`. Any [keyname](http://github.com/dfcreative/key-name) can be declared instead of a code.


### `listeners(target, event?)`

Get list of listeners registered for an event.



# Analogs

* [enot (event notation system)](https://github.com/dfcreative/enot) — an easy wrapper for emmy with humanized event notation.
* [emmitt](https://github.com/airportyh/emmitt) — universal event wrapper.
* [event](https://github.com/component/event) — unified DOM event binder.