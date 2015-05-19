

/*
 * Developer note - See note in model.defaults.js about the use of Hungarian 
 * notation and camel case.
 */

/**
 * Column options that can be given to DataTables at initialisation time.
 *  @namespace
 */
DataTable.defaults.column = {
	/**
	 * Allows a column's sorting to take multiple columns into account when 
	 * doing a sort. For example first name / last name columns make sense to 
	 * do a multi-column sort over the two columns.
	 *  @type array
	 *  @default null <i>Takes the value of the column index automatically</i>
	 *
	 *  @name DataTable.defaults.column.dataSort
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "dataSort": [ 0, 1 ], "targets": [ 0 ] },
	 *          { "dataSort": [ 1, 0 ], "targets": [ 1 ] },
	 *          { "dataSort": [ 2, 3, 4 ], "targets": [ 2 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          { "dataSort": [ 0, 1 ] },
	 *          { "dataSort": [ 1, 0 ] },
	 *          { "dataSort": [ 2, 3, 4 ] },
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"aDataSort": null,


	/**
	 * You can control the default sorting direction, and even alter the behaviour
	 * of the sort handler (i.e. only allow ascending sorting etc) using this
	 * parameter.
	 *  @type array
	 *  @default [ 'asc', 'desc' ]
	 *
	 *  @name DataTable.defaults.column.sorting
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "sorting": [ "asc" ], "targets": [ 1 ] },
	 *          { "sorting": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
	 *          { "sorting": [ "desc" ], "targets": [ 3 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          { "sorting": [ "asc" ] },
	 *          { "sorting": [ "desc", "asc", "asc" ] },
	 *          { "sorting": [ "desc" ] },
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"asSorting": [ 'asc', 'desc' ],


	/**
	 * Enable or disable filtering on the data in this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.searchable
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "searchable": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "searchable": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bSearchable": true,


	/**
	 * Enable or disable sorting on this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.sortable
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "sortable": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "sortable": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bSortable": true,


	/**
	 * Enable or disable the display of this column.
	 *  @type boolean
	 *  @default true
	 *
	 *  @name DataTable.defaults.column.visible
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "visible": false, "targets": [ 0 ] }
	 *        ] } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "visible": false },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ] } );
	 *    } );
	 */
	"bVisible": true,
	
	
	/**
	 * Developer definable function that is called whenever a cell is created (Ajax source,
	 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
	 * allowing you to modify the DOM element (add background colour for example) when the
	 * element is available.
	 *  @type function
	 *  @param {element} td The TD node that has been created
	 *  @param {*} cellData The Data for the cell
	 *  @param {array|object} rowData The data for the whole row
	 *  @param {int} row The row index for the aoData data store
	 *  @param {int} col The column index for aoColumns
	 *
	 *  @name DataTable.defaults.column.createdCell
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [3],
	 *          "createdCell": function (td, cellData, rowData, row, col) {
	 *            if ( cellData == "1.7" ) {
	 *              $(td).css('color', 'blue')
	 *            }
	 *          }
	 *        } ]
	 *      });
	 *    } );
	 */
	"fnCreatedCell": null,


	/**
	 * The column index (starting from 0!) that you wish a sort to be performed
	 * upon when this column is selected for sorting. This can be used for sorting
	 * on hidden columns for example.
	 *  @type int
	 *  @default -1 <i>Use automatically calculated column index</i>
	 *
	 *  @name DataTable.defaults.column.dataSort
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "dataSort": 1, "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "dataSort": 1 },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"iDataSort": -1,


	/**
	 * This parameter has been replaced by `data` in DataTables to ensure naming
	 * consistency. `dataProp` can still be used, as there is backwards compatibility
	 * in DataTables for this option, but it is strongly recommended that you use
	 * `data` in preference to `dataProp`.
	 *  @name DataTable.defaults.column.dataProp
	 */


	/**
	 * This property can be used to read data from any JSON data source property,
	 * including deeply nested objects / properties. `data` can be given in a
	 * number of different ways which effect its behaviour:
	 *
	 * * integer - treated as an array index for the data source. This is the
	 *   default that DataTables uses (incrementally increased for each column).
	 * * string - read an object property from the data source. Note that you can
	 *   use Javascript dotted notation to read deep properties / arrays from the
	 *   data source.
	 * * null - the sDefaultContent option will be used for the cell (null
	 *   by default, so you will need to specify the default content you want -
	 *   typically an empty string). This can be useful on generated columns such 
	 *   as edit / delete action columns.
	 * * function - the function given will be executed whenever DataTables 
	 *   needs to set or get the data for a cell in the column. The function 
	 *   takes three parameters:
	 *    * {array|object} The data source for the row
	 *    * {string} The type call data requested - this will be 'set' when
	 *      setting data or 'filter', 'display', 'type', 'sort' or undefined when 
	 *      gathering data. Note that when `undefined` is given for the type
	 *      DataTables expects to get the raw data for the object back<
	 *    * {*} Data to set when the second parameter is 'set'.
	 * * The return value from the function is not required when 'set' is the type
	 *   of call, but otherwise the return is what will be used for the data
	 *   requested.
	 *
	 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The name change
	 * reflects the flexibility of this property and is consistent with the naming of
	 * mRender. If 'mDataProp' is given, then it will still be used by DataTables, as
	 * it automatically maps the old name to the new if required.
	 *
	 *  @type string|int|function|null
	 *  @default null <i>Use automatically calculated column index</i>
	 *
	 *  @name DataTable.defaults.column.data
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Read table data from objects
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajaxSource": "sources/deep.txt",
	 *        "columns": [
	 *          { "data": "engine" },
	 *          { "data": "browser" },
	 *          { "data": "platform.inner" },
	 *          { "data": "platform.details.0" },
	 *          { "data": "platform.details.1" }
	 *        ]
	 *      } );
	 *    } );
	 * 
	 *  @example
	 *    // Using `data` as a function to provide different information for
	 *    // sorting, filtering and display. In this case, currency (price)
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": function ( source, type, val ) {
	 *            if (type === 'set') {
	 *              source.price = val;
	 *              // Store the computed dislay and filter values for efficiency
	 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
	 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
	 *              return;
	 *            }
	 *            else if (type === 'display') {
	 *              return source.price_display;
	 *            }
	 *            else if (type === 'filter') {
	 *              return source.price_filter;
	 *            }
	 *            // 'sort', 'type' and undefined all just use the integer
	 *            return source.price;
	 *          }
	 *        } ]
	 *      } );
	 *    } );
	 */
	"mData": null,


	/**
	 * This property is the rendering partner to `data` and it is suggested that
	 * when you want to manipulate data for display (including filtering, sorting etc)
	 * but not altering the underlying data for the table, use this property. `data`
	 * can actually do everything this property can and more, but this parameter is
	 * easier to use since there is no 'set' option. Like `data` this can be given
	 * in a number of different ways to effect its behaviour, with the addition of 
	 * supporting array syntax for easy outputting of arrays (including arrays of
	 * objects):
	 * 
	 * * integer - treated as an array index for the data source. This is the
	 *   default that DataTables uses (incrementally increased for each column).
	 * * string - read an object property from the data source. Note that you can
	 *   use Javascript dotted notation to read deep properties / arrays from the
	 *   data source and also array brackets to indicate that the data reader should
	 *   loop over the data source array. When characters are given between the array
	 *   brackets, these characters are used to join the data source array together.
	 *   For example: "accounts[, ].name" would result in a comma separated list with
	 *   the 'name' value from the 'accounts' array of objects.
	 * * function - the function given will be executed whenever DataTables 
	 *   needs to set or get the data for a cell in the column. The function 
	 *   takes three parameters:
	 *    * {array|object} The data source for the row (based on `data`)
	 *    * {string} The type call data requested - this will be 'filter', 'display', 
	 *      'type' or 'sort'.
	 *    * {array|object} The full data source for the row (not based on `data`)
	 *    * The return value from the function is what will be used for the data
	 *       requested.
	 *
	 *  @type string|int|function|null
	 *  @default null _Use `data`_
	 *
	 *  @name DataTable.defaults.column.render
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Create a comma separated list from an array of objects
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "ajaxSource": "sources/deep.txt",
	 *        "columns": [
	 *          { "data": "engine" },
	 *          { "data": "browser" },
	 *          {
	 *            "data": "platform",
	 *            "render": "[, ].name"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 * 
	 *  @example
	 *    // Use as a function to create a link from the data source
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "data": "download_link",
	 *          "render": function ( data, type, full ) {
	 *            return '<a href="'+data+'">Download</a>';
	 *          }
	 *        } ]
	 *      } );
	 *    } );
	 */
	"mRender": null,


	/**
	 * Change the cell type created for the column - either TD cells or TH cells. This
	 * can be useful as TH cells have semantic meaning in the table body, allowing them
	 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
	 *  @type string
	 *  @default td
	 *
	 *  @name DataTable.defaults.column.cellType
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Make the first column use TH cells
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ {
	 *          "targets": [ 0 ],
	 *          "cellType": "th"
	 *        } ]
	 *      } );
	 *    } );
	 */
	"sCellType": "td",


	/**
	 * Class to give to each cell in this column.
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @name DataTable.defaults.column.class
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "class": "my_class", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "class": "my_class" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sClass": "",
	
	/**
	 * When DataTables calculates the column widths to assign to each column,
	 * it finds the longest string in each column and then constructs a
	 * temporary table and reads the widths from that. The problem with this
	 * is that "mmm" is much wider then "iiii", but the latter is a longer 
	 * string - thus the calculation can go wrong (doing it properly and putting
	 * it into an DOM object and measuring that is horribly(!) slow). Thus as
	 * a "work around" we provide this option. It will append its value to the
	 * text that is found to be the longest string for the column - i.e. padding.
	 * Generally you shouldn't need this!
	 *  @type string
	 *  @default <i>Empty string<i>
	 *
	 *  @name DataTable.defaults.column.contentPadding
	 *  @dtopt Columns
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          null,
	 *          null,
	 *          null,
	 *          {
	 *            "contentPadding": "mmm"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sContentPadding": "",


	/**
	 * Allows a default value to be given for a column's data, and will be used
	 * whenever a null data source is encountered (this can be because `data`
	 * is set to null, or because the data source itself is null).
	 *  @type string
	 *  @default null
	 *
	 *  @name DataTable.defaults.column.defaultContent
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          {
	 *            "data": null,
	 *            "defaultContent": "Edit",
	 *            "targets": [ -1 ]
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          null,
	 *          null,
	 *          null,
	 *          {
	 *            "data": null,
	 *            "defaultContent": "Edit"
	 *          }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sDefaultContent": null,


	/**
	 * This parameter is only used in DataTables' server-side processing. It can
	 * be exceptionally useful to know what columns are being displayed on the
	 * client side, and to map these to database fields. When defined, the names
	 * also allow DataTables to reorder information from the server if it comes
	 * back in an unexpected order (i.e. if you switch your columns around on the
	 * client-side, your server-side code does not also need updating).
	 *  @type string
	 *  @default <i>Empty string</i>
	 *
	 *  @name DataTable.defaults.column.name
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "name": "engine", "targets": [ 0 ] },
	 *          { "name": "browser", "targets": [ 1 ] },
	 *          { "name": "platform", "targets": [ 2 ] },
	 *          { "name": "version", "targets": [ 3 ] },
	 *          { "name": "grade", "targets": [ 4 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "name": "engine" },
	 *          { "name": "browser" },
	 *          { "name": "platform" },
	 *          { "name": "version" },
	 *          { "name": "grade" }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sName": "",


	/**
	 * Defines a data source type for the sorting which can be used to read
	 * real-time information from the table (updating the internally cached
	 * version) prior to sorting. This allows sorting to occur on user editable
	 * elements such as form inputs.
	 *  @type string
	 *  @default std
	 *
	 *  @name DataTable.defaults.column.sortDataType
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [
	 *          { "sortDataType": "dom-text", "targets": [ 2, 3 ] },
	 *          { "type": "numeric", "targets": [ 3 ] },
	 *          { "sortDataType": "dom-select", "targets": [ 4 ] },
	 *          { "sortDataType": "dom-checkbox", "targets": [ 5 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [
	 *          null,
	 *          null,
	 *          { "sortDataType": "dom-text" },
	 *          { "sortDataType": "dom-text", "type": "numeric" },
	 *          { "sortDataType": "dom-select" },
	 *          { "sortDataType": "dom-checkbox" }
	 *        ]
	 *      } );
	 *    } );
	 */
	"sSortDataType": "std",


	/**
	 * The title of this column.
	 *  @type string
	 *  @default null <i>Derived from the 'TH' value for this column in the 
	 *    original HTML table.</i>
	 *
	 *  @name DataTable.defaults.column.title
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "title": "My column title", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "title": "My column title" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sTitle": null,


	/**
	 * The type allows you to specify how the data for this column will be sorted.
	 * Four types (string, numeric, date and html (which will strip HTML tags
	 * before sorting)) are currently available. Note that only date formats
	 * understood by Javascript's Date() object will be accepted as type date. For
	 * example: "Mar 26, 2008 5:03 PM". May take the values: 'string', 'numeric',
	 * 'date' or 'html' (by default). Further types can be adding through
	 * plug-ins.
	 *  @type string
	 *  @default null <i>Auto-detected from raw data</i>
	 *
	 *  @name DataTable.defaults.column.type
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "type": "html", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "type": "html" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sType": null,


	/**
	 * Defining the width of the column, this parameter may take any CSS value
	 * (3em, 20px etc). DataTables apples 'smart' widths to columns which have not
	 * been given a specific width through this interface ensuring that the table
	 * remains readable.
	 *  @type string
	 *  @default null <i>Automatic</i>
	 *
	 *  @name DataTable.defaults.column.width
	 *  @dtopt Columns
	 * 
	 *  @example
	 *    // Using `columnDefs`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columnDefs": [ 
	 *          { "width": "20%", "targets": [ 0 ] }
	 *        ]
	 *      } );
	 *    } );
	 *    
	 *  @example
	 *    // Using `columns`
	 *    $(document).ready( function() {
	 *      $('#example').dataTable( {
	 *        "columns": [ 
	 *          { "width": "20%" },
	 *          null,
	 *          null,
	 *          null,
	 *          null
	 *        ]
	 *      } );
	 *    } );
	 */
	"sWidth": null
};

_fnHungarianMap( DataTable.defaults.column );

