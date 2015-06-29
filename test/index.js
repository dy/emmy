/**
 * Main tests file
 */

var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;

/** A native env emitter */
var nativeEmitter = doc ? doc : new (require('events'));

var Emmy = doc && typeof Emitter !== 'undefined' ? Emitter : require('../');
var assert = typeof chai !== 'undefined' ? chai.assert : require('chai').assert;

var on = Emmy.on,
	off = Emmy.off,
	once = Emmy.once,
	emit = Emmy.emit,
	delegate = Emmy.delegate,
	throttle = Emmy.throttle,
	later = Emmy.later,
	not = Emmy.not,
	keypass = Emmy.keypass;


describe('Regression', function () {
	it('on/emit/off', function () {
		var a = {};
		var i = 0;
		on(a, 'click', function () {i++});
		emit(a, 'click');
		assert.equal(i, 1);
		off(a, 'click');
		emit(a, 'click');
		assert.equal(i, 1);
	});

	it('removeAll', function () {
		var a = {}, i = 0;

		on(a, 'y', function () {i++});
		on(a, 'y', function () {i++});
		emit(a, 'y');

		assert.equal(i, 2);
		off(a);

		emit(a, 'y');
		assert.equal(i, 2);
	});

	it.skip('IE8, IE9', function () {
	});

	it('Call list changed during `emit`', function () {
		var a = {}, log = [];

		on(a, 'x', function () {
			off(a, 'x');
			log.push(1);
		});

		on(a, 'x', function () {
			log.push(2);
		});

		on(a, 'x', function () {
			log.push(3);
		});

		emit(a, 'x');

		assert.deepEqual(log, [1,2,3]);
	});

	it('Objects artifically implementing Emitter interface', function () {
		var i = 0;
		var a = {
			emit: function(a){
				emit(this, a);
			},
			fn: function () {
				i++;
			},
			on: function(a, b){
				on(this, a, b);
			}
		};

		a.on('fn', a.fn);
		a.emit('fn');
		assert.equal(i, 1);
	});

	it('Object inheriting Emitter interface', function () {
		var A = function (){};

		A.prototype = Object.create(Emmy.prototype);

		var i = 0;
		var a = new A;
		a.on('fn', function () {i++;});
		a.emit('fn');
		assert.equal(i, 1);
	});

	it('Mixin prototype', function () {
		function User(name){
			this.name = name || 'tobi';
		}

		var user = new User;

		Emmy(User.prototype);

		var i = 0;

		user.on('hello', function () {i++});
		user.emit('hello');

		assert.equal(i, 1);
	});

	it('Mixin object', function () {
		var user = { name: 'tobi' };
		Emmy(user);

		var i = 0;

		user.on('hello dude', function () {i++});
		user.emit('hello dude');

		assert.equal(i, 2);
	});

	it('Emitter instance', function () {
		var emitter = new Emmy, i = 0;
		emitter.on('something', function () {i++});
		emitter.emit('something');
		assert.equal(i, 1);
	});

	it('Once', function () {
		var a = {}, i = 0, inc = function () {i++};

		once(a, 'x', inc);
		emit(a, 'x');
		emit(a, 'x');
		emit(a, 'x');

		assert.equal(i, 1);
	});

	it('Once on object having self events', function () {
		var d = nativeEmitter;

		var i = 0;
		var inc = function () {i++};

		once(d, 'x', inc);
		emit(d, 'x');
		emit(d, 'x');
		emit(d, 'x');

		assert.equal(i, 1);
	});

	it.skip('Chainable static calls (there’re no more static methods)', function () {
		var a = {}, i = 0;

		function inc(){i++};

		on(a, 'x', inc);
		once(a, 'x', inc);
		emit(a, 'x');
		emit(a, 'x');

		assert.equal(i, 3);
	});

	it('Chainable instance calls', function () {
		var a = new Emmy, i = 0;

		function inc(){i++};

		a
		.on('x', inc)
		.once('x', inc)
		.emit('x')
		.emit('x');

		assert.equal(i, 3);
	});

	it('listeners && hasListeners', function () {
		var a = new Emmy;

		function fn(){}
		function fn2(){}

		a.on('x', fn).on('y', fn).on('x', fn2);

		assert.sameMembers(a.listeners('x'), [fn, fn2]);
		assert.ok(a.listeners('x').length);
		assert.notOk(a.listeners('z').length);
	});

	it('List arg in emit', function () {
		var x = {}, i = 0, a = [1,2], b;

		on(x, 'y', function(e){i++; b = e});
		emit(x, 'y', a);

		assert.equal(i, 1);
		assert.equal(b, a);
	});

	it('Space-separated events', function () {
		var x = {}, i = 0, j = 0;

		on(x, 'x y', function(e, f){i+=e+f});
		on(x, 'x y', function(e, f){j+=e+f});

		emit(x, 'x y', 1, 2);

		assert.equal(i, 6);
		assert.equal(j, 6);

		off(x, 'x y');
		emit(x, 'x y', 1, 2);
		assert.equal(i, 6);
		assert.equal(j, 6);
	});

	it('ignore empty target', function () {
		on(null, 'click', function () {});
		once(null, 'click', function () {});
		off(null, 'click', function () {});
		emit(null, 'click');
	});

	it('Scope events', function () {
		var i = 0, j = 0, el = nativeEmitter;

		var fn1 = function(e){
			// console.log('--ex')
			i++;
		}, fn2 = function(e){
			// console.log('--e')
			j++;
		};

		// console.log('---onx')
		on(el, 'click.x touchstart.x', fn1);

		// console.log('---on')
		on(el, 'click touchstart', fn2);

		// console.log('---emit')
		emit(el, 'click touchstart');
		assert.equal(i,2);
		assert.equal(j,2);

		// console.log('---off')
		off(el, 'click.x touchstart.x');

		// console.log('---emit')
		emit(el, 'click touchstart');
		assert.equal(i,2);
		assert.equal(j,4);

		off(el);
	});

	it('Does not call natural `on` twice', function () {
		var el = nativeEmitter;
		var i = 0;

		once(el, 'x', function () {
			i++;
		});
		on(el, 'x', function () {
			i++;
		});

		emit(el, 'x');
		assert.equal(i, 2);
		emit(el, 'x');
		assert.equal(i, 3);
	});

	it('Unbind multiple namespaced events via throttle', function (done) {
		var target = {}//nativeEmitter;

		var log = [];

		throttle(target, 'x.y', function () {
			log.push(1);
		},8);
		throttle(target, 'x.z', function () {
			log.push(2);
		},8);
		throttle(target, 'x', function () {
			log.push(3);
		},8);

		emit(target, 'x');
		emit(target, 'x');
		emit(target, 'x');

		off(target, 'x.y');

		assert.deepEqual(log, [1,2,3]);

		setTimeout(function () {
			emit(target, 'x');
			emit(target, 'x');
			emit(target, 'x');
		},2);


		setTimeout(function () {
			assert.deepEqual(log, [1,2,3,2,3]);
			done();
		}, 40);
	});
});



describe('Standalone methods', function () {
	it('Delegate with swapped order of params', function () {
		if (!doc) return;

		var i = 0, j = 0;
		var el = document.createElement('div');
		document.body.appendChild(el);

		var inc = function () {
			i++;
		};

		delegate(document, 'hello', 'p, div, .some', inc);

		var sideLink = document.createElement('span');
		document.body.appendChild(sideLink);

		on(sideLink, 'hello', function () {
			j++;
		});

		//emit not bubbling evt
		emit(document.body, 'hello');
		assert.equal(i, 0);

		//emit bubbling evt on passing element
		emit(el, 'hello', null, true);
		assert.equal(i, 1);

		//emit not passing element bubbling evt (should be ignored)
		emit(sideLink, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);


		//unbind delegate
		off(document, 'hello');

		//emit bubbling evt on passing element (should be ignored)
		emit(el, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);
	});

	it('Not', function () {
		if (!doc) return;

		var j = 0;
		var el = document.createElement('div');
		document.body.appendChild(el);

		var inc = function () {
			j++;
		};

		not(document, 'hello', 'p, div, .some', inc);

		var sideLink = document.createElement('span');
		document.body.appendChild(sideLink);

		//emit not bubbling evt - ignored
		// console.log('emit body')
		emit(document.body, 'hello');
		assert.equal(j, 0);

		//emit bubbling evt on ignoring element - ignored
		// console.log('emit el')
		emit(el, 'hello', null, true);
		assert.equal(j, 0);

		//emit bubbling evt on some other element - passed
		// console.log('emit sideLink')
		emit(sideLink, 'hello', null, true);
		assert.equal(j, 1);


		//unbind not
		off(document, 'hello');

		//emit bubbling evt on passing element (should be ignored)
		emit(sideLink, 'hello', null, true);
		assert.equal(j, 1);
	});

	it(':not on elements which are no more in DOM', function () {
		if (!doc) return;

		var a = document.createElement('div');
		a.className = 'a';
		a.innerHTML = '<span class="x"></span>';
		document.body.appendChild(a);

		var i = 0;


		on(a, 'click', function () {
			// console.log('---a click', this)
			this.innerHTML = '<span></span>';
		});

		//look how element caused the event has been removed from DOM in the first callback, but doc is still triggered by it
		not(document, 'click', '.a', function(e){
			// console.log('---document click', this, a.innerHTML)
			i++;
		});
		// console.log('----emit click', a.firstChild)
		emit(a.firstChild, 'click', true, true);

		assert.equal(i, 0);
	});

	it('Throttle', function(done){
		var i = 0;
		var a = {};

		//should be called 10 times less often than dispatched event
		throttle(a, 'x', 50, function () {
			i++;
			// console.log(new Date - initT);
			assert.equal(this, a);
		});

		var interval = setInterval(function () {
			emit(a, 'x');
		}, 5);

		//should be called instantly
		setTimeout(function () {
			assert.equal(i, 1);
		}, 10);

		//should get close number of calls
		setTimeout(function () {
			clearInterval(interval);

			assert.closeTo(i, 5, 1);
			done();
		}, 240);
	});

	it('Delegate simple', function () {
		if (!doc) return;


		//TODO: fix this test. Don’t catch bubbling event higher than delegate target
		var i = 0, j = 0;
		var el = document.createElement('div');
		el.className = 'el';
		document.body.appendChild(el);
		var el2 = document.createElement('div');
		el.appendChild(el2);
		el2.className = 'el2';

		var inc = function () {
			i++;
		};

		delegate(el, 'hello', inc, 'p, div, .some');

		var sideLink = document.createElement('span');
		sideLink.className = 'side';
		el.appendChild(sideLink);

		on(sideLink, 'hello', function () {
			j++;
		});

		//emit not bubbling evt (ignored)
		emit(el2, 'hello');
		assert.equal(i, 0);

		//emit bubbling evt too high (ignored)
		emit(document.body, 'hello', null, true);
		assert.equal(i, 0);

		//emit bubbling evt on passing element
		emit(el2, 'hello', null, true);
		assert.equal(i, 1);
		emit(el, 'hello', null, true);
		assert.equal(i, 1);

		//emit not passing element bubbling evt (should be ignored)
		// console.log('------- emit side');
		emit(sideLink, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);


		//unbind delegate
		// console.log('------- off');
		off(el, 'hello');

		//emit bubbling evt on passing element (should be ignored cause is off)
		// console.log('------- emit el');
		emit(el2, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);
	});

	it('Delegate to element', function () {
		if (!doc) return;

		var el = doc.createElement('div');
		var innerEl = doc.createElement('div');
		el.appendChild(innerEl);

		doc.body.appendChild(el);

		var i = 0;

		delegate(el, 'click', innerEl, function (e) {
			if (e.delegateTarget === innerEl) i++;
		});

		innerEl.click();

		assert.equal(i, 1);
	});

	it('Keypass', function () {
		if (!doc) return;

		var k = 0, a = 0, ka=0, z = 0;
		var el = doc.createElement('div');

		keypass(el, 'keydown', function(e){
			z++;
		});
		keypass(el, 'keydown', function(e){
			a++;
		}, 83);
		keypass(el, 'keydown', function(e){
			k++;
		}, 'enter');
		keypass(el, 'keydown', function(e){
			ka++;
		}, [65, 'enter', '68']);


		var evt = createKeyEvt('keydown', 65);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 0);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s
		evt = createKeyEvt('keydown', 83);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 1);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s2
		evt = createKeyEvt('keydown', 83);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		//enter
		evt = createKeyEvt('keydown', 13);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 1);
		assert.equal(ka, 2);
	});

	it('Later', function(done){
		var a = {};
		var i = 0;

		later(a, 'x', 100, function () {
			i++;
		});

		emit(a, 'x');
		assert.equal(i, 0);

		setTimeout(function () {
			assert.equal(i, 0);
		}, 50);

		setTimeout(function () {
			assert.equal(i, 1);
			done();
		}, 120);
	});

	it('delegateTarget', function () {
		if (!doc) return;

		var a = document.createElement('div');
		a.className = 'd';
		var b = document.createElement('div');
		a.appendChild(b);
		document.body.appendChild(a);

		var cTarget;
		delegate(document, 'click', '.d', function(e){
			cTarget = e.delegateTarget;
		});
		emit(b, 'click', null, true);
		assert.equal(cTarget, a);
	});
});




//helpers
function dispatchEvt(el, eventName, data, bubbles){
	var event;
	if (el instanceof HTMLElement || el === window || el === document) {
		if (!(eventName instanceof Event)) {
			event =  document.createEvent('CustomEvent');
			event.initCustomEvent(eventName, bubbles, null, data)
		} else {
			event = eventName;
		}
		// var event = new CustomEvent(eventName, { detail: data, bubbles: bubbles })
		el.dispatchEvent(event);
	} else {
		if (el.fire) el.fire(eventName);
		else if (el.trigger) el.trigger(eventName);
		else if (el.emit) el.emit(eventName);
	}
}

function createKeyEvt(name, code){
	var evt = document.createEvent('KeyboardEvent');
	try{
		Object.defineProperty(evt, 'keyCode', {
			get : function() {
				return this.keyCodeVal;
			}
		});
		Object.defineProperty(evt, 'which', {
			get : function() {
				return this.keyCodeVal;
			}
		});
	} catch (e) {
	}

	evt.keyCode = this.keyCodeVal;
	evt.which = this.keyCodeVal;

	if (evt.initKeyboardEvent) {
		evt.initKeyboardEvent('keydown', true, true, document.defaultView, false, false, false, false, code, code);
	} else {
		evt.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, code, code);
	}

	evt.keyCodeVal = code;

	return evt;
}

function createMouseEvt(name, btn){
	var evt = document.createEvent('MouseEvent')
	evt.initMouseEvent(
		name, true,true,window,
		1, 0,0,0,0,
		false,false,false,false,
		btn, null
	)
	evt.which = btn;
	return evt
}
