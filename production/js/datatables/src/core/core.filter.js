
/**
 * Generate the node required for filtering text
 *  @returns {node} Filter control element
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlFilter ( oSettings )
{
	var oPreviousSearch = oSettings.oPreviousSearch;
	
	var sSearchStr = oSettings.oLanguage.sSearch;
	sSearchStr = (sSearchStr.indexOf('_INPUT_') !== -1) ?
	  sSearchStr.replace('_INPUT_', '<input type="text" />') :
	  sSearchStr==="" ? '<input type="text" />' : sSearchStr+' <input type="text" />';
	
	var nFilter = document.createElement( 'div' );
	nFilter.className = oSettings.oClasses.sFilter;
	nFilter.innerHTML = '<label>'+sSearchStr+'</label>';
	if ( !oSettings.aanFeatures.f )
	{
		nFilter.id = oSettings.sTableId+'_filter';
	}
	
	var jqFilter = $('input[type="text"]', nFilter);

	// Store a reference to the input element, so other input elements could be
	// added to the filter wrapper if needed (submit button for example)
	nFilter._DT_Input = jqFilter[0];

	jqFilter.val( oPreviousSearch.sSearch.replace('"','&quot;') );
	jqFilter.bind( 'keyup.DT', function(e) {
		/* Update all other filter input elements for the new display */
		var n = oSettings.aanFeatures.f;
		var val = this.value==="" ? "" : this.value; // mental IE8 fix :-(

		for ( var i=0, iLen=n.length ; i<iLen ; i++ )
		{
			if ( n[i] != $(this).parents('div.dataTables_filter')[0] )
			{
				$(n[i]._DT_Input).val( val );
			}
		}
		
		/* Now do the filter */
		if ( val != oPreviousSearch.sSearch )
		{
			_fnFilterComplete( oSettings, { 
				"sSearch": val, 
				"bRegex": oPreviousSearch.bRegex,
				"bSmart": oPreviousSearch.bSmart ,
				"bCaseInsensitive": oPreviousSearch.bCaseInsensitive 
			} );
		}
	} );

	jqFilter
		.attr('aria-controls', oSettings.sTableId)
		.bind( 'keypress.DT', function(e) {
			/* Prevent form submission */
			if ( e.keyCode == 13 )
			{
				return false;
			}
		}
	);
	
	return nFilter;
}


/**
 * Filter the table using both the global filter and column based filtering
 *  @param {object} oSettings dataTables settings object
 *  @param {object} oSearch search information
 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
 *  @memberof DataTable#oApi
 */
function _fnFilterComplete ( oSettings, oInput, iForce )
{
	var oPrevSearch = oSettings.oPreviousSearch;
	var aoPrevSearch = oSettings.aoPreSearchCols;
	var fnSaveFilter = function ( oFilter ) {
		/* Save the filtering values */
		oPrevSearch.sSearch = oFilter.sSearch;
		oPrevSearch.bRegex = oFilter.bRegex;
		oPrevSearch.bSmart = oFilter.bSmart;
		oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
	};

	/* In server-side processing all filtering is done by the server, so no point hanging around here */
	if ( !oSettings.oFeatures.bServerSide )
	{
		/* Global filter */
		_fnFilter( oSettings, oInput.sSearch, iForce, oInput.bRegex, oInput.bSmart, oInput.bCaseInsensitive );
		fnSaveFilter( oInput );

		/* Now do the individual column filter */
		for ( var i=0 ; i<oSettings.aoPreSearchCols.length ; i++ )
		{
			_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, aoPrevSearch[i].bRegex, 
				aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
		}
		
		/* Custom filtering */
		_fnFilterCustom( oSettings );
	}
	else
	{
		fnSaveFilter( oInput );
	}
	
	/* Tell the draw function we have been filtering */
	oSettings.bFiltered = true;
	$(oSettings.oInstance).trigger('filter', oSettings);
	
	/* Redraw the table */
	oSettings._iDisplayStart = 0;
	_fnCalculateEnd( oSettings );
	_fnDraw( oSettings );
	
	/* Rebuild search array 'offline' */
	_fnBuildSearchArray( oSettings, 0 );
}


