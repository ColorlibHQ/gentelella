---
title: "Limitations of JSZip"
layout: default
section: limitations
fullpage: true
---

### Not supported features

All the features of zip files are not supported. Classic zip files will work
but encrypted zip, multi-volume, etc are not supported and the load() method
will throw an `Error`.


### ZIP64 and 32bit integers

ZIP64 files can be loaded, but only if the zip file is not "too big". ZIP64 uses 64bits integers
but Javascript represents all numbers as
[64-bit double precision IEEE 754 floating point numbers](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
(see section 8.5). So, we have 53bits for integers and
[bitwise operations treat everything as 32bits](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators).
So if all the 64bits integers can fit into 32 bits integers, everything will be
fine. If it's not the case, you will have other problems anyway (see next
limitation).

### Performance issues

An other limitation comes from the browser (and the machine running the
browser). A compressed zip file of 10MB is "easily" opened by firefox / chrome
/ opera / IE10+ but will crash older IE. Also keep in mind that strings in
javascript are encoded in UTF-16 : a 10MB ascii text file will take 20MB of
memory.

If you're having performance issues, please consider the following :

* Don't use IE &lt;= 9. Everything is better with typed arrays.
* Use typed arrays (Uint8Array, ArrayBuffer, etc) if possible :
  * If you generate a zip file, you should use `type:"uint8array"`
    (or blob, arraybuffer, nodebuffer).
  * If you load the file from an ajax call, ask your XHR an ArrayBuffer.
    Loading a string is asking for troubles.
* Don't use compression (see below).
* If you want to get the content of an ASCII file as a string, consider using
  `asBinary()` instead of `asText()`. The transformation
  "binary string" -&gt; "unicode string" is a consuming process.

Note about compression :
When reading a file, JSZip will store the content without decompressing it.
When generating a compressed file, JSZip will reuse if possible compressed
content :

* If you read a zip file compressed with DEFLATE and call `generate` with the
  DEFLATE compression, JSZip won't call the compression algorithms (same with
  STORE everywhere.)
* If you read a zip file compressed with DEFLATE and call `generate` with the
  STORE compression, JSZip will have to decompress everything.

On IE &lt;=9, typed arrays are not supported and the compression algorithm
will fallback on arrays. In that case, JSZip needs to convert the binary string
into an array, DEFLATE it and convert the result into a binary string.
You don't want that to happen.

### The output zip will differ from the input zip

Reading and generating a zip file won't give you back the same file.
Some data are discarded (file metadata) and other are added (subfolders).

### Encodings support

JSZip only supports UTF-8 natively. A zip file doesn't contain the name of the
encoding used, you need to know it before doing anything.

#### File name

If the name of a file inside the zip is encoded with UTF-8 then JSZip can
detect it (Language encoding flag, Unicode Path Extra Field). If not, JSZip
can't detect the encoding used and will generate [Mojibake](https://en.wikipedia.org/wiki/Mojibake).
You can use the [encodeFileName]({{site.baseurl}}/documentation/api_jszip/generate.html)
option and the [decodeFileName]({{site.baseurl}}/documentation/api_jszip/load.html)
option to encode/decode using a custom encoding.

#### File content

The `asText()` method uses UTF-8 to decode the content. If you have a text in
a different encoding, you can get the bytes array with `asUint8Array()` and
decode it with a lib (iconv, iconv-lite, etc) on your side.
To save a text using a non-UTF-8 encoding, do the same : encode it into a
Uint8Array before adding it to JSZip.
