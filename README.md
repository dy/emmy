# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)  [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy) <a href="http://unlicense.org/UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

<!--
[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)
-->

Emmy is **asbestos-free** event emitter and event utils for green components development.

1. It emits events on any target: plain object, html element, jQuery set, Backbone model, [color](https://github.com/dfcreative/color) etc.

2. It is [fully compliant](https://rawgit.com/dfcreative/emmy/master/test/index.html) with [component-emitter](https://github.com/component/emitter).

3. It works both in browser and _io_.

4. It is only _1.07kb_ gzipped.

5. Each method can be used standalone as `require('emmy/<method>');`. That way final build size can be reduced even more.

6. It provides additional event methods: _delegate_, _throttle_, _later_ and _keypass_. They can be required selectively.


#### [Test it](https://cdn.rawgit.com/dfcreative/emmy/master/test/index.html), [feel it](http://jsfiddle.net/dfcreative/j2tquytv/).


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

Bind events to any object in an unobtrusive way.


### Create `Emitter` instance

```js
var Emitter = require('emmy');

var emitter = new Emitter;
emitter.emit('something');
```

Create a new object with event methods.


### Mixin object

```js
var Emitter = require('emmy');

user = Emitter({name: 'John'});

user.emit('hello');
```

Extend existing object with event methods.


### Mixin prototype

```js
var Emitter = require('emmy');
Emitter(User.prototype);
```

Extend existing class prototype with event methods.


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

Make instances of class `instanceof Emitter`.


### Standalone methods

```js
var once = require('emmy/once');

once(worker, 'message', function(){});
```

Use if only one specific event method is required or to reduce size of build.



# API

Method | Description |
--- | --- | --- |
`.on(target[s], event[s], handler[s])` | Register _handler_ for _event_ on _target_.
`.once(target[s], event[s], handler[s])` | Register single-shot _event_ _handler_ on _target_.
`.off(target[s] [, event[s]] [, handler[s]] )` | Remove an _event_ _handler_ for target. If no _handler_ passed - remove all registered handlers. In no _event_ passed - remove all registered listeners for all events on target.
`.emit(target[s], event[s] [, data] [, bubbles])` | Emit an _event_ with params passed on target. _data_ will be available in _event.details_, if fired on DOM element, else each argument after event will be passed as data, just like usual emitter does.
`.listeners(event)`| Get list of listeners for an `event`
`.hasListeners(event)`| Check if emitter has `event` handlers

If a param has (s) sufix - that means a list can be passed.


Standalone functions:

Method | Description
---|---
`on` |
`off` |
`emit` |
`once` |
`later` |
`throttle` |
`delegate` |




# Afterword

A somewhat more comprehensive emitter based on emmy - have a look at [ENot — event notation system](https://github.com/dfcreative/enot).


There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events nor DOM-events at all. It does not provide an Emitter class, listeners methods, and it has a bit too many letters in title :). No, seriously, `emmy` is only 4 letters length, in that if you have indentation size == 4, your chain calls will look beautiful.

[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)