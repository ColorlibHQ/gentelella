/**
 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
 * return the resulting jQuery object.
 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
 *    criterion ("applied") or all TR elements (i.e. no filter).
 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
 *    Can be either 'current', whereby the current sorting of the table is used, or
 *    'original' whereby the original order the data was read into the table is used.
 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be 
 *    'current' and filter is 'applied', regardless of what they might be given as.
 *  @returns {object} jQuery object, filtered by the given selector.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Highlight every second row
 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
 *    } );
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Filter to rows with 'Webkit' in them, add a background colour and then
 *      // remove the filter, thus highlighting the 'Webkit' rows only.
 *      oTable.fnFilter('Webkit');
 *      oTable.$('tr', {"filter": "applied"}).css('backgroundColor', 'blue');
 *      oTable.fnFilter('');
 *    } );
 */
this.$ = function ( sSelector, oOpts )
{
	var i, iLen, a = [], tr;
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var aoData = oSettings.aoData;
	var aiDisplay = oSettings.aiDisplay;
	var aiDisplayMaster = oSettings.aiDisplayMaster;

	if ( !oOpts )
	{
		oOpts = {};
	}

	oOpts = $.extend( {}, {
		"filter": "none", // applied
		"order": "current", // "original"
		"page": "all" // current
	}, oOpts );

	// Current page implies that order=current and fitler=applied, since it is fairly
	// senseless otherwise
	if ( oOpts.page == 'current' )
	{
		for ( i=oSettings._iDisplayStart, iLen=oSettings.fnDisplayEnd() ; i<iLen ; i++ )
		{
			tr = aoData[ aiDisplay[i] ].nTr;
			if ( tr )
			{
				a.push( tr );
			}
		}
	}
	else if ( oOpts.order == "current" && oOpts.filter == "none" )
	{
		for ( i=0, iLen=aiDisplayMaster.length ; i<iLen ; i++ )
		{
			tr = aoData[ aiDisplayMaster[i] ].nTr;
			if ( tr )
			{
				a.push( tr );
			}
		}
	}
	else if ( oOpts.order == "current" && oOpts.filter == "applied" )
	{
		for ( i=0, iLen=aiDisplay.length ; i<iLen ; i++ )
		{
			tr = aoData[ aiDisplay[i] ].nTr;
			if ( tr )
			{
				a.push( tr );
			}
		}
	}
	else if ( oOpts.order == "original" && oOpts.filter == "none" )
	{
		for ( i=0, iLen=aoData.length ; i<iLen ; i++ )
		{
			tr = aoData[ i ].nTr ;
			if ( tr )
			{
				a.push( tr );
			}
		}
	}
	else if ( oOpts.order == "original" && oOpts.filter == "applied" )
	{
		for ( i=0, iLen=aoData.length ; i<iLen ; i++ )
		{
			tr = aoData[ i ].nTr;
			if ( $.inArray( i, aiDisplay ) !== -1 && tr )
			{
				a.push( tr );
			}
		}
	}
	else
	{
		_fnLog( oSettings, 1, "Unknown selection options" );
	}

	/* We need to filter on the TR elements and also 'find' in their descendants
	 * to make the selector act like it would in a full table - so we need
	 * to build both results and then combine them together
	 */
	var jqA = $(a);
	var jqTRs = jqA.filter( sSelector );
	var jqDescendants = jqA.find( sSelector );

	return $( [].concat($.makeArray(jqTRs), $.makeArray(jqDescendants)) );
};


/**
 * Almost identical to $ in operation, but in this case returns the data for the matched
 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
 * rather than any descendants, so the data can be obtained for the row/cell. If matching
 * rows are found, the data returned is the original data array/object that was used to  
 * create the row (or a generated array if from a DOM source).
 *
 * This method is often useful in-combination with $ where both functions are given the
 * same parameters and the array indexes will match identically.
 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
 *    criterion ("applied") or all elements (i.e. no filter).
 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
 *    Can be either 'current', whereby the current sorting of the table is used, or
 *    'original' whereby the original order the data was read into the table is used.
 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be 
 *    'current' and filter is 'applied', regardless of what they might be given as.
 *  @returns {array} Data for the matched elements. If any elements, as a result of the
 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null 
 *    entry in the array.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Get the data from the first row in the table
 *      var data = oTable._('tr:first');
 *
 *      // Do something useful with the data
 *      alert( "First cell is: "+data[0] );
 *    } );
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *
 *      // Filter to 'Webkit' and get all data for 
 *      oTable.fnFilter('Webkit');
 *      var data = oTable._('tr', {"filter": "applied"});
 *      
 *      // Do something with the data
 *      alert( data.length+" rows matched the filter" );
 *    } );
 */
this._ = function ( sSelector, oOpts )
{
	var aOut = [];
	var i, iLen, iIndex;
	var aTrs = this.$( sSelector, oOpts );

	for ( i=0, iLen=aTrs.length ; i<iLen ; i++ )
	{
		aOut.push( this.fnGetData(aTrs[i]) );
	}

	return aOut;
};


/**
 * Add a single new row or multiple rows of data to the table. Please note
 * that this is suitable for client-side processing only - if you are using 
 * server-side processing (i.e. "bServerSide": true), then to add data, you
 * must add it to the data source, i.e. the server-side, through an Ajax call.
 *  @param {array|object} mData The data to be added to the table. This can be:
 *    <ul>
 *      <li>1D array of data - add a single row with the data provided</li>
 *      <li>2D array of arrays - add multiple rows in a single call</li>
 *      <li>object - data object when using <i>mData</i></li>
 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
 *    </ul>
 *  @param {bool} [bRedraw=true] redraw the table or not
 *  @returns {array} An array of integers, representing the list of indexes in 
 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to 
 *    the table.
 *  @dtopt API
 *
 *  @example
 *    // Global var for counter
 *    var giCount = 2;
 *    
 *    $(document).ready(function() {
 *      $('#example').dataTable();
 *    } );
 *    
 *    function fnClickAddRow() {
 *      $('#example').dataTable().fnAddData( [
 *        giCount+".1",
 *        giCount+".2",
 *        giCount+".3",
 *        giCount+".4" ]
 *      );
 *        
 *      giCount++;
 *    }
 */
this.fnAddData = function( mData, bRedraw )
{
	if ( mData.length === 0 )
	{
		return [];
	}
	
	var aiReturn = [];
	var iTest;
	
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	
	/* Check if we want to add multiple rows or not */
	if ( typeof mData[0] === "object" && mData[0] !== null )
	{
		for ( var i=0 ; i<mData.length ; i++ )
		{
			iTest = _fnAddData( oSettings, mData[i] );
			if ( iTest == -1 )
			{
				return aiReturn;
			}
			aiReturn.push( iTest );
		}
	}
	else
	{
		iTest = _fnAddData( oSettings, mData );
		if ( iTest == -1 )
		{
			return aiReturn;
		}
		aiReturn.push( iTest );
	}
	
	oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	
	if ( bRedraw === undefined || bRedraw )
	{
		_fnReDraw( oSettings );
	}
	return aiReturn;
};


/**
 * This function will make DataTables recalculate the column sizes, based on the data 
 * contained in the table and the sizes applied to the columns (in the DOM, CSS or 
 * through the sWidth parameter). This can be useful when the width of the table's 
 * parent element changes (for example a window resize).
 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable( {
 *        "sScrollY": "200px",
 *        "bPaginate": false
 *      } );
 *      
 *      $(window).bind('resize', function () {
 *        oTable.fnAdjustColumnSizing();
 *      } );
 *    } );
 */
this.fnAdjustColumnSizing = function ( bRedraw )
{
	var oSettings = _fnSettingsFromNode(this[DataTable.ext.iApiIndex]);
	_fnAdjustColumnSizing( oSettings );
	
	if ( bRedraw === undefined || bRedraw )
	{
		this.fnDraw( false );
	}
	else if ( oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "" )
	{
		/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
		this.oApi._fnScrollDraw(oSettings);
	}
};


/**
 * Quickly and simply clear a table
 *  @param {bool} [bRedraw=true] redraw the table or not
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
 *      oTable.fnClearTable();
 *    } );
 */
