// DATA_TEMPLATE: js_data
oTest.fnStart( "bAutoWidth" );

/* It's actually a little tricky to test this. We can't test absolute numbers because
 * different browsers and different platforms will render the width of the columns slightly
 * differently. However, we certainly can test the principle of what should happen (column 
 * width doesn't change over pages)
 */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"aaData": gaaData
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnTest( 
		"Auto width is enabled by default",
		null,
		function () { return oSettings.oFeatures.bAutoWidth; }
	);
	
	oTest.fnTest( 
		"First column has a width assigned to it",
		null,
		function () { return $('#example thead th:eq(0)').attr('style').match(/width/i); }
	);
	
	/*
	This would seem like a better test - but there appear to be difficulties with tables
	which are bigger (calculated) than there is actually room for. I suspect this is actually
	a bug in datatables
	oTest.fnTest( 
		"Check column widths on first page match second page",
		null,
		function () {
			var anThs = $('#example thead th');
			var a0 = anThs[0].offsetWidth;
			var a1 = anThs[1].offsetWidth;
			var a2 = anThs[2].offsetWidth;
			var a3 = anThs[3].offsetWidth;
			var a4 = anThs[4].offsetWidth;
			$('#example_next').click();
			var b0 = anThs[0].offsetWidth;
			var b1 = anThs[1].offsetWidth;
			var b2 = anThs[2].offsetWidth;
			var b3 = anThs[3].offsetWidth;
			var b4 = anThs[4].offsetWidth;
			console.log( a0, b0, a1, b1, a2, b2, a3, b3 );
			if ( a0==b0 && a1==b1 && a2==b2 && a3==b3 )
				return true;
			else
				return false;
		}
	);
	
	oTest.fnTest( 
		"Check column widths on second page match thid page",
		null,
		function () {
			var anThs = $('#example thead th');
			var a0 = anThs[0].offsetWidth;
			var a1 = anThs[1].offsetWidth;
			var a2 = anThs[2].offsetWidth;
			var a3 = anThs[3].offsetWidth;
			var a4 = anThs[4].offsetWidth;
			$('#example_next').click();
			var b0 = anThs[0].offsetWidth;
			var b1 = anThs[1].offsetWidth;
			var b2 = anThs[2].offsetWidth;
			var b3 = anThs[3].offsetWidth;
			var b4 = anThs[4].offsetWidth;
			if ( a0==b0 && a1==b1 && a2==b2 && a3==b3 )
				return true;
			else
				return false;
		}
	);
	*/
	
	/* Check can disable */
	oTest.fnTest( 
		"Auto width can be disabled",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"bAutoWidth": false
			} );
	 		oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bAutoWidth == false; }
	);
	
	oTest.fnTest( 
		"First column does not have a width assigned to it",
		null,
		function () { return $('#example thead th:eq(0)').attr('style') == null; }
	);
	
	/*
	oTest.fnTest( 
		"Check column widths on first page do not match second page",
		null,
		function () {
			var anThs = $('#example thead th');
			var a0 = anThs[0].offsetWidth;
			var a1 = anThs[1].offsetWidth;
			var a2 = anThs[2].offsetWidth;
			var a3 = anThs[3].offsetWidth;
			var a4 = anThs[4].offsetWidth;
			$('#example_next').click();
			var b0 = anThs[0].offsetWidth;
			var b1 = anThs[1].offsetWidth;
			var b2 = anThs[2].offsetWidth;
			var b3 = anThs[3].offsetWidth;
			var b4 = anThs[4].offsetWidth;
			if ( a0==b0 && a1==b1 && a2==b2 && a3==b3 )
				return false;
			else
				return true;
		}
	);
	*/
	
	/* Enable makes no difference */
	oTest.fnTest( 
		"Auto width enabled override",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"aaData": gaaData,
				"bAutoWidth": true
			} );
	 		oSettings = oTable.fnSettings();
		},
		function () { return oSettings.oFeatures.bAutoWidth; }
	);
	
	
	oTest.fnComplete();
} );