
/**
 * Update the table using an Ajax call
 *  @param {object} oSettings dataTables settings object
 *  @returns {boolean} Block the table drawing or not
 *  @memberof DataTable#oApi
 */
function _fnAjaxUpdate( oSettings )
{
	if ( oSettings.bAjaxDataGet )
	{
		oSettings.iDraw++;
		_fnProcessingDisplay( oSettings, true );
		var iColumns = oSettings.aoColumns.length;
		var aoData = _fnAjaxParameters( oSettings );
		_fnServerParams( oSettings, aoData );
		
		oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aoData,
			function(json) {
				_fnAjaxUpdateDraw( oSettings, json );
			}, oSettings );
		return false;
	}
	return true;
}


/**
 * Build up the parameters in an object needed for a server-side processing request
 *  @param {object} oSettings dataTables settings object
 *  @returns {bool} block the table drawing or not
 *  @memberof DataTable#oApi
 */
function _fnAjaxParameters( oSettings )
{
	var iColumns = oSettings.aoColumns.length;
	var aoData = [], mDataProp, aaSort, aDataSort;
	var i, j;
	
	aoData.push( { "name": "sEcho",          "value": oSettings.iDraw } );
	aoData.push( { "name": "iColumns",       "value": iColumns } );
	aoData.push( { "name": "sColumns",       "value": _fnColumnOrdering(oSettings) } );
	aoData.push( { "name": "iDisplayStart",  "value": oSettings._iDisplayStart } );
	aoData.push( { "name": "iDisplayLength", "value": oSettings.oFeatures.bPaginate !== false ?
		oSettings._iDisplayLength : -1 } );
		
	for ( i=0 ; i<iColumns ; i++ )
	{
	  mDataProp = oSettings.aoColumns[i].mData;
		aoData.push( { "name": "mDataProp_"+i, "value": typeof(mDataProp)==="function" ? 'function' : mDataProp } );
	}
	
	/* Filtering */
	if ( oSettings.oFeatures.bFilter !== false )
	{
		aoData.push( { "name": "sSearch", "value": oSettings.oPreviousSearch.sSearch } );
		aoData.push( { "name": "bRegex",  "value": oSettings.oPreviousSearch.bRegex } );
		for ( i=0 ; i<iColumns ; i++ )
		{
			aoData.push( { "name": "sSearch_"+i,     "value": oSettings.aoPreSearchCols[i].sSearch } );
			aoData.push( { "name": "bRegex_"+i,      "value": oSettings.aoPreSearchCols[i].bRegex } );
			aoData.push( { "name": "bSearchable_"+i, "value": oSettings.aoColumns[i].bSearchable } );
		}
	}
	
	/* Sorting */
	if ( oSettings.oFeatures.bSort !== false )
	{
		var iCounter = 0;

		aaSort = ( oSettings.aaSortingFixed !== null ) ?
			oSettings.aaSortingFixed.concat( oSettings.aaSorting ) :
			oSettings.aaSorting.slice();
		
		for ( i=0 ; i<aaSort.length ; i++ )
		{
			aDataSort = oSettings.aoColumns[ aaSort[i][0] ].aDataSort;
			
			for ( j=0 ; j<aDataSort.length ; j++ )
			{
				aoData.push( { "name": "iSortCol_"+iCounter,  "value": aDataSort[j] } );
				aoData.push( { "name": "sSortDir_"+iCounter,  "value": aaSort[i][1] } );
				iCounter++;
			}
		}
		aoData.push( { "name": "iSortingCols",   "value": iCounter } );
		
		for ( i=0 ; i<iColumns ; i++ )
		{
			aoData.push( { "name": "bSortable_"+i,  "value": oSettings.aoColumns[i].bSortable } );
		}
	}
	
	return aoData;
}


/**
 * Add Ajax parameters from plug-ins
 *  @param {object} oSettings dataTables settings object
 *  @param array {objects} aoData name/value pairs to send to the server
 *  @memberof DataTable#oApi
 */
function _fnServerParams( oSettings, aoData )
{
	_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [aoData] );
}


/**
 * Data the data from the server (nuking the old) and redraw the table
 *  @param {object} oSettings dataTables settings object
 *  @param {object} json json data return from the server.
 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
 *  @param {array} json.aaData The data to display on this page
 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
 *  @memberof DataTable#oApi
 */
function _fnAjaxUpdateDraw ( oSettings, json )
{
	if ( json.sEcho !== undefined )
	{
		/* Protect against old returns over-writing a new one. Possible when you get
		 * very fast interaction, and later queries are completed much faster
		 */
		if ( json.sEcho*1 < oSettings.iDraw )
		{
			return;
		}
		oSettings.iDraw = json.sEcho * 1;
	}
	
	if ( !oSettings.oScroll.bInfinite || oSettings.bSorted || oSettings.bFiltered )
	{
		_fnClearTable( oSettings );
	}
	oSettings._iRecordsTotal = parseInt(json.iTotalRecords, 10);
	oSettings._iRecordsDisplay = parseInt(json.iTotalDisplayRecords, 10);
	
	var aData = _fnGetObjectDataFn( oSettings.sAjaxDataProp )( json );
	for ( var i=0, iLen=aData.length ; i<iLen ; i++ )
	{
		_fnAddData( oSettings, aData[i] );
	}
	oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	
	oSettings.bAjaxDataGet = false;
	_fnDraw( oSettings );
	oSettings.bAjaxDataGet = true;
	_fnProcessingDisplay( oSettings, false );
}