this.fnClearTable = function( bRedraw )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	_fnClearTable( oSettings );
	
	if ( bRedraw === undefined || bRedraw )
	{
		_fnDraw( oSettings );
	}
};


/**
 * The exact opposite of 'opening' a row, this function will close any rows which 
 * are currently 'open'.
 *  @param {node} nTr the table row to 'close'
 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *      
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *      
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnClose = function( nTr )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	
	for ( var i=0 ; i<oSettings.aoOpenRows.length ; i++ )
	{
		if ( oSettings.aoOpenRows[i].nParent == nTr )
		{
			var nTrParent = oSettings.aoOpenRows[i].nTr.parentNode;
			if ( nTrParent )
			{
				/* Remove it if it is currently on display */
				nTrParent.removeChild( oSettings.aoOpenRows[i].nTr );
			}
			oSettings.aoOpenRows.splice( i, 1 );
			return 0;
		}
	}
	return 1;
};


/**
 * Remove a row for the table
 *  @param {mixed} mTarget The index of the row from aoData to be deleted, or
 *    the TR element you want to delete
 *  @param {function|null} [fnCallBack] Callback function
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @returns {array} The row that was deleted
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Immediately remove the first row
 *      oTable.fnDeleteRow( 0 );
 *    } );
 */
this.fnDeleteRow = function( mTarget, fnCallBack, bRedraw )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var i, iLen, iAODataIndex;
	
	iAODataIndex = (typeof mTarget === 'object') ? 
		_fnNodeToDataIndex(oSettings, mTarget) : mTarget;
	
	/* Return the data array from this row */
	var oData = oSettings.aoData.splice( iAODataIndex, 1 );

	/* Update the _DT_RowIndex parameter */
	for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoData[i].nTr !== null )
		{
			oSettings.aoData[i].nTr._DT_RowIndex = i;
		}
	}
	
	/* Remove the target row from the search array */
	var iDisplayIndex = $.inArray( iAODataIndex, oSettings.aiDisplay );
	oSettings.asDataSearch.splice( iDisplayIndex, 1 );
	
	/* Delete from the display arrays */
	_fnDeleteIndex( oSettings.aiDisplayMaster, iAODataIndex );
	_fnDeleteIndex( oSettings.aiDisplay, iAODataIndex );
	
	/* If there is a user callback function - call it */
	if ( typeof fnCallBack === "function" )
	{
		fnCallBack.call( this, oSettings, oData );
	}
	
	/* Check for an 'overflow' they case for displaying the table */
	if ( oSettings._iDisplayStart >= oSettings.fnRecordsDisplay() )
	{
		oSettings._iDisplayStart -= oSettings._iDisplayLength;
		if ( oSettings._iDisplayStart < 0 )
		{
			oSettings._iDisplayStart = 0;
		}
	}
	
	if ( bRedraw === undefined || bRedraw )
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
	
	return oData;
};


/**
 * Restore the table to it's original state in the DOM by removing all of DataTables 
 * enhancements, alterations to the DOM structure of the table and event listeners.
 *  @param {boolean} [bRemove=false] Completely remove the table from the DOM
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
 *      var oTable = $('#example').dataTable();
 *      oTable.fnDestroy();
 *    } );
 */
this.fnDestroy = function ( bRemove )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var nOrig = oSettings.nTableWrapper.parentNode;
	var nBody = oSettings.nTBody;
	var i, iLen;

	bRemove = (bRemove===undefined) ? false : bRemove;
	
	/* Flag to note that the table is currently being destroyed - no action should be taken */
	oSettings.bDestroying = true;
	
	/* Fire off the destroy callbacks for plug-ins etc */
	_fnCallbackFire( oSettings, "aoDestroyCallback", "destroy", [oSettings] );

	/* If the table is not being removed, restore the hidden columns */
	if ( !bRemove )
	{
		for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
		{
			if ( oSettings.aoColumns[i].bVisible === false )
			{
				this.fnSetColumnVis( i, true );
			}
		}
	}
	
	/* Blitz all DT events */
	$(oSettings.nTableWrapper).find('*').andSelf().unbind('.DT');
	
	/* If there is an 'empty' indicator row, remove it */
	$('tbody>tr>td.'+oSettings.oClasses.sRowEmpty, oSettings.nTable).parent().remove();
	
	/* When scrolling we had to break the table up - restore it */
	if ( oSettings.nTable != oSettings.nTHead.parentNode )
	{
		$(oSettings.nTable).children('thead').remove();
		oSettings.nTable.appendChild( oSettings.nTHead );
	}
	
	if ( oSettings.nTFoot && oSettings.nTable != oSettings.nTFoot.parentNode )
	{
		$(oSettings.nTable).children('tfoot').remove();
		oSettings.nTable.appendChild( oSettings.nTFoot );
	}
	
	/* Remove the DataTables generated nodes, events and classes */
	oSettings.nTable.parentNode.removeChild( oSettings.nTable );
	$(oSettings.nTableWrapper).remove();
	
	oSettings.aaSorting = [];
	oSettings.aaSortingFixed = [];
	_fnSortingClasses( oSettings );
	
	$(_fnGetTrNodes( oSettings )).removeClass( oSettings.asStripeClasses.join(' ') );
	
	$('th, td', oSettings.nTHead).removeClass( [
		oSettings.oClasses.sSortable,
		oSettings.oClasses.sSortableAsc,
		oSettings.oClasses.sSortableDesc,
		oSettings.oClasses.sSortableNone ].join(' ')
	);
	if ( oSettings.bJUI )
	{
		$('th span.'+oSettings.oClasses.sSortIcon
			+ ', td span.'+oSettings.oClasses.sSortIcon, oSettings.nTHead).remove();

		$('th, td', oSettings.nTHead).each( function () {
			var jqWrapper = $('div.'+oSettings.oClasses.sSortJUIWrapper, this);
			var kids = jqWrapper.contents();
			$(this).append( kids );
			jqWrapper.remove();
		} );
	}
	
	/* Add the TR elements back into the table in their original order */
	if ( !bRemove && oSettings.nTableReinsertBefore )
	{
		nOrig.insertBefore( oSettings.nTable, oSettings.nTableReinsertBefore );
	}
	else if ( !bRemove )
	{
		nOrig.appendChild( oSettings.nTable );
	}

	for ( i=0, iLen=oSettings.aoData.length ; i<iLen ; i++ )
	{
		if ( oSettings.aoData[i].nTr !== null )
		{
			nBody.appendChild( oSettings.aoData[i].nTr );
		}
	}
	
	/* Restore the width of the original table */
	if ( oSettings.oFeatures.bAutoWidth === true )
	{
	  oSettings.nTable.style.width = _fnStringToCss(oSettings.sDestroyWidth);
	}
	
	/* If the were originally stripe classes - then we add them back here. Note
	 * this is not fool proof (for example if not all rows had stripe classes - but
	 * it's a good effort without getting carried away
	 */
	iLen = oSettings.asDestroyStripes.length;
	if (iLen)
	{
		var anRows = $(nBody).children('tr');
		for ( i=0 ; i<iLen ; i++ )
		{
			anRows.filter(':nth-child(' + iLen + 'n + ' + i + ')').addClass( oSettings.asDestroyStripes[i] );
		}
	}
	
	/* Remove the settings object from the settings array */
	for ( i=0, iLen=DataTable.settings.length ; i<iLen ; i++ )
	{
		if ( DataTable.settings[i] == oSettings )
		{
			DataTable.settings.splice( i, 1 );
		}
	}
	
	/* End it all */
	oSettings = null;
	oInit = null;
};


/**
 * Redraw the table
 *  @param {bool} [bComplete=true] Re-filter and resort (if enabled) the table before the draw.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
 *      oTable.fnDraw();
 *    } );
 */
this.fnDraw = function( bComplete )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	if ( bComplete === false )
	{
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
	else
	{
		_fnReDraw( oSettings );
	}
};


/**
 * Filter the input based on data
 *  @param {string} sInput String to filter the table on
 *  @param {int|null} [iColumn] Column to limit filtering to
 *  @param {bool} [bRegex=false] Treat as regular expression or not
 *  @param {bool} [bSmart=true] Perform smart filtering or not
 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Sometime later - filter...
 *      oTable.fnFilter( 'test string' );
 *    } );
 */
