# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)  [![Code Climate](https://codeclimate.com/github/dfcreative/emmy/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/emmy) <a href="http://unlicense.org/UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

<!--
[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)
-->

Emmy is an event emitter for lightweight components/jquery-plugins.

1. It emits events for any object: plain object, html element, jQuery set, Backbone model, [color](https://github.com/dfcreative/color) etc.

2. Emmy first tries to use target event system, if any, and only then uses own "wrapper" events.

3. Emmy is fully compliant with [component-emitter](https://github.com/component/emitter) , so you can safely replace it with _Emmy_ and vice-versa ([compliance test](test/compliance.js)).

5. It works both in browser and _io_ (or _node_).

6. ((emmy.min.js)[emmy.min.js]) only Nkb minified & gzipped (via closure compiler advanded optimizations).

7. Any method can be required selectively as `require('emmy/<method>');`, so you can reduce final build size even better.


# Use

For browser use browserify or [emmy.js](/emmy.js).

Install:

`$ npm install emmy`


### Wrapper methods:

```js
	var Emitter = require('emmy');

	Emitter.on(target, 'evt', function(){});
	Emitter.emit(target, 'evt');
	Emitter.off(target, 'evt');
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

	user = {name: 'John'};

	Emitter(user);

	user.emit('hello');
```

### Mixin prototype:
```js
	var Emitter = require('emmy');
	Emitter(User.prototype);
```

### Or inherit Emitter:
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

# API

Each method can be required selectively as `require('emmy/<method>')`.

Method | Description |
--- | --- | --- |
`on(event, handler)` | Register a `handler` or a list of handlers for an `event`.
`one(event, handler)` | Register a single-shot `event` `handler` or `handlers`.
`off(event?, handler?)` | Remove an `event` `handler`. If no `handler` passed - remove all registered handlers. In no `event` passed - remove all registered listeners for all events.
`emit(event, data?, bubbles?)` | Emit an `event` with params passed. `data` will be available in `event.details`, if fired on DOM element.
`listeners(event)`| Get list of listeners for an `event`
`hasListeners(event)`| Check if emitter has `event` handlers


# Afterword

You also might be interested in more comprehensive emitter - have a look at [ENot — event notation system](https://github.com/dfcreative/enot).

There’s also a similar project - [emmitt](https://github.com/airportyh/emmitt), but it can’t emit bubbling events, as well as emit natural target events, like DOM-events. Besides, it does not provide an Emitter class.


[![NPM](https://nodei.co/npm/emmy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/emmy/)