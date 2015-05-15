/**
 * Change the order of the table
 *  @param {object} oSettings dataTables settings object
 *  @param {bool} bApplyClasses optional - should we apply classes or not
 *  @memberof DataTable#oApi
 *  @todo This really needs split up!
 */
function _fnSort ( oSettings, bApplyClasses )
{
	var
		i, iLen, j, jLen, k, kLen,
		sDataType, nTh,
		aSort = [],
	 	aiOrig = [],
		oExtSort = DataTable.ext.oSort,
		aoData = oSettings.aoData,
		aoColumns = oSettings.aoColumns,
		oAria = oSettings.oLanguage.oAria,
		fnFormatter, aDataSort, data, iCol, sType, oSort,
		iFormatters = 0,
		aaNestedSort = ( oSettings.aaSortingFixed !== null ) ?
			oSettings.aaSortingFixed.concat( oSettings.aaSorting ) :
			oSettings.aaSorting.slice();

	/* Flatten the aDataSort inner arrays into a single array, otherwise we have nested
	 * loops in multiple locations
	 */
	for ( i=0 ; i<aaNestedSort.length ; i++ )
	{
		aDataSort = aoColumns[ aaNestedSort[i][0] ].aDataSort;

		for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
		{
			iCol = aDataSort[k];
			sType = aoColumns[ iCol ].sType || 'string';
			fnFormatter = oExtSort[ sType+"-pre" ];

			aSort.push( {
				col:    iCol,
				dir:    aaNestedSort[i][1],
				index:  aaNestedSort[i][2],
				type:   sType,
				format: fnFormatter
			} );

			// Track if we can use the formatter method
			if ( fnFormatter )
			{
				iFormatters++;
			}
		}
	}

	/* No sorting required if server-side or no sorting array */
	if ( !oSettings.oFeatures.bServerSide && aSort.length !== 0 )
	{
		/* If there is a sorting data type, and a function belonging to it, then we need to
		 * get the data from the developer's function and apply it for this column
		 */
		for ( i=0 ; i<aSort.length ; i++ )
		{
			var iColumn = aSort[i].col;
			var iVisColumn = _fnColumnIndexToVisible( oSettings, iColumn );

			sDataType = oSettings.aoColumns[ iColumn ].sSortDataType;
			if ( DataTable.ext.afnSortData[sDataType] )
			{
				var aData = DataTable.ext.afnSortData[sDataType].call( 
					oSettings.oInstance, oSettings, iColumn, iVisColumn
				);
				if ( aData.length === aoData.length )
				{
					for ( j=0, jLen=aoData.length ; j<jLen ; j++ )
					{
						_fnSetCellData( oSettings, j, iColumn, aData[j] );
					}
				}
				else
				{
					_fnLog( oSettings, 0, "Returned data sort array (col "+iColumn+") is the wrong length" );
				}
			}
		}

		
		/* Create a value - key array of the current row positions such that we can use their
		 * current position during the sort, if values match, in order to perform stable sorting
		 */
		for ( i=0, iLen=oSettings.aiDisplayMaster.length ; i<iLen ; i++ )
		{
			aiOrig[ oSettings.aiDisplayMaster[i] ] = i;
		}

		/* Build an internal data array which is specific to the sort, so we can get and prep
		 * the data to be sorted only once, rather than needing to do it every time the sorting
		 * function runs. This make the sorting function a very simple comparison
		 */
		for ( j=0 ; j<aSort.length ; j++ )
		{
			oSort = aSort[j];

			for ( i=0, iLen=aoData.length ; i<iLen ; i++ )
			{
				data = _fnGetCellData( oSettings, i, oSort.col, 'sort' );

				aoData[i]._aSortData[ oSort.col ] = oSort.format ?
					oSort.format( data ) :
					data;
			}
		}
		
		/* Do the sort - here we want multi-column sorting based on a given data source (column)
		 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
		 * follow on it's own, but this is what we want (example two column sorting):
		 *  fnLocalSorting = function(a,b){
		 *  	var iTest;
		 *  	iTest = oSort['string-asc']('data11', 'data12');
		 *  	if (iTest !== 0)
		 *  		return iTest;
		 *    iTest = oSort['numeric-desc']('data21', 'data22');
		 *    if (iTest !== 0)
		 *  		return iTest;
		 *  	return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
		 *  }
		 * Basically we have a test for each sorting column, if the data in that column is equal,
		 * test the next column. If all columns match, then we use a numeric sort on the row 
		 * positions in the original data array to provide a stable sort.
		 *
		 * Note - I know it seems excessive to have two sorting methods, but the first is around
		 * 15% faster, so the second is only maintained for backwards compatibility with sorting
		 * methods which do not have a pre-sort formatting function.
		 */
		if ( iFormatters === aSort.length ) {
			// All sort types have formatting functions
			oSettings.aiDisplayMaster.sort( function ( a, b ) {
				var
					x, y, k, test, sort,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;

				for ( k=0 ; k<len ; k++ )
				{
					sort = aSort[k];

					x = dataA[ sort.col ];
					y = dataB[ sort.col ];

					test = x<y ? -1 : x>y ? 1 : 0;
					if ( test !== 0 )
					{
						return sort.dir === 'asc' ? test : -test;
					}
				}
				
				x = aiOrig[a];
				y = aiOrig[b];
				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
		else {
			// Depreciated - remove in 1.11 (providing a plug-in option)
			// Not all sort types have formatting methods, so we have to call their sorting
			// methods.
			oSettings.aiDisplayMaster.sort( function ( a, b ) {
				var
					x, y, k, l, test, sort,
					len=aSort.length,
					dataA = aoData[a]._aSortData,
					dataB = aoData[b]._aSortData;

				for ( k=0 ; k<len ; k++ )
				{
					sort = aSort[k];

					x = dataA[ sort.col ];
					y = dataB[ sort.col ];

					test = oExtSort[ sort.type+"-"+sort.dir ]( x, y );
					if ( test !== 0 )
					{
						return test;
					}
				}
				
				x = aiOrig[a];
				y = aiOrig[b];
				return x<y ? -1 : x>y ? 1 : 0;
			} );
		}
	}
	
	/* Alter the sorting classes to take account of the changes */
	if ( (bApplyClasses === undefined || bApplyClasses) && !oSettings.oFeatures.bDeferRender )
	{
		_fnSortingClasses( oSettings );
	}

	for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
	{
		var sTitle = aoColumns[i].sTitle.replace( /<.*?>/g, "" );
		nTh = aoColumns[i].nTh;
		nTh.removeAttribute('aria-sort');
		nTh.removeAttribute('aria-label');
		
		/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
		if ( aoColumns[i].bSortable )
		{
			if ( aSort.length > 0 && aSort[0].col == i )
			{
				nTh.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
				
				var nextSort = (aoColumns[i].asSorting[ aSort[0].index+1 ]) ? 
					aoColumns[i].asSorting[ aSort[0].index+1 ] : aoColumns[i].asSorting[0];
				nTh.setAttribute('aria-label', sTitle+
					(nextSort=="asc" ? oAria.sSortAscending : oAria.sSortDescending) );
			}
			else
			{
				nTh.setAttribute('aria-label', sTitle+
					(aoColumns[i].asSorting[0]=="asc" ? oAria.sSortAscending : oAria.sSortDescending) );
			}
		}
		else
		{
			nTh.setAttribute('aria-label', sTitle);
		}
	}
	
	/* Tell the draw function that we have sorted the data */
	oSettings.bSorted = true;
	$(oSettings.oInstance).trigger('sort', oSettings);
	
	/* Copy the master data into the draw array and re-draw */
	if ( oSettings.oFeatures.bFilter )
	{
		/* _fnFilter() will redraw the table for us */
		_fnFilterComplete( oSettings, oSettings.oPreviousSearch, 1 );
	}
	else
	{
		oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
		oSettings._iDisplayStart = 0; /* reset display back to page 0 */
		_fnCalculateEnd( oSettings );
		_fnDraw( oSettings );
	}
}


/**
 * Attach a sort handler (click) to a node
 *  @param {object} oSettings dataTables settings object
 *  @param {node} nNode node to attach the handler to
 *  @param {int} iDataIndex column sorting index
 *  @param {function} [fnCallback] callback function
 *  @memberof DataTable#oApi
 */
function _fnSortAttachListener ( oSettings, nNode, iDataIndex, fnCallback )
{
	_fnBindAction( nNode, {}, function (e) {
		/* If the column is not sortable - don't to anything */
		if ( oSettings.aoColumns[iDataIndex].bSortable === false )
		{
			return;
		}
		
		/*
		 * This is a little bit odd I admit... I declare a temporary function inside the scope of
		 * _fnBuildHead and the click handler in order that the code presented here can be used 
		 * twice - once for when bProcessing is enabled, and another time for when it is 
		 * disabled, as we need to perform slightly different actions.
		 *   Basically the issue here is that the Javascript engine in modern browsers don't 
		 * appear to allow the rendering engine to update the display while it is still executing
		 * it's thread (well - it does but only after long intervals). This means that the 
		 * 'processing' display doesn't appear for a table sort. To break the js thread up a bit
		 * I force an execution break by using setTimeout - but this breaks the expected 
		 * thread continuation for the end-developer's point of view (their code would execute
		 * too early), so we only do it when we absolutely have to.
		 */
		var fnInnerSorting = function () {
			var iColumn, iNextSort;
			
			/* If the shift key is pressed then we are multiple column sorting */
			if ( e.shiftKey )
			{
				/* Are we already doing some kind of sort on this column? */
				var bFound = false;
				for ( var i=0 ; i<oSettings.aaSorting.length ; i++ )
				{
					if ( oSettings.aaSorting[i][0] == iDataIndex )
					{
						bFound = true;
						iColumn = oSettings.aaSorting[i][0];
						iNextSort = oSettings.aaSorting[i][2]+1;
						
						if ( !oSettings.aoColumns[iColumn].asSorting[iNextSort] )
						{
							/* Reached the end of the sorting options, remove from multi-col sort */
							oSettings.aaSorting.splice( i, 1 );
						}
						else
						{
							/* Move onto next sorting direction */
							oSettings.aaSorting[i][1] = oSettings.aoColumns[iColumn].asSorting[iNextSort];
							oSettings.aaSorting[i][2] = iNextSort;
						}
						break;
					}
				}
				
				/* No sort yet - add it in */
				if ( bFound === false )
				{
					oSettings.aaSorting.push( [ iDataIndex, 
						oSettings.aoColumns[iDataIndex].asSorting[0], 0 ] );
				}
			}
			else
			{
				/* If no shift key then single column sort */
				if ( oSettings.aaSorting.length == 1 && oSettings.aaSorting[0][0] == iDataIndex )
				{
					iColumn = oSettings.aaSorting[0][0];
					iNextSort = oSettings.aaSorting[0][2]+1;
					if ( !oSettings.aoColumns[iColumn].asSorting[iNextSort] )
					{
						iNextSort = 0;
					}
					oSettings.aaSorting[0][1] = oSettings.aoColumns[iColumn].asSorting[iNextSort];
					oSettings.aaSorting[0][2] = iNextSort;
				}
				else
				{
					oSettings.aaSorting.splice( 0, oSettings.aaSorting.length );
					oSettings.aaSorting.push( [ iDataIndex, 
						oSettings.aoColumns[iDataIndex].asSorting[0], 0 ] );
				}
			}
			
			/* Run the sort */
			_fnSort( oSettings );
		}; /* /fnInnerSorting */
		
		if ( !oSettings.oFeatures.bProcessing )
		{
			fnInnerSorting();
		}
		else
		{
			_fnProcessingDisplay( oSettings, true );
			setTimeout( function() {
				fnInnerSorting();
				if ( !oSettings.oFeatures.bServerSide )
				{
					_fnProcessingDisplay( oSettings, false );
				}
			}, 0 );
		}
		
		/* Call the user specified callback function - used for async user interaction */
		if ( typeof fnCallback == 'function' )
		{
			fnCallback( oSettings );
		}
	} );
}


/**
 * Set the sorting classes on the header, Note: it is safe to call this function 
 * when bSort and bSortClasses are false
 *  @param {object} oSettings dataTables settings object
 *  @memberof DataTable#oApi
 */
function _fnSortingClasses( oSettings )
{
	var i, iLen, j, jLen, iFound;
	var aaSort, sClass;
	var iColumns = oSettings.aoColumns.length;
	var oClasses = oSettings.oClasses;
	
	for ( i=0 ; i<iColumns ; i++ )
	{
		if ( oSettings.aoColumns[i].bSortable )
		{
			$(oSettings.aoColumns[i].nTh).removeClass( oClasses.sSortAsc +" "+ oClasses.sSortDesc +
				" "+ oSettings.aoColumns[i].sSortingClass );
		}
	}
	
	if ( oSettings.aaSortingFixed !== null )
	{
		aaSort = oSettings.aaSortingFixed.concat( oSettings.aaSorting );
	}
	else
	{
		aaSort = oSettings.aaSorting.slice();
	}
	
	/* Apply the required classes to the header */
	for ( i=0 ; i<oSettings.aoColumns.length ; i++ )
	{
		if ( oSettings.aoColumns[i].bSortable )
		{
			sClass = oSettings.aoColumns[i].sSortingClass;
			iFound = -1;
			for ( j=0 ; j<aaSort.length ; j++ )
			{
				if ( aaSort[j][0] == i )
				{
					sClass = ( aaSort[j][1] == "asc" ) ?
						oClasses.sSortAsc : oClasses.sSortDesc;
					iFound = j;
					break;
				}
			}
			$(oSettings.aoColumns[i].nTh).addClass( sClass );
			
			if ( oSettings.bJUI )
			{
				/* jQuery UI uses extra markup */
				var jqSpan = $("span."+oClasses.sSortIcon,  oSettings.aoColumns[i].nTh);
				jqSpan.removeClass(oClasses.sSortJUIAsc +" "+ oClasses.sSortJUIDesc +" "+ 
					oClasses.sSortJUI +" "+ oClasses.sSortJUIAscAllowed +" "+ oClasses.sSortJUIDescAllowed );
				
				var sSpanClass;
				if ( iFound == -1 )
				{
				 	sSpanClass = oSettings.aoColumns[i].sSortingClassJUI;
				}
				else if ( aaSort[iFound][1] == "asc" )
				{
					sSpanClass = oClasses.sSortJUIAsc;
				}
				else
				{
					sSpanClass = oClasses.sSortJUIDesc;
				}
				
				jqSpan.addClass( sSpanClass );
			}
		}
		else
		{
			/* No sorting on this column, so add the base class. This will have been assigned by
			 * _fnAddColumn
			 */
			$(oSettings.aoColumns[i].nTh).addClass( oSettings.aoColumns[i].sSortingClass );
		}
	}
	
	/* 
	 * Apply the required classes to the table body
	 * Note that this is given as a feature switch since it can significantly slow down a sort
	 * on large data sets (adding and removing of classes is always slow at the best of times..)
	 * Further to this, note that this code is admittedly fairly ugly. It could be made a lot 
	 * simpler using jQuery selectors and add/removeClass, but that is significantly slower
	 * (on the order of 5 times slower) - hence the direct DOM manipulation here.
	 * Note that for deferred drawing we do use jQuery - the reason being that taking the first
	 * row found to see if the whole column needs processed can miss classes since the first
	 * column might be new.
	 */
	sClass = oClasses.sSortColumn;
	
	if ( oSettings.oFeatures.bSort && oSettings.oFeatures.bSortClasses )
	{
		var nTds = _fnGetTdNodes( oSettings );
		
		/* Determine what the sorting class for each column should be */
		var iClass, iTargetCol;
		var asClasses = [];
		for (i = 0; i < iColumns; i++)
		{
			asClasses.push("");
		}
		for (i = 0, iClass = 1; i < aaSort.length; i++)
		{
			iTargetCol = parseInt( aaSort[i][0], 10 );
			asClasses[iTargetCol] = sClass + iClass;
			
			if ( iClass < 3 )
			{
				iClass++;
			}
		}
		
		/* Make changes to the classes for each cell as needed */
		var reClass = new RegExp(sClass + "[123]");
		var sTmpClass, sCurrentClass, sNewClass;
		for ( i=0, iLen=nTds.length; i<iLen; i++ )
		{
			/* Determine which column we're looking at */
			iTargetCol = i % iColumns;
			
			/* What is the full list of classes now */
			sCurrentClass = nTds[i].className;
			/* What sorting class should be applied? */
			sNewClass = asClasses[iTargetCol];
			/* What would the new full list be if we did a replacement? */
			sTmpClass = sCurrentClass.replace(reClass, sNewClass);
			
			if ( sTmpClass != sCurrentClass )
			{
				/* We changed something */
				nTds[i].className = $.trim( sTmpClass );
			}
			else if ( sNewClass.length > 0 && sCurrentClass.indexOf(sNewClass) == -1 )
			{
				/* We need to add a class */
				nTds[i].className = sCurrentClass + " " + sNewClass;
			}
		}
	}
}