this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	
	if ( !oSettings.oFeatures.bFilter )
	{
		return;
	}
	
	if ( bRegex === undefined || bRegex === null )
	{
		bRegex = false;
	}
	
	if ( bSmart === undefined || bSmart === null )
	{
		bSmart = true;
	}
	
	if ( bShowGlobal === undefined || bShowGlobal === null )
	{
		bShowGlobal = true;
	}
	
	if ( bCaseInsensitive === undefined || bCaseInsensitive === null )
	{
		bCaseInsensitive = true;
	}
	
	if ( iColumn === undefined || iColumn === null )
	{
		/* Global filter */
		_fnFilterComplete( oSettings, {
			"sSearch":sInput+"",
			"bRegex": bRegex,
			"bSmart": bSmart,
			"bCaseInsensitive": bCaseInsensitive
		}, 1 );
		
		if ( bShowGlobal && oSettings.aanFeatures.f )
		{
			var n = oSettings.aanFeatures.f;
			for ( var i=0, iLen=n.length ; i<iLen ; i++ )
			{
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( n[i]._DT_Input != document.activeElement )
					{
						$(n[i]._DT_Input).val( sInput );
					}
				}
				catch ( e ) {
					$(n[i]._DT_Input).val( sInput );
				}
			}
		}
	}
	else
	{
		/* Single column filter */
		$.extend( oSettings.aoPreSearchCols[ iColumn ], {
			"sSearch": sInput+"",
			"bRegex": bRegex,
			"bSmart": bSmart,
			"bCaseInsensitive": bCaseInsensitive
		} );
		_fnFilterComplete( oSettings, oSettings.oPreviousSearch, 1 );
	}
};


/**
 * Get the data for the whole table, an individual row or an individual cell based on the 
 * provided parameters.
 *  @param {int|node} [mRow] A TR row node, TD/TH cell node or an integer. If given as
 *    a TR node then the data source for the whole row will be returned. If given as a
 *    TD/TH cell node then iCol will be automatically calculated and the data for the
 *    cell returned. If given as an integer, then this is treated as the aoData internal
 *    data index for the row (see fnGetPosition) and the data for that row used.
 *  @param {int} [iCol] Optional column index that you want the data of.
 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
 *    returned. If mRow is defined, just data for that row, and is iCol is
 *    defined, only data for the designated cell is returned.
 *  @dtopt API
 *
 *  @example
 *    // Row data
 *    $(document).ready(function() {
 *      oTable = $('#example').dataTable();
 *
 *      oTable.$('tr').click( function () {
 *        var data = oTable.fnGetData( this );
 *        // ... do something with the array / object of data for the row
 *      } );
 *    } );
 *
 *  @example
 *    // Individual cell data
 *    $(document).ready(function() {
 *      oTable = $('#example').dataTable();
 *
 *      oTable.$('td').click( function () {
 *        var sData = oTable.fnGetData( this );
 *        alert( 'The cell clicked on had the value of '+sData );
 *      } );
 *    } );
 */
this.fnGetData = function( mRow, iCol )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	
	if ( mRow !== undefined )
	{
		var iRow = mRow;
		if ( typeof mRow === 'object' )
		{
			var sNode = mRow.nodeName.toLowerCase();
			if (sNode === "tr" )
			{
				iRow = _fnNodeToDataIndex(oSettings, mRow);
			}
			else if ( sNode === "td" )
			{
				iRow = _fnNodeToDataIndex(oSettings, mRow.parentNode);
				iCol = _fnNodeToColumnIndex( oSettings, iRow, mRow );
			}
		}

		if ( iCol !== undefined )
		{
			return _fnGetCellData( oSettings, iRow, iCol, '' );
		}
		return (oSettings.aoData[iRow]!==undefined) ?
			oSettings.aoData[iRow]._aData : null;
	}
	return _fnGetDataMaster( oSettings );
};


