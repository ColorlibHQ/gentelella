# Buttons for DataTables 

This package contains distribution files for the [Buttons extension](https://datatables.net/extensions/buttons) for [DataTables](https://datatables.net/). Only the core software for this library is contained in this package - to be correctly styled, a styling package for Buttons must also be included. Styling options include DataTable's native styling, [Bootstrap](http://getbootstrap.com) and [Foundation](http://foundation.zurb.com/).

The Buttons extension for DataTables provides a common set of options, API methods and styling to display buttons on a page that will interact with a DataTable. It also provides plug-ins for file export (HTML5 and Flash), print view and column visibility. Other libraries, such as Editor and Select also provide buttons specific to their use cases.


## Installation

### Browser

For inclusion of this library using a standard `<script>` tag, rather than using this package, it is recommended that you use the [DataTables download builder](//datatables.net/download) which can create CDN or locally hosted packages for you, will all dependencies satisfied.

### npm

```
npm install datatables.net-buttons
```

```
var $ = require( 'jquery' );
require( 'datatables.net-buttons' )( window, $ );
```

### bower

```
bower install --save datatables.net-buttons
```



## Documentation

Full documentation of the DataTables options, API and plug-in interface are available on the DOCS_LINK. The site also contains information on the wide variety of plug-ins that are available for DataTables, which can be used to enhance and customise your table even further.


## Bug / Support

Support for DataTables is available through the [DataTables forums](//datatables.net/forums) and [commercial support options](//datatables.net/support) are available.


### Contributing

If you are thinking of contributing code to DataTables, first of all, thank you! All fixes, patches and enhancements to DataTables are very warmly welcomed. This repository is a distribution repo, so patches and issues sent to this repo will not be accepted. Instead, please direct pull requests to the [DataTables/Buttons](http://github.com/DataTables/Buttons). For issues / bugs, please direct your questions to the [DataTables forums](//datatables.net/forums).


## License

This software is released under the [MIT license](//datatables.net/license). You are free to use, modify and distribute this software, but all copyright information must remain.
