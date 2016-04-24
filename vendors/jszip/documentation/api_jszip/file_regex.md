---
title: "file(regex)"
layout: default
section: api
---

__Description__ : Search a file in the current folder and subfolders with a
[regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).
The regex is tested against the relative filename.

__Arguments__

name  | type   | description
------|--------|------------
regex | RegExp | the regex to use.

__Returns__ : An array of matching files (an empty array if none matched). Each
maching file is an instance of [ZipObject]({{site.baseurl}}/documentation/api_zipobject.html).

__Throws__ : Nothing.

<!--
__Complexity__ : **O(k)** where k is the number of entries in the current JSZip
instance.
-->

__Example__

```js
var zip = new JSZip();
zip.file("file1.txt", "content");
zip.file("file2.txt", "content");

zip.file(/file/); // array of size 2

// example with a relative path :
var folder = zip.folder("sub");
folder
  .file("file3.txt", "content")  // relative path from folder : file3.txt
  .file("file4.txt", "content"); // relative path from folder : file4.txt

folder.file(/file/);  // array of size 2
folder.file(/^file/); // array of size 2, the relative paths start with file

// arrays contain objects in the form:
// {name: "file2.txt", dir: false, asText : function () {...}, ...}
```


