// DATA_TEMPLATE: empty_table
oTest.fnStart( "Sanity checks for DataTables with data from JS - Deep data source" );

oTest.fnTest( 
	"jQuery.dataTable function",
	null,
	function () { return typeof jQuery().dataTable == "function"; }
);

oTest.fnTest(
	"jQuery.dataTableSettings storage array",
	null,
	function () { return typeof jQuery().dataTableSettings == "object"; }
);

oTest.fnTest(
	"jQuery.dataTableExt plugin object",
	null,
	function () { return typeof jQuery().dataTableExt == "object"; }
);

$(document).ready( function () {
	var oInit = {
		"aoColumns": [
			{ "mData": "engine" },
			{ "mData": "browser" },
			{ "mData": "platform.inner" },
			{ "mData": "platform.details.0" },
			{ "mData": "platform.details.1" }
		],
		"aaData": [
	{
		"engine": "Trident",
		"browser": "Internet Explorer 4.0",
		"platform": {
			"inner": "Win 95+",
			"details": [
				"4",
				"X"
			]
		}
	},
	{
		"engine": "Trident",
		"browser": "Internet Explorer 5.0",
		"platform": {
			"inner": "Win 95+",
			"details": [
				"5",
				"C"
			]
		}
	},
	{
		"engine": "Trident",
		"browser": "Internet Explorer 5.5",
		"platform": {
			"inner": "Win 95+",
			"details": [
				"5.5",
				"A"
			]
		}
	},
	{
		"engine": "Trident",
		"browser": "Internet Explorer 6",
		"platform": {
			"inner": "Win 98+",
			"details": [
				"6",
				"A"
			]
		}
	},
	{
		"engine": "Trident",
		"browser": "Internet Explorer 7",
		"platform": {
			"inner": "Win XP SP2+",
			"details": [
				"7",
				"A"
			]
		}
	},
	{
		"engine": "Trident",
		"browser": "AOL browser (AOL desktop)",
		"platform": {
			"inner": "Win XP",
			"details": [
				"6",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Firefox 1.0",
		"platform": {
			"inner": "Win 98+ / OSX.2+",
			"details": [
				"1.7",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Firefox 1.5",
		"platform": {
			"inner": "Win 98+ / OSX.2+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Firefox 2.0",
		"platform": {
			"inner": "Win 98+ / OSX.2+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Firefox 3.0",
		"platform": {
			"inner": "Win 2k+ / OSX.3+",
			"details": [
				"1.9",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Camino 1.0",
		"platform": {
			"inner": "OSX.2+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Camino 1.5",
		"platform": {
			"inner": "OSX.3+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Netscape 7.2",
		"platform": {
			"inner": "Win 95+ / Mac OS 8.6-9.2",
			"details": [
				"1.7",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Netscape Browser 8",
		"platform": {
			"inner": "Win 98SE+",
			"details": [
				"1.7",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Netscape Navigator 9",
		"platform": {
			"inner": "Win 98+ / OSX.2+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.0",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.1",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.1,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.2",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.2,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.3",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.3,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.4",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.4,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.5",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.5,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.6",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				1.6,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.7",
		"platform": {
			"inner": "Win 98+ / OSX.1+",
			"details": [
				1.7,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Mozilla 1.8",
		"platform": {
			"inner": "Win 98+ / OSX.1+",
			"details": [
				1.8,
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Seamonkey 1.1",
		"platform": {
			"inner": "Win 98+ / OSX.2+",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Gecko",
		"browser": "Epiphany 2.20",
		"platform": {
			"inner": "Gnome",
			"details": [
				"1.8",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "Safari 1.2",
		"platform": {
			"inner": "OSX.3",
			"details": [
				"125.5",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "Safari 1.3",
		"platform": {
			"inner": "OSX.3",
			"details": [
				"312.8",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "Safari 2.0",
		"platform": {
			"inner": "OSX.4+",
			"details": [
				"419.3",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "Safari 3.0",
		"platform": {
			"inner": "OSX.4+",
			"details": [
				"522.1",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "OmniWeb 5.5",
		"platform": {
			"inner": "OSX.4+",
			"details": [
				"420",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "iPod Touch / iPhone",
		"platform": {
			"inner": "iPod",
			"details": [
				"420.1",
				"A"
			]
		}
	},
	{
		"engine": "Webkit",
		"browser": "S60",
		"platform": {
			"inner": "S60",
			"details": [
				"413",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 7.0",
		"platform": {
			"inner": "Win 95+ / OSX.1+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 7.5",
		"platform": {
			"inner": "Win 95+ / OSX.2+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 8.0",
		"platform": {
			"inner": "Win 95+ / OSX.2+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 8.5",
		"platform": {
			"inner": "Win 95+ / OSX.2+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 9.0",
		"platform": {
			"inner": "Win 95+ / OSX.3+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 9.2",
		"platform": {
			"inner": "Win 88+ / OSX.3+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera 9.5",
		"platform": {
			"inner": "Win 88+ / OSX.3+",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Opera for Wii",
		"platform": {
			"inner": "Wii",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Nokia N800",
		"platform": {
			"inner": "N800",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Presto",
		"browser": "Nintendo DS browser",
		"platform": {
			"inner": "Nintendo DS",
			"details": [
				"8.5",
				"C/A<sup>1</sup>"
			]
		}
	},
	{
		"engine": "KHTML",
		"browser": "Konqureror 3.1",
		"platform": {
			"inner": "KDE 3.1",
			"details": [
				"3.1",
				"C"
			]
		}
	},
	{
		"engine": "KHTML",
		"browser": "Konqureror 3.3",
		"platform": {
			"inner": "KDE 3.3",
			"details": [
				"3.3",
				"A"
			]
		}
	},
	{
		"engine": "KHTML",
		"browser": "Konqureror 3.5",
		"platform": {
			"inner": "KDE 3.5",
			"details": [
				"3.5",
				"A"
			]
		}
	},
	{
		"engine": "Tasman",
		"browser": "Internet Explorer 4.5",
		"platform": {
			"inner": "Mac OS 8-9",
			"details": [
				"-",
				"X"
			]
		}
	},
	{
		"engine": "Tasman",
		"browser": "Internet Explorer 5.1",
		"platform": {
			"inner": "Mac OS 7.6-9",
			"details": [
				"1",
				"C"
			]
		}
	},
	{
		"engine": "Tasman",
		"browser": "Internet Explorer 5.2",
		"platform": {
			"inner": "Mac OS 8-X",
			"details": [
				"1",
				"C"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "NetFront 3.1",
		"platform": {
			"inner": "Embedded devices",
			"details": [
				"-",
				"C"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "NetFront 3.4",
		"platform": {
			"inner": "Embedded devices",
			"details": [
				"-",
				"A"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "Dillo 0.8",
		"platform": {
			"inner": "Embedded devices",
			"details": [
				"-",
				"X"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "Links",
		"platform": {
			"inner": "Text only",
			"details": [
				"-",
				"X"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "Lynx",
		"platform": {
			"inner": "Text only",
			"details": [
				"-",
				"X"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "IE Mobile",
		"platform": {
			"inner": "Windows Mobile 6",
			"details": [
				"-",
				"C"
			]
		}
	},
	{
		"engine": "Misc",
		"browser": "PSP browser",
		"platform": {
			"inner": "PSP",
			"details": [
				"-",
				"C"
			]
		}
	},
	{
		"engine": "Other browsers",
		"browser": "All others",
		"platform": {
			"inner": "-",
			"details": [
				"-",
				"U"
			]
		}
	}
]
	};
	$('#example').dataTable( oInit );
	
	/* Basic checks */
	oTest.fnWaitTest( 
		"Length changing div exists",
		null,
		function () { return document.getElementById('example_length') != null; }
	);
	
	oTest.fnTest( 
		"Filtering div exists",
		null,
		function () { return document.getElementById('example_filter') != null; }
	);
	
	oTest.fnTest( 
		"Information div exists",
		null,
		function () { return document.getElementById('example_info') != null; }
	);
	
	oTest.fnTest( 
		"Pagination div exists",
		null,
		function () { return document.getElementById('example_paginate') != null; }
	);
	
	oTest.fnTest( 
		"Processing div is off by default",
		null,
		function () { return document.getElementById('example_processing') == null; }
	);
	
	oTest.fnWaitTest( 
		"10 rows shown on the first page",
		null,
		function () { return $('#example tbody tr').length == 10; }
	);
	
	oTest.fnTest( 
		"Initial sort occured",
		null,
		function () { return $('#example tbody td:eq(0)').html() == "Gecko"; }
	);
	
	/* Need to use the WaitTest for sorting due to the setTimeout datatables uses */
	oTest.fnTest( 
		"Sorting (first click) on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnTest( 
		"Sorting (second click) on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnTest( 
		"Sorting (third click) on second column",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnTest( 
		"Sorting (first click) on numeric column",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "-"; }
	);
	
	oTest.fnTest( 
		"Sorting (second click) on numeric column",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody td:eq(3)').html() == "522.1"; }
	);
	
	oTest.fnTest( 
		"Sorting multi-column (first click)",
		function () { 
			$('#example thead th:eq(0)').click();
			oDispacher.click( $('#example thead th:eq(1)')[0], { 'shift': true } ); },
		function () { var b = 
			$('#example tbody td:eq(0)').html() == "Gecko" && 
			$('#example tbody td:eq(1)').html() == "Camino 1.0"; return b; }
	);
	
	oTest.fnTest( 
		"Sorting multi-column - sorting second column only",
		function () { 
			$('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	/* Basic paging */
	oTest.fnTest( 
		"Paging to second page",
		function () { $('#example_next').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "IE Mobile"; }
	);
	
	oTest.fnTest( 
		"Paging to first page",
		function () { $('#example_previous').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	oTest.fnTest( 
		"Attempting to page back beyond the first page",
		function () { $('#example_previous').click(); },
		function () { return $('#example tbody td:eq(1)').html() == "All others"; }
	);
	
	/* Changing length */
	oTest.fnTest( 
		"Changing table length to 25 records",
		function () { $("select[name=example_length]").val('25').change(); },
		function () { return $('#example tbody tr').length == 25; }
	);
	
	oTest.fnTest( 
		"Changing table length to 50 records",
		function () { $("select[name=example_length]").val('50').change(); },
		function () { return $('#example tbody tr').length == 50; }
	);
	
	oTest.fnTest( 
		"Changing table length to 100 records",
		function () { $("select[name=example_length]").val('100').change(); },
		function () { return $('#example tbody tr').length == 57; }
	);
	
	oTest.fnTest( 
		"Changing table length to 10 records",
		function () { $("select[name=example_length]").val('10').change(); },
		function () { return $('#example tbody tr').length == 10; }
	);
	
	/*
	 * Information element
	 */
	oTest.fnTest(
		"Information on zero config",
		null,
		function () { return document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information on second page",
		function () { $('#example_next').click(); },
		function () { return document.getElementById('example_info').innerHTML == "Showing 11 to 20 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information on third page",
		function () { $('#example_next').click(); },
		function () { return document.getElementById('example_info').innerHTML == "Showing 21 to 30 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information on last page",
		function () {
			$('#example_next').click();
			$('#example_next').click();
			$('#example_next').click();
		},
		function () { return document.getElementById('example_info').innerHTML == "Showing 51 to 57 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information back on first page",
		function () {
			$('#example_previous').click();
			$('#example_previous').click();
			$('#example_previous').click();
			$('#example_previous').click();
			$('#example_previous').click();
		},
		function () { return document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information with 25 records",
		function () { $("select[name=example_length]").val('25').change(); },
		function () { return document.getElementById('example_info').innerHTML == "Showing 1 to 25 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information with 25 records - second page",
		function () { $('#example_next').click(); },
		function () { return document.getElementById('example_info').innerHTML == "Showing 26 to 50 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information with 100 records - first page",
		function () {
			$('#example_previous').click();
			$("select[name=example_length]").val('100').change();
		},
		function () { return document.getElementById('example_info').innerHTML == "Showing 1 to 57 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information back to 10 records",
		function () {
			$('#example_previous').click();
			$("select[name=example_length]").val('10').change();
		},
		function () { return document.getElementById('example_info').innerHTML == "Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win'",
		function () { $('#example_filter input').val("Win").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win' second page",
		function () { $('#example_next').click(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 11 to 20 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win' last page",
		function () {
			$('#example_next').click();
			$('#example_next').click();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 31 to 31 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win' back to first page",
		function () {
			$('#example_previous').click();
			$('#example_previous').click();
			$('#example_previous').click();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win' second page - second time",
		function () {
			$('#example_next').click();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 11 to 20 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter increased to 'Win 98'",
		function () { $('#example_filter input').val("Win 98").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 9 of 9 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter decreased to 'Win'",
		function () { $('#example_filter input').val("Win").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter 'Win' second page - third time",
		function () {
			$('#example_next').click();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 11 to 20 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Information with filter removed",
		function () { $('#example_filter input').val("").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	
	/*
	 * Filtering
	 */
	oTest.fnWaitTest(
		"Filter 'W' - rows",
		function () { 
			/* Reset the table such that the old sorting doesn't mess things up */
			oSession.fnRestore();
			$('#example').dataTable( oInit );
			$('#example_filter input').val("W").keyup(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == "Gecko"; }
	);
	
	oTest.fnTest(
		"Filter 'W' - info",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 42 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter 'Wi'",
		function () { $('#example_filter input').val("Wi").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 32 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter 'Win'",
		function () { $('#example_filter input').val("Win").keyup(); },
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter 'Win' - sorting column 1",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "AOL browser (AOL desktop)"; }
	);
	
	oTest.fnTest(
		"Filter 'Win' - sorting column 1 info",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 31 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter 'Win' - sorting column 1 reverse",
		function () { $('#example thead th:eq(1)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "Seamonkey 1.1"; }
	);
	
	oTest.fnTest(
		"Filter 'Win XP' - maintaing reverse sorting col 1",
		function () { $('#example_filter input').val("Win XP").keyup(); },
		function () { return $('#example tbody tr:eq(0) td:eq(1)').html() == "Internet Explorer 7"; }
	);
	
	oTest.fnTest(
		"Filter 'Win XP' - sorting col 3",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == "4"; }
	);
	
	oTest.fnTest(
		"Filter 'Win XP' - sorting col 3 - reversed",
		function () { $('#example thead th:eq(3)').click(); },
		function () { return $('#example tbody tr:eq(0) td:eq(3)').html() == "7"; }
	);
	
	oTest.fnTest(
		"Filter 'Win' - sorting col 3 - reversed info",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 6 of 6 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter 'nothinghere'",
		function () { $('#example_filter input').val("nothinghere").keyup(); },
		function () { return $('#example tbody tr:eq(0) td:eq(0)').html() == 
			"No matching records found"; }
	);
	
	oTest.fnTest(
		"Filter 'nothinghere' - info",
		null,
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 0 to 0 of 0 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Filter back to blank and 1st column sorting",
		function () {
			$('#example_filter input').val("").keyup();
			$('#example thead th:eq(0)').click();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 57 entries"; }
	);
	
	oTest.fnTest(
		"Prefixing a filter entry",
		function () {
			$('#example_filter input').val("Win").keyup();
			$('#example_filter input').val("GeckoWin").keyup();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 0 to 0 of 0 entries (filtered from 57 total entries)"; }
	);
	
	oTest.fnTest(
		"Prefixing a filter entry with space",
		function () {
			$('#example_filter input').val("Gecko Win").keyup();
		},
		function () { return document.getElementById('example_info').innerHTML == 
			"Showing 1 to 10 of 17 entries (filtered from 57 total entries)"; }
	);
	
	
	
	
	
	
	
	
	oTest.fnComplete();
} );