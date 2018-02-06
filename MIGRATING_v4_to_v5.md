# Migrating from v4.x to v5.x

### Changelog

#### Major Features
1. Cell merge support, using `rowspan` and `colspan` html attributes on table. [**v5.0.0-rc.1**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.1), [**v5.0.0-rc.3**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.3), [**v5.0.0-rc.6**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.6), [**v5.0.0-rc.8**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.8), [**v5.0.0-rc.9**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.9)


#### Properties
1. `xlsx` has replaced `xls` as the default spreadsheet format. [**v5.0.0-rc.2**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.2)
```javascript
// (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
formats: ['xlsx', 'csv', 'txt'],
```
2. Two(2) new export formats have been added: `xlsm` and `xlsb`. [**v5.0.0-rc.4**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.4)
3. Both `csv` and `xls` formats now have a the `enforceStrictRFC4180` property set to `false`. [**v5.0.0-rc.4**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.4)


#### Methods
1. `getFileSize` utility method to quickly [calculate the filesize](https://github.com/clarketm/TableExport/blob/v5.0.0-rc.1/examples/exportButtons.html) of a file export. [**v5.0.0-rc.1**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.1)
2. `getBinaryData` renamed to a more semantically correct `getRawData`


#### Settings
1. [`ignoreCSS`](README.md#ignorecss) can now accept either a `selector` (e.g. `'.tableexport-ignore'`) or `selector[]` (e.g. `['.tableexport-ignore', '#ignore']`). [**v5.0.0-rc.7**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.7)
```javascript
/**
 * CSS selector or selector[] to exclude/remove cells from the exported file(s).
 * @type {selector|selector[]}
 * @memberof TableExport.prototype
 */
ignoreCSS: '.tableexport-ignore'
```
2. [`emptyCSS`](README.md#emptycss) can now accept either a `selector` (e.g. `'.tableexport-empty'`) or `selector[]` (e.g. `['.tableexport-empty', '#empty']`). [**v5.0.0-rc.7**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.7)
```javascript
/**
 * CSS selector or selector[] to replace cells with an empty string in the exported file(s).
 * @type {selector|selector[]}
 * @memberof TableExport.prototype
 */
emptyCSS: '.tableexport-empty'
```
3. `defaultCaptionClass` class is now configurable rather than statically set to the `.tableexport-caption` class. [**v5.0.0-rc.10**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.10)
```javascript
/**
 * Class applied to each table caption.
 * @memberof TableExport.prototype
 */
defaultCaptionClass: 'tableexport-caption'
```
4. `storageKey` attribute is now configurable rather than statically set to the `tableexport-id` attribute. [**v5.0.0-rc.10**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.10)
```javascript
/**
 * Attribute applied to each export button element used to reference a Storage key.
 * @memberof TableExport.prototype
 */
storageKey: 'tableexport-id'
```
5. `defaultNamespace` string is now configurable rather than statically set to the `te-` string. [**v5.0.0-rc.10**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.10)
```javascript
/**
 * Namespace (i.e. prefix) applied to each table UUID and Storage key.
 * @memberof TableExport.prototype
 */
defaultNamespace: 'tableexport-'
```
6. `types` renamed to `typeConfig`. [**v5.0.0-rc.1**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.1)
7. `xlsx`, `xls`, `csv`, and `txt` prototype properties moved to nested under the `formatConfig` namespace. [**v5.0.0-rc.1**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.1)


#### Miscellaneous
1. Improved error logging to the console, including more verbose error descriptions. [**v5.0.0-rc.4**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.4)
2. Serialized export data is now stored in Session Storage rather than Local Storage to prevent undesirable persistence. [**v5.0.0-rc.10**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.10)
3. Implement caching by maintaining unique reference to tables by `id`. The `tableKey` attribute is now used to uniquely identify table elements and hold either the table's `id` or a UUID generated from the `defaultNamespace` and a unique internal counter. [**v5.0.0-rc.10**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.10), [**v5.0.0-rc.11**](https://github.com/clarketm/TableExport/releases/tag/v5.0.0-rc.11)
