var Emitter = require('../index');
var assert = require('chai').assert;


describe('Emmy cases', function(){
	it('fire plain objects', function(){
		var a = {};
		var i = 0;
		Emitter.on(a, 'click', function(){i++});
		Emitter.emit(a, 'click');
		assert.equal(i, 1);

		Emitter.off(a, 'click');
		Emitter.emit(a, 'click');
		assert.equal(i, 1);
	});

	it ("recursion in unbind all", function(){
		var a = {};
		Emitter.on(a, 'y', function(){});
		Emitter.off(a, 'x');
	});

	it.skip("emit click in IE8, IE9", function(){

	});

	it("changed call list", function(){
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

	it("Objects artifically implementing Emitter interface", function(){
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

	it('EventEmitter compliance', function(){
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

	it('Once method', function(){
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
});