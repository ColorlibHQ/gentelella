---
title: "Reading a local file with the File API"
layout: default
section: example
---

<h3>Choose the local(s) zip file(s)</h3>
<p class="note">Note : your browser will process the zip file, don't choose a file too big !</p>
<input type="file" id="file" name="file" multiple /><br />

<div id="error_block" class="alert alert-danger hidden">
  You will need a recent browser to use this demo :(
</div>

<div id="result_block" class="hidden">
  <h3>Content :</h3>
  <div id="result"></div>
</div>
<script type="text/javascript" src="{{site.baseurl}}/test/jquery-1.8.3.min.js"></script>
<script type="text/javascript">
(function () {
  if (!window.FileReader || !window.ArrayBuffer) {
    $("#error_block").removeClass("hidden").addClass("show");
    return;
  }


  var $result = $("#result");
  $("#file").on("change", function(evt) {
    // remove content
    $result.html("");
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // see http://www.html5rocks.com/en/tutorials/file/dndfiles/

    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          var $title = $("<h4>", {
            text : theFile.name
          });
          $result.append($title);
          var $fileContent = $("<ul>");
          try {

            var dateBefore = new Date();
            // read the content of the file with JSZip
            var zip = new JSZip(e.target.result);
            var dateAfter = new Date();

            $title.append($("<span>", {
              text:" (parsed in " + (dateAfter - dateBefore) + "ms)"
            }));

            // that, or a good ol' for(var entryName in zip.files)
            $.each(zip.files, function (index, zipEntry) {
              $fileContent.append($("<li>", {
                text : zipEntry.name
              }));
              // the content is here : zipEntry.asText()
            });
            // end of the magic !

          } catch(e) {
            $fileContent = $("<div>", {
              "class" : "alert alert-danger",
              text : "Error reading " + theFile.name + " : " + e.message
            });
          }
          $result.append($fileContent);
        }
      })(f);

      // read the file !
      // readAsArrayBuffer and readAsBinaryString both produce valid content for JSZip.
      reader.readAsArrayBuffer(f);
      // reader.readAsBinaryString(f);
    }
  });
})();
</script>
