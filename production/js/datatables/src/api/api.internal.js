
/*
 * This is really a good bit rubbish this method of exposing the internal methods
 * publicly... - To be fixed in 2.0 using methods on the prototype
 */


/**
 * Create a wrapper function for exporting an internal functions to an external API.
 *  @param {string} sFunc API function name
 *  @returns {function} wrapped function
 *  @memberof DataTable#oApi
 */
function _fnExternApiFunc (sFunc)
{
	return function() {
		var aArgs = [_fnSettingsFromNode(this[DataTable.ext.iApiIndex])].concat( 
			Array.prototype.slice.call(arguments) );
		return DataTable.ext.oApi[sFunc].apply( this, aArgs );
	};
}


/**
 * Reference to internal functions for use by plug-in developers. Note that these
 * methods are references to internal functions and are considered to be private.
 * If you use these methods, be aware that they are liable to change between versions
 * (check the upgrade notes).
 *  @namespace
 */
this.oApi = {
	"_fnExternApiFunc": _fnExternApiFunc,
	"_fnInitialise": _fnInitialise,
	"_fnInitComplete": _fnInitComplete,
	"_fnLanguageCompat": _fnLanguageCompat,
	"_fnAddColumn": _fnAddColumn,
	"_fnColumnOptions": _fnColumnOptions,
	"_fnAddData": _fnAddData,
	"_fnCreateTr": _fnCreateTr,
	"_fnAddTr": _fnAddTr,
	"_fnBuildHead": _fnBuildHead,
	"_fnDrawHead": _fnDrawHead,
	"_fnDraw": _fnDraw,
	"_fnReDraw": _fnReDraw,
	"_fnAjaxUpdate": _fnAjaxUpdate,
	"_fnAjaxParameters": _fnAjaxParameters,
	"_fnAjaxUpdateDraw": _fnAjaxUpdateDraw,
	"_fnServerParams": _fnServerParams,
	"_fnAddOptionsHtml": _fnAddOptionsHtml,
	"_fnFeatureHtmlTable": _fnFeatureHtmlTable,
	"_fnScrollDraw": _fnScrollDraw,
	"_fnAdjustColumnSizing": _fnAdjustColumnSizing,
	"_fnFeatureHtmlFilter": _fnFeatureHtmlFilter,
	"_fnFilterComplete": _fnFilterComplete,
	"_fnFilterCustom": _fnFilterCustom,
	"_fnFilterColumn": _fnFilterColumn,
	"_fnFilter": _fnFilter,
	"_fnBuildSearchArray": _fnBuildSearchArray,
	"_fnBuildSearchRow": _fnBuildSearchRow,
	"_fnFilterCreateSearch": _fnFilterCreateSearch,
	"_fnDataToSearch": _fnDataToSearch,
	"_fnSort": _fnSort,
	"_fnSortAttachListener": _fnSortAttachListener,
	"_fnSortingClasses": _fnSortingClasses,
	"_fnFeatureHtmlPaginate": _fnFeatureHtmlPaginate,
	"_fnPageChange": _fnPageChange,
	"_fnFeatureHtmlInfo": _fnFeatureHtmlInfo,
	"_fnUpdateInfo": _fnUpdateInfo,
	"_fnFeatureHtmlLength": _fnFeatureHtmlLength,
	"_fnFeatureHtmlProcessing": _fnFeatureHtmlProcessing,
	"_fnProcessingDisplay": _fnProcessingDisplay,
	"_fnVisibleToColumnIndex": _fnVisibleToColumnIndex,
	"_fnColumnIndexToVisible": _fnColumnIndexToVisible,
	"_fnNodeToDataIndex": _fnNodeToDataIndex,
	"_fnVisbleColumns": _fnVisbleColumns,
	"_fnCalculateEnd": _fnCalculateEnd,
	"_fnConvertToWidth": _fnConvertToWidth,
	"_fnCalculateColumnWidths": _fnCalculateColumnWidths,
	"_fnScrollingWidthAdjust": _fnScrollingWidthAdjust,
	"_fnGetWidestNode": _fnGetWidestNode,
	"_fnGetMaxLenString": _fnGetMaxLenString,
	"_fnStringToCss": _fnStringToCss,
	"_fnDetectType": _fnDetectType,
	"_fnSettingsFromNode": _fnSettingsFromNode,
	"_fnGetDataMaster": _fnGetDataMaster,
	"_fnGetTrNodes": _fnGetTrNodes,
	"_fnGetTdNodes": _fnGetTdNodes,
	"_fnEscapeRegex": _fnEscapeRegex,
	"_fnDeleteIndex": _fnDeleteIndex,
	"_fnColumnOrdering": _fnColumnOrdering,
	"_fnLog": _fnLog,
	"_fnClearTable": _fnClearTable,
	"_fnSaveState": _fnSaveState,
	"_fnLoadState": _fnLoadState,
	"_fnDetectHeader": _fnDetectHeader,
	"_fnGetUniqueThs": _fnGetUniqueThs,
	"_fnScrollBarWidth": _fnScrollBarWidth,
	"_fnApplyToChildren": _fnApplyToChildren,
	"_fnMap": _fnMap,
	"_fnGetRowData": _fnGetRowData,
	"_fnGetCellData": _fnGetCellData,
	"_fnSetCellData": _fnSetCellData,
	"_fnGetObjectDataFn": _fnGetObjectDataFn,
	"_fnSetObjectDataFn": _fnSetObjectDataFn,
	"_fnApplyColumnDefs": _fnApplyColumnDefs,
	"_fnBindAction": _fnBindAction,
	"_fnExtend": _fnExtend,
	"_fnCallbackReg": _fnCallbackReg,
	"_fnCallbackFire": _fnCallbackFire,
	"_fnNodeToColumnIndex": _fnNodeToColumnIndex,
	"_fnInfoMacros": _fnInfoMacros,
	"_fnBrowserDetect": _fnBrowserDetect,
	"_fnGetColumns": _fnGetColumns,
	"_fnHungarianMap": _fnHungarianMap,
	"_fnCamelToHungarian": _fnCamelToHungarian
};

$.extend( DataTable.ext.oApi, this.oApi );

for ( var sFunc in DataTable.ext.oApi )
{
	if ( sFunc )
	{
		this[sFunc] = _fnExternApiFunc(sFunc);
	}
}

