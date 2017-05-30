# Migrating from v3.x to v4.x

### Changelog

#### Properties
1. [`bootstrap`](README.md#properties) default changed from `true` to `false`.
1. [`fileName`](README.md#properties) renamed to `filename`.
1. [`ignoreCSS`](README.md#properties) moved to [*settings*](README.md#settings) (i.e. prototype).
1. [`emptyCSS`](README.md#properties) moved to [*settings*](README.md#settings) (i.e. prototype).
1. [`exportButtons`](README.md#properties) added and has a default value of `true`.

#### Methods
1. [`getExportData`](README.md#methods) added to allow direct access to the export data.

#### Settings
1. [`defaultFileName`](README.md#settings) renamed to `defaultFilename`.
1. [`ignoreCSS`](README.md#properties) added (moved from [*properties*](README.md#properties)).
1. [`emptyCSS`](README.md#properties) added (moved from [*properties*](README.md#properties)).