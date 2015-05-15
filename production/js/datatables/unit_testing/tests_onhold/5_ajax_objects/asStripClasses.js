// DATA_TEMPLATE: empty_table
oTest.fnStart( "asStripeClasses" );

$(document).ready( function () {
	/* Check the default */
	$('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
		"aoColumns": [
			{ "mData": "engine" },
			{ "mData": "browser" },
			{ "mData": "platform" },
			{ "mData": "version" },
			{ "mData": "grade" }
		]
	} );
	
	oTest.fnWaitTest( 
		"Default row striping is applied",
		null,
		function () {
			return $('#example tbody tr:eq(0)').hasClass('odd') &&
			       $('#example tbody tr:eq(1)').hasClass('even') &&
			       $('#example tbody tr:eq(2)').hasClass('odd') &&
			       $('#example tbody tr:eq(3)').hasClass('even');
		}
	);
	
	oTest.fnWaitTest( 
		"Row striping on the second page",
		function () { $('#example_next').click(); },
		function () {
			return $('#example tbody tr:eq(0)').hasClass('odd') &&
			       $('#example tbody tr:eq(1)').hasClass('even') &&
			       $('#example tbody tr:eq(2)').hasClass('odd') &&
			       $('#example tbody tr:eq(3)').hasClass('even');
		}
	);
	
	/* No striping */
	oTest.fnWaitTest( 
		"No row striping",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"asStripeClasses": []
			} );
		},
		function () {
			if ( typeof $('#example tbody tr:eq(1)')[0] == 'undefined' )
			{
				/* Use the 'wait for' to allow this to become true */
				return false;
			}
			return $('#example tbody tr:eq(0)')[0].className == "" &&
			       $('#example tbody tr:eq(1)')[0].className == "" &&
			       $('#example tbody tr:eq(2)')[0].className == "" &&
			       $('#example tbody tr:eq(3)')[0].className == "";
		}
	);
	
	/* Custom striping */
	oTest.fnWaitTest( 
		"Custom striping [2]",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"asStripeClasses": [ 'test1', 'test2' ]
			} );
		},
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test1') &&
			       $('#example tbody tr:eq(3)').hasClass('test2');
		}
	);
	
	
	/* long array of striping */
	oTest.fnWaitTest( 
		"Custom striping [4]",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/objects.txt",
				"aoColumnDefs": [
					{ "mData": "engine", "aTargets": [0] },
					{ "mData": "browser", "aTargets": [1] },
					{ "mData": "platform", "aTargets": [2] },
					{ "mData": "version", "aTargets": [3] },
					{ "mData": "grade", "aTargets": [4] }
				],
				"asStripeClasses": [ 'test1', 'test2', 'test3', 'test4' ]
			} );
		},
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test3') &&
			       $('#example tbody tr:eq(3)').hasClass('test4');
		}
	);
	
	oTest.fnWaitTest( 
		"Custom striping is restarted on second page [2]",
		function () { $('#example_next').click(); },
		function () {
			return $('#example tbody tr:eq(0)').hasClass('test1') &&
			       $('#example tbody tr:eq(1)').hasClass('test2') &&
			       $('#example tbody tr:eq(2)').hasClass('test3') &&
			       $('#example tbody tr:eq(3)').hasClass('test4');
		}
	);
	
	
	oTest.fnComplete();
} );