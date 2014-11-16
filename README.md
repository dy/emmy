# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)

[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)


Emmy is an EventEmitter which first tries to use target event system - DOM events, jQuery, Backbone, or other target EventEmitter interface, if implemented, and only then uses own events.

It is best if you want to add events to non-eventable objects, like array, [color](https://github.com/harthur/color), backbone-model or any other object. Also it is useful to implement a convenient wrapper for eventable objects, like webworkers, elements etc.

Emmy fully implements [component-emitter](https://github.com/component/emitter) interface, so you can safely replace existing emitter with _Emmy_ and vice-versa.



## Use

Install:

`$ npm install emmy`


Use static API:

```js
var Emitter = require('emmy');

Emitter.on(target, 'evt', function(){});
Emitter.emit(target, 'evt');
Emitter.off(target, 'evt');
```

Create `Emitter` instance:

```js
var Emitter = require('emmy');

var emitter = new Emitter;
emitter.emit('something');
```

Mixin object:
```js
var Emitter = requre('emmy');

user = {name: 'John'};

Emitter(user);

user.emit('hello');
```

Mixin prototype:
```js
var Emitter = require('emmy');
Emitter(User.prototype);
```

Or inherit Emitter:
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

## API

Method | Alias | Description |
--- | --- | --- |
`on(event, handler)` | `addEventListener`, `addListener` | Register an `event` `handler`.
`on(event, handlers)` | | Register an `event` each callback from `handlers` list.
`one(event, handler)` | `addOnceListener` | Register a single-shot `event` `handler`.
`one(event, handlers)` | | Register a single-shot `event` `handlers`.
`off(event, handler)`| `removeEventListener`, `removeListener` | Remove an `event` `handler`.
`off(event)`|  | Remove all listeners for an `event`.
`off()`|  | Remove all listeners on target.
`emit(event, data, bubbles)`| `fire`, `dispatchEvent` | Emit an `event` with params passed.
`listeners(event)`| | Get list of listeners for an `event`
`hasListeners(event)`| | Check if emitter has `event` handlers


---

You also might be interested in more comprehensive emitter - give a glance at [ENot — event notation system](https://github.com/dfcreative/enot).


## License

MIT
