var log = function (m) { console.log(m); }

var warn = function (m) { console.warn(m); }

var msg = function (m, title) { if (title === undefined) title = "Info"; new PNotify({ title: title, text: m, type: 'info', styling: 'bootstrap3' }); }

var msgSuccess = function (m, title) { if (title === undefined) title = "Success"; new PNotify({ title: title, text: m, type: 'success', styling: 'bootstrap3' }); }

var msgNotice = function (m, title) { if (title === undefined) title = "Note"; new PNotify({ title: title, text: m, styling: 'bootstrap3' }); }

var msgError = function (m, title) { if (title === undefined) title = "Erreur !"; new PNotify({ title: title, text: m, type: 'error', styling: 'bootstrap3' }); }

var msgDark = function (m, title) { if (title === undefined) title = "Info"; new PNotify({ title: title, text: m, type: 'info', styling: 'bootstrap3', addclass: 'dark' }); }