/**
 * Get an array of the TR nodes that are used in the table's body. Note that you will 
 * typically want to use the '$' API method in preference to this as it is more 
 * flexible.
 *  @param {int} [iRow] Optional row index for the TR element you want
 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
 *    in the table's body, or iRow is defined, just the TR element requested.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Get the nodes from the table
 *      var nNodes = oTable.fnGetNodes( );
 *    } );
 */
this.fnGetNodes = function( iRow )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	
	if ( iRow !== undefined ) {
		return (oSettings.aoData[iRow]!==undefined) ?
			oSettings.aoData[iRow].nTr : null;
	}
	return _fnGetTrNodes( oSettings );
};


/**
 * Get the array indexes of a particular cell from it's DOM element
 * and column index including hidden columns
 *  @param {node} nNode this can either be a TR, TD or TH in the table's body
 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
 *    if given as a cell, an array of [row index, column index (visible), 
 *    column index (all)] is given.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      $('#example tbody td').click( function () {
 *        // Get the position of the current data from the node
 *        var aPos = oTable.fnGetPosition( this );
 *        
 *        // Get the data array for this row
 *        var aData = oTable.fnGetData( aPos[0] );
 *        
 *        // Update the data array and return the value
 *        aData[ aPos[1] ] = 'clicked';
 *        this.innerHTML = 'clicked';
 *      } );
 *      
 *      // Init DataTables
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnGetPosition = function( nNode )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var sNodeName = nNode.nodeName.toUpperCase();
	
	if ( sNodeName == "TR" )
	{
		return _fnNodeToDataIndex(oSettings, nNode);
	}
	else if ( sNodeName == "TD" || sNodeName == "TH" )
	{
		var iDataIndex = _fnNodeToDataIndex( oSettings, nNode.parentNode );
		var iColumnIndex = _fnNodeToColumnIndex( oSettings, iDataIndex, nNode );
		return [ iDataIndex, _fnColumnIndexToVisible(oSettings, iColumnIndex ), iColumnIndex ];
	}
	return null;
};


/**
 * Check to see if a row is 'open' or not.
 *  @param {node} nTr the table row to check
 *  @returns {boolean} true if the row is currently open, false otherwise
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *      
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *      
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnIsOpen = function( nTr )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var aoOpenRows = oSettings.aoOpenRows;
	
	for ( var i=0 ; i<oSettings.aoOpenRows.length ; i++ )
	{
		if ( oSettings.aoOpenRows[i].nParent == nTr )
		{
			return true;
		}
	}
	return false;
};


/**
 * This function will place a new row directly after a row which is currently 
 * on display on the page, with the HTML contents that is passed into the 
 * function. This can be used, for example, to ask for confirmation that a 
 * particular record should be deleted.
 *  @param {node} nTr The table row to 'open'
 *  @param {string|node|jQuery} mHtml The HTML to put into the row
 *  @param {string} sClass Class to give the new TD cell
 *  @returns {node} The row opened. Note that if the table row passed in as the
 *    first parameter, is not found in the table, this method will silently
 *    return.
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable;
 *      
 *      // 'open' an information row when a row is clicked on
 *      $('#example tbody tr').click( function () {
 *        if ( oTable.fnIsOpen(this) ) {
 *          oTable.fnClose( this );
 *        } else {
 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
 *        }
 *      } );
 *      
 *      oTable = $('#example').dataTable();
 *    } );
 */
this.fnOpen = function( nTr, mHtml, sClass )
{
	/* Find settings from table node */
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );

	/* Check that the row given is in the table */
	var nTableRows = _fnGetTrNodes( oSettings );
	if ( $.inArray(nTr, nTableRows) === -1 )
	{
		return;
	}
	
	/* the old open one if there is one */
	this.fnClose( nTr );
	
	var nNewRow = document.createElement("tr");
	var nNewCell = document.createElement("td");
	nNewRow.appendChild( nNewCell );
	nNewCell.className = sClass;
	nNewCell.colSpan = _fnVisbleColumns( oSettings );

	if (typeof mHtml === "string")
	{
		nNewCell.innerHTML = mHtml;
	}
	else
	{
		$(nNewCell).html( mHtml );
	}

	/* If the nTr isn't on the page at the moment - then we don't insert at the moment */
	var nTrs = $('tr', oSettings.nTBody);
	if ( $.inArray(nTr, nTrs) != -1  )
	{
		$(nNewRow).insertAfter(nTr);
	}
	
	oSettings.aoOpenRows.push( {
		"nTr": nNewRow,
		"nParent": nTr
	} );
	
	return nNewRow;
};


