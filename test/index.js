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
})