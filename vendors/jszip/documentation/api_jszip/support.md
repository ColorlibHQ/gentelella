---
title: "JSZip.support"
layout: default
section: api
---

If the browser supports them, JSZip can take advantage of some "new" features :
ArrayBuffer, Blob, Uint8Array. To know if JSZip can use them, you can check the
JSZip.support object. It contains the following boolean properties :

* `arraybuffer` : true if JSZip can read and generate ArrayBuffer, false otherwise.
* `uint8array` : true if JSZip can read and generate Uint8Array, false otherwise.
* `blob` : true if JSZip can generate Blob, false otherwise.
* `nodebuffer` : true if JSZip can read and generate nodejs Buffer, false otherwise.


