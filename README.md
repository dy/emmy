# Emmy

A prominent event emitter.

Uses target’s events, if possible: jQuery, DOM events, Backbone or any other EventEmitter, if implemented. If isn’t - uses own events.


## Use

```
$ npm install emmy
```

```js
var Emmy = require('emmy');

//Hand emmy
var target.prototype = Object.create(Emmy);


target

//Bind events
.on(target, 'event', handler)
.on(otherTarget, 'otherEvent', handler)
.on(target, 'event2', [handler1, handler2]) //bind list of handlers


//Unbind events
.off(target, 'event', handler)
.off(otherTarget, 'otherEvent') //unbind all 'otherEvent' callbacks
.off(target, 'event2', [handler1, handler2]); //unbind list of handlers
.off(target) //unbind all events


//Emit events
.emit(target, 'a')
.emit(otherTarget, 'b', data, bubbles);
```


## TODO

* Add testling table


## License

MIT
