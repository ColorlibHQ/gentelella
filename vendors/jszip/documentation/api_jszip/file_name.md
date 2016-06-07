---
title: "file(name)"
layout: default
section: api
---

__Description__ : Get a file with the specified name. You can specify folders
in the name : the folder separator is a forward slash ("/").

__Arguments__

name | type   | description
-----|--------|-------------
name | string | the name of the file.

__Returns__ : An instance of [ZipObject]({{site.baseurl}}/documentation/api_zipobject.html) representing
the file if any, `null` otherwise.

__Throws__ : Nothing.

<!-- __Complexity__ : This is a simple lookup in **O(1)**. -->

__Examples__

```js
var zip = new JSZip();
zip.file("file.txt", "content");

zip.file("file.txt").name // "file.txt"
zip.file("file.txt").asText() // "content"
zip.file("file.txt").options.dir // false

// utf8 example
var zip = new JSZip(zipFromAjaxWithUTF8);
zip.file("amount.txt").asText() // "€15"
zip.file("amount.txt").asArrayBuffer() // an ArrayBuffer containing €15 encoded as utf8
zip.file("amount.txt").asUint8Array() // an Uint8Array containing €15 encoded as utf8

// with folders
zip.folder("sub").file("file.txt", "content");
zip.file("sub/file.txt"); // the file
// or
zip.folder("sub").file("file.txt") // the file
```