/**
 * Apply custom filtering functions
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnFilterCustom( oSettings )
{
	var afnFilters = DataTable.ext.afnFiltering;
	var aiFilterColumns = _fnGetColumns( oSettings, 'bSearchable' );

	for ( var i=0, iLen=afnFilters.length ; i<iLen ; i++ )
	{
		var iCorrector = 0;
		for ( var j=0, jLen=oSettings.aiDisplay.length ; j<jLen ; j++ )
		{
			var iDisIndex = oSettings.aiDisplay[j-iCorrector];
			var bTest = afnFilters[i](
				oSettings,
				_fnGetRowData( oSettings, iDisIndex, 'filter', aiFilterColumns ),
				iDisIndex
			);
			
			/* Check if we should use this row based on the filtering function */
			if ( !bTest )
			{
				oSettings.aiDisplay.splice( j-iCorrector, 1 );
				iCorrector++;
			}
		}
	}
}


/**
 * Filter the table on a per-column basis
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sInput string to filter on
 *  @param {int} iColumn column to filter
 *  @param {bool} bRegex treat search string as a regular expression or not
 *  @param {bool} bSmart use smart filtering or not
 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
 *  @memberof DataTable#oApi
 */
function _fnFilterColumn ( oSettings, sInput, iColumn, bRegex, bSmart, bCaseInsensitive )
{
	if ( sInput === "" )
	{
		return;
	}
	
	var iIndexCorrector = 0;
	var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart, bCaseInsensitive );
	
	for ( var i=oSettings.aiDisplay.length-1 ; i>=0 ; i-- )
	{
		var sData = _fnDataToSearch( _fnGetCellData( oSettings, oSettings.aiDisplay[i], iColumn, 'filter' ),
			oSettings.aoColumns[iColumn].sType );
		if ( ! rpSearch.test( sData ) )
		{
			oSettings.aiDisplay.splice( i, 1 );
			iIndexCorrector++;
		}
	}
}


/**
 * Filter the data table based on user input and draw the table
 *  @param {object} oSettings dataTables settings object
 *  @param {string} sInput string to filter on
 *  @param {int} iForce optional - force a research of the master array (1) or not (undefined or 0)
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
 *  @memberof DataTable#oApi
 */
function _fnFilter( oSettings, sInput, iForce, bRegex, bSmart, bCaseInsensitive )
{
	var i;
	var rpSearch = _fnFilterCreateSearch( sInput, bRegex, bSmart, bCaseInsensitive );
	var oPrevSearch = oSettings.oPreviousSearch;
	
	/* Check if we are forcing or not - optional parameter */
	if ( !iForce )
	{
		iForce = 0;
	}
	
	/* Need to take account of custom filtering functions - always filter */
	if ( DataTable.ext.afnFiltering.length !== 0 )
	{
		iForce = 1;
	}
	
	/*
	 * If the input is blank - we want the full data set
	 */
	if ( sInput.length <= 0 )
	{
		oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
	}
	else
	{
		/*
		 * We are starting a new search or the new search string is smaller 
		 * then the old one (i.e. delete). Search from the master array
	 	 */
		if ( oSettings.aiDisplay.length == oSettings.aiDisplayMaster.length ||
			   oPrevSearch.sSearch.length > sInput.length || iForce == 1 ||
			   sInput.indexOf(oPrevSearch.sSearch) !== 0 )
		{
			/* Nuke the old display array - we are going to rebuild it */
			oSettings.aiDisplay.splice( 0, oSettings.aiDisplay.length);
			
			/* Force a rebuild of the search array */
			_fnBuildSearchArray( oSettings, 1 );
			
			/* Search through all records to populate the search array
			 * The the oSettings.aiDisplayMaster and asDataSearch arrays have 1 to 1 
			 * mapping
			 */
			for ( i=0 ; i<oSettings.aiDisplayMaster.length ; i++ )
			{
				if ( rpSearch.test(oSettings.asDataSearch[i]) )
				{
					oSettings.aiDisplay.push( oSettings.aiDisplayMaster[i] );
				}
			}
	  }
	  else
		{
	  	/* Using old search array - refine it - do it this way for speed
	  	 * Don't have to search the whole master array again
			 */
	  	var iIndexCorrector = 0;
	  	
	  	/* Search the current results */
	  	for ( i=0 ; i<oSettings.asDataSearch.length ; i++ )
			{
	  		if ( ! rpSearch.test(oSettings.asDataSearch[i]) )
				{
	  			oSettings.aiDisplay.splice( i-iIndexCorrector, 1 );
	  			iIndexCorrector++;
	  		}
	  	}
	  }
	}
}


