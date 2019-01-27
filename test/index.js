/**
 * Main tests file
 */

var t = require('tape');
var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;

/** A native env emitter */
var nativeEmitter = doc ? doc : new (require('events').EventEmitter);

var Emmy = doc && typeof Emitter !== 'undefined' ? Emitter : require('../');

var on = Emmy.on,
	off = Emmy.off,
	once = Emmy.once,
	emit = Emmy.emit,
	delegate = Emmy.delegate,
	throttle = Emmy.throttle,
	later = Emmy.later,
	not = Emmy.not,
	keypass = Emmy.keypass;


t('on/emit/off', function (t) {
	var a = {};
	var i = 0;
	on(a, 'click', function () {i++});
	emit(a, 'click');
	t.equal(i, 1);
	off(a, 'click');
	emit(a, 'click');
	t.equal(i, 1);
	t.end()
});

t.skip('readme', function (t) {

})

t('removeAll', function (t) {
	var a = {}, i = 0;

	on(a, 'y', function () {i++});
	on(a, 'y', function () {i++});
	emit(a, 'y');

	t.equal(i, 2);
	off(a);

	emit(a, 'y');
	t.equal(i, 2);

	t.end()
});

t.skip('IE8, IE9', function () {
});

t('Call list changed during `emit`', function (t) {
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

	t.deepEqual(log, [1,2,3]);

	t.end()
});

t('Objects artifically implementing Emitter interface', function (t) {
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
	t.equal(i, 1);

	t.end()
});

t.skip('Object inheriting Emitter interface', function (t) {
	// skip since we don't support that anymore
	var A = function (){};

	A.prototype = Object.create(Emmy);
	// Emmy(A.prototype)

	var i = 0;
	var a = new A;
	a.on('fn', function () {i++;});
	a.emit('fn');
	t.equal(i, 1);

	t.end()
});

t('Mixin prototype', function (t) {
	function User(name){
		this.name = name || 'tobi';
	}

	var user = new User;

	Emmy(User.prototype);

	var i = 0;

	user.on('hello', function () {i++});
	user.emit('hello');

	t.equal(i, 1);

	t.end()
});

t('Mixin object', function (t) {
	var user = { name: 'tobi' };
	Emmy(user);

	var i = 0;

	user.on('hello dude', function () {i++});
	user.emit('hello dude');

	t.equal(i, 2);

	t.end()
});

t('Emitter instance', function (t) {
	var emitter = new Emmy, i = 0;
	emitter.on('something', function () {i++});
	emitter.emit('something');
	t.equal(i, 1);

	t.end()
});

t('Once', function (t) {
	var a = {}, i = 0, inc = function () {
		i++
		off(a, inc)
	};

	on(a, 'x', inc);
	emit(a, 'x');
	emit(a, 'x');
	emit(a, 'x');

	t.equal(i, 1);

	t.end()
});

t('Once on object having self events', function (t) {
	var d = nativeEmitter;

	var i = 0;
	var inc = function () {i++; off(d, inc);};

	on(d, 'x', inc);
	emit(d, 'x');
	emit(d, 'x');
	emit(d, 'x');

	t.equal(i, 1);

	t.end()
});

t.skip('Chainable static calls (there’re no more static methods)', function () {
	var a = {}, i = 0;

	function inc(){i++};

	on(a, 'x', inc);
	once(a, 'x', inc);
	emit(a, 'x');
	emit(a, 'x');

	t.equal(i, 3);
});

t('Chainable instance calls', function (t) {
	var a = new Emmy, i = 0;

	function inc(){i++};

	a
	.on('x', inc)
	.on('x', () => {off(a, inc); inc();})
	.emit('x')
	.emit('x');

	t.equal(i, 3);

	t.end()
});

t.skip('listeners && hasListeners', function (t) {
	var a = new Emmy;

	function fn(){}
	function fn2(){}

	a.on('x', fn).on('y', fn).on('x', fn2);

	t.sameMembers(a.listeners('x'), [fn, fn2]);
	t.ok(a.listeners('x').length);
	t.notOk(a.listeners('z').length);
});

t('List arg in emit', function (t) {
	var x = {}, i = 0, a = [1,2], b;

	on(x, 'y', function(e){i++; b = e});
	emit(x, 'y', a);

	t.equal(i, 1);
	t.equal(b, a);

	t.end()
});

t('Space-separated events', function (t) {
	var x = {}, i = 0, j = 0;

	on(x, 'x y', function(e, f){i+=e+f});
	on(x, 'x y', function(e, f){j+=e+f});

	emit(x, 'x y', 1, 2);

	t.equal(i, 6);
	t.equal(j, 6);

	off(x, 'x y');
	emit(x, 'x y', 1, 2);
	t.equal(i, 6);
	t.equal(j, 6);

	t.end()
});

