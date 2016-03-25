/*!
 Bootstrap integration for DataTables' Responsive
 Â©2015 SpryMedia Ltd - datatables.net/license
*/
(function(c){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs","datatables.net-responsive"],function(a){return c(a,window,document)}):"object"===typeof exports?module.exports=function(a,b){a||(a=window);if(!b||!b.fn.dataTable)b=require("datatables.net-bs")(a,b).$;b.fn.dataTable.Responsive||require("datatables.net-responsive")(a,b);return c(b,a,a.document)}:c(jQuery,window,document)})(function(c){var a=c.fn.dataTable,b=a.Responsive.display,f=b.modal;b.modal=function(a){return function(b,
d,e){c.fn.modal?d||(d=c('<div class="modal fade" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"/></div></div></div>'),a&&a.header&&d.find("div.modal-header").append('<h4 class="modal-title">'+a.header(b)+"</h4>"),d.find("div.modal-body").append(e()),d.appendTo("body").modal()):f(b,d,e)}};
return a.Responsive});
