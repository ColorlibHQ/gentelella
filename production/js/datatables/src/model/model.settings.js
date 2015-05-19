

/**
 * DataTables settings object - this holds all the information needed for a
 * given table, including configuration, data and current application of the
 * table options. DataTables does not have a single instance for each DataTable
 * with the settings attached to that instance, but rather instances of the
 * DataTable "class" are created on-the-fly as needed (typically by a 
 * $().dataTable() call) and the settings object is then applied to that
 * instance.
 * 
 * Note that this object is related to {@link DataTable.defaults} but this 
 * one is the internal data store for DataTables's cache of columns. It should
 * NOT be manipulated outside of DataTables. Any configuration should be done
 * through the initialisation options.
 *  @namespace
 *  @todo Really should attach the settings object to individual instances so we
 *    don't need to create new instances on each $().dataTable() call (if the
 *    table already exists). It would also save passing oSettings around and
 *    into every single function. However, this is a very significant 
 *    architecture change for DataTables and will almost certainly break
 *    backwards compatibility with older installations. This is something that
 *    will be done in 2.0.
 */
DataTable.models.oSettings = {
	/**
	 * Primary features of DataTables and their enablement state.
	 *  @namespace
	 */
	"oFeatures": {
		
		/**
		 * Flag to say if DataTables should automatically try to calculate the
		 * optimum table and columns widths (true) or not (false).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bAutoWidth": null,

		/**
		 * Delay the creation of TR and TD elements until they are actually
		 * needed by a driven page draw. This can give a significant speed
		 * increase for Ajax source and Javascript source data, but makes no
		 * difference at all fro DOM and server-side processing tables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bDeferRender": null,
		
		/**
		 * Enable filtering on the table or not. Note that if this is disabled
		 * then there is no filtering at all on the table, including fnFilter.
		 * To just remove the filtering input use sDom and remove the 'f' option.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bFilter": null,
		
		/**
		 * Table information element (the 'Showing x of y records' div) enable
		 * flag.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bInfo": null,
		
		/**
		 * Present a user control allowing the end user to change the page size
		 * when pagination is enabled.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bLengthChange": null,

		/**
		 * Pagination enabled or not. Note that if this is disabled then length
		 * changing must also be disabled.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bPaginate": null,
		
		/**
		 * Processing indicator enable flag whenever DataTables is enacting a
		 * user request - typically an Ajax request for server-side processing.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bProcessing": null,
		
		/**
		 * Server-side processing enabled flag - when enabled DataTables will
		 * get all data from the server for every draw - there is no filtering,
		 * sorting or paging done on the client-side.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bServerSide": null,
		
		/**
		 * Sorting enablement flag.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSort": null,
		
		/**
		 * Apply a class to the columns which are being sorted to provide a
		 * visual highlight or not. This can slow things down when enabled since
		 * there is a lot of DOM interaction.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortClasses": null,
		
		/**
		 * State saving enablement flag.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bStateSave": null
	},
	

	/**
	 * Scrolling settings for a table.
	 *  @namespace
	 */
	"oScroll": {
		/**
		 * Indicate if DataTables should be allowed to set the padding / margin
		 * etc for the scrolling header elements or not. Typically you will want
		 * this.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bAutoCss": null,
		
		/**
		 * When the table is shorter in height than sScrollY, collapse the
		 * table container down to the height of the table (when true).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bCollapse": null,
		
		/**
		 * Infinite scrolling enablement flag. Now deprecated in favour of
		 * using the Scroller plug-in.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bInfinite": null,
		
		/**
		 * Width of the scrollbar for the web-browser's platform. Calculated
		 * during table initialisation.
		 *  @type int
		 *  @default 0
		 */
		"iBarWidth": 0,
		
		/**
		 * Space (in pixels) between the bottom of the scrolling container and 
		 * the bottom of the scrolling viewport before the next page is loaded
		 * when using infinite scrolling.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 */
		"iLoadGap": null,
		
		/**
		 * Viewport width for horizontal scrolling. Horizontal scrolling is 
		 * disabled if an empty string.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sX": null,
		
		/**
		 * Width to expand the table to when using x-scrolling. Typically you
		 * should not need to use this.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @deprecated
		 */
		"sXInner": null,
		
		/**
		 * Viewport height for vertical scrolling. Vertical scrolling is disabled
		 * if an empty string.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sY": null
	},
	
	/**
	 * Language information for the table.
	 *  @namespace
	 *  @extends DataTable.defaults.oLanguage
	 */
	"oLanguage": {
		/**
		 * Information callback function. See 
		 * {@link DataTable.defaults.fnInfoCallback}
		 *  @type function
		 *  @default null
		 */
		"fnInfoCallback": null
	},
	
	/**
	 * Browser support parameters
	 *  @namespace
	 */
	"oBrowser": {
		/**
		 * Indicate if the browser incorrectly calculates width:100% inside a
		 * scrolling element (IE6/7)
		 *  @type boolean
		 *  @default false
		 */
		"bScrollOversize": false
	},
	
	/**
	 * Array referencing the nodes which are used for the features. The 
	 * parameters of this object match what is allowed by sDom - i.e.
	 *   <ul>
	 *     <li>'l' - Length changing</li>
	 *     <li>'f' - Filtering input</li>
	 *     <li>'t' - The table!</li>
	 *     <li>'i' - Information</li>
	 *     <li>'p' - Pagination</li>
	 *     <li>'r' - pRocessing</li>
	 *   </ul>
	 *  @type array
	 *  @default []
	 */
	"aanFeatures": [],
	
	/**
	 * Store data information - see {@link DataTable.models.oRow} for detailed
	 * information.
	 *  @type array
	 *  @default []
	 */
	"aoData": [],
	
	/**
	 * Array of indexes which are in the current display (after filtering etc)
	 *  @type array
	 *  @default []
	 */
	"aiDisplay": [],
	
	/**
	 * Array of indexes for display - no filtering
	 *  @type array
	 *  @default []
	 */
	"aiDisplayMaster": [],
	
	/**
	 * Store information about each column that is in use
	 *  @type array
	 *  @default []
	 */
	"aoColumns": [],
	
	/**
	 * Store information about the table's header
	 *  @type array
	 *  @default []
	 */
	"aoHeader": [],
	
	/**
	 * Store information about the table's footer
	 *  @type array
	 *  @default []
	 */
	"aoFooter": [],
	
	/**
	 * Search data array for regular expression searching
	 *  @type array
	 *  @default []
	 */
	"asDataSearch": [],
	
	/**
	 * Store the applied global search information in case we want to force a 
	 * research or compare the old search to a new one.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @namespace
	 *  @extends DataTable.models.oSearch
	 */
	"oPreviousSearch": {},
	
	/**
	 * Store the applied search for each column - see 
	 * {@link DataTable.models.oSearch} for the format that is used for the
	 * filtering information for each column.
	 *  @type array
	 *  @default []
	 */
	"aoPreSearchCols": [],
	
	/**
	 * Sorting that is applied to the table. Note that the inner arrays are
	 * used in the following manner:
	 * <ul>
	 *   <li>Index 0 - column number</li>
	 *   <li>Index 1 - current sorting direction</li>
	 *   <li>Index 2 - index of asSorting for this column</li>
	 * </ul>
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type array
	 *  @todo These inner arrays should really be objects
	 */
	"aaSorting": null,
	
	/**
	 * Sorting that is always applied to the table (i.e. prefixed in front of
	 * aaSorting).
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type array|null
	 *  @default null
	 */
	"aaSortingFixed": null,
	
	/**
	 * Classes to use for the striping of a table.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type array
	 *  @default []
	 */
	"asStripeClasses": null,
	
	/**
	 * If restoring a table - we should restore its striping classes as well
	 *  @type array
	 *  @default []
	 */
	"asDestroyStripes": [],
	
	/**
	 * If restoring a table - we should restore its width 
	 *  @type int
	 *  @default 0
	 */
	"sDestroyWidth": 0,
	
	/**
	 * Callback functions array for every time a row is inserted (i.e. on a draw).
	 *  @type array
	 *  @default []
	 */
	"aoRowCallback": [],
	
	/**
	 * Callback functions for the header on each draw.
	 *  @type array
	 *  @default []
	 */
	"aoHeaderCallback": [],
	
	/**
	 * Callback function for the footer on each draw.
	 *  @type array
	 *  @default []
	 */
	"aoFooterCallback": [],
	
	/**
	 * Array of callback functions for draw callback functions
	 *  @type array
	 *  @default []
	 */
	"aoDrawCallback": [],
	
	/**
	 * Array of callback functions for row created function
	 *  @type array
	 *  @default []
	 */
	"aoRowCreatedCallback": [],
	
	/**
	 * Callback functions for just before the table is redrawn. A return of 
	 * false will be used to cancel the draw.
	 *  @type array
	 *  @default []
	 */
	"aoPreDrawCallback": [],
	
	/**
	 * Callback functions for when the table has been initialised.
	 *  @type array
	 *  @default []
	 */
	"aoInitComplete": [],

	
	/**
	 * Callbacks for modifying the settings to be stored for state saving, prior to
	 * saving state.
	 *  @type array
	 *  @default []
	 */
	"aoStateSaveParams": [],
	
	/**
	 * Callbacks for modifying the settings that have been stored for state saving
	 * prior to using the stored values to restore the state.
	 *  @type array
	 *  @default []
	 */
	"aoStateLoadParams": [],
	
	/**
	 * Callbacks for operating on the settings object once the saved state has been
	 * loaded
	 *  @type array
	 *  @default []
	 */
	"aoStateLoaded": [],
	
	/**
	 * Cache the table ID for quick access
	 *  @type string
	 *  @default <i>Empty string</i>
	 */
	"sTableId": "",
	
	/**
	 * The TABLE node for the main table
	 *  @type node
	 *  @default null
	 */
	"nTable": null,
	
	/**
	 * Permanent ref to the thead element
	 *  @type node
	 *  @default null
	 */
	"nTHead": null,
	
	/**
	 * Permanent ref to the tfoot element - if it exists
	 *  @type node
	 *  @default null
	 */
	"nTFoot": null,
	
	/**
	 * Permanent ref to the tbody element
	 *  @type node
	 *  @default null
	 */
	"nTBody": null,
	
	/**
	 * Cache the wrapper node (contains all DataTables controlled elements)
	 *  @type node
	 *  @default null
	 */
	"nTableWrapper": null,
	
	/**
	 * Indicate if when using server-side processing the loading of data 
	 * should be deferred until the second draw.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type boolean
	 *  @default false
	 */
	"bDeferLoading": false,
	
	/**
	 * Indicate if all required information has been read in
	 *  @type boolean
	 *  @default false
	 */
	"bInitialised": false,
	
	/**
	 * Information about open rows. Each object in the array has the parameters
	 * 'nTr' and 'nParent'
	 *  @type array
	 *  @default []
	 */
	"aoOpenRows": [],
	
	/**
	 * Dictate the positioning of DataTables' control elements - see
	 * {@link DataTable.model.oInit.sDom}.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type string
	 *  @default null
	 */
	"sDom": null,
	
	/**
	 * Which type of pagination should be used.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type string 
	 *  @default two_button
	 */
	"sPaginationType": "two_button",
	
	/**
	 * The state duration (for `stateSave`) in seconds.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type int
	 *  @default 0
	 */
	"iStateDuration": 0,
	
	/**
	 * Array of callback functions for state saving. Each array element is an 
	 * object with the following parameters:
	 *   <ul>
	 *     <li>function:fn - function to call. Takes two parameters, oSettings
	 *       and the JSON string to save that has been thus far created. Returns
	 *       a JSON string to be inserted into a json object 
	 *       (i.e. '"param": [ 0, 1, 2]')</li>
	 *     <li>string:sName - name of callback</li>
	 *   </ul>
	 *  @type array
	 *  @default []
	 */
	"aoStateSave": [],
	
	/**
	 * Array of callback functions for state loading. Each array element is an 
	 * object with the following parameters:
	 *   <ul>
	 *     <li>function:fn - function to call. Takes two parameters, oSettings 
	 *       and the object stored. May return false to cancel state loading</li>
	 *     <li>string:sName - name of callback</li>
	 *   </ul>
	 *  @type array
	 *  @default []
	 */
	"aoStateLoad": [],
	
	/**
	 * State that was loaded. Useful for back reference
	 *  @type object
	 *  @default null
	 */
	"oLoadedState": null,
	
	/**
	 * Source url for AJAX data for the table.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type string
	 *  @default null
	 */
	"sAjaxSource": null,
	
	/**
	 * Property from a given object from which to read the table data from. This
	 * can be an empty string (when not server-side processing), in which case 
	 * it is  assumed an an array is given directly.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type string
	 */
	"sAjaxDataProp": null,
	
	/**
	 * Note if draw should be blocked while getting data
	 *  @type boolean
	 *  @default true
	 */
	"bAjaxDataGet": true,
	
	/**
	 * The last jQuery XHR object that was used for server-side data gathering. 
	 * This can be used for working with the XHR information in one of the 
	 * callbacks
	 *  @type object
	 *  @default null
	 */
	"jqXHR": null,
	
	/**
	 * Function to get the server-side data.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type function
	 */
	"fnServerData": null,
	
	/**
	 * Functions which are called prior to sending an Ajax request so extra 
	 * parameters can easily be sent to the server
	 *  @type array
	 *  @default []
	 */
	"aoServerParams": [],
	
	/**
	 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if 
	 * required).
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type string
	 */
	"sServerMethod": null,
	
	/**
	 * Format numbers for display.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type function
	 */
	"fnFormatNumber": null,
	
	/**
	 * List of options that can be used for the user selectable length menu.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type array
	 *  @default []
	 */
	"aLengthMenu": null,
	
	/**
	 * Counter for the draws that the table does. Also used as a tracker for
	 * server-side processing
	 *  @type int
	 *  @default 0
	 */
	"iDraw": 0,
	
	/**
	 * Indicate if a redraw is being done - useful for Ajax
	 *  @type boolean
	 *  @default false
	 */
	"bDrawing": false,
	
	/**
	 * Draw index (iDraw) of the last error when parsing the returned data
	 *  @type int
	 *  @default -1
	 */
	"iDrawError": -1,
	
	/**
	 * Paging display length
	 *  @type int
	 *  @default 10
	 */
	"_iDisplayLength": 10,

	/**
	 * Paging start point - aiDisplay index
	 *  @type int
	 *  @default 0
	 */
	"_iDisplayStart": 0,

	/**
	 * Paging end point - aiDisplay index. Use fnDisplayEnd rather than
	 * this property to get the end point
	 *  @type int
	 *  @default 10
	 *  @private
	 */
	"_iDisplayEnd": 10,
	
	/**
	 * Server-side processing - number of records in the result set
	 * (i.e. before filtering), Use fnRecordsTotal rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 *  @type int
	 *  @default 0
	 *  @private
	 */
	"_iRecordsTotal": 0,

	/**
	 * Server-side processing - number of records in the current display set
	 * (i.e. after filtering). Use fnRecordsDisplay rather than
	 * this property to get the value of the number of records, regardless of
	 * the server-side processing setting.
	 *  @type boolean
	 *  @default 0
	 *  @private
	 */
	"_iRecordsDisplay": 0,
	
	/**
	 * Flag to indicate if jQuery UI marking and classes should be used.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type boolean
	 */
	"bJUI": null,
	
	/**
	 * The classes to use for the table
	 *  @type object
	 *  @default {}
	 */
	"oClasses": {},
	
	/**
	 * Flag attached to the settings object so you can check in the draw 
	 * callback if filtering has been done in the draw. Deprecated in favour of
	 * events.
	 *  @type boolean
	 *  @default false
	 *  @deprecated
	 */
	"bFiltered": false,
	
	/**
	 * Flag attached to the settings object so you can check in the draw 
	 * callback if sorting has been done in the draw. Deprecated in favour of
	 * events.
	 *  @type boolean
	 *  @default false
	 *  @deprecated
	 */
	"bSorted": false,
	
	/**
	 * Indicate that if multiple rows are in the header and there is more than 
	 * one unique cell per column, if the top one (true) or bottom one (false) 
	 * should be used for sorting / title by DataTables.
	 * Note that this parameter will be set by the initialisation routine. To
	 * set a default use {@link DataTable.defaults}.
	 *  @type boolean
	 */
	"bSortCellsTop": null,
	
	/**
	 * Initialisation object that is used for the table
	 *  @type object
	 *  @default null
	 */
	"oInit": null,
	
	/**
	 * Destroy callback functions - for plug-ins to attach themselves to the
	 * destroy so they can clean up markup and events.
	 *  @type array
	 *  @default []
	 */
	"aoDestroyCallback": [],

	
	/**
	 * Get the number of records in the current record set, before filtering
	 *  @type function
	 */
	"fnRecordsTotal": function ()
	{
		if ( this.oFeatures.bServerSide ) {
			return parseInt(this._iRecordsTotal, 10);
		} else {
			return this.aiDisplayMaster.length;
		}
	},
	
	/**
	 * Get the number of records in the current record set, after filtering
	 *  @type function
	 */
	"fnRecordsDisplay": function ()
	{
		if ( this.oFeatures.bServerSide ) {
			return parseInt(this._iRecordsDisplay, 10);
		} else {
			return this.aiDisplay.length;
		}
	},
	
	/**
	 * Set the display end point - aiDisplay index
	 *  @type function
	 *  @todo Should do away with _iDisplayEnd and calculate it on-the-fly here
	 */
	"fnDisplayEnd": function ()
	{
		if ( this.oFeatures.bServerSide ) {
			if ( this.oFeatures.bPaginate === false || this._iDisplayLength == -1 ) {
				return this._iDisplayStart+this.aiDisplay.length;
			} else {
				return Math.min( this._iDisplayStart+this._iDisplayLength, 
					this._iRecordsDisplay );
			}
		} else {
			return this._iDisplayEnd;
		}
	},
	
	/**
	 * The DataTables object for this table
	 *  @type object
	 *  @default null
	 */
	"oInstance": null,
	
	/**
	 * Unique identifier for each instance of the DataTables object. If there
	 * is an ID on the table node, then it takes that value, otherwise an
	 * incrementing internal counter is used.
	 *  @type string
	 *  @default null
	 */
	"sInstance": null,

	/**
	 * tabindex attribute value that is added to DataTables control elements, allowing
	 * keyboard navigation of the table and its controls.
	 */
	"iTabIndex": 0,

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	"nScrollHead": null,

	/**
	 * DIV container for the footer scrolling table if scrolling
	 */
	"nScrollFoot": null
};
