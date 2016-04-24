---
title: "Get a file with an ajax call"
layout: default
section: example
---

<p>Tip : check the source of the page !</p>

<h3>With JSZipUtils</h3>
<div id="jszip_utils"></div>

<script type="text/javascript">
(function () {

  function showError(elt, err) {
    elt.innerHTML = "<p class='alert alert-danger'>" + err + "</p>";
  }

  function showContent(elt, type, content) {
    elt.innerHTML = "<p class='alert alert-success'>loaded ! (as a " + type + ")<br/>" +
      "Content = " + content + "</p>";
  }

  //=========================
  // JSZipUtils
  //=========================
  JSZipUtils.getBinaryContent('{{site.baseurl}}/test/ref/text.zip', function(err, data) {
    var elt = document.getElementById('jszip_utils');
    if(err) {
      showError(elt, err);
      return;
    }

    try {
      var zip = new JSZip(data);
      showContent(elt, "" + data, zip.file("Hello.txt").asText());
    } catch(e) {
      showError(elt, e);
    }
  });

})();
</script>
