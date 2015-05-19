

/**
 * Save the state of a table
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSaveState ( oSettings )
{
	if ( !oSettings.oFeatures.bStateSave || oSettings.bDestroying )
	{
		return;
	}

	/* Store the interesting variables */
	var i, iLen, bInfinite=oSettings.oScroll.bInfinite;
	var oState = {
		"iCreate":      new Date().getTime(),
		"iStart":       (bInfinite ? 0 : oSettings._iDisplayStart),
		"iEnd":         (bInfinite ? oSettings._iDisplayLength : oSettings._iDisplayEnd),
		"iLength":      oSettings._iDisplayLength,
		"aaSorting":    $.extend( true, [], oSettings.aaSorting ),
		"oSearch":      $.extend( true, {}, oSettings.oPreviousSearch ),
		"aoSearchCols": $.extend( true, [], oSettings.aoPreSearchCols ),
		"abVisCols":    []
	};

	for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		oState.abVisCols.push( oSettings.aoColumns[i].bVisible );
	}

	_fnCallbackFire( oSettings, "aoStateSaveParams", 'stateSaveParams', [oSettings, oState] );
	
	oSettings.fnStateSaveCallback.call( oSettings.oInstance, oSettings, oState );
}


/**
 * Attempt to load a saved table state
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oInit DataTables init object so we can override settings
 *  @memberof DataTable#oApi
 */
function _fnLoadState ( oSettings, oInit )
{
	if ( !oSettings.oFeatures.bStateSave )
	{
		return;
	}

	var oData = oSettings.fnStateLoadCallback.call( oSettings.oInstance, oSettings );
	if ( !oData )
	{
		return;
	}
	
	/* Allow custom and plug-in manipulation functions to alter the saved data set and
	 * cancelling of loading by returning false
	 */
	var abStateLoad = _fnCallbackFire( oSettings, 'aoStateLoadParams', 'stateLoadParams', [oSettings, oData] );
	if ( $.inArray( false, abStateLoad ) !== -1 )
	{
		return;
	}

	/* Reject old data */
	if ( oData.iCreate < new Date().getTime() - (oSettings.iStateDuration*1000) ) {
		return;
	}
	
	/* Store the saved state so it might be accessed at any time */
	oSettings.oLoadedState = $.extend( true, {}, oData );
	
	/* Restore key features */
	oSettings._iDisplayStart    = oData.iStart;
	oSettings.iInitDisplayStart = oData.iStart;
	oSettings._iDisplayEnd      = oData.iEnd;
	oSettings._iDisplayLength   = oData.iLength;
	oSettings.aaSorting         = oData.aaSorting.slice();
	oSettings.saved_aaSorting   = oData.aaSorting.slice();
	
	/* Search filtering  */
	$.extend( oSettings.oPreviousSearch, oData.oSearch );
	$.extend( true, oSettings.aoPreSearchCols, oData.aoSearchCols );
	
	/* Column visibility state
	 * Pass back visibility settings to the init handler, but to do not here override
	 * the init object that the user might have passed in
	 */
	oInit.saved_aoColumns = [];
	for ( var i=0 ; i<oData.abVisCols.length ; i++ )
	{
		oInit.saved_aoColumns[i] = {};
		oInit.saved_aoColumns[i].bVisible = oData.abVisCols[i];
	}

	_fnCallbackFire( oSettings, 'aoStateLoaded', 'stateLoaded', [oSettings, oData] );
}


