# Emmy

An event emitter with target events harness: jQuery, DOM events, Backbone or any other EventEmitter interface, if implemented. If isn’t - uses own events.


## Use

```
$ npm install emmy
```

```js
var Emmy = require('emmy');


function Actor(){};


//Hand emmy to an actor
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


## TODO

* Add testling table


## License

MIT
