var Emmy = require('../index');
var icicle = require('icicle');

var emmy = new Emmy;


describe('MicroEvents', function(){
	it('fire plain objects', function(){
		var a = {};
		var i = 0;
		emmy.on.call(a, 'click', function(){i++});
		emmy.emit.call(a, 'click');
		assert.equal(i, 1);

		emmy.off.call(a, 'click');
		emmy.emit.call(a, 'click');
		assert.equal(i, 1);
	});

	it ("recursion in unbind all", function(){
		var a = {};
		emmy.on.call(a, 'y', function(){});
		emmy.off.call(a, 'x');
	});

	it.skip("emit click in IE8, IE9", function(){

	});

	it("changed call list", function(){
		var a = {}, log = [];

		emmy.on.call(a, 'x', function(){
			emmy.off.call(a, 'x');
			log.push(1);
		});

		emmy.on.call(a, 'x', function(){
			log.push(2)
		})

		emmy.on.call(a, 'x', function(){
			log.push(3)
		})

		emmy.emit.call(a, 'x')

		assert.deepEqual(log, [1,2,3])
	});

	it("Objects artifically implementing Emitter interface", function(){
		var i = 0;
		var a = {
			emit: function(a){
				emmy.emit.call(this, a);
			},
			fn: function(){
				i++;
			},
			on: function(a, b){
				emmy.on.call(this, a, b);
			}
		};

		a.on('fn', a.fn);
		a.emit('fn');
		assert.equal(i, 1);
	});

	it('Object inheriting Emitter interface', function(){
		var A = function (){};
		A.prototype = Object.create(Emmy.prototype);

		var i = 0;
		var a = new A;
		a.on('fn', function(){i++;});
		a.emit('fn');
		assert.equal(i, 1);
	});
});