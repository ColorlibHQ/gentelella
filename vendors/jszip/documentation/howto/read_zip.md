---
title: "How to read a file"
layout: default
section: example
---

This page explains how to read an existing zip file or add a existing file into
the zip file.


### In the browser

#### AJAX request

Getting binary data with an ajax request is hard (mainly because of IE <= 9).
The easy way is to use [JSZipUtils.getBinaryContent](https://github.com/stuk/jszip-utils).
With JSZipUtils.getBinaryContent, you can do the following (see the
documentation for more examples) :

```js
JSZipUtils.getBinaryContent('path/to/content.zip', function(err, data) {
  if(err) {
    throw err; // or handle err
  }

  var zip = new JSZip(data);
});
```

<br>

If you need to adapt an existing solution to what getBinaryContent does, here
are the details. When doing a XHR request (level 1, without setting the
`responseType`) the browser will try to interpret the response as a string and
decode it from its charset. To avoid this on Firefox/Chrome/Opera, you need to
set mime type : `xhr.overrideMimeType("text/plain; charset=x-user-defined");`.
On IE <= 9, this is harder. The overrideMimeType trick doesn't work so we need
to use [vbscript](http://stackoverflow.com/questions/1095102/how-do-i-load-binary-image-data-using-javascript-and-xmlhttprequest)
and non standard attributes.
On IE > 9, overrideMimeType doesn't work but xhr2 does.

With [xhr 2](http://caniuse.com/xhr2), you can just set the responseType
attribute : `xhr.responseType = "arraybuffer";`. With this, the browser will
return an ArrayBuffer.

#### Local files

If the browser supports the [FileReader API](http://caniuse.com/filereader),
you can use it to read a zip file. JSZip can read ArrayBuffer, so you can use
`FileReader.readAsArrayBuffer(Blob)`, see this [example]({{site.baseurl}}/documentation/examples/read-local-file-api.html).

### In nodejs

JSZip can read Buffers so you can do the following :

#### Local file

```js
"use strict";

var fs = require("fs");
var JSZip = require("jszip");

// read a zip file
fs.readFile("test.zip", function(err, data) {
  if (err) throw err;
  var zip = new JSZip(data);
});

// read a file and add it to a zip
fs.readFile("picture.png", function(err, data) {
  if (err) throw err;
  var zip = new JSZip();
  zip.file("picture.png", data);
});
```

#### Remote file

There are a lot of nodejs libraries doing http requests, from the built-in
[http](http://nodejs.org/docs/latest/api/http.html) to the
[npm packages](https://www.npmjs.org/browse/keyword/http). Here are two
examples, one with the default http API, the other with
[request](https://github.com/mikeal/request) (but you're free to use your
favorite library !). If possible, download the file as a Buffer (you will get
better performances). If it's not possible, you can fallback to a binary string
(the option is likely to be `encoding : "binary"`).

##### With http :

```js
"use strict";

var http = require("http");
var url = require("url");
var JSZip = require("jszip");

var req = http.get(url.parse("http://localhost/.../file.zip"), function (res) {
  if (res.statusCode !== 200) {
    console.log(res.statusCode);
    // handle error
    return;
  }
  var data = [], dataLen = 0;

  // don't set the encoding, it will break everything !
  // or, if you must, set it to null. In that case the chunk will be a string.

  res.on("data", function (chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  });

  res.on("end", function () {
    var buf = new Buffer(dataLen);
    for (var i=0,len=data.length,pos=0; i<len; i++) {
      data[i].copy(buf, pos);
      pos += data[i].length;
    }

    // here we go !
    var zip = new JSZip(buf);
    console.log(zip.file("content.txt").asText());
  });
});

req.on("error", function(err){
  // handle error
});
```

##### With request :

```js
"use strict";

var request = require('request');
var JSZip = require("jszip");

request({
  method : "GET",
  url : "http://localhost/.../file.zip",
  encoding: null // <- this one is important !
}, function (error, response, body) {
  if(error ||  response.statusCode !== 200) {
    // handle error
    return;
  }
  var zip = new JSZip(body);
  console.log(zip.file("content.txt").asText());
});
```
