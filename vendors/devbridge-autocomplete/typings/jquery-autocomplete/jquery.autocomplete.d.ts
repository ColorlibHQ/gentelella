// Type definitions for jQuery-Autocomplete 1.2.25
// Project: https://www.devbridge.com/sourcery/components/jquery-autocomplete/
// Definitions by: John Gouigouix <https://github.com/orchestra-ts/DefinitelyTyped/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../jquery/jquery.d.ts"/>

interface AutocompleteSuggestion {

    value: string;
    data: any;

}

interface AutocompleteResponse {

    suggestions: AutocompleteSuggestion[];

}

interface JQueryAutocompleteOptions {

    //----------------o AJAX SETTINGS

    /**
     * Server side URL or callback function that returns serviceUrl string. Optional if local lookup data is provided.
     */
    serviceUrl?: string;

    /**
     * Ajax request type to get suggestions.
     * @default "GET"
     */
    type?: string;

    /**
     * type of data returned from server. Either text, json or jsonp, which will cause the autocomplete to use jsonp.
     * You may return a json object in your callback when using jsonp.
     * @default "text"
     */
    dataType?: "text" | "json" | "jsonp";

    /**
     * The name of the request parameter that contains the query.
     * @default "query"
     */
    paramName?: string;

    /**
     * Additional parameters to pass with the request, optional.
     */
    params?: Object;

    /**
     * Number of miliseconds to defer ajax request.
     * @default 0
     */
    deferRequestBy?: number;

    /**
     * Any additional Ajax Settings that configure the jQuery Ajax request.
     */
    ajaxSettings?: JQueryAjaxSettings;


    //----------------o CONFIG SETTINGS

    /**
     * Boolean value indicating whether to cache suggestion results.
     * @default false
     */
    noCache?: boolean;

    /**
     * That splits input value and takes last part to as query for suggestions.
     * Useful when for example you need to fill list of coma separated values.
     */
    delimiter?: string | RegExp;

    /**
     * Called before ajax request. this is bound to input element.
     * @param query
     */
    onSearchStart? (query: string): void;

    /**
     * Called after ajax response is processed. this is bound to input element.
     * Suggestions is an array containing the results.
     * @param query
     * @param suggestions
     */
    onSearchComplete? (query: string, suggestions: AutocompleteSuggestion[]): void;

    /**
     * Called if ajax request fails. this is bound to input element.
     * @param query
     * @param jqXHR
     * @param textStatus
     * @param errorThrown
     */
    onSearchError? (query: string, jqXHR: JQueryXHR, textStatus: string, errorThrown: any): void;

    /**
     * Called after the result of the query is ready. Converts the result into response.suggestions format.
     * @param response
     * @param originalQuery
     */
    transformResult? (response: any, originalQuery: string): AutocompleteResponse;

    /**
     * Callback function invoked when user selects suggestion from the list.
     * This inside callback refers to input HtmlElement.
     * @param suggestion
     */
    onSelect? (suggestion: AutocompleteSuggestion): void;

    /**
     * Minimum number of characters required to trigger autosuggest.
     * @default 1
     */
    minChars?: number;

    /**
     * Number of maximum results to display for local lookup.
     * @default no limit
     */
    lookupLimit?: number;

    /**
     * Callback function or lookup array for the suggestions. It may be array of strings or suggestion object literals.
     *   -> suggestion: An object literal with the following format: { value: 'string', data: any }.
     */
    lookup?: { (query: string, done: { (results: AutocompleteResponse): void }): void } | string[] | AutocompleteSuggestion[];

    /**
     * Filter function for local lookups. By default it does partial string match (case insensitive).
     * @param suggestion
     * @param query
     * @param queryLowercase
     */
    lookupFilter? (suggestion: AutocompleteSuggestion, query: string, queryLowercase: string): any;

    /**
     * Boolean value indicating if select should be triggered if it matches suggestion.
     * @default true
     */
    triggerSelectOnValidInput?: boolean;

    /**
     * Boolean value indicating if it shoud prevent future ajax requests for queries with the same root if no results were returned.
     * E.g. if Jam returns no suggestions, it will not fire for any future query that starts with Jam.
     * @default true
     */
    preventBadQueries?: boolean;

    /**
     * If set to true, first item will be selected when showing suggestions.
     * @default false
     */
    autoSelectFirst?: boolean;

    /**
     * Called before container will be hidden
     * @param container
     */
    onHide? (container: any): void;


    //----------------o PRESENTATION SETTINGS

    /**
     * Called before displaying the suggestions. You may manipulate suggestions DOM before it is displayed.
     * @param container
     */
    beforeRender? (container: any): void;

    /**
     * Custom function to format suggestion entry inside suggestions container, optional.
     * @param suggestion
     * @param currentValue
     */
    formatResult? (suggestion: AutocompleteSuggestion, currentValue: string): string;

    /**
     * Property name of the suggestion data object, by which results should be grouped.
     */
    groupBy?: string;

