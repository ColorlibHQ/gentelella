---
title: "Download the generated zip file"
layout: default
section: example
---

<p>Tip : check the source of the page !</p>
<h2>The FileSaver API</h2>
<div>
  Works on firefox, chrome , opera &gt;= 15 and IE &gt;= 10 (but NOT in compatibility view).<br/>
  <button id="blob" class="btn btn-primary">click to download</button>
</div>
<h2>The data URL</h2>
<div>
  Does not work in IE, has restrictions on the length.<br/>
  <button id="data_uri" class="btn btn-primary">click to download</button>
</div>
<script type="text/javascript">
(function () {
  var zip = new JSZip();
  zip.file("Hello.txt", "Hello world\n");

  function bindEvent(el, eventName, eventHandler) {
    if (el.addEventListener){
      // standard way
      el.addEventListener(eventName, eventHandler, false);
    } else if (el.attachEvent){
      // old IE
      el.attachEvent('on'+eventName, eventHandler);
    }
  }

  // Blob
  var blobLink = document.getElementById('blob');
  if (JSZip.support.blob) {
    function downloadWithBlob() {
      try {
        var blob = zip.generate({type:"blob"});
        // see FileSaver.js
        saveAs(blob, "hello.zip");
      } catch(e) {
        blobLink.innerHTML += " " + e;
      }
      return false;
    }
    bindEvent(blobLink, 'click', downloadWithBlob);
  } else {
    blobLink.innerHTML += " (not supported on this browser)";
  }

  // data URI
  function downloadWithDataURI() {
    window.location = "data:application/zip;base64," + zip.generate({type:"base64"});
  }
  var dataUriLink = document.getElementById('data_uri');
  bindEvent(dataUriLink, 'click', downloadWithDataURI);

})();
</script>
