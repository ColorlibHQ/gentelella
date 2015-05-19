// DATA_TEMPLATE: empty_table
oTest.fnStart( "sDom" );

/* This is going to be brutal on the browser! There is a lot that can be tested here... */

$(document).ready( function () {
	/* Check the default */
	var oTable = $('#example').dataTable( {
		"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
		"bDeferRender": true
	} );
	var oSettings = oTable.fnSettings();
	
	oTest.fnWaitTest( 
		"Default DOM varaible",
		null,
		function () { return oSettings.sDom == "lfrtip"; }
	);
	
	oTest.fnWaitTest( 
		"Default DOM in document",
		null,
		function () {
			var nNodes = $('#demo div, #demo table');
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nLength &&
				nNodes[2] == nFilter &&
				nNodes[3] == nTable &&
				nNodes[4] == nInfo &&
				nNodes[5] == nPaging;
			return bReturn;
		}
	);
	
	oTest.fnWaitTest( 
		"Check example 1 in code propagates",
		function () {
			oSession.fnRestore();
			oTable = $('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": '<"wrapper"flipt>'
			} );
			oSettings = oTable.fnSettings();
		},
		function () { return oSettings.sDom == '<"wrapper"flipt>'; }
	);
	
	oTest.fnWaitTest( 
		"Check example 1 in DOM",
		null,
		function () {
			var jqNodes = $('#demo div, #demo table');
			var nNodes = [];
			
			/* Strip the paging nodes */
			for ( var i=0, iLen=jqNodes.length ; i<iLen ; i++ )
			{
				if ( jqNodes[i].getAttribute('id') != "example_previous" &&
				     jqNodes[i].getAttribute('id') != "example_next" )
				{
					nNodes.push( jqNodes[i] );
				}
			}
			
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			var nCustomWrapper = $('div.wrapper')[0];
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nCustomWrapper &&
				nNodes[2] == nFilter &&
				nNodes[3] == nLength &&
				nNodes[4] == nInfo &&
				nNodes[5] == nPaging &&
				nNodes[6] == nTable;
			return bReturn;
		}
	);
	
	oTest.fnWaitTest( 
		"Check example 2 in DOM",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": '<lf<t>ip>'
			} );
		},
		function () {
			var jqNodes = $('#demo div, #demo table');
			var nNodes = [];
			var nCustomWrappers = []
			
			/* Strip the paging nodes */
			for ( var i=0, iLen=jqNodes.length ; i<iLen ; i++ )
			{
				if ( jqNodes[i].getAttribute('id') != "example_previous" &&
				     jqNodes[i].getAttribute('id') != "example_next" )
				{
					nNodes.push( jqNodes[i] );
				}
				
				/* Only the two custom divs don't have class names */
				if ( jqNodes[i].className == "" )
				{
					nCustomWrappers.push( jqNodes[i] );
				}
			}
			
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nCustomWrappers[0] &&
				nNodes[2] == nLength &&
				nNodes[3] == nFilter &&
				nNodes[4] == nCustomWrappers[1] &&
				nNodes[5] == nTable &&
				nNodes[6] == nInfo &&
				nNodes[7] == nPaging;
			return bReturn;
		}
	);
	
	oTest.fnWaitTest( 
		"Check no length element",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": 'frtip'
			} );
		},
		function () {
			var nNodes = $('#demo div, #demo table');
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				null == nLength &&
				nNodes[1] == nFilter &&
				nNodes[2] == nTable &&
				nNodes[3] == nInfo &&
				nNodes[4] == nPaging;
			return bReturn;
		}
	);
	
	oTest.fnWaitTest( 
		"Check no filter element",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": 'lrtip'
			} );
		},
		function () {
			var nNodes = $('#demo div, #demo table');
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nLength &&
				null == nFilter &&
				nNodes[2] == nTable &&
				nNodes[3] == nInfo &&
				nNodes[4] == nPaging;
			return bReturn;
		}
	);
	
	/* Note we don't test for no table as this is not supported (and it would be fairly daft! */
	
	oTest.fnWaitTest( 
		"Check no info element",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": 'lfrtp'
			} );
		},
		function () {
			var nNodes = $('#demo div, #demo table');
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nLength &&
				nNodes[2] == nFilter &&
				nNodes[3] == nTable &&
				null == nInfo &&
				nNodes[4] == nPaging;
			return bReturn;
		}
	);
	
	oTest.fnWaitTest( 
		"Check no paging element",
		function () {
			oSession.fnRestore();
			$('#example').dataTable( {
				"sAjaxSource": "../../../examples/ajax/sources/arrays.txt",
				"bDeferRender": true,
				"sDom": 'lfrti'
			} );
		},
		function () {
			var nNodes = $('#demo div, #demo table');
			var nWrapper = document.getElementById('example_wrapper');
			var nLength = document.getElementById('example_length');
			var nFilter = document.getElementById('example_filter');
			var nInfo = document.getElementById('example_info');
			var nPaging = document.getElementById('example_paginate');
			var nTable = document.getElementById('example');
			
			var bReturn = 
				nNodes[0] == nWrapper &&
				nNodes[1] == nLength &&
				nNodes[2] == nFilter &&
				nNodes[3] == nTable &&
				nNodes[4] == nInfo &&
				null == nPaging;
			return bReturn;
		}
	);
	
	
	oTest.fnComplete();
} );