# Emmy [![Build Status](https://travis-ci.org/dfcreative/emmy.svg?branch=master)](https://travis-ci.org/dfcreative/emmy)

[![browser support](https://ci.testling.com/dfcreative/emmy.png)
](https://ci.testling.com/dfcreative/emmy)

Emits an event which everyone knows about. Tries to use target event system: jQuery, DOM events, Backbone or any other EventEmitter interface, if implemented. If is not - uses own events.


## Use

1. Install

`$ npm install emmy`


Inherit:

```js
var Emmy = require('emmy');


function Actor(){};


//Give out emmy to an actor
Actor.prototype = Object.create(Emmy);


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


Or use static API:

```js
var evt = require('emmy');

evt.on(target, 'evt', function(){});
evt.emit(target, 'evt');
evt.off(target, 'evt');
```


## License

MIT
