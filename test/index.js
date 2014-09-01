var evt = require('../index');
var assert = require('chai').assert;

describe('MicroEvents', function(){
	it('fire plain objects', function(){
		var a = {};
		var i = 0;
		evt.on(a, 'click', function(){i++})
		evt.emit(a, 'click');
		assert.equal(i, 1);

		evt.off(a, 'click');
		evt.emit(a, 'click');
		assert.equal(i, 1)
	})

	it ("recursion in unbind all", function(){
		var a = {};
		evt.on(a, 'y', function(){})
		evt.off(a, 'x')
	})

	it.skip("emit click in IE8, IE9", function(){

	})

	it("changed call list", function(){
		var a = {}, log = [];

		evt.on(a, 'x', function(){
			evt.off(a, 'x');
			log.push(1)
		})

		evt.on(a, 'x', function(){
			log.push(2)
		})

		evt.on(a, 'x', function(){
			log.push(3)
		})

		evt.emit(a, 'x')

		assert.deepEqual(log, [1,2,3])
	})
})