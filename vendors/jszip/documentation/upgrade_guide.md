---
title: Upgrade Guide
layout: default
section: main
---

### From 2.2.2 to 2.3.0

* On `ZipObject#options`, the attributes `date` and `dir` have been
  deprecated and are now on `ZipObject`.
* On `ZipObject#options`, the attributes `base64` and `binary` have been
  deprecated.
* `JSZip.base64`, `JSZip.prototype.crc32`, `JSZip.prototype.utf8decode`,
  `JSZip.prototype.utf8encode` and `JSZip.utils` have been deprecated.

```js
// deprecated
zip.file("test.txt").options.date
zip.file("test.txt").options.dir
// new API
zip.file("test.txt").date
zip.file("test.txt").dir
```


### From 2.0.0 to 2.1.0

* The packaging changed : instead of loading jszip.js, jszip-load.js,
  jszip-inflate.js, jszip-deflate.js, just include dist/jszip.js or
  dist/jszip.min.js.
  For AMD loader users : JSZip now registers itself. You just have to put the
  file at the right place or configure your loader.


### From 1.x to 2.x

* `JSZipBase64` has been renamed to `JSZip.base64`.
* The `data` attribute doesn't exist anymore :
  use the getters `asText()`, `asBinary()`, etc
* The compression/decompression methods now give their input type with the
  `compressInputType` and `uncompressInputType` attributes.

Example for the data attribute :

```js
// before
zip.file("test.txt").data;
zip.files["test.txt"].data;
zip.file("image.png").data;
zip.files["image.png"].data;

// after
zip.file("test.txt").asText();
zip.files["test.txt"].asText();
zip.file("image.png").asBinary();
zip.files["image.png"].asBinary();
```