/**
 * Change the pagination - provides the internal logic for pagination in a simple API 
 * function. With this function you can have a DataTables table go to the next, 
 * previous, first or last pages.
 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
 *    or page number to jump to (integer), note that page 0 is the first page.
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      oTable.fnPageChange( 'next' );
 *    } );
 */
this.fnPageChange = function ( mAction, bRedraw )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	_fnPageChange( oSettings, mAction );
	_fnCalculateEnd( oSettings );
	
	if ( bRedraw === undefined || bRedraw )
	{
		_fnDraw( oSettings );
	}
};


/**
 * Show a particular column
 *  @param {int} iCol The column whose display should be changed
 *  @param {bool} bShow Show (true) or hide (false) the column
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Hide the second column after initialisation
 *      oTable.fnSetColumnVis( 1, false );
 *    } );
 */
this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var i, iLen;
	var aoColumns = oSettings.aoColumns;
	var aoData = oSettings.aoData;
	var nTd, bAppend, iBefore;
	
	/* No point in doing anything if we are requesting what is already true */
	if ( aoColumns[iCol].bVisible == bShow )
	{
		return;
	}
	
	/* Show the column */
	if ( bShow )
	{
		var iInsert = 0;
		for ( i=0 ; i<iCol ; i++ )
		{
			if ( aoColumns[i].bVisible )
			{
				iInsert++;
			}
		}
		
		/* Need to decide if we should use appendChild or insertBefore */
		bAppend = (iInsert >= _fnVisbleColumns( oSettings ));

		/* Which coloumn should we be inserting before? */
		if ( !bAppend )
		{
			for ( i=iCol ; i<aoColumns.length ; i++ )
			{
				if ( aoColumns[i].bVisible )
				{
					iBefore = i;
					break;
				}
			}
		}

		for ( i=0, iLen=aoData.length ; i<iLen ; i++ )
		{
			if ( aoData[i].nTr !== null )
			{
				if ( bAppend )
				{
					aoData[i].nTr.appendChild( 
						aoData[i]._anHidden[iCol]
					);
				}
				else
				{
					aoData[i].nTr.insertBefore(
						aoData[i]._anHidden[iCol], 
						_fnGetTdNodes( oSettings, i )[iBefore] );
				}
			}
		}
	}
	else
	{
		/* Remove a column from display */
		for ( i=0, iLen=aoData.length ; i<iLen ; i++ )
		{
			if ( aoData[i].nTr !== null )
			{
				nTd = _fnGetTdNodes( oSettings, i )[iCol];
				aoData[i]._anHidden[iCol] = nTd;
				nTd.parentNode.removeChild( nTd );
			}
		}
	}

	/* Clear to set the visible flag */
	aoColumns[iCol].bVisible = bShow;

	/* Redraw the header and footer based on the new column visibility */
	_fnDrawHead( oSettings, oSettings.aoHeader );
	if ( oSettings.nTFoot )
	{
		_fnDrawHead( oSettings, oSettings.aoFooter );
	}
	
	/* If there are any 'open' rows, then we need to alter the colspan for this col change */
	for ( i=0, iLen=oSettings.aoOpenRows.length ; i<iLen ; i++ )
	{
		oSettings.aoOpenRows[i].nTr.colSpan = _fnVisbleColumns( oSettings );
	}
	
	/* Do a redraw incase anything depending on the table columns needs it 
	 * (built-in: scrolling) 
	 */
	if ( bRedraw === undefined || bRedraw )
	{
		_fnAdjustColumnSizing( oSettings );
		_fnDraw( oSettings );
	}
	
	_fnSaveState( oSettings );
};


/**
 * Get the settings for a particular table for external manipulation
 *  @returns {object} DataTables settings object. See 
 *    {@link DataTable.models.oSettings}
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      var oSettings = oTable.fnSettings();
 *      
 *      // Show an example parameter from the settings
 *      alert( oSettings._iDisplayStart );
 *    } );
 */
this.fnSettings = function()
{
	return _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
};


/**
 * Sort the table by a particular column
 *  @param {int} iCol the data index to sort on. Note that this will not match the 
 *    'display index' if you have hidden data entries
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Sort immediately with columns 0 and 1
 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
 *    } );
 */
this.fnSort = function( aaSort )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	oSettings.aaSorting = aaSort;
	_fnSort( oSettings );
};


/**
 * Attach a sort listener to an element for a given column
 *  @param {node} nNode the element to attach the sort listener to
 *  @param {int} iColumn the column that a click on this node will sort on
 *  @param {function} [fnCallback] callback function when sort is run
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      
 *      // Sort on column 1, when 'sorter' is clicked on
 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
 *    } );
 */
this.fnSortListener = function( nNode, iColumn, fnCallback )
{
	_fnSortAttachListener( _fnSettingsFromNode( this[DataTable.ext.iApiIndex] ), nNode, iColumn,
	 	fnCallback );
};


/**
 * Update a table cell or row - this method will accept either a single value to
 * update the cell with, an array of values with one element for each column or
 * an object in the same format as the original data source. The function is
 * self-referencing in order to make the multi column updates easier.
 *  @param {object|array|string} mData Data to update the cell/row with
 *  @param {node|int} mRow TR element you want to update or the aoData index
 *  @param {int} [iColumn] The column to update, give as null or undefined to
 *    update a whole row.
 *  @param {bool} [bRedraw=true] Redraw the table or not
 *  @param {bool} [bAction=true] Perform pre-draw actions or not
 *  @returns {int} 0 on success, 1 on error
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
 *    } );
 */
this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
{
	var oSettings = _fnSettingsFromNode( this[DataTable.ext.iApiIndex] );
	var i, sDisplay;
	var iRow = (typeof mRow === 'object') ? 
		_fnNodeToDataIndex(oSettings, mRow) : mRow;

	if ( iColumn === undefined || iColumn === null )
	{
		/* Update the whole row */
		oSettings.aoData[iRow]._aData = mData;

		for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
		{
			this.fnUpdate( _fnGetCellData( oSettings, iRow, i ), iRow, i, false, false );
		}
	}
	else
	{
		/* Individual cell update */
		_fnSetCellData( oSettings, iRow, iColumn, mData );
		sDisplay = _fnGetCellData( oSettings, iRow, iColumn, 'display' );
		
		var oCol = oSettings.aoColumns[iColumn];
		if ( oSettings.aoData[iRow].nTr !== null )
		{
			/* Do the actual HTML update */
			_fnGetTdNodes( oSettings, iRow )[iColumn].innerHTML = sDisplay;
		}
	}
	
	/* Modify the search index for this row (strictly this is likely not needed, since fnReDraw
	 * will rebuild the search array - however, the redraw might be disabled by the user)
	 */
	var iDisplayIndex = $.inArray( iRow, oSettings.aiDisplay );
	oSettings.asDataSearch[iDisplayIndex] = _fnBuildSearchRow(
		oSettings, 
		_fnGetRowData( oSettings, iRow, 'filter', _fnGetColumns( oSettings, 'bSearchable' ) )
	);
	
	/* Perform pre-draw actions */
	if ( bAction === undefined || bAction )
	{
		_fnAdjustColumnSizing( oSettings );
	}
	
	/* Redraw the table */
	if ( bRedraw === undefined || bRedraw )
	{
		_fnReDraw( oSettings );
	}
	return 0;
};


/**
 * Provide a common method for plug-ins to check the version of DataTables being used, in order
 * to ensure compatibility.
 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
 *    formats "X" and "X.Y" are also acceptable.
 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
 *    version, or false if this version of DataTales is not suitable
 *  @method
 *  @dtopt API
 *
 *  @example
 *    $(document).ready(function() {
 *      var oTable = $('#example').dataTable();
 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
 *    } );
 */
this.fnVersionCheck = DataTable.ext.fnVersionCheck;

