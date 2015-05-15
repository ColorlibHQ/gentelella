// DATA_TEMPLATE: dom_data
oTest.fnStart( "Check behaviour of the data set functions that DataTables uses" );

$(document).ready( function () {
	// Slightly unusual test set this one, in that we don't really care about the DOM
	// but want to test the internal data handling functions but we do need a table to
	// get at the functions!
	var table = $('#example').dataTable();
	var fn, test, o;
	
	// Object property access
	oTest.fnTest(
		"Create property",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test');

			o = {};
			fn( o, true );
		},
		function () { return o.test }
	);
	
	oTest.fnTest(
		"Single property doesn't kill other properties",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test');

			o = {
				"test2": false
			};
			fn( o, true );
		},
		function () { return o.test && o.test2===false; }
	);
	
	oTest.fnTest(
		"Single property overwrite old property",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test');

			o = {
				"test": false,
				"test2": false
			};
			fn( o, true );
		},
		function () { return o.test && o.test2===false; }
	);


	// Nested
	oTest.fnTest(
		"Create nested property",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test.inner');

			o = {
				"test": {}
			};
			fn( o, true );
		},
		function () { return o.test.inner }
	);

	oTest.fnTest(
		"Deep create nested property",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test.inner');

			o = {};
			fn( o, true );
		},
		function () { return o.test.inner }
	);
	
	oTest.fnTest(
		"Nested property doesn't kill other properties",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test.inner');

			o = {
				"test": {
					"test2": false
				}
			};
			fn( o, true );
		},
		function () { return o.test.inner && o.test.test2===false; }
	);
	
	oTest.fnTest(
		"Single property overwrite old property",
		function () {
			fn = table.oApi._fnSetObjectDataFn('nested.test');

			o = {
				"nested": {
					"test": false,
					"test2": false
				}
			};
			fn( o, true );
		},
		function () { return o.nested.test && o.nested.test2===false; }
	);

	// Set arrays / objects
	oTest.fnTest(
		"Create object",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test');

			o = {};
			fn( o, {"a":true, "b":false} );
		},
		function () { return o.test.a && o.test.b===false }
	);

	oTest.fnTest(
		"Create nested object",
		function () {
			fn = table.oApi._fnSetObjectDataFn('nested.test');

			o = {};
			fn( o, {"a":true, "b":false} );
		},
		function () { return o.nested.test.a && o.nested.test.b===false }
	);

	oTest.fnTest(
		"Create array",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test');

			o = {};
			fn( o, [1,2,3] );
		},
		function () { return o.test[0]===1 && o.test[2]===3 }
	);

	oTest.fnTest(
		"Create nested array",
		function () {
			fn = table.oApi._fnSetObjectDataFn('nested.test');

			o = {};
			fn( o, [1,2,3] );
		},
		function () { return o.nested.test[0]===1 && o.nested.test[2]===3 }
	);


	// Array notation
	oTest.fnTest(
		"Create array of objects",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test[].a');

			o = {};
			fn( o, [1,2,3] );
		},
		function () { return o.test.length===3 && o.test[0].a===1 && o.test[1].a===2; }
	);

	oTest.fnTest(
		"Create array of nested objects",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test[].a.b');

			o = {};
			fn( o, [1,2,3] );
		},
		function () { return o.test.length===3 && o.test[0].a.b===1 && o.test[1].a.b===2; }
	);

	oTest.fnTest(
		"Create array",
		function () {
			fn = table.oApi._fnSetObjectDataFn('test[]');

			o = {};
			fn( o, [1,2,3] );
		},
		function () { return o.test.length===3 && o.test[0]===1 && o.test[1]===2; }
	);


	
	oTest.fnComplete();
} );