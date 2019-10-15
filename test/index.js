/**
 * Main tests file
 */

var t = require('tape');
var doc = typeof document === 'undefined' ? undefined : document;
var on = require('../on')
var off = require('../off')
var emit = require('../emit')

/** A native env emitter */
var nativeEmitter = doc ? doc : new (require('events').EventEmitter);

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

t('the most expected classes case', function (t) {
	var a = {}

	var i = 0, j = 0
	on(a, 'x', e => {
		i++
	})
	on(a, 'x.a', e => {
		j++
	})

	emit(a, 'x')
	t.equal(i , 1, 'not-prefixed')
	t.equal(j , 1, 'prefixed')

	emit(a, 'x.a')
	t.equal(i , 1, 'not prefixed')
	t.equal(j , 2, 'prefixed')

	off(a, '.a')

	emit(a, 'x')
	t.equal(i , 2, 'not prefixed')
	t.equal(j , 2, 'prefixed')

	emit(a, 'x.a')
	t.equal(i , 2)
	t.equal(j , 2)

	t.end()
})

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

	on('p, div, .some', 'hello', inc, {target: el});

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

	on(innerEl, 'click', function (e) {
		if (e.delegateTarget === innerEl) i++;
	}, { target: el });

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

	on([innerEl, innerEl2], 'click', function (e) {
		if (e.delegateTarget === innerEl) {
			i++;
		}
		else if (e.delegateTarget === innerEl2) {
			i++;
		}
	}, { target: el });

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
	on('.d', 'click', function(e){
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
