# Emmy [![Build Status](https://travis-ci.org/dy/emmy.svg?branch=master)](https://travis-ci.org/dy/emmy)

Events toolkit.

* [x] Multiple events `on(el, 'click touchstart', cb)`
* [x] Event classes `on(el, 'click.x', cb), off(el, '.x')`
* [x] Uses native events, if available.
* [x] Delegate `on('.subel', 'click', cb, { target: container })`


## Usage

[![npm install emmy](https://nodei.co/npm/emmy.png?mini=true)](https://npmjs.org/package/emmy)

```js
import {on, off, emit} from 'emmy'

on(el, 'evt.foo', e => {})
emit(el, 'evt', {x: 1})
off(el, '.foo')
```

## API

### `off = on(target, event, handler, opts?)`

Bind `event` handler to `target` events.

* `event` can be a string or an array, optionally with class suffixes `click.tag1.tag2`
* `target` can be an element, list, or a string to delegate events.
* `opts` can provide `opts.target` for delegate target and listener props.

```js
// dragging scheme
on(el, 'mousedown touchstart', () => {
	// ...init drag

	on(el, 'mousemove.drag touchmove.drag', () => {
		// ...handle drag
	})

	on(el, 'mouseup.drag touchend.drag', () => {
		off(el, '.drag')
		// ...end drag
	})
})

// delegate
let off = on('.selector', 'click', handler, { target: container })

// remove listener
off()
```

---

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

---

### `emit(target, event, data?, options?)`

Emit an `event` on a `target`. `event` can be a string or an _Event_ instance. If `target` is an element then `data` is placed to `e.details`. `options` can define triggering params, eg. `{bubbles: true}`.



## License

MIT © Dmitry Ivanov.
