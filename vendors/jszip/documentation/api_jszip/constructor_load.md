---
title: "new JSZip(data [,options]) or JSZip(data [,options])"
layout: default
section: api
---

This is a shortcut for

```js
var zip = new JSZip();
zip.load(data, options);
```

Please see the documentation of [load]({{site.baseurl}}/documentation/api_jszip/load.html).

__Example__

```js
var zip = new JSZip(data, options);
// same as
var zip = JSZip(data, options);
```
