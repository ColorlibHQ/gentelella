Here are the notes I made while working through the ZIP file specification.

For each file:

        local file header signature     4 bytes  (0x04034b50)
        version needed to extract       2 bytes
        general purpose bit flag        2 bytes
        compression method              2 bytes
        last mod file time              2 bytes
        last mod file date              2 bytes
        crc-32                          4 bytes
        compressed size                 4 bytes
        uncompressed size               4 bytes
        file name length                2 bytes
        extra field length              2 bytes

|sig |v |g |c |t |d |crc |csz |usz |n |x |
 PK.. ## 00 00 ?? ?? xxxx ???? ???? ?? 00
<file name><file data>

Central directory:

        central file header signature   4 bytes  (0x02014b50)
        version made by                 2 bytes
        version needed to extract       2 bytes  *
        general purpose bit flag        2 bytes  *
        compression method              2 bytes  *
        last mod file time              2 bytes  *
        last mod file date              2 bytes  *
        crc-32                          4 bytes  *
        compressed size                 4 bytes  *
        uncompressed size               4 bytes  *
        file name length                2 bytes  *
        extra field length              2 bytes  *
        file comment length             2 bytes
        disk number start               2 bytes
        internal file attributes        2 bytes
        external file attributes        4 bytes
        relative offset of local header 4 bytes

        file name (variable size)
        extra field (variable size)
        file comment (variable size)

|sig |vm|vx|g |c |d |t |crc |csz |usz |n |x |cm|dn|ia|xa  |roff|
 PK.. ## ## 00 00 ?? ?? xxxx ???? ???? ?? 00 00 00 00 xxxx ????

End of central directory:

        end of central dir signature    4 bytes  (0x06054b50)
        number of this disk             2 bytes
        number of the disk with the
        start of the central directory  2 bytes
        total number of entries in the
        central directory on this disk  2 bytes
        total number of entries in
        the central directory           2 bytes
        size of the central directory   4 bytes
        offset of start of central
        directory with respect to
        the starting disk number        4 bytes
        .ZIP file comment length        2 bytes
        .ZIP file comment       (variable size)

|sig |n1|n2|e |ne|size|off |cm|
 PK.. 00 00 ?? ?? ???? ???? 00
