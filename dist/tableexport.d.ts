// Type definitions for TableExport v5.0.3
// Project: https://tableexport.travismclarke.com
// Definitions by: Travis Clarke <https://github.com/clarketm>

/*!
 * TableExport.js v5.0.3 (https://www.travismclarke.com)
 *
 * Copyright (c) 2018 - Travis Clarke - https://www.travismclarke.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * TableExport main library constructor
 * @class TableExport
 * @constructor
 */
export declare class TableExport {

    constructor(selectors: Node | NodeList | JQuery, options?: Defaults);

    /**
     * Default library options.
     */
    defaults: Defaults;

    /**
     * TableExport configuration options (user-defined w/ default fallback)
     */
    settings: any;

    /**
     * selectors (e.g. tables) to apply the library to
     */
    selectors: Node[];

    /**
     * Current TableExport version number
     */
    version: string;

    /**
     * Character set (character encoding) of the HTML.
     */
    charset: string;

    /**
     * Filename fallback for exported files.
     */
    defaultFilename: string;

    /**
     * Class applied to each export button element.
     */
    defaultButton: string;

    /**
     * Bootstrap configuration classes ["base", "theme", "container"].
     */
    bootstrapConfig: string[];

    /**
     * Row delimeter
     */
    rowDel: string;

    /**
     * HTML entity mapping for special characters.
     */
    entityMap: Object;

    /**
     * Class selector to exclude/remove cells from the exported file(s).
     */
    ignoreCSS: string;

    /**
     * Class selector to replace cells with an empty string in the exported file(s).
     */
    emptyCSS: string;

    /**
     * XLSX (Open XML spreadsheet) file extension configuration
     */
    xlsx: XLSX;

    /**
     * XLS (Binary spreadsheet) file extension configuration
     */
    xls: XLS;

    /**
     * CSV (Comma Separated Values) file extension configuration
     */
    csv: CSV;

    /**
     * TXT (Plain Text) file extension configuration
     */
    txt: TXT;

    /**
     * Cell-types override and assertion configuration
     */
    types: Types;

    /**
     * Removes leading/trailing whitespace from cell string
     */
    formatValue: (isTrimWhitespace: boolean, string: string) => string;

    /**
     * Get cell data-type
     */
    getType: (string: string) => string;

    /**
     * Formats datetimes for compatibility with Excel
     */
    dateNum: (v: number, date1904: Date) => number;

    /**
     * Creates an Excel spreadsheet from a data string
     */
    createSheet: (data: string) => void;

    /**
     * Converts a string to an arraybuffer
     */
    string2ArrayBuffer: (s: string) => ArrayBuffer;

    /**
     * Exports and downloads the file
     */
    export2file: (data: string, mime: string, name: string, extension: String) => void;

    /**
     * Retrieve export data for each selector and its respective formats
     */
    getExportData: () => Object;

    /**
     * Updates the library instance with new/updated options
     */
    update: (options: Defaults) => TableExport;

    /**
     * Reset the library instance to its original state
     */
    reset: () => TableExport;

    /**
     * Remove the instance (i.e. caption containing the export buttons)
     */
    remove: () => void;
}

/**
 * Excel Workbook constructor
 * @constructor
 */
interface Workbook {
    SheetNames: any[];
    Sheets: Object;
}

/**
 * Default library options.
 */
interface Defaults {
    headers?: boolean;
    footers?: boolean;
    formats?: string[];
    filename?: string;
    bootstrap?: boolean;
    exportButtons?: boolean;
    position?: string;
    ignoreRows?: number[];
    ignoreCols?: number[];
    trimWhitespace?: boolean;
}

/**
 * XLSX (Open XML spreadsheet) file extension configuration
 */
interface XLSX {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * XLS (Binary spreadsheet) file extension configuration
 */
interface XLS {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * CSV (Comma Separated Values) file extension configuration
 */
interface CSV {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * TXT (Plain Text) file extension configuration
 */
interface TXT {
    defaultClass: string;
    buttonContent: string;
    mimeType: string;
    separator: string;
    fileExtension: string;
}

/**
 * Cell-types override and assertion configuration
 */
interface Types {
    string: Type;
    number: Type;
    boolean: Type;
    date: Type;
}

/**
 * Cell-type override and assertion configuration structure
 */
interface Type {
    defaultClass: string;
    assert: (v: any) => boolean;
}

declare global {

    interface JQuery {
        /**
         * TableExport main library constructor
         */
        tableExport(options?: Defaults): TableExport;
    }
    
}