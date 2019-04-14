# browser-xlsx

> Bringing js-xlsx to the browser.

## Legal Notice

This library is licensed under MIT but, as GitHub mentions, it's a fork of [clarketm](https://github.com/clarketm)/[TableExport](https://github.com/clarketm/TableExport/) as well, which is licensed under Apache 2.0.
I tried my best not to infringe the latter, since it's still not really clear to me what's permitted and what's not. I kept the original headers on the files and made a summary of changes at the start of each. I hope this is what the copyright notice intended.

## Installation

The module is available on `bower` because of internal reasons. `npm` package wil problably be available soon.

```
bower install browser-xlsx --save
```

## Usage

BEWARE: I accidentally broke the `csv` - and problably the `txt` exporter too - while trimming the source code. The Excel exporter still works though.

```js
// Create the object by passing an array of rows.
// Types are detected automatically.
var excel = new BrowserXLSX([
	[ 'Hello', 'How', 'Are', 'You' ],
	[ 'I', 'Am', 'Fine', 'Thanks' ]
]);

// The size, in bytes, of the download.
// The format is required: different file types have different sizes.
excel.getFileSize('xlsx');

// Prompt the user to download the file.
excel.export2file('myWorkbook', 'xlsx', 'myWorksheet');
```