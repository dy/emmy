/**
 * Main tests file
 */

var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;

var Emitter = doc && typeof Emitter !== 'undefined' ? Emitter : require('..');
var assert = typeof chai !== 'undefined' ? chai.assert : require('chai').assert;



describe('Regression', function(){
	it('on/emit/off', function(){
		var a = {};
		var i = 0;
		Emitter.on(a, 'click', function(){i++});
		Emitter.emit(a, 'click');
		assert.equal(i, 1);
		Emitter.off(a, 'click');
		Emitter.emit(a, 'click');
		assert.equal(i, 1);
	});

	it('removeAll', function(){
		var a = {}, i = 0;

		Emitter.on(a, 'y', function(){i++});
		Emitter.on(a, 'y', function(){i++});
		Emitter.emit(a, 'y');

		assert.equal(i, 2);
		Emitter.off(a);

		Emitter.emit(a, 'y');
		assert.equal(i, 2);
	});

	it.skip('IE8, IE9', function(){
	});

	it('Call list changed during `emit`', function(){
		var a = {}, log = [];

		Emitter.on(a, 'x', function(){
			Emitter.off(a, 'x');
			log.push(1);
		});

		Emitter.on(a, 'x', function(){
			log.push(2);
		});

		Emitter.on(a, 'x', function(){
			log.push(3);
		});

		Emitter.emit(a, 'x');

		assert.deepEqual(log, [1,2,3]);
	});

	it('Objects artifically implementing Emitter interface', function(){
		var i = 0;
		var a = {
			emit: function(a){
				Emitter.emit(this, a);
			},
			fn: function(){
				i++;
			},
			on: function(a, b){
				Emitter.on(this, a, b);
			}
		};

		a.on('fn', a.fn);
		a.emit('fn');
		assert.equal(i, 1);
	});

	it('Object inheriting Emitter interface', function(){
		var A = function (){};
		A.prototype = Object.create(Emitter.prototype);

		var i = 0;
		var a = new A;
		a.on('fn', function(){i++;});
		a.emit('fn');
		assert.equal(i, 1);
	});

	it('Mixin prototype', function(){
		function User(name){
			this.name = name || 'tobi';
		}

		var user = new User;

		Emitter(User.prototype);

		var i = 0;

		user.on('hello', function(){i++});
		user.emit('hello');

		assert.equal(i, 1);
	});

	it('Mixin object', function(){
		var user = { name: 'tobi' };
		Emitter(user);

		var i = 0;

		user.on('hello dude', function(){i++});
		user.emit('hello dude');

		assert.equal(i, 2);
	});

	it('Emitter instance', function(){
		var emitter = new Emitter, i = 0;
		emitter.on('something', function(){i++});
		emitter.emit('something');
		assert.equal(i, 1);
	});

	it('Once', function(){
		var a = {}, i = 0, inc = function(){i++};

		Emitter.once(a, 'x', inc);
		Emitter.emit(a, 'x');
		Emitter.emit(a, 'x');
		Emitter.emit(a, 'x');

		assert.equal(i, 1);
	});

	it('Once on object having self events', function(){
		if (typeof document !== 'undefined') {
			var d =  document.createElement('div');
		} else {
			var EventEmitter = require('events').EventEmitter;
			var d = new EventEmitter;
		}
		var i = 0;
		var inc = function(){i++};

		Emitter.once(d, 'x', inc);
		Emitter.emit(d, 'x');
		Emitter.emit(d, 'x');
		Emitter.emit(d, 'x');

		assert.equal(i, 1);
	});

	it('Chainable static calls', function(){
		var a = {}, i = 0;

		function inc(){i++};

		Emitter.on(a, 'x', inc).once(a, 'x', inc).emit(a, 'x').emit(a, 'x');

		assert.equal(i, 3);
	});

	it('Chainable instance calls', function(){
		var a = new Emitter, i = 0;

		function inc(){i++};

		a
		.on('x', inc)
		.once('x', inc)
		.emit('x')
		.emit('x');

		assert.equal(i, 3);
	});

	it('listeners && hasListeners', function(){
		var a = new Emitter;

		function fn(){}
		function fn2(){}

		a.on('x', fn).on('y', fn).on('x', fn2);

		assert.sameMembers(a.listeners('x'), [fn, fn2]);
		assert.ok(a.listeners('x').length);
		assert.notOk(a.listeners('z').length);
	});

	it('List arg in emit', function(){
		var x = {}, i = 0, a = [1,2], b;

		Emitter.on(x, 'y', function(e){i++; b = e});
		Emitter.emit(x, 'y', a);

		assert.equal(i, 1);
		assert.equal(b, a);
	});

	//@deprecated - user can do it himself
	it.skip('List of targets', function(){
		var x = {}, y = {}, i = 0, j = 0;

		Emitter.on([x, y], ['x', 'y'], [
			function(e,f){i+=e+f},
			function(e, f){j+=e+f}
		]);

		Emitter.emit([x,y], ['x', 'y'], 1, 2);

		assert.equal(i, 12);
		assert.equal(j, 12);


		Emitter.off([x, y], ['x', 'y']);
		Emitter.emit([x,y], ['x', 'y'], 1, 2);
		assert.equal(i, 12);
		assert.equal(j, 12);
	});

	it('Space-separated events', function(){
		var x = {}, i = 0, j = 0;

		Emitter.on(x, 'x y', function(e, f){i+=e+f});
		Emitter.on(x, 'x y', function(e, f){j+=e+f});

		Emitter.emit(x, 'x y', 1, 2);

		assert.equal(i, 6);
		assert.equal(j, 6);

		Emitter.off(x, 'x y');
		Emitter.emit(x, 'x y', 1, 2);
		assert.equal(i, 6);
		assert.equal(j, 6);
	});

	//@deprecated
	it.skip('Batch events', function(){
		var x = {}, i = 0, j = 0;

		Emitter.on(x, {
			x: function(e){i+=e},
			y: function(e){j+=e}
		});

		Emitter.emit(x, {
			x: 2,
			y: 3
		});

		assert.equal(i, 2);
		assert.equal(j, 3);


		Emitter.off(x, {
			x: undefined,
			y: undefined
		});

		Emitter.emit(x, {
			'x': 2,
			'y': 3
		});

		assert.equal(i, 2);
		assert.equal(j, 3);
	});

	it('Throttle', function(done){
		var i = 0;
		var a = {};

		//should be called 10 times less often than dispatched event
		Emitter.throttle(a, 'x', 50, function(){
			i++;
			// console.log(new Date - initT);
			assert.equal(this, a);
		});

		var interval = setInterval(function(){
			Emitter.emit(a, 'x');
		}, 5);

		//should be called instantly
		setTimeout(function(){
			assert.equal(i, 1);
		}, 10);

		//should get close number of calls
		setTimeout(function(){
			clearInterval(interval);

			assert.closeTo(i, 5, 1);
			done();
		}, 240);
	});

	it('Delegate simple', function(){
		if (!doc) return;


		//TODO: fix this test. Don’t catch bubbling event higher than delegate target
		var i = 0, j = 0;
		var el = document.createElement('div');
		el.className = 'el';
		document.body.appendChild(el);
		var el2 = document.createElement('div');
		el.appendChild(el2);
		el2.className = 'el2';

		var inc = function(){
			i++;
		};

		Emitter.delegate(el, 'hello', inc, 'p, div, .some');

		var sideLink = document.createElement('span');
		sideLink.className = 'side';
		el.appendChild(sideLink);

		Emitter.on(sideLink, 'hello', function(){
			j++;
		});

		//emit not bubbling evt (ignored)
		Emitter.emit(el2, 'hello');
		assert.equal(i, 0);

		//emit bubbling evt too high (ignored)
		Emitter.emit(document.body, 'hello', null, true);
		assert.equal(i, 0);

		//emit bubbling evt on passing element
		Emitter.emit(el2, 'hello', null, true);
		assert.equal(i, 1);
		Emitter.emit(el, 'hello', null, true);
		assert.equal(i, 1);

		//emit not passing element bubbling evt (should be ignored)
		// console.log('------- emit side');
		Emitter.emit(sideLink, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);


		//unbind delegate
		// console.log('------- off');
		Emitter.off(el, 'hello');

		//emit bubbling evt on passing element (should be ignored cause is off)
		// console.log('------- emit el');
		Emitter.emit(el2, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);
	});

	it('Not', function(){
		if (!doc) return;

		var j = 0;
		var el = document.createElement('div');
		document.body.appendChild(el);

		var inc = function(){
			j++;
		};

		Emitter.not(document, 'hello', 'p, div, .some', inc);

		var sideLink = document.createElement('span');
		document.body.appendChild(sideLink);

		//emit not bubbling evt - ignored
		// console.log("emit body")
		Emitter.emit(document.body, 'hello');
		assert.equal(j, 0);

		//emit bubbling evt on ignoring element - ignored
		// console.log("emit el")
		Emitter.emit(el, 'hello', null, true);
		assert.equal(j, 0);

		//emit bubbling evt on some other element - passed
		// console.log("emit sideLink")
		Emitter.emit(sideLink, 'hello', null, true);
		assert.equal(j, 1);


		//unbind not
		Emitter.off(document, 'hello');

		//emit bubbling evt on passing element (should be ignored)
		Emitter.emit(sideLink, 'hello', null, true);
		assert.equal(j, 1);
	});

	it(":not on elements which are no more in DOM", function(){
		if (!doc) return;

		var a = document.createElement('div');
		a.className = 'a';
		a.innerHTML = '<span class="x"></span>';
		document.body.appendChild(a);

		var i = 0;


		Emitter.on(a, 'click', function(){
			// console.log('---a click', this)
			this.innerHTML = '<span></span>';
		});

		//look how element caused the event has been removed from DOM in the first callback, but doc is still triggered by it
		Emitter.not(document, 'click', '.a', function(e){
			// console.log('---document click', this, a.innerHTML)
			i++;
		});
		// console.log('----emit click', a.firstChild)
		Emitter.emit(a.firstChild, 'click', true, true);

		assert.equal(i, 0);
	});

	it('Delegate with swapped order of params', function(){
			if (!doc) return;

		var i = 0, j = 0;
		var el = document.createElement('div');
		document.body.appendChild(el);

		var inc = function(){
			i++;
		};

		Emitter.delegate(document, 'hello', 'p, div, .some', inc);

		var sideLink = document.createElement('span');
		document.body.appendChild(sideLink);

		Emitter.on(sideLink, 'hello', function(){
			j++;
		});

		//emit not bubbling evt
		Emitter.emit(document.body, 'hello');
		assert.equal(i, 0);

		//emit bubbling evt on passing element
		Emitter.emit(el, 'hello', null, true);
		assert.equal(i, 1);

		//emit not passing element bubbling evt (should be ignored)
		Emitter.emit(sideLink, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);


		//unbind delegate
		Emitter.off(document, 'hello');

		//emit bubbling evt on passing element (should be ignored)
		Emitter.emit(el, 'hello', null, true);
		assert.equal(i, 1);
		assert.equal(j, 1);
	});

	it('Keypass', function(){
		if (!doc) return;

		var k = 0, a = 0, ka=0, z = 0;
		var el = document.createElement("div");

		Emitter.keypass(el, "keydown", function(e){
			z++;
		});
		Emitter.keypass(el, "keydown", function(e){
			a++;
		}, 83);
		Emitter.keypass(el, "keydown", function(e){
			k++;
		}, 'enter');
		Emitter.keypass(el, "keydown", function(e){
			ka++;
		}, [65, 'enter', '68']);


		var evt = createKeyEvt("keydown", 65);
		Emitter.emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 0);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s
		evt = createKeyEvt("keydown", 83);
		Emitter.emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 1);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s2
		evt = createKeyEvt("keydown", 83);
		Emitter.emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		//enter
		evt = createKeyEvt("keydown", 13);
		Emitter.emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 1);
		assert.equal(ka, 2);
	});

	it('Later', function(done){
		var a = {};
		var i = 0;

		Emitter.later(a, 'x', 100, function(){
			i++;
		});

		Emitter.emit(a, 'x');
		assert.equal(i, 0);

		setTimeout(function(){
			assert.equal(i, 0);
		}, 50);

		setTimeout(function(){
			assert.equal(i, 1);
			done();
		}, 120);
	});


	it('ignore empty target', function(){
		Emitter.on(null, 'click', function(){});
		Emitter.once(null, 'click', function(){});
		Emitter.off(null, 'click', function(){});
		Emitter.emit(null, 'click');
	});



	it("delegateTarget", function(){
		if (window.mochaPhantomJS) return;

		var a = document.createElement('div');
		a.className = 'd';
		var b = document.createElement('div');
		a.appendChild(b);
		document.body.appendChild(a);

		var cTarget;
		Emitter.delegate(document, 'click', '.d', function(e){
			cTarget = e.delegateTarget;
		});
		Emitter.emit(b, 'click', null, true);
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
