# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy) [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy) ![size](https://img.shields.io/badge/size-1.35kb-brightgreen.svg) <a href="UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

<!--
[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)
-->

Emmy is enhanced event emitter and event methods for green components.

1. Emits events on any target: plain object, element, jQuery, Backbone model, [color](https://github.com/dfcreative/color) etc. Uses target events first, if available, like `dispatchEvent` or `addEventListener` on DOM elements or `on`, `trigger` on jQuery objects.

2. Fully compliant with [component-emitter](https://github.com/component/emitter), but behaves in an unobtrusive way, not polluting target with `_callbacks` property by leveraging _WeakMaps_.

6. Provides standalone _on_, _once_, _emit_, _off_ and additional _delegate_, _not_, _throttle_, _later_ and _keypass_ methods. Each is available as `require('emmy/<method>');`.

3. Accepts space-separated multiple events, e.g. `on(el, 'click touchstart', cb)`.

4. Handles [event-namespaces](http://api.jquery.com/on/#event-names), e.g. `on(el, 'click.x', cb); off(el, 'click.x');`.

5. Works both in browsers and _io_.

9999. **Asbestos-free**.



#### [Try it](http://jsfiddle.net/dfcreative/j2tquytv/)


# Use

For browser use browserify or standalone [emmy.js](/emmy.js).

Install:

`$ npm install emmy`


### Wrapping methods:

```js
var Emitter = require('emmy');

Emitter.on(target, 'evt', function(){});
Emitter.emit(target, 'evt', data1, data2);
Emitter.off(target, 'evt');

//typical use-case
Emitter.once(webWorker, 'message', function(){...});
```

_Use:_ bind events to any object in an unobtrusive way.


### Create `Emitter` instance

```js
var Emitter = require('emmy');

var emitter = new Emitter;
emitter.emit('something');
```

_Use:_ сreate a new object with event methods.


### Mixin object

```js
var Emitter = require('emmy');

user = Emitter({name: 'John'});

user.emit('hello');
```

_Use:_ extend existing object with event methods.


### Mixin prototype

```js
var Emitter = require('emmy');
Emitter(User.prototype);
```

_Use:_ extend existing class prototype with event methods.


### Inherit Emitter

```js
var Emitter = require('emmy');

function Actor(){};

//Give out emmy to an actor :)
Actor.prototype = Object.create(Emitter);

var actor = new Actor();

actor
//Bind events
.on('event', handler)
.on('otherEvent', handler)
.on('event2', [handler1, handler2]) //bind list of handlers


//Unbind events
.off('event', handler)
.off('otherEvent') //unbind all 'otherEvent' callbacks
.off('event2', [handler1, handler2]); //unbind list of handlers
.off(target) //unbind all events


//Emit events
.emit('a')
.emit('b', data, bubbles);
```

_Use:_ make instances of class `instanceof Emitter`.


### Standalone

```js
var once = require('emmy/once');

once(worker, 'message', function(){});
```

_Use:_ if only one specific event method is required or to reduce size of build.



# API

### Standalone functions

Process single target/event/callback.

Function | Arguments | Description
---|---|---
`on` | target, event, callback | Bind event handler to a target.
`once` | target, event, callback | Bind single-shot event handler to a target.
`off` | target, event?, callback? | Unbind event handler from a target. If calback isn’t passed - unbind all callbacks for an event. If no event passed - unbind all.
`emit` | target, event, callback, data1, data2, ... | Emit an event on a target, passing _dataN_. If target is an element then _data1_ is _e.details_, _data2_ is _bubbles_. So to fire bubbling event, call `emit` | element, 'click', null, true.
`later` | target, event, callback, delay | Bind an event handler which triggers a _delay_ later than actual event occures.
`throttle` | target, event, callback, interval | Bind an event handler which won’t be called more often than an _interval_.
`delegate` | target, event, callback, selector | Bind an event handler catching bubbling events from target’s descendants.
`not` | target, event, callback, selector | Bind an event handler catching events from target’s descendants ignoring ones that match selector.
`keypass` | target, event, callback, keylist | Bind an event handler which triggers only if `e.which` or `e.keyCode` is one from the defined _keylist_. Any [keyname](http://github.com/dfcreative/keyname) can be declared instead of a code.
`listeners` | target [, event] | Get list of listeners registered for an event.



### Emmy methods

Can be used both as static and prototype methods: `Emmy.on(<target>, <event>, <method>, ...<data>)` and `emitter.on(<event>, <handler>, ...<data>)`.

Method | Arguments | Description |
---|---|---
`.on` | event, handler | Register _handler_ for _event_.
`.once` | event, handler | Register single-shot _event_ _handler_.
`.off` | event, handler  | Remove an _event_ _handler_. If no _handler_ passed - remove all registered handlers. In no _event_ passed - remove all registered listeners for all events.
`.emit` | event, data1, data2, ... | Emit an _event_ with params passed. Each argument after _event_ will be passed to the callback.
`.listeners` | event | Get list of listeners for an `event`.
`.hasListeners` | event | Check if emitter has `event` handlers.



# Afterword

Emmy implements maximally minimal coverage for main use-cases. It’s not supposed to recognize broad range of input values. For that take a look at [ENot (event notation system)](https://github.com/dfcreative/enot) — an easy wrapper for emmy with humanized event notation.

There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events nor DOM-events, it does not provide an Emitter class and a bunch of useful methods.


[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)