/**
 * TableExport main plugin constructor
 *
 * @class TableExport
 *
 * @param selectors {jQuery} jQuery selector(s)
 * @param options {Object} TableExport configuration options
 * @param isUpdate {Boolean}
 * @constructor
 */
export class TableExport {

    constructor(selectors: string|string[], options: Defaults, isUpdate: boolean);

    /**
     * Default plugin options.
     * @memberof TableExport.prototype
     */
    defaults: Defaults;

    /**
     * TableExport configuration options (user-defined w/ default fallback)
     */
    settings: any;

    /**
     * jQuery selectors (tables) to apply the plugin to
     */
    selectors: any;

    /**
     * Character set (character encoding) of the HTML.
     * @memberof TableExport.prototype
     */
    charset: string;

    /**
     * Filename fallback for exported files.
     * @memberof TableExport.prototype
     */
    defaultFileName: string;

    /**
     * Class applied to each export button element.
     * @memberof TableExport.prototype
     */
    defaultButton: string;

    /**
     * Bootstrap configuration classes ["base", "theme", "container"].
     * @memberof TableExport.prototype
     */
    bootstrap: string[];

    /**
     * Row delimeter
     * @memberof TableExport.prototype
     */
    rowDel: string;

    /**
     * HTML entity mapping for special characters.
     * @memberof TableExport.prototype
     */
    entityMap: Object;

    /**
     * XLSX (Open XML spreadsheet) file extension configuration
     * @memberof TableExport.prototype
     */
    xlsx: XLSX;

    /**
     * XLS (Binary spreadsheet) file extension configuration
     * @memberof TableExport.prototype
     */
    xls: XLS;

    /**
     * CSV (Comma Separated Values) file extension configuration
     * @memberof TableExport.prototype
     */
    csv: CSV;

    /**
     * TXT (Plain Text) file extension configuration
     * @memberof TableExport.prototype
     */
    txt: TXT;

    /**
     * Escapes special characters with HTML entities
     * @memberof TableExport.prototype
     * @param string {String}
     * @returns {String} escaped string
     */
    escapeHtml: (string: string) => string;

    /**
     * Formats datetimes for compatibility with Excel
     * @memberof TableExport.prototype
     * @param v {Number}
     * @param date1904 {Date}
     * @returns {Number} epoch time
     */
    dateNum: (v: number, date1904: Date) => number;

    /**
     * Creates an Excel spreadsheet from a data string
     * @memberof TableExport.prototype
     * @param data {String}
     * @returns {Number} epoch time
     */
    createSheet: (data: string) => number;

    /**
     * Converts a string to an arraybuffer
     * @memberof TableExport.prototype
     * @returns {ArrayBuffer}
     */
    string2ArrayBuffer: (s: string) => ArrayBuffer;

    /**
     * Exports and downloads the file
     * @memberof TableExport.prototype
     * @param data {String}
     * @param mime {String} mime type
     * @param name {String} filename
     * @param extension {String} file extension
     */
    export2file: (data: string, mime: string, name: string, extension: String) => void;

    /**
     * Updates the plugin instance with new/updated options
     * @param options {Object} TableExport configuration options
     * @returns {TableExport} updated TableExport instance
     */
    update: (options: any) => TableExport;

    /**
     * Reset the plugin instance to its original state
     * @returns {TableExport} original TableExport instance
     */
    reset: () => TableExport;

    /**
     * Remove the instance (i.e. caption containing the export buttons)
     */
    remove: () => void;
}

/**
 * Excel Workbook constructor
 * @memberof TableExport.prototype
 * @constructor
 */
export interface Workbook {
    SheetNames: any[];
    Sheets: Object;
}

/**
 * Default plugin options.
 * @memberof TableExport.prototype
 */
export interface Defaults {
    headings: boolean;
    footers: boolean;
    formats: string[];
    fileName: string;
    bootstrap: boolean;
    position: string;
    ignoreRows: number[];
    ignoreCols: number[];
    ignoreCSS: string;
    emptyCSS: string;
}

/**
 * XLSX (Open XML spreadsheet) file extension configuration
 * @memberof TableExport.prototype
 */
export interface XLSX {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * XLS (Binary spreadsheet) file extension configuration
 * @memberof TableExport.prototype
 */
export interface XLS {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * CSV (Comma Separated Values) file extension configuration
 * @memberof TableExport.prototype
 */
export interface CSV {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * TXT (Plain Text) file extension configuration
 * @memberof TableExport.prototype
 */
export interface TXT {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

interface JQuery {

    /**
     * TableExport main plugin constructor
     *
     * @param options {Object} TableExport configuration options
     * @param isUpdate {Boolean}
     */
    tableexport(options: Defaults, isUpdate: boolean): TableExport;
}