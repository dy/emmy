# Emmy [![Build Status](https://travis-ci.org/dy/emmy.svg?branch=master)](https://travis-ci.org/dy/emmy)

Events micro toolkit.

:heavy_check_mark: Multiple events `on(el, 'click touchstart', cb)`
:heavy_check_mark: Events prefix `on(el, 'click.x', cb); off(el, '.x');`
:heavy_check_mark: Harnesses target event mechanism, if available.

## Usage

[![npm install emmy](https://nodei.co/npm/emmy.png?mini=true)](https://npmjs.org/package/emmy)

```js
import {on, off, emit} from 'emmy'

on(el, 'evt', e => { console.log(e) })
emit(el, 'evt', {x: 1})
off(el, 'evt')
```

## API

### `on(target, event, callback?, opts?) | on(target, events)`

Bind `event` handler to `target` or bind dict of `events`.

* `target` can be any non-primitive object. In case of objects with own events mechanism, such as _HTMLElement_ or _Stream_, the own handler is used but reference to the handler is kept.
* `event` can be a string with single or multiple events, an array or a dict of events with callbacks. Each event name may have a suffix, ie. `click.tag1.tag2`.
* `delegate` is an optional string with selector to delegate events or an object with the properties:

```js
// dragging scheme
on(el, 'mousedown touchstart', () => {
	// ...init drag

	on(el, 'mousemove.drag touchmove.drag', () => {
		// ...handle drag
	}, {throttle: raf})

	on(el, 'mouseup.drag touchend.drag', () => {
		off(el, '.drag')
		// ...end drag
	})
})

// bind events dict
on(target, {
	click: handler,
	mousedown: specialHandler
})
```

### `off(target, event?, callback?)`

Remove `event` handler from a `target`. If `callback` isn't passed - all registered listeners are removed. If `event` isn't passed - all registered callbacks for all known events are removed (useful on destroying the target).

```js
// remove handler the standard way
off(target, 'click', handler)

// remove handler for all registered events
off(target, handler)

// remove all events with provided suffix[es]
off(target, '.special')
```

### `emit(target, event, data?, options?)`

Emit an `event` on a `target`. `event` can be a string or an _Event_ instance. If `target` is an element then `data` is placed to `e.details`. `options` can define triggering params, eg. `{bubbles: true}`.

### `let emitter = require('emmy')(emitter?)`

Emmy can also be used as events provider for a target.

```js
import Events from 'emmy'

// turn target into an event emitter
Events(target)
target.on('.x', e => {})
target.emit('change.x')
target.off('.x')

// create event emitter instance
let emitter = new Emitter()
emitter.on('.x', e => {})
emitter.emit('a.x b.x')
emitter.off('a b')
```


## License

MIT © Dmitry Ivanov.
