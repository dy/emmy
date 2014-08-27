Uses existing event system, if possible: jQuery, DOM events, Backbone events (pending).


```
npm install muevent
```

```js
var evt = require('muevent');

evt.on(target, method, handler);
evt.off(target, method, [handler]);
evt.emit(target, method);
```


## License

MIT