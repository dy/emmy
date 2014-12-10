var doc = typeof document === 'undefined' ? undefined : document;
var win = typeof window === 'undefined' ? undefined : window;

var Emitter = doc && typeof Emitter !== 'undefined' ? Emitter : require('..');
var assert = typeof chai !== 'undefined' ? chai.assert : require('chai').assert;

var on = require('../on');
var off = require('../off');
var emit = require('../emit');
var throttle = require('../throttle');
var later = require('../later');
var keypass = require('../keypass');
var delegate = require('../delegate');
var not = require('../not');


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

	it ('removeAll', function(){
		var a = {};
		Emitter.on(a, 'y', function(){});
		Emitter.off(a, 'x');
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

		assert.equal(i, 1);
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

	it.skip('pass data & bubbles to emit', function(){
		var a = new Emitter;
		//TODO
	});

	it.skip('List of targets', function(){

	});

	it.skip('Batch events', function(){

	});

	it('Throttle', function(done){
		var i = 0;
		var a = {};

		//should be called 10 times less often than dispatched event
		throttle(a, 'x', function(){
			i++;
			// console.log(new Date - initT);
			assert.equal(this, a);
		}, 50);

		var interval = setInterval(function(){
			emit(a, 'x');
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


	it('Delegate', function(){
		var i = 0, j = 0;
		var el = document.createElement('div');
		document.body.appendChild(el);

		var inc = function(){
			i++;
		};

		delegate(document, 'hello', inc, 'p, div, .some');

		var sideLink = document.createElement('span');
		document.body.appendChild(sideLink);

		on(sideLink, 'hello', function(){
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


	it('Keypass', function(){
		var k = 0, a = 0, ka=0, z = 0;
		var el = document.createElement("div");

		keypass(el, "keydown", function(e){
			z++;
		});
		keypass(el, "keydown", function(e){
			a++;
		}, 83);
		keypass(el, "keydown", function(e){
			k++;
		}, 'enter');
		keypass(el, "keydown", function(e){
			ka++;
		}, [65, 'enter', '68']);


		var evt = createKeyEvt("keydown", 65);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 0);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s
		evt = createKeyEvt("keydown", 83);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 1);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		// s2
		evt = createKeyEvt("keydown", 83);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 0);
		assert.equal(ka, 1);

		//enter
		evt = createKeyEvt("keydown", 13);
		emit(el, evt);
		assert.equal(z, 0);
		assert.equal(a, 2);
		assert.equal(k, 1);
		assert.equal(ka, 2);
	});

	it('Later', function(done){
		var a = document.createElement('div');
		var i = 0;

		later(a, 'x', function(){
			i++;
		}, 100);

		emit(a, 'x');
		assert.equal(i, 0);

		setTimeout(function(){
			assert.equal(i, 0);
		}, 50);

		setTimeout(function(){
			assert.equal(i, 1);
			done();
		}, 110);
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
