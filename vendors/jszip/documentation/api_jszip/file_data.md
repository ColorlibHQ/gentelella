---
title: "file(name, data [,options])"
layout: default
section: api
---

__Description__ : Add (or update) a file to the zip file.

__Arguments__

name                | type    | description
--------------------|---------|------------
name                | string  | the name of the file. You can specify folders in the name : the folder separator is a forward slash ("/").
data                | String/ArrayBuffer/Uint8Array/Buffer | the content of the file.
options             | object  | the options.

Content of `options` :

name        | type    | default | description
------------|---------|---------|------------
base64      | boolean | `false` | set to `true` if the data is base64 encoded. For example image data from a `<canvas>` element. Plain text and HTML do not need this option.
binary      | boolean | `false` | set to `true` if the data should be treated as raw content, `false` if this is a text. If base64 is used, this defaults to `true`, if the data is not a string, this will be set to `true`.
date        | date    | the current date | the last modification date.
compression | string  | null    | If set, specifies compression method to use for this specific file. If not, the default file compression will be used, see [generate(options)]({{site.baseurl}}/documentation/api_jszip/generate.html).
compressionOptions | object | `null` | the options to use when compressing the file, see [generate(options)]({{site.baseurl}}/documentation/api_jszip/generate.html).
comment     | string  | null    | The comment for this file.
optimizedBinaryString | boolean | `false` | Set to true if (and only if) the input is a "binary string" and has already been prepared with a 0xFF mask.
createFolders | boolean | `false` | Set to true if folders in the file path should be automatically created, otherwise there will only be virtual folders that represent the path to the file.
unixPermissions | 16 bits number | null    | The UNIX permissions of the file, if any.
dosPermissions  | 6 bits number  | null    | The DOS permissions of the file, if any.
dir             | boolean        | false   | Set to true if this is a directory and content should be ignored.

You shouldn't update the data given to this method : it is kept as it so any
update will impact the stored data.

__For the permissions__ :

The field `unixPermissions` also accepts a string representing the octal value :
"644", "755", etc. On nodejs you can use the `mode` attribute of
[nodejs' fs.Stats](http://nodejs.org/api/fs.html#fs_class_fs_stats).

See also [the platform option of generate()]({{site.baseurl}}/documentation/api_jszip/generate.html).

__About `dir`__ :

If `dir` is true or if a permission says it's a folder, this entry be flagged
as a folder and the content will be ignored.

__Returns__ : The current JSZip object, for chaining.

__Throws__ : An exception if the data is not in a supported format.

<!--
__Complexity__ : **O(1)** for anything but binary strings.
For binary strings (`data` is a string and `binary` = true), if
`optimizedBinaryString` is not set, the 0xFF mask will be applied giving a
complexity in **O(n)** where n is the size of the added data.
-->

__Example__

```js
zip.file("Hello.txt", "Hello World\n");

// base64
zip.file("smile.gif", "R0lGODdhBQAFAIACAAAAAP/eACwAAAAABQAFAAACCIwPkWerClIBADs=", {base64: true});
// from an ajax call with xhr.responseType = 'arraybuffer'
zip.file("smile.gif", arraybufferFromXhr);
// or on nodejs
zip.file("smile.gif", fs.readFileSync("smile.gif"));

zip.file("Xmas.txt", "Ho ho ho !", {date : new Date("December 25, 2007 00:00:01")});
zip.file("folder/file.txt", "file in folder");

zip.file("animals.txt", "dog,platypus\n").file("people.txt", "james,sebastian\n");

// result : Hello.txt, smile.gif, Xmas.txt, animals.txt, people.txt,
// folder/, folder/file.txt
// In the above case, the "folder" folder will not have a 'D'irectory attribute or Method property. The
// folder only exists as part of the path to "file.txt".

zip.file("folder/file.txt", "file in folder", {createFolders: true});
// In this case, the "folder" folder WILL have a 'D'irectory attribute and a Method property of "store".
// It will exist whether or not "file.txt" is present.

zip.file("script.sh", "echo 'hello world'", {
  unixPermissions : "755"
});
// when generated with platform:UNIX, the script.sh file will be executable
```
