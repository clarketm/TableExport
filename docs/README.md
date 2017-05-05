# [TableExport](https://tableexport.v4.travismclarke.com) &nbsp; [![Build Status](https://travis-ci.org/clarketm/TableExport.svg?branch=master)](https://travis-ci.org/clarketm/TableExport)
The simple, easy-to-implement library to export HTML tables to xlsx, xls, csv, and txt files

[Examples](#examples) **--** [Demo](https://www.travismclarke.com/tableexport/) **--** [TableExport + RequireJS](https://github.com/clarketm/tableexport_requirejs_app) skeleton **--** [TableExport + Flask](https://github.com/clarketm/tableexport_flask_app) skeleton.

## Docs
* [Migrating from **3.x** to **4.x**?](MIGRATING.md)
* [`v3` docs](https://www.travismclarke.com/tableexport/) and [README](https://github.com/clarketm/TableExport/tree/3.x.x#getting-started): 
* [`v4` docs](https://tableexport.v4.travismclarke.com) and [README](#getting-started) (below): 

## Getting Started

### Install manually using `<script>` tags
To use this library, include the [FileSaver.js](https://github.com/clarketm/FileSaver.js/) library, and [TableExport](https://tableexport.v4.travismclarke.com) library before the closing `<body>` tag of your HTML document:

```html
<script src="FileSaver.js"></script>
 ...
<script src="tableexport.js"></script>
```

### Install with Bower

```shell
$ bower install tableexport.js
```

### Install with npm
```shell
$ npm install tableexport
```

### CDN
#### [CDNjs](https://cdnjs.com/libraries/TableExport)
|          | uncompressed | compressed |
| :------: | :----------: | :--------: |
|  __CSS__ |   [🔗](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/css/tableexport.css)     |  [🔗](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/css/tableexport.min.css)      |
|  __JS__  |   [🔗](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/js/tableexport.js)     |  [🔗](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/js/tableexport.min.js)      |
|  __Images__  | &mdash; |   [🔗<sup>xlsx</sup>](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/img/xlsx.svg)[🔗<sup>xls</sup>](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/img/xls.svg)[🔗<sup>csv</sup>](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/img/csv.svg)[🔗<sup>txt</sup>](https://cdnjs.cloudflare.com/ajax/libs/TableExport/4.0.0/img/txt.svg)  |


#### [unpkg](https://unpkg.com/#/)
|          | uncompressed | compressed |
| :------: | :----------: | :--------: |
|  __CSS__ |   [🔗](https://unpkg.com/tableexport/dist/css/tableexport.css)     |  [🔗](https://unpkg.com/tableexport/dist/css/tableexport.min.css)      |
|  __JS__  |   [🔗](https://unpkg.com/tableexport/dist/js/tableexport.js)     |  [🔗](https://unpkg.com/tableexport/dist/js/tableexport.min.js)      |
|  __Images__  | &mdash; |   [🔗<sup>xlsx</sup>](https://unpkg.com/tableexport/dist/img/xlsx.svg)[🔗<sup>xls</sup>](https://unpkg.com/tableexport/dist/img/xls.svg)[🔗<sup>csv</sup>](https://unpkg.com/tableexport/dist/img/csv.svg)[🔗<sup>txt</sup>](https://unpkg.com/tableexport/dist/img/txt.svg)  |


### Dependencies

#### Required:

* [FileSaver.js](https://github.com/clarketm/FileSaver.js/)

#### Optional:

* [jQuery](https://jquery.com) (1.2.1 or higher)
* [Bootstrap](http://getbootstrap.com/getting-started/#download) (3.1.0 or higher)

#### Add-Ons:
In order to provide **Office Open XML SpreadsheetML Format ( `.xlsx` )** support, you must include the following third-party library in your project before both [FileSaver.js](https://github.com/clarketm/FileSaver.js/) and [TableExport](https://tableexport.v4.travismclarke.com).

* [xlsx.core.js](https://github.com/SheetJS/js-xlsx) by _SheetJS_

> Including `xlsx.core.js` is **NOT** necessary if installing with [`Bower`](#install-with-bower) or [`npm`](#install-with-npm)

```html
<script src="xlsx.core.js"></script>
<script src="FileSaver.js"></script>
 ...
<script src="tableexport.js"></script>
```

#### Older Browsers:
To support legacy browsers ( **Chrome** < 20, **Firefox** < 13, **Opera** < 12.10, **IE** < 10, __Safari__ < 6 ) include the [Blob.js](https://github.com/clarketm/Blob.js/) polyfill before the [FileSaver.js](https://github.com/clarketm/FileSaver.js/) script.

* [Blob.js](https://github.com/clarketm/Blob.js) by _eligrey_ (forked by  _clarketm_)
 
 > Including `Blob.js` is **NOT** necessary if installing with [`Bower`](#install-with-bower) or [`npm`](#install-with-npm)

```html
<script src="Blob.js"></script>
<script src="FileSaver.js"></script>
 ...
<script src="tableexport.js"></script>
```

## Usage

### JavaScript

To use this library, simple call the [`TableExport`](https://tableexport.v4.travismclarke.com) constructor:

```js
new TableExport(document.getElementsByTagName("table"));

// OR simply

TableExport(document.getElementsByTagName("table"));

// OR using jQuery

$("table").tableExport();    
```

Additional properties can be passed-in to customize the look and feel of your tables, buttons, and exported data.

Notice that by default, TableExport will create export buttons for three different filetypes *`xls`, `csv`, `txt`*. You can choose which buttons to generate by setting the `formats` property to the filetype(s) of your choice.

```js
/* Defaults */
TableExport(document.getElementsByTagName("table"), {
    headers: true,                              // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
    footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
    formats: ['xls', 'csv', 'txt'],             // (String[]), filetype(s) for the export, (default: ['xls', 'csv', 'txt'])
    filename: 'id',                             // (id, String), filename for the downloaded file, (default: 'id')
    bootstrap: false,                           // (Boolean), style buttons using bootstrap, (default: true)
    exportButtons: true,                        // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
    position: 'bottom',                         // (top, bottom), position of the caption element relative to table, (default: 'bottom')
    ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
    ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
    trimWhitespace: true                        // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
});
```
> **Note:**  to use the `xlsx` filetype, you must include [js-xlsx](https://github.com/SheetJS/js-xlsx/blob/master/dist/xlsx.core.min.js); reference the [`Add-Ons`](#add-ons) section.

### Properties

* [`headers`](https://www.travismclarke.com/tableexport/examples/headers_footers.html)
* [`footers`](https://www.travismclarke.com/tableexport/examples/headers_footers.html)
* [`formats`](https://www.travismclarke.com/tableexport/examples/formats-xlsx-xls-csv-txt.html)
* [`filename`](https://www.travismclarke.com/tableexport/examples/filename.html)
* [`bootstrap`](https://www.travismclarke.com/tableexport/examples/bootstrap.html)
* [`exportButtons`](https://www.travismclarke.com/tableexport/examples/exportButtons.html)
* [`position`](https://www.travismclarke.com/tableexport/examples/position.html)
* [`ignoreRows`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
* [`ignoreCols`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
* [`trimWhitespace`](https://www.travismclarke.com/tableexport/examples/whitespace.html)

### Methods

TableExport supports additional methods (**getExportData**, **update**, **reset** and **remove**) to control the [`TableExport`](https://tableexport.v4.travismclarke.com) instance after creation.

```js
/* First, call the `TableExport` constructor and save the return instance to a variable */
var table = TableExport(document.getElementById("export-buttons-table"));
```

#### [`getExportData`](https://www.travismclarke.com/tableexport/examples/exportButtons.html)
```js
/* get export data */
var exportData = table.getExportData();     // useful for creating custom export buttons, i.e. when (exportButtons: false)

/*****************
 ** exportData ***
 *****************
{
    "export-buttons-table": {
        xls: {
            data: "...",
            fileExtension: ".xls",
            filename: "export-buttons-table",
            mimeType: "application/vnd.ms-excel"
        },
        ...
    }
};
*/
```

#### [`update`](https://www.travismclarke.com/tableexport/#methods)
```js
/* update */
table.update({
    filename: "newFile"     // pass in a new set of properties
});
```

#### [`reset`](https://www.travismclarke.com/tableexport/#methods)
```js
/* reset */
table.reset();             // useful for a dynamically altered table
```

#### [`remove`](https://www.travismclarke.com/tableexport/#methods)
```js
/* remove */
table.remove();            // removes caption and buttons
```

### Settings
Below are some of the popular configurable settings to customize the functionality of the library.

#### [`ignoreCSS`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
```js
/* class selector to exclude/remove cells (<td> or <th>) or rows (<tr>) from the exported file(s). */
TableExport.prototype.ignoreCSS = "tableexport-ignore";

// OR using jQuery

$.fn.tableExport.ignoreCSS = "tableexport-ignore" ;
```

#### [`emptyCSS`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
```js
/* class selector to replace cells (<td> or <th>) with an empty string (i.e. "blank cell") in the exported file(s). */
TableExport.prototype.emptyCSS = "tableexport-empty";

// OR using jQuery

$.fn.tableExport.emptyCSS = "tableexport-empty" ;
```

```js
/* default charset encoding (UTF-8) */
TableExport.prototype.charset = "charset=utf-8";

/* default `filename` property if "id" attribute is unset */
TableExport.prototype.defaultFilename = "myDownload";

/* default class to style buttons when not using Bootstrap or the built-in export buttons, i.e. when (`bootstrap: false` & `exportButtons: true`)  */
TableExport.prototype.defaultButton = "button-default";

/* Bootstrap classes used to style and position the export button, i.e. when (`bootstrap: true` & `exportButtons: true`) */
TableExport.prototype.bootstrapConfig = ["btn", "btn-default", "btn-toolbar"];

/* row delimeter used in all filetypes */
TableExport.prototype.rowDel = "\r\n";
```

```js
/* Format-specific configuration (default class, content, and separator) */

/* Excel Open XML spreadsheet (.xlsx) */
TableExport.prototype.xlsx = {
    defaultClass: "xlsx",
    buttonContent: "Export to xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileExtension: ".xlsx"
};

/* Excel Binary spreadsheet (.xls) */
TableExport.prototype.xls = {
    defaultClass: "xls",
    buttonContent: "Export to xls",
    separator: "\t",
    mimeType: "application/vnd.ms-excel",
    fileExtension: ".xls"
};

/* Comma Separated Values (.csv) */
TableExport.prototype.csv = {
    defaultClass: "csv",
    buttonContent: "Export to csv",
    separator: ",",
    mimeType: "application/csv",
    fileExtension: ".csv"
};

/* Plain Text (.txt) */
TableExport.prototype.txt = {
    defaultClass: "txt",
    buttonContent: "Export to txt",
    separator: "  ",
    mimeType: "text/plain",
    fileExtension: ".txt"
};
```

### CSS

[TableExport](https://tableexport.v4.travismclarke.com) packages with customized [Bootstrap](http://getbootstrap.com/getting-started/#download) CSS stylesheets to deliver enhanced table and button styling. These styles can be *enabled* by initializing with the `bootstrap` property set to `true`.

```js
TableExport(document.getElementsByTagName("table"), {
    bootstrap: true
});
```

When used alongside Bootstrap, there are four custom classes **`.xlsx`, `.xls`, `.csv`, `.txt`** providing button styling for each of the exportable filetypes.

### Browser Support

|  | Chrome | Firefox | IE  | Opera | Safari |
| :------: | :------: | :-------: | :---: | :-----: | :------: |
| __Android__ |    &#10003;   |    &#10003;    | - |   &#10003;   |  -   |
| __iOS__ |    &#10003;   |  -    | - |   -   |   &#10003;    |
| **Mac OSX**|    &#10003;   |    &#10003;    | - |   &#10003;  |   &#10003;    |
| **Windows** |    &#10003;   |    &#10003;    | &#10003; |   &#10003;   |   &#10003;    |

> A full list of [browser support](https://github.com/clarketm/FileSaver.js#supported-browsers) can be found in the [FileSaver.js](https://github.com/clarketm/FileSaver.js) README. Some [legacy browsers](https://github.com/clarketm/FileSaver.js#supported-browsers) may require an additional third-party dependency: [Blob.js](https://github.com/clarketm/Blob.js/)

### Examples

#### Customizing Properties
* [`headers`](https://www.travismclarke.com/tableexport/examples/headers_footers.html)
* [`footers`](https://www.travismclarke.com/tableexport/examples/headers_footers.html)
* [`formats`](https://www.travismclarke.com/tableexport/examples/formats-xlsx-xls-csv-txt.html)
* [`filename`](https://www.travismclarke.com/tableexport/examples/filename.html)
* [`bootstrap`](https://www.travismclarke.com/tableexport/examples/bootstrap.html)
* [`exportButtons`](https://www.travismclarke.com/tableexport/examples/exportButtons.html)
* [`position`](https://www.travismclarke.com/tableexport/examples/position.html)
* [`ignoreRows`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
* [`ignoreCols`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
* [`trimWhitespace`](https://www.travismclarke.com/tableexport/examples/whitespace.html)

#### Customizing Settings
* [`ignoreCSS`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)
* [`emptyCSS`](https://www.travismclarke.com/tableexport/examples/ignore-row-cols-cells.html)

#### Skeletons 
A live, interactive demo can be found on the **[TableExport](https://www.travismclarke.com/tableexport/#live-demo)** webpage. 
* [TableExport + RequireJS](https://github.com/clarketm/tableexport_requirejs_app) skeleton.
* [TableExport + Flask](https://github.com/clarketm/tableexport_flask_app) skeleton.

### License
[TableExport](https://tableexport.v4.travismclarke.com) is licensed under the terms of the [MIT](http://opensource.org/licenses/mit-license.php) License

### Going Forward
#### TODOs
- [ ] Update JSDocs and TypScript definition file.
- [ ] Allow `ignoreCSS` and `emptyCSS` to work with any `selector|selector[]` instead of solely a single CSS class.
- [ ] Fix bug with **CSV** and **TXT** `ignoreRows` and `ignoreCols` (rows/cols rendered as empty strings rather than being *removed*).
- [ ] Reimplement and test the `update`, `reset`, and `remove` **TableExport** prototype properties without requiring jQuery.
- [ ] Ensure (via testing) full consistency and backwards-compatibility for jQuery.
- [ ] Make jQuery as *peer dependency* and ensure proper **TableExport** rendering in broswser, AMD, and CommonJS environments.

### :star: Credits
Special thanks the the following contributors: 
* [SheetJS](https://github.com/SheetJS) - js-xlsx 
* [Eli Grey](https://github.com/eligrey) - FileSaver.js & Blob.js
