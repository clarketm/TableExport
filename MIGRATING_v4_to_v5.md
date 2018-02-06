# Migrating from v4.x to v5.x

### Changelog

**WIP (rough list):**
`ignoreCSS` can be a `string` or `string[]`
`emptyCSS` can be a `string` or `string[]`
`defaultCaptionClass` is configurable rather than always `.tableexport-caption` class
`storageKey` attribute is configurable rather than always `tableexport-id` attribute
default `formats` changed from `['xls', 'csv', 'txt']` to `['xlsx', 'csv', 'txt']`
new formats: `xlsm` and `xlsb`
new setting for `csv` and `xls` formats => `enforceStrictRFC4180`: false
additional and improved error messages
use sessionstorage rather than localstorage
configurable localstorage namespace prefix `defaultNamespace`
uuid creation for tables without an id
new configurable prototype properties:
```
/**
 * Class applied to each table caption.
 * @memberof TableExport.prototype
 */
defaultCaptionClass: 'tableexport-caption',
/**
 * Namespace (i.e. prefix) applied to each table UUID and Storage key.
 * @memberof TableExport.prototype
 */
defaultNamespace: 'tableexport-',
/**
 * Attribute applied to each table element used to generate each Storage key.
 * @memberof TableExport.prototype
 */
tableKey: 'tableexport-key',
/**
 * Attribute applied to each export button element used to reference a Storage key.
 * @memberof TableExport.prototype
 */
storageKey: 'tableexport-id',
```
cell merging support, using rowspan and colspan html attributes
new prototype method `getFileSize`