t('ignore empty target', function (t) {
	on(null, 'click', function () {});
	on(null, 'click', function () {});
	off(null, 'click', function () {});
	emit(null, 'click');

	t.end()
});

t('Scope events', function (t) {
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
	t.equal(i,2);
	t.equal(j,2);

	// console.log('---off')
	off(el, 'click.x touchstart.x');

	// console.log('---emit')
	emit(el, 'click touchstart');
	t.equal(i,2);
	t.equal(j,4);

	off(el);

	t.end()
});

t('Does not call natural `on` twice', function (t) {
	var el = nativeEmitter;
	var i = 0;

	on(el, 'x', function x() {
		off(el, x)
		i++;
	});
	on(el, 'x', function () {
		i++;
	});

	emit(el, 'x');
	t.equal(i, 2);
	emit(el, 'x');
	t.equal(i, 3);

	t.end()
});

t('Unbind multiple namespaced events via throttle', async function (t) {
	var target = {}//nativeEmitter;

	var log = [];

	on(target, 'x.y', function () {
		log.push(1);
	}, 8);
	on(target, 'x.z', function () {
		log.push(2);
	}, 8);
	on(target, 'x', function () {
		log.push(3);
	}, 8);

	emit(target, 'x');
	emit(target, 'x');
	emit(target, 'x');

	off(target, 'x.y');

	t.deepEqual(log, [1,2,3]);

	await delay(10)
	t.deepEqual(log, [1,2,3,2,3]);
	emit(target, 'x');
	emit(target, 'x');
	emit(target, 'x');

	await delay(20)
	t.deepEqual(log, [1,2,3,2,3,2,3]);
	await delay(20)
	t.deepEqual(log, [1,2,3,2,3,2,3]);
	emit(target, 'x');
	emit(target, 'x');
	t.deepEqual(log, [1,2,3,2,3,2,3,2,3]);
	await delay(20)
	t.deepEqual(log, [1,2,3,2,3,2,3,2,3,2,3]);

	t.end();
});

t('Object w/events', function (t) {
	var el = {};
	var i = 0, j = 0;

	on(el, {
		a: function () {i++},
		b: function () {j++}
	});
	emit(el, 'a');
	emit(el, 'b');

	t.equal(i,1);
	t.equal(j,1);

	off(el, 'a b');

	emit(el, 'a');
	emit(el, 'b');

	t.equal(i,1);
	t.equal(j,1);

	t.end()
});

t.skip('Return false', function () {
	if (!doc) return;

	var el = doc.createElement('div');
	var innerEl = doc.createElement('div');
	el.appendChild(innerEl);
	doc.body.appendChild(el);

	var i = 0;

	on(el, 'click', function () {
		i++;
	});

	innerEl.click();
	t.equal(i,1);

	innerEl.onclick = function () {
		//this seems to don’t work in DOM either; it’s just a jquery convention
		return false;
	}

	innerEl.click();
	t.equal(i,1);
});

t('Delegate with swapped order of params', function (t) {
	if (!doc) return t.end();

	var i = 0, j = 0;
	var el = document.createElement('div');
	document.body.appendChild(el);

	var inc = function () {
		i++;
	};

	on(document, 'hello', 'p, div, .some', inc);

	var sideLink = document.createElement('span');
	document.body.appendChild(sideLink);

	on(sideLink, 'hello', function () {
		j++;
	});

	//emit not bubbling evt
	emit(document.body, 'hello');
	t.equal(i, 0);

	//emit bubbling evt on passing element
	emit(el, 'hello', null, true);
	t.equal(i, 1);

	//emit not passing element bubbling evt (should be ignored)
	emit(sideLink, 'hello', null, true);
	t.equal(i, 1);
	t.equal(j, 1);


	//unbind delegate
	off(document, 'hello');

	//emit bubbling evt on passing element (should be ignored)
	emit(el, 'hello', null, true);
	t.equal(i, 1);
	t.equal(j, 1);

	t.end()
});

t.skip('Not', function (t) {
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
	t.equal(j, 0);

	//emit bubbling evt on ignoring element - ignored
	// console.log('emit el')
	emit(el, 'hello', null, true);
	t.equal(j, 0);

	//emit bubbling evt on some other element - passed
	// console.log('emit sideLink')
	emit(sideLink, 'hello', null, true);
	t.equal(j, 1);


	//unbind not
	off(document, 'hello');

	//emit bubbling evt on passing element (should be ignored)
	emit(sideLink, 'hello', null, true);
	t.equal(j, 1);
});

t.skip(':not on elements which are no more in DOM', function (t) {
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

	t.equal(i, 0);
});

t('Throttle', function(t){
	var i = 0;
	var a = {};

	//should be called 10 times less often than dispatched event
	on(a, 'x', function () {
		i++;
		// console.log(new Date - initT);
		t.equal(this, a);
	}, 50);

	var interval = setInterval(function () {
		emit(a, 'x');
	}, 5);

	//should be called instantly
	setTimeout(function () {
		t.equal(i, 1);
	}, 10);

	//should get close number of calls
	setTimeout(function () {
		clearInterval(interval);

		t.equal(i, 5);
		t.end();
	}, 240);
});

t('Delegate simple', function (t) {
	if (!doc) return t.end();

	//TODO: fix this t. Don’t catch bubbling event higher than delegate target
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

	on(el, 'hello', inc, 'p, div, .some');

	var sideLink = document.createElement('span');
	sideLink.className = 'side';
	el.appendChild(sideLink);

	on(sideLink, 'hello', function () {
		j++;
	});

	//emit not bubbling evt (ignored)
	emit(el2, 'hello');
	t.equal(i, 0);

	//emit bubbling evt too high (ignored)
	emit(document.body, 'hello', null, true);
	t.equal(i, 0);

	//emit bubbling evt on passing element
	emit(el2, 'hello', null, true);
	t.equal(i, 1);
	emit(el, 'hello', null, true);
	t.equal(i, 1);

	//emit not passing element bubbling evt (should be ignored)
	// console.log('------- emit side');
	emit(sideLink, 'hello', null, true);
	t.equal(i, 1);
	t.equal(j, 1);


	//unbind delegate
	// console.log('------- off');
	off(el, 'hello');

	//emit bubbling evt on passing element (should be ignored cause is off)
	// console.log('------- emit el');
	emit(el2, 'hello', null, true);
	t.equal(i, 1);
	t.equal(j, 1);

	t.end()
});

t('Delegate to element', function (t) {
	if (!doc) return t.end();

	var el = doc.createElement('div');
	var innerEl = doc.createElement('div');
	el.appendChild(innerEl);

	doc.body.appendChild(el);

	var i = 0;

	on(el, 'click', innerEl, function (e) {
		if (e.delegateTarget === innerEl) i++;
	});

	innerEl.click();

	t.equal(i, 1);

	t.end()
});

t('Delegate to list', function (t) {
	if (!doc) return t.end();

	var el = doc.createElement('div');
	var innerEl = doc.createElement('div');
	var innerEl2 = doc.createElement('div');
	el.appendChild(innerEl);
	el.appendChild(innerEl2);

	doc.body.appendChild(el);

	var i = 0;

	on(el, 'click', [innerEl, innerEl2], function (e) {
		if (e.delegateTarget === innerEl) {
			i++;
		}
		else if (e.delegateTarget === innerEl2) {
			i++;
		}
	});

	innerEl.click();
	innerEl2.click();

	t.equal(i, 2);

	t.end()
});

t.skip('Keypass', function (t) {
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
	t.equal(z, 0);
	t.equal(a, 0);
	t.equal(k, 0);
	t.equal(ka, 1);

	// s
	evt = createKeyEvt('keydown', 83);
	emit(el, evt);
	t.equal(z, 0);
	t.equal(a, 1);
	t.equal(k, 0);
	t.equal(ka, 1);

	// s2
	evt = createKeyEvt('keydown', 83);
	emit(el, evt);
	t.equal(z, 0);
	t.equal(a, 2);
	t.equal(k, 0);
	t.equal(ka, 1);

	//enter
	evt = createKeyEvt('keydown', 13);
	emit(el, evt);
	t.equal(z, 0);
	t.equal(a, 2);
	t.equal(k, 1);
	t.equal(ka, 2);
});

t.skip('Later', function(dtone){
	var a = {};
	var i = 0;

	later(a, 'x', 100, function () {
		i++;
	});

	emit(a, 'x');
	t.equal(i, 0);

	setTimeout(function () {
		t.equal(i, 0);
	}, 50);

	setTimeout(function () {
		t.equal(i, 1);
		done();
	}, 120);
});

t('delegateTarget', function (t) {
	if (!doc) return t.end();

	var a = document.createElement('div');
	a.className = 'd';
	var b = document.createElement('div');
	a.appendChild(b);
	document.body.appendChild(a);

	var cTarget;
	on(document, 'click', '.d', function(e){
		cTarget = e.delegateTarget;
	});
	emit(b, 'click', null, true);
	t.equal(cTarget, a);

	t.end()
});

t('off by className', function (t) {
	var el = {};
	var i = 0;

	on(el, 'x.1', function () {
		i++
	});
	on(el, 'x.2', function () {
		i++
	})
	on(el, 'y.1', function () {
		i++
	});

	emit(el, 'x');
	t.equal(i, 2);
	emit(el, 'y');
	t.equal(i, 3);

	off(el, '.1');

	emit(el, 'x');
	t.equal(i, 4);
	emit(el, 'y');
	t.equal(i, 4);

	t.end()
});

t('off number', function (t) {
	var el = {};
	on(el, 'x.123', function () {
		i++
	});
	off(el, 123);

	t.end()
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


function delay(n) {
	return new Promise(function (ok) {
		setTimeout(ok, n)
	})
}
