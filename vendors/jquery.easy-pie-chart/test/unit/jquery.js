describe('Unit testing jQuery version of easy pie chart', function() {
	var $el;

	var createInstance = function(options, el) {
		options = options || {};
		el = el || '<span class="chart"></span>';
		return function() {
			$el = $(el);
			$('body').append($el);
			$el.easyPieChart(options);
		};
	};

	describe('initialize plugin', function() {
		beforeEach(createInstance());

		it('should insert a canvas element', function() {
			expect($el.html()).toContain('canvas');
		});
	});


	describe('takes size option and', function() {
		var $canvas;
		beforeEach(createInstance({
			size: 200
		}));

		beforeEach(function() {
			$canvas = $el.find('canvas');
		});

		it('set correct width', function() {
			expect($canvas.width()).toBe(200);
		});

		it('set correct height', function() {
			expect($canvas.height()).toBe(200);
		});
	});

	describe('options should be overwritable by data attributes', function() {
		var $canvas;
		beforeEach(createInstance({
			size: 200
		}, '<span class="chart" data-size="400"></span>'));

		beforeEach(function() {
			$canvas = $el.find('canvas');
		});

		it('overwrite width', function() {
			expect($canvas.width()).toBe(400);
		});

		it('overwrite height', function() {
			expect($canvas.height()).toBe(400);
		});
	});

});