    /**
     * Maximum height of the suggestions container in pixels.
     * @default 300
     */
    maxHeight?: number;

    /**
     * Suggestions container width in pixels, e.g.: 300. takes input field width.
     * @default "auto"
     */
    width?: string | number;

    /**
     * 'z-index' for suggestions container.
     * @default 9999
     */
    zIndex?: number;

    /**
     * Container where suggestions will be appended. Can be jQuery object, selector or html element.
     * Make sure to set position: absolute or position: relative for that element.
     * @default document.body
     */
    appendTo?: any;

    /**
     * Suggestions are automatically positioned when their container is appended to body (look at appendTo option),
     * in other cases suggestions are rendered but no positioning is applied.
     * Set this option to force auto positioning in other cases.
     * @default false
     */
    forceFixPosition?: boolean;

    /**
     * Vertical orientation of the displayed suggestions, available values are auto, top, bottom.
     * If set to auto, the suggestions will be orientated it the way that place them closer to middle of the view port.
     * @default "bottom"
     */
    orientation?: "bottom" | "auto" | "top"

    /**
     * If true, input value stays the same when navigating over suggestions.
     * @default false
     */
    preserveInput?: boolean;

    /**
     * When no matching results, display a notification label.
     * @default false
     */
    showNoSuggestionNotice?: boolean;

    /**
     * Text or htmlString or Element or jQuery object for no matching results label.
     * @default "No results"
     */
    noSuggestionNotice?: string | Element | JQuery;

    /**
     * Called when input is altered after selection has been made. this is bound to input element.
     */
    onInvalidateSelection? (): void;

    /**
     * Set to true to leave the cursor in the input field after the user tabs to select a suggestion.
     * @default false
     */
    tabDisabled?: boolean;

}

interface AutocompleteInstance {

    /**
     * you may update any option at any time. Options are listed above.
     * @param options
     */
    setOptions(options: JQueryAutocompleteOptions): void;

    /**
     * clears suggestion cache and current suggestions suggestions.
     */
    clear(): void;

    /**
     * clears suggestion cache.
     */
    clearCache(): void;

    /**
     * deactivate autocomplete.
     */
    disable(): void;

    /**
     * activates autocomplete if it was deactivated before.
     */
    enable(): void;

    /**
     * hides suggestions.
     */
    hide(): void;

    /**
     * destroys autocomplete instance. All events are detached and suggestion containers removed.
     */
    dispose(): void;

}

interface JQuery {

    /**
     * Create Autocomplete component
     */
    autocomplete(options?: JQueryAutocompleteOptions): AutocompleteInstance;

    /**
     * Trigger non-specialized signature method
     * @param methodName
     * @param arg
     */
    autocomplete(methodName: string, ...arg: any[]): any;

    /**
     * You may update any option at any time. Options are listed above.
     * @param methodName The name of the method
     * @param options
     */
    autocomplete(methodName: "setOptions", options: JQueryAutocompleteOptions): AutocompleteInstance;

    /**
     * Clears suggestion cache and current suggestions suggestions.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "clear"): AutocompleteInstance;

    /**
     * Clears suggestion cache.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "clearCache"): AutocompleteInstance;

    /**
     * Deactivate autocomplete.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "disable"): AutocompleteInstance;

    /**
     * Activates autocomplete if it was deactivated before.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "enable"): AutocompleteInstance;

    /**
     * Hides suggestions.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "hide"): AutocompleteInstance;

    /**
     * Destroys autocomplete instance. All events are detached and suggestion containers removed.
     * @param methodName The name of the method
     */
    autocomplete(methodName: "dispose"): AutocompleteInstance;

    /**
     * Create Autocomplete component via plugin alias
     */
    devbridgeAutocomplete(options?: JQueryAutocompleteOptions): AutocompleteInstance;

    /**
     * Trigger non-specialized signature method
     * @param methodName
     * @param arg
     */
    devbridgeAutocomplete(methodName: string, ...arg: any[]): any;

    /**
     * You may update any option at any time. Options are listed above.
     * @param methodName The name of the method
     * @param options
     */
    devbridgeAutocomplete(methodName: "setOptions", options: JQueryAutocompleteOptions): AutocompleteInstance;

    /**
     * Clears suggestion cache and current suggestions suggestions.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "clear"): AutocompleteInstance;

    /**
     * Clears suggestion cache.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "clearCache"): AutocompleteInstance;

    /**
     * Deactivate autocomplete.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "disable"): AutocompleteInstance;

    /**
     * Activates autocomplete if it was deactivated before.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "enable"): AutocompleteInstance;

    /**
     * Hides suggestions.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "hide"): AutocompleteInstance;

    /**
     * Destroys autocomplete instance. All events are detached and suggestion containers removed.
     * @param methodName The name of the method
     */
    devbridgeAutocomplete(methodName: "dispose"): AutocompleteInstance;

}
