# Important - this is retired software

Please note that TableTools has now been retired and replaced by the [Buttons](//datatables.net/extensions/buttons) and [Select](//datatables.net/extensions/select) extensions which offers significant improvements and API integration with the rest of DataTables and the other extensions.

It is strongly recommended that you upgrade if possible to Buttons and Select, and to not use TableTools in any new projects.


# TableTools

TableTools is a plug-in for the DataTables HTML table enhancer, which adds a highly customisable button toolbar to a DataTable. Key features include:

* Copy to clipboard
* Save table data as CSV, XLS or PDF files
* Print view for clean printing
* Row selection options
* Easy use predefined buttons
* Simple customisation of buttons
* Well defined API for advanced control


# Installation

To use TableTools, first download DataTables ( http://datatables.net/download ) and place the unzipped TableTools package into a `extensions` directory in the DataTables package (in DataTables 1.9- use the `extras` directory). This will allow the pages in the examples to operate correctly. To see the examples running, open the `examples` directory in your web-browser.


# Basic usage

TableTools is initialised using the `T` option that it adds to DataTables' `dom` option. For example:

```js
$(document).ready( function () {
	$('#example').DataTable( {
		dom: 'T<"clear">lfrtip'
	} );
} );
```


# Documentation / support

* Documentation: http://datatables.net/extensions/tabletools/
* DataTables support forums: http://datatables.net/forums


# GitHub

If you fancy getting involved with the development of TableTools and help make it better, please refer to its GitHub repo: https://github.com/DataTables/TableTools

