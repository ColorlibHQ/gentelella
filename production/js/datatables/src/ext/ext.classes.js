
$.extend( DataTable.ext.oStdClasses, {
	"sTable": "dataTable",

	/* Two buttons buttons */
	"sPagePrevEnabled": "paginate_enabled_previous",
	"sPagePrevDisabled": "paginate_disabled_previous",
	"sPageNextEnabled": "paginate_enabled_next",
	"sPageNextDisabled": "paginate_disabled_next",
	"sPageJUINext": "",
	"sPageJUIPrev": "",
	
	/* Full numbers paging buttons */
	"sPageButton": "paginate_button",
	"sPageButtonActive": "paginate_active",
	"sPageButtonStaticDisabled": "paginate_button paginate_button_disabled",
	"sPageFirst": "first",
	"sPagePrevious": "previous",
	"sPageNext": "next",
	"sPageLast": "last",
	
	/* Striping classes */
	"sStripeOdd": "odd",
	"sStripeEven": "even",
	
	/* Empty row */
	"sRowEmpty": "dataTables_empty",
	
	/* Features */
	"sWrapper": "dataTables_wrapper",
	"sFilter": "dataTables_filter",
	"sInfo": "dataTables_info",
	"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
	"sLength": "dataTables_length",
	"sProcessing": "dataTables_processing",
	
	/* Sorting */
	"sSortAsc": "sorting_asc",
	"sSortDesc": "sorting_desc",
	"sSortable": "sorting", /* Sortable in both directions */
	"sSortableAsc": "sorting_asc_disabled",
	"sSortableDesc": "sorting_desc_disabled",
	"sSortableNone": "sorting_disabled",
	"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	"sSortJUIAsc": "",
	"sSortJUIDesc": "",
	"sSortJUI": "",
	"sSortJUIAscAllowed": "",
	"sSortJUIDescAllowed": "",
	"sSortJUIWrapper": "",
	"sSortIcon": "",
	
	/* Scrolling */
	"sScrollWrapper": "dataTables_scroll",
	"sScrollHead": "dataTables_scrollHead",
	"sScrollHeadInner": "dataTables_scrollHeadInner",
	"sScrollBody": "dataTables_scrollBody",
	"sScrollFoot": "dataTables_scrollFoot",
	"sScrollFootInner": "dataTables_scrollFootInner",
	
	/* Misc */
	"sFooterTH": "",
	"sJUIHeader": "",
	"sJUIFooter": ""
} );


$.extend( DataTable.ext.oJUIClasses, DataTable.ext.oStdClasses, {
	/* Two buttons buttons */
	"sPagePrevEnabled": "fg-button ui-button ui-state-default ui-corner-left",
	"sPagePrevDisabled": "fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",
	"sPageNextEnabled": "fg-button ui-button ui-state-default ui-corner-right",
	"sPageNextDisabled": "fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",
	"sPageJUINext": "ui-icon ui-icon-circle-arrow-e",
	"sPageJUIPrev": "ui-icon ui-icon-circle-arrow-w",
	
	/* Full numbers paging buttons */
	"sPageButton": "fg-button ui-button ui-state-default",
	"sPageButtonActive": "fg-button ui-button ui-state-default ui-state-disabled",
	"sPageButtonStaticDisabled": "fg-button ui-button ui-state-default ui-state-disabled",
	"sPageFirst": "first ui-corner-tl ui-corner-bl",
	"sPageLast": "last ui-corner-tr ui-corner-br",
	
	/* Features */
	"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
		"ui-buttonset-multi paging_", /* Note that the type is postfixed */
	
	/* Sorting */
	"sSortAsc": "ui-state-default",
	"sSortDesc": "ui-state-default",
	"sSortable": "ui-state-default",
	"sSortableAsc": "ui-state-default",
	"sSortableDesc": "ui-state-default",
	"sSortableNone": "ui-state-default",
	"sSortJUIAsc": "css_right ui-icon ui-icon-triangle-1-n",
	"sSortJUIDesc": "css_right ui-icon ui-icon-triangle-1-s",
	"sSortJUI": "css_right ui-icon ui-icon-carat-2-n-s",
	"sSortJUIAscAllowed": "css_right ui-icon ui-icon-carat-1-n",
	"sSortJUIDescAllowed": "css_right ui-icon ui-icon-carat-1-s",
	"sSortJUIWrapper": "DataTables_sort_wrapper",
	"sSortIcon": "DataTables_sort_icon",
	
	/* Scrolling */
	"sScrollHead": "dataTables_scrollHead ui-state-default",
	"sScrollFoot": "dataTables_scrollFoot ui-state-default",
	
	/* Misc */
	"sFooterTH": "ui-state-default",
	"sJUIHeader": "fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix",
	"sJUIFooter": "fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"
} );

