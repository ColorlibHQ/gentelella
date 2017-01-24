---
title: "remove(name)"
layout: default
section: api
---

__Description__ : Delete a file or folder (recursively).

__Arguments__

name | type   | description
-----|--------|------------
name | string | the name of the file/folder to delete.

__Returns__ : The current JSZip object.

__Throws__ : Nothing.

<!--
__Complexity__ : **O(k)** where k is the number of entry to delete (may be > 1
when removing a folder).
-->

__Example__

```js
var zip = new JSZip();
zip.file("Hello.txt", "Hello World\n");
zip.file("temp.txt", "nothing").remove("temp.txt");
// result : Hello.txt

zip.folder("css").file("style.css", "body {background: #FF0000}");
zip.remove("css");
//result : empty zip
```


