---
title: "JSZip API"
layout: default
section: api
---

An instance of JSZip represents a set of files. You can add them, remove them,
modify them. You can also import an existing zip file or generate one.

### Attributes

attribute name       | type        | description
---------------------|-------------|-------------
`files`              | object      | the [ZipObject]({{site.baseurl}}/documentation/api_zipobject.html)s inside the zip with the name as key. See [file(name)]({{site.baseurl}}/documentation/api_jszip/file_name.html).
`comment`            | string      | the comment of the zip file.
