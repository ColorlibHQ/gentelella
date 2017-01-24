jQuery(function ($) {
    "use strict";

    /**
     * Reset the message.
     */
    function resetMessage () {
        $("#result")
        .removeClass()
        .text("");
    }
    /**
     * show a successful message.
     * @param {String} text the text to show.
     */
    function showMessage(text) {
        resetMessage();
        $("#result")
        .addClass("alert alert-success")
        .text(text);
    }
    /**
     * show an error message.
     * @param {String} text the text to show.
     */
    function showError(text) {
        resetMessage();
        $("#result")
        .addClass("alert alert-danger")
        .text(text);
    }

    /**
     * Fetch the content, add it to the JSZip object
     * and use a jQuery deferred to hold the result.
     * @param {String} url the url of the content to fetch.
     * @param {String} filename the filename to use in the JSZip object.
     * @param {JSZip} zip the JSZip instance.
     * @return {jQuery.Deferred} the deferred containing the data.
     */
    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                zip.file(filename, data, {binary:true});
                deferred.resolve(data);
            }
        });
        return deferred;
    }

    if(!JSZip.support.blob) {
        showError("This demo works only with a recent browser !");
        return;
    }

    var $form = $("#download_form").on("submit", function () {

        resetMessage();

        var zip = new JSZip();
        var deferreds = [];

        // find every checked item
        $(this).find(":checked").each(function () {
            var $this = $(this);
            var url = $this.data("url");
            var filename = url.replace(/.*\//g, "");
            deferreds.push(deferredAddZip(url, filename, zip));
        });

        // when everything has been downloaded, we can trigger the dl
        $.when.apply($, deferreds).done(function () {
            var blob = zip.generate({type:"blob"});

            // see FileSaver.js
            saveAs(blob, "example.zip");

            showMessage("done !");
        }).fail(function (err) {
            showError(err);
        });
        return false;
    });
});

// vim: set shiftwidth=4 softtabstop=4:
