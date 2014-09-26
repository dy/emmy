var Emmy = require('../index');
var icicle = require('icicle');

var emmy = new Emmy;


describe('MicroEvents', function(){
	it('fire plain objects', function(){
		var a = {};
		var i = 0;
		Emmy.on(a, 'click', function(){i++});
		Emmy.emit(a, 'click');
		assert.equal(i, 1);

		Emmy.off(a, 'click');
		Emmy.emit(a, 'click');
		assert.equal(i, 1);
	});

	it ("recursion in unbind all", function(){
		var a = {};
		Emmy.on(a, 'y', function(){});
		Emmy.off(a, 'x');
	});

	it.skip("emit click in IE8, IE9", function(){

	});

	it("changed call list", function(){
		var a = {}, log = [];

		Emmy.on(a, 'x', function(){
			Emmy.off(a, 'x');
			log.push(1);
		});

		Emmy.on(a, 'x', function(){
			log.push(2)
		})

		Emmy.on(a, 'x', function(){
			log.push(3)
		})

		Emmy.emit(a, 'x')

		assert.deepEqual(log, [1,2,3])
	});

	it("Objects artifically implementing Emitter interface", function(){
		var i = 0;
		var a = {
			emit: function(a){
				Emmy.emit(this, a);
			},
			fn: function(){
				i++;
			},
			on: function(a, b){
				Emmy.on(this, a, b);
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