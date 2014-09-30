# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)

[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)


Emmy is an EventEmitter which first tries to use target event system - jQuery, DOM events, Backbone or other EventEmitter interface, if implemented, ond only then uses own events.

Emmy fully implements [component-emitter](https://github.com/component/emitter) interface, as well as jQuery events and ony other emitter interface, so you can safely replace existing emitter with _Emmy_.


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
`one(event, handler)` | `addOnceListener` | Register a single-shot `event` `handler`.
`off(event, handler)`| `removeEventListener`, `removeListener` | Remove an `event` `handler`.
`off(event)`|  | Remove all listeners for an `event`.
`off()`|  | Remove all listeners on target.
`emit(event, data, bubbles)`| `fire` | Emit an `event` with params passed.


---

You also might be interesting in more comprehensive emitter - give a glance at [ENot — event notation system](https://github.com/dfcreative/enot).


## License

MIT
