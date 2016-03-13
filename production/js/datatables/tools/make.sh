#!/bin/sh

OUT_DIR=$1
DEBUG=$2

# Change into script's own dir
cd $(dirname $0)

DT_SRC=$(dirname $(dirname $(pwd)))
DT_BUILT="${DT_SRC}/built/DataTables"
. $DT_SRC/build/include.sh

# Copy CSS
rsync -r css $OUT_DIR
css_compress $OUT_DIR/css/dataTables.tableTools.css

# Copy images
rsync -r images $OUT_DIR

# Combine JS files
if [ ! -d $OUT_DIR/js ]; then
	mkdir $OUT_DIR/js
fi
cp src/dataTables.tableTools.js js

sed -i -e "/\/\/include ZeroClipboard.js/r src/ZeroClipboard.js" js/dataTables.tableTools.js
sed -i -e "/\/\/include TableTools.js/r src/TableTools.js" js/dataTables.tableTools.js
rm js/dataTables.tableTools.js-e

# Copy JS input place
cp js/dataTables.tableTools.js $OUT_DIR/js/dataTables.tableTools.js
js_compress $OUT_DIR/js/dataTables.tableTools.js

# Copy and build examples
rsync -r examples $OUT_DIR
examples_process $OUT_DIR

# AS3 build and copy - we keep the swf binaries in git as well at the moment
if [ -e /usr/local/flex_sdk_4.12 -a "$DEBUG" = "" ]; then
	cd as3

	# Non PDF version
	/usr/local/flex_sdk_4.12/bin/mxmlc --target-player=10.0 -static-link-runtime-shared-libraries=true ZeroClipboard.as
	mv ZeroClipboard.swf ../swf/copy_csv_xls.swf
	mv ZeroClipboard.as ZeroClipboardNonePdf.as

	# PDF version
	mv ZeroClipboardPdf.as ZeroClipboard.as
	/usr/local/flex_sdk_4.12/bin/mxmlc --target-player=10.0 -static-link-runtime-shared-libraries=true -library-path+=lib ZeroClipboard.as
	mv ZeroClipboard.swf ../swf/copy_csv_xls_pdf.swf

	# Restore
	mv ZeroClipboard.as ZeroClipboardPdf.as
	mv ZeroClipboardNonePdf.as ZeroClipboard.as

	cd ..
fi

rsync -r swf $OUT_DIR

# Readme
cp Readme.md $OUT_DIR
