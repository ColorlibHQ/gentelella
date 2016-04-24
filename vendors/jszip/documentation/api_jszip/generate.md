---
title: "generate(options)"
layout: default
section: api
---

__Description__ : Generates the complete zip file.

__Arguments__

name                | type    | default | description
--------------------|---------|---------|------------
options             | object  |         | the options to generate the zip file :
options.base64      | boolean | false   | **deprecated**, use `type` instead. If `type` is not used, set to `false` to get the result as a raw byte string, `true` to encode it as base64.
options.compression | string  | `STORE` (no compression) | the default file compression method to use. Available methods are `STORE` and `DEFLATE`. You can also provide your own compression method.
options.compressionOptions | object | `null` | the options to use when compressing the file, see below.
options.type        | string  | `base64` | The type of zip to return, see below for the other types.
options.comment     | string  |          | The comment to use for the zip file.
options.mimeType    | string  | `application/zip` | mime-type for the generated file. Useful when you need to generate a file with a different extension, ie: ".ods".
options.platform    | string  | `DOS`    | The platform to use when generating the zip file.
options.encodeFileName | function  | encode with UTF-8 | the function to encode the file name / comment.

Possible values for `type` :

* `base64` (default) : the result will be a string, the binary in a base64 form.
* `string` : the result will be a string in "binary" form, using 1 byte per char (2 bytes).
* `uint8array` : the result will be a Uint8Array containing the zip. This requires a compatible browser.
* `arraybuffer` : the result will be a ArrayBuffer containing the zip. This requires a compatible browser.
* `blob` : the result will be a Blob containing the zip. This requires a compatible browser.
* `nodebuffer` : the result will be a nodejs Buffer containing the zip. This requires nodejs.

Note : when using type = "uint8array", "arraybuffer" or "blob", be sure to
check if the browser supports it (you can use [`JSZip.support`]({{site.baseurl}}/documentation/api_jszip/support.html)).

The `compressionOptions` parameter depends on the compression type. With
`STORE` (no compression), this parameter is ignored. With `DEFLATE`, you can
give the compression level with `compressionOptions : {level:6}` (or any level
between 1 (best speed) and 9 (best compression)).

Note : if the entry is *already* compressed (coming from a compressed zip file),
calling `generate()` with a different compression level won't update the entry.
The reason is simple : JSZip doesn't know how compressed the content was and
how to match the compression level with the implementation we use.

Note for the `comment` option : the zip format has no flag or field to give the
encoding of this field and JSZip will use UTF-8. With non ASCII characters you
might get encoding issues if the file archiver doesn't use UTF-8 to decode the
comment.

If not set, JSZip will use the field `comment` on its `options`.

Possible values for `platform` : `DOS` and `UNIX`. It also accepts nodejs
`process.platform` values.
When using `DOS`, the attribute `dosPermissions` of each file is used.
When using `UNIX`, the attribute `unixPermissions` of each file is used.

If you set the platform value on nodejs, be sure to use `process.platform`.
`fs.stats` returns a non executable mode for folders on windows, if you
force the platform to `UNIX` the generated zip file will have a strange
behavior on UNIX platforms.

__About `encodeFileName`__ :

By default, JSZip uses UTF-8 to encode the file names / comments. You can use
this method to force an other encoding. Note : the encoding used is not stored
in a zip file, not using UTF-8 may lead to encoding issues.
The function takes a string and returns a bytes array (Uint8Array or Array).

__Returns__ : The generated zip file.

__Throws__ : An exception if the asked `type` is not available in the browser,
see [JSZip.support]({{site.baseurl}}/documentation/api_jszip/support.html).

<!-- __Complexity__ : TODO : worst case, with/out compression, etc -->

__Example__

```js
var content = zip.generate({type:"blob"});
// see FileSaver.js
saveAs(content, "hello.zip");
```

```js
var content = zip.generate({type:"base64"});
location.href="data:application/zip;base64,"+content;
```

```js
var content = zip.generate({type:"nodebuffer"});
require("fs").writeFile("hello.zip", content, function(err){/*...*/});
```

```js
// on nodejs
zip.file(pathname, content, {
    date: stat.mtime,
    unixPermissions: stat.mode
});

// ...

zip.generate({
    type: 'nodebuffer',
    platform: process.platform
});
```

```js
//This example will Generate a Open Document Spreasheet, with the correct mime type
var zip = new JSZip();
zip.file("mimetype", "application/vnd.oasis.opendocument.spreadsheet");
var conf2 = zip.folder("Configurations2");
conf2.folder("acceleator");
conf2.folder("images");
conf2.folder("popupmenu");
conf2.folder("statusbar");
conf2.folder("floater");
conf2.folder("menubar");
conf2.folder("progressbar");
conf2.folder("toolbar");

var manifest = "<..."; //xml containing manifest.xml 
var styles = "<..."; //xml containing styles.xml
var settings = "<..."; //xml containing settings.xml
var meta = "<..."; //xml containing meta.xml
var content = "<..."; //xml containing content.xml

var metaInf = zip.folder("META-INF");
metaInf.file("manifest.xml", manifest);
zip.file("styles.xml", styles);
zip.file("settings.xml", settings); 
zip.file("meta.xml", meta);
zip.file("content.xml", content);

//Generate the file
var odsFile = zip.generate({type: "blob", mimeType: "application/ods", compression: "DEFLATE"});

var url = window.URL.createObjectURL(odsFile);
var link = document.getElementById("link"); //I suppose you'll have a link with this id :)
link.download = "testjs.ods";
link.href = url;


```


Using a custom charset :

```js
// using iconv-lite for example
var iconv = require('iconv-lite');

zip.generate({
    type: 'uint8array',
    encodeFileName: function (string) {
        return iconv.encode(string, 'your-encoding');
    }
});
```

