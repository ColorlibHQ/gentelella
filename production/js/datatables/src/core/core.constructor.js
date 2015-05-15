var i=0, iLen, j, jLen, k, kLen;
var sId = this.getAttribute( 'id' );
var bInitHandedOff = false;
var bUsePassedData = false;
var oInitEmpty = oInit === undefined ? true : false;


/* Sanity check */
if ( this.nodeName.toLowerCase() != 'table' )
{
	_fnLog( null, 0, "Attempted to initialise DataTables on a node which is not a "+
		"table: "+this.nodeName );
	return;
}

/* Convert the camel-case defaults to Hungarian */
_fnCamelToHungarian( DataTable.defaults, DataTable.defaults, true );
_fnCamelToHungarian( DataTable.defaults.column, DataTable.defaults.column, true );

/* Setting up the initialisation object */
if ( !oInit )
{
	oInit = {};
}
_fnCamelToHungarian( DataTable.defaults, oInit );

/* Check to see if we are re-initialising a table */
for ( i=0, iLen=DataTable.settings.length ; i<iLen ; i++ )
{
	/* Base check on table node */
	if ( DataTable.settings[i].nTable == this )
	{
		if ( oInitEmpty || oInit.bRetrieve )
		{
			return DataTable.settings[i].oInstance;
		}
		else if ( oInit.bDestroy )
		{
			DataTable.settings[i].oInstance.fnDestroy();
			break;
		}
		else
		{
			_fnLog( DataTable.settings[i], 0, "Cannot reinitialise DataTable.\n\n"+
				"To retrieve the DataTables object for this table, pass no arguments or see "+
				"the docs for bRetrieve and bDestroy" );
			return;
		}
	}
	
	/* If the element we are initialising has the same ID as a table which was previously
	 * initialised, but the table nodes don't match (from before) then we destroy the old
	 * instance by simply deleting it. This is under the assumption that the table has been
	 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
	 */
	if ( DataTable.settings[i].sTableId == this.id )
	{
		DataTable.settings.splice( i, 1 );
		break;
	}
}

/* Ensure the table has an ID - required for accessibility */
if ( sId === null || sId === "" )
{
	sId = "DataTables_Table_"+(DataTable.ext._oExternConfig.iNextUnique++);
	this.id = sId;
}

/* Create the settings object for this table and set some of the default parameters */
var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
	"nTable":        this,
	"oApi":          _that.oApi,
	"oInit":         oInit,
	"sDestroyWidth": $(this).width(),
	"sInstance":     sId,
	"sTableId":      sId
} );
DataTable.settings.push( oSettings );

// Need to add the instance after the instance after the settings object has been added
// to the settings array, so we can self reference the table instance if more than one
oSettings.oInstance = (_that.length===1) ? _that : $(this).dataTable();

// Backwards compatibility, before we apply all the defaults
if ( oInit.oLanguage )
{
	_fnLanguageCompat( oInit.oLanguage );
}

oInit = _fnExtend( $.extend(true, {}, DataTable.defaults), oInit );

// Map the initialisation options onto the settings object
_fnMap( oSettings.oFeatures, oInit, "bPaginate" );
_fnMap( oSettings.oFeatures, oInit, "bLengthChange" );
_fnMap( oSettings.oFeatures, oInit, "bFilter" );
_fnMap( oSettings.oFeatures, oInit, "bSort" );
_fnMap( oSettings.oFeatures, oInit, "bInfo" );
_fnMap( oSettings.oFeatures, oInit, "bProcessing" );
_fnMap( oSettings.oFeatures, oInit, "bAutoWidth" );
_fnMap( oSettings.oFeatures, oInit, "bSortClasses" );
_fnMap( oSettings.oFeatures, oInit, "bServerSide" );
_fnMap( oSettings.oFeatures, oInit, "bDeferRender" );
_fnMap( oSettings.oScroll, oInit, "sScrollX", "sX" );
_fnMap( oSettings.oScroll, oInit, "sScrollXInner", "sXInner" );
_fnMap( oSettings.oScroll, oInit, "sScrollY", "sY" );
_fnMap( oSettings.oScroll, oInit, "bScrollCollapse", "bCollapse" );
_fnMap( oSettings.oScroll, oInit, "bScrollInfinite", "bInfinite" );
_fnMap( oSettings.oScroll, oInit, "iScrollLoadGap", "iLoadGap" );
_fnMap( oSettings.oScroll, oInit, "bScrollAutoCss", "bAutoCss" );
_fnMap( oSettings, oInit, "asStripeClasses" );
_fnMap( oSettings, oInit, "fnServerData" );
_fnMap( oSettings, oInit, "fnFormatNumber" );
_fnMap( oSettings, oInit, "sServerMethod" );
_fnMap( oSettings, oInit, "aaSorting" );
_fnMap( oSettings, oInit, "aaSortingFixed" );
_fnMap( oSettings, oInit, "aLengthMenu" );
_fnMap( oSettings, oInit, "sPaginationType" );
_fnMap( oSettings, oInit, "sAjaxSource" );
_fnMap( oSettings, oInit, "sAjaxDataProp" );
_fnMap( oSettings, oInit, "iCookieDuration", "iStateDuration" ); // backwards compat
_fnMap( oSettings, oInit, "iStateDuration" );
_fnMap( oSettings, oInit, "sDom" );
_fnMap( oSettings, oInit, "bSortCellsTop" );
_fnMap( oSettings, oInit, "iTabIndex" );
_fnMap( oSettings, oInit, "oSearch", "oPreviousSearch" );
_fnMap( oSettings, oInit, "aoSearchCols", "aoPreSearchCols" );
_fnMap( oSettings, oInit, "iDisplayLength", "_iDisplayLength" );
_fnMap( oSettings, oInit, "bJQueryUI", "bJUI" );
_fnMap( oSettings, oInit, "fnStateLoadCallback" );
_fnMap( oSettings, oInit, "fnStateSaveCallback" );
_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );

/* Callback functions which are array driven */
_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );

if ( oSettings.oFeatures.bServerSide && oSettings.oFeatures.bSort &&
	   oSettings.oFeatures.bSortClasses )
{
	/* Enable sort classes for server-side processing. Safe to do it here, since server-side
	 * processing must be enabled by the developer
	 */
	_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSortingClasses, 'server_side_sort_classes' );
}
else if ( oSettings.oFeatures.bDeferRender )
{
	_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSortingClasses, 'defer_sort_classes' );
}

if ( oInit.bJQueryUI )
{
	/* Use the JUI classes object for display. You could clone the oStdClasses object if 
	 * you want to have multiple tables with multiple independent classes 
	 */
	$.extend( oSettings.oClasses, DataTable.ext.oJUIClasses );
	
	if ( oInit.sDom === DataTable.defaults.sDom && DataTable.defaults.sDom === "lfrtip" )
	{
		/* Set the DOM to use a layout suitable for jQuery UI's theming */
		oSettings.sDom = '<"H"lfr>t<"F"ip>';
	}
}
else
{
	$.extend( oSettings.oClasses, DataTable.ext.oStdClasses );
}
$(this).addClass( oSettings.oClasses.sTable );

/* Calculate the scroll bar width and cache it for use later on */
if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
{
	oSettings.oScroll.iBarWidth = _fnScrollBarWidth();
}

if ( oSettings.iInitDisplayStart === undefined )
{
	/* Display start point, taking into account the save saving */
	oSettings.iInitDisplayStart = oInit.iDisplayStart;
	oSettings._iDisplayStart = oInit.iDisplayStart;
}

/* Must be done after everything which can be overridden by the state saving! */
if ( oInit.bStateSave )
{
	oSettings.oFeatures.bStateSave = true;
	_fnLoadState( oSettings, oInit );
	_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
}

if ( oInit.iDeferLoading !== null )
{
	oSettings.bDeferLoading = true;
	var tmp = $.isArray( oInit.iDeferLoading );
	oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
	oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
}

if ( oInit.aaData !== null )
{
	bUsePassedData = true;
}

/* Language definitions */
if ( oInit.oLanguage.sUrl !== "" )
{
	/* Get the language definitions from a file - because this Ajax call makes the language
	 * get async to the remainder of this function we use bInitHandedOff to indicate that 
	 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
	 */
	oSettings.oLanguage.sUrl = oInit.oLanguage.sUrl;
	$.getJSON( oSettings.oLanguage.sUrl, null, function( json ) {
		_fnLanguageCompat( json );
		_fnCamelToHungarian( DataTable.defaults.oLanguage, json );
		$.extend( true, oSettings.oLanguage, oInit.oLanguage, json );
		_fnInitialise( oSettings );
	} );
	bInitHandedOff = true;
}
else
{
	$.extend( true, oSettings.oLanguage, oInit.oLanguage );
}


/*
 * Stripes
 */
if ( oInit.asStripeClasses === null )
{
	oSettings.asStripeClasses =[
		oSettings.oClasses.sStripeOdd,
		oSettings.oClasses.sStripeEven
	];
}

/* Remove row stripe classes if they are already on the table row */
var stripeClasses = oSettings.asStripeClasses;
if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
	return $('tbody tr:eq(0)', this).hasClass(el);
} ) ) !== -1 ) {
	$('tbody tr', this).removeClass( stripeClasses.join(' ') );
	oSettings.asDestroyStripes = stripeClasses.slice();
}

/*
 * Columns
 * See if we should load columns automatically or use defined ones
 */
var anThs = [];
var aoColumnsInit;
var nThead = this.getElementsByTagName('thead');
if ( nThead.length !== 0 )
{
	_fnDetectHeader( oSettings.aoHeader, nThead[0] );
	anThs = _fnGetUniqueThs( oSettings );
}

/* If not given a column array, generate one with nulls */
if ( oInit.aoColumns === null )
{
	aoColumnsInit = [];
	for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
	{
		aoColumnsInit.push( null );
	}
}
else
{
	aoColumnsInit = oInit.aoColumns;
}

/* Add the columns */
for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
{
	/* Short cut - use the loop to check if we have column visibility state to restore */
	if ( oInit.saved_aoColumns !== undefined && oInit.saved_aoColumns.length == iLen )
	{
		if ( aoColumnsInit[i] === null )
		{
			aoColumnsInit[i] = {};
		}
		aoColumnsInit[i].bVisible = oInit.saved_aoColumns[i].bVisible;
	}
	
	_fnAddColumn( oSettings, anThs ? anThs[i] : null );
}

/* Apply the column definitions */
_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
	_fnColumnOptions( oSettings, iCol, oDef );
} );


/*
 * Sorting
 * Check the aaSorting array
 */
for ( i=0, iLen=oSettings.aaSorting.length ; i<iLen ; i++ )
{
	if ( oSettings.aaSorting[i][0] >= oSettings.aoColumns.length )
	{
		oSettings.aaSorting[i][0] = 0;
	}
	var oColumn = oSettings.aoColumns[ oSettings.aaSorting[i][0] ];
	
	/* Add a default sorting index */
	if ( oSettings.aaSorting[i][2] === undefined )
	{
		oSettings.aaSorting[i][2] = 0;
	}
	
	/* If aaSorting is not defined, then we use the first indicator in asSorting */
	if ( oInit.aaSorting === undefined && oSettings.saved_aaSorting === undefined )
	{
		oSettings.aaSorting[i][1] = oColumn.asSorting[0];
	}
	
	/* Set the current sorting index based on aoColumns.asSorting */
	for ( j=0, jLen=oColumn.asSorting.length ; j<jLen ; j++ )
	{
		if ( oSettings.aaSorting[i][1] == oColumn.asSorting[j] )
		{
			oSettings.aaSorting[i][2] = j;
			break;
		}
	}
}
	
/* Do a first pass on the sorting classes (allows any size changes to be taken into
 * account, and also will apply sorting disabled classes if disabled
 */
_fnSortingClasses( oSettings );


/*
 * Final init
 * Cache the header, body and footer as required, creating them if needed
 */

/* Browser support detection */
_fnBrowserDetect( oSettings );

// Work around for Webkit bug 83867 - store the caption-side before removing from doc
var captions = $(this).children('caption').each( function () {
	this._captionSide = $(this).css('caption-side');
} );

var thead = $(this).children('thead');
if ( thead.length === 0 )
{
	thead = [ document.createElement( 'thead' ) ];
	this.appendChild( thead[0] );
}
oSettings.nTHead = thead[0];

var tbody = $(this).children('tbody');
if ( tbody.length === 0 )
{
	tbody = [ document.createElement( 'tbody' ) ];
	this.appendChild( tbody[0] );
}
oSettings.nTBody = tbody[0];
oSettings.nTBody.setAttribute( "role", "alert" );
oSettings.nTBody.setAttribute( "aria-live", "polite" );
oSettings.nTBody.setAttribute( "aria-relevant", "all" );

var tfoot = $(this).children('tfoot');
if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
{
	// If we are a scrolling table, and no footer has been given, then we need to create
	// a tfoot element for the caption element to be appended to
	tfoot = [ document.createElement( 'tfoot' ) ];
	this.appendChild( tfoot[0] );
}

if ( tfoot.length > 0 )
{
	oSettings.nTFoot = tfoot[0];
	_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
}

/* Check if there is data passing into the constructor */
if ( bUsePassedData )
{
	for ( i=0 ; i<oInit.aaData.length ; i++ )
	{
		_fnAddData( oSettings, oInit.aaData[ i ] );
	}
}
else if ( oSettings.bDeferLoading || oSettings.sAjaxSource === null )
{
	/* Grab the data from the page - only do this when deferred loading or no Ajax
	 * source since there is no point in reading the DOM data if we are then going
	 * to replace it with Ajax data
	 */
	_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
}

/* Copy the data index array */
oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();

/* Initialisation complete - table can be drawn */
oSettings.bInitialised = true;

/* Check if we need to initialise the table (it might not have been handed off to the
 * language processor)
 */
if ( bInitHandedOff === false )
{
	_fnInitialise( oSettings );
}
