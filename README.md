# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)  [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy) <a href="http://unlicense.org/UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

<!--
[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)
-->

Emmy is **asbestos-free** event emitter for green components and jquery plugins.

1. It emits events on any target: plain object, html element, jQuery set, Backbone model, [color](https://github.com/dfcreative/color) etc.

2. It is [fully compliant](https://rawgit.com/dfcreative/emmy/master/test/index.html) with [component-emitter](https://github.com/component/emitter), so you can safely replace it with emmy and vice-versa.

3. It works both in browser and _io_.

4. It is only _1.07kb_ gzipped. Besides, any method can be required selectively as `require('emmy/<method>');`, in that build size can be reduced even more.

<br/>

#### [Test it](https://cdn.rawgit.com/dfcreative/emmy/master/test/index.html), [feel it](http://jsfiddle.net/dfcreative/j2tquytv/).


# Use

For browser use browserify or standalone [emmy.js](/emmy.js).

Install:

`$ npm install emmy`


### Static methods:

```js
	var Emitter = require('emmy');

	Emitter.on(target, 'evt', function(){});
	Emitter.emit(target, 'evt', data1, data2);
	Emitter.off(target, 'evt');

	//typical use-case
	Emitter.once(webWorker, 'message', function(){...});
```

### Create `Emitter` instance:

```js
	var Emitter = require('emmy');

	var emitter = new Emitter;
	emitter.emit('something');
```

### Mixin object:

```js
	var Emitter = requre('emmy');

	user = Emitter({name: 'John'});

	user.emit('hello');
```

### Mixin prototype:

```js
	var Emitter = require('emmy');
	Emitter(User.prototype);
```

### Inherit Emitter:

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


### Selective methods:

```js
var once = require('emmy/once');

once(worker, 'message', function(){});
```


# API

Method | Description |
--- | --- | --- |
`on(event, handler)` | Register a `handler` or a list of handlers for an `event`.
`one(event, handler)` | Register a single-shot `event` `handler` or `handlers`.
`off(event?, handler?)` | Remove an `event` `handler`. If no `handler` passed - remove all registered handlers. In no `event` passed - remove all registered listeners for all events.
`emit(event, data?, bubbles?)` | Emit an `event` with params passed. `data` will be available in `event.details`, if fired on DOM element.
`listeners(event)`| Get list of listeners for an `event`
`hasListeners(event)`| Check if emitter has `event` handlers


# Afterword

A somewhat more comprehensive emitter based on emmy - have a look at [ENot — event notation system](https://github.com/dfcreative/enot).


There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events nor DOM-events at all. It does not provide an Emitter class, listeners methods, and it has a bit too many letters in title :). No, seriously, `emmy` is only 4 letters length, in that if you have indentation size == 4, your chain calls will look beautiful.

[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)