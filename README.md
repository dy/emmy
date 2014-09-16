# μEvents

Events for any object.

Uses passed object events, if possible: jQuery, DOM events, Backbone or any other EventEmitter interface. If object isn’t an eventable, uses inobstructive events wrapper.


## Use

```
$ npm install muevents
```


```js
var evt = require('muevents');

evt.on(target, 'event', handler)
.on(otherTarget, 'otherEvent', handler);
.on(target, 'event2', [handler1, handler2]); //bind list of handlers

evt.off(target, 'event', handler)
.off(otherTarget, 'otherEvent') //unbind all 'otherEvent' callbacks
.off(target, 'event2', [handler1, handler2]); //unbind list of handlers
.off(target) //unbind all events

evt.emit(target, 'a')
.emit(otherTarget, 'b', data, bubbles)
```


## TODO

* Add testling table


## License

MIT
