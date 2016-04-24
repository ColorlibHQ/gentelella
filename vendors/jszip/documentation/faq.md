---
title: "Frequently Asked Questions"
layout: default
section: main
---

### "Corrupted zip or bug : unexpected signature"

If you are sure that the zip file is correct, that error often comes from a
corrupted content. An ajax request, if not prepared correctly, will try to
decode the binary content as a text and corrupt it. See
[this page]({{site.baseurl}}/documentation/howto/read_zip.html).

### My browser crashes / becomes unresponsive / never finish the execution

That happens if you try to handle to much data. If possible, try again with a
small (some KB) zip file to see if your code is correct. See
[this page]({{site.baseurl}}/documentation/limitations.html) for more
informations.
