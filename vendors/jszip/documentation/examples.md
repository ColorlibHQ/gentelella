---
title: "How to use JSZip"
layout: default
section: example
---

An instance of JSZip represents a set of files. You can add them, remove them,
modify them. You can also import an existing zip file or generate one.

### Getting the object

#### In a browser

For a browser, there are two interesting files : `dist/jszip.js` and
`dist/jszip.min.js` (include just one).

If you use an AMD loader (RequireJS for example) JSZip will register itself :
you just have to put the js file at the right place, or configure the loader
(see [here for RequireJS](http://requirejs.org/docs/api.html#config-paths)).

Without any loader, JSZip will declare in the global scope a variable named `JSZip`.

#### In nodejs

In nodejs, you can `require` it :

```js
var JSZip = require("jszip");
```

### Basic manipulations

The first step is to create an instance of JSZip :

```js
var zip = new JSZip();
```

On this instance, we can add (and update) files and folders with
`.file(name, content)` and `.folder(name)`.
They return the current JSZip instance so you can chain the calls.

```js
// create a file
zip.file("hello.txt", "Hello[p my)6cxsw2q");
// oops, cat on keyboard. Fixing !
zip.file("hello.txt", "Hello World\n");

// create a file and a folder
zip.file("nested/hello.txt", "Hello World\n");
// same as
zip.folder("nested").file("hello.txt", "Hello World\n");
```

With `.folder(name)`, the returned object has a different root : if you add files
on this object, you will put them in the created subfolder. This is just a
view, the added files will also be in the "root" object.

```js
var photoZip = zip.folder("photos");
// this call will create photos/README
photoZip.file("README", "a folder with photos");
```

You can access the file content with `.file(name)` and
[its getters]({{site.baseurl}}/documentation/api_zipobject.html) :

```js
zip.file("hello.txt").asText(); // "Hello World\n"

if (JSZip.support.uint8array) {
  zip.file("hello.txt").asUint8Array(); // Uint8Array { 0=72, 1=101, 2=108, more...}
}
```

You can also remove files or folders with `.remove(name)` :

```js
zip.remove("photos/README");
zip.remove("photos");
// same as
zip.remove("photos"); // by removing the folder, you also remove its content.
```

### Generate a zip file

With `.generate(options)` you can generate a zip file (not a real file but its
representation in memory). Check
[this page]({{site.baseurl}}/documentation/howto/write_zip.html) for more
informations on how to write / give the file to the user.

```js
var content = null;
if (JSZip.support.uint8array) {
  content = zip.generate({type : "uint8array"});
} else {
  content = zip.generate({type : "string"});
}
```

### Read a zip file

With `.load(data)` you can load a zip file. Check
[this page]({{site.baseurl}}/documentation/howto/read_zip.html) to see how to
do properly (it's more tricky that it seems).

```js
var new_zip = new JSZip();
// more files !
new_zip.load(content);

// you now have every files contained in the loaded zip
new_zip.file("hello.txt").asText(); // "Hello World\n"
```