/**
 * Create an array which can be quickly search through
 *  @param {object} oSettings dataTables settings object
 *  @param {int} iMaster use the master data array - optional
 *  @memberof DataTable#oApi
 */
function _fnBuildSearchArray ( oSettings, iMaster )
{
	if ( !oSettings.oFeatures.bServerSide )
	{
		/* Clear out the old data */
		oSettings.asDataSearch = [];

		var aiFilterColumns = _fnGetColumns( oSettings, 'bSearchable' );
		var aiIndex = (iMaster===1) ?
		 	oSettings.aiDisplayMaster :
		 	oSettings.aiDisplay;
		
		for ( var i=0, iLen=aiIndex.length ; i<iLen ; i++ )
		{
			oSettings.asDataSearch[i] = _fnBuildSearchRow(
				oSettings,
				_fnGetRowData( oSettings, aiIndex[i], 'filter', aiFilterColumns )
			);
		}
	}
}


/**
 * Create a searchable string from a single data row
 *  @param {object} oSettings dataTables settings object
 *  @param {array} aData Row data array to use for the data to search
 *  @memberof DataTable#oApi
 */
function _fnBuildSearchRow( oSettings, aData )
{
	for ( var i=0, len=aData.length ; i<len ; i++ ) {
		aData[i] = _fnDataToSearch( aData[i], oSettings.aoColumns[i].sType );
	}
	
	var sSearch = aData.join('  ');
	
	/* If it looks like there is an HTML entity in the string, attempt to decode it */
	if ( sSearch.indexOf('&') !== -1 )
	{
		sSearch = $('<div>').html(sSearch).text();
	}
	
	// Strip newline characters
	return sSearch.replace( /[\n\r]/g, " " );
}

/**
 * Build a regular expression object suitable for searching a table
 *  @param {string} sSearch string to search for
 *  @param {bool} bRegex treat as a regular expression or not
 *  @param {bool} bSmart perform smart filtering or not
 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
 *  @returns {RegExp} constructed object
 *  @memberof DataTable#oApi
 */
function _fnFilterCreateSearch( sSearch, bRegex, bSmart, bCaseInsensitive )
{
	var asSearch,
		sRegExpString = bRegex ? sSearch : _fnEscapeRegex( sSearch );
	
	if ( bSmart )
	{
		/* Generate the regular expression to use. Something along the lines of:
		 * ^(?=.*?\bone\b)(?=.*?\btwo\b)(?=.*?\bthree\b).*$
		 */
		asSearch = sRegExpString.split( ' ' );
		sRegExpString = '^(?=.*?'+asSearch.join( ')(?=.*?' )+').*$';
	}
	
	return new RegExp( sRegExpString, bCaseInsensitive ? "i" : "" );
}


/**
 * Convert raw data into something that the user can search on
 *  @param {string} sData data to be modified
 *  @param {string} sType data type
 *  @returns {string} search string
 *  @memberof DataTable#oApi
 */
function _fnDataToSearch ( sData, sType )
{
	if ( typeof DataTable.ext.ofnSearch[sType] === "function" )
	{
		return DataTable.ext.ofnSearch[sType]( sData );
	}
	else if ( sData === null )
	{
		return '';
	}
	else if ( sType == "html" )
	{
		return sData.replace(/[\r\n]/g," ").replace( /<.*?>/g, "" );
	}
	else if ( typeof sData === "string" )
	{
		return sData.replace(/[\r\n]/g," ");
	}
	return sData;
}


/**
 * scape a string such that it can be used in a regular expression
 *  @param {string} sVal string to escape
 *  @returns {string} escaped string
 *  @memberof DataTable#oApi
 */
function _fnEscapeRegex ( sVal )
{
	var acEscape = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ];
	var reReplace = new RegExp( '(\\' + acEscape.join('|\\') + ')', 'g' );
	return sVal.replace(reReplace, '\\$1');
}

