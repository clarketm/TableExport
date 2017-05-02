/*!
 * TableExport.js 4.0.0-alpha.5 (https://www.travismclarke.com)
 * Copyright 2017 Travis Clarke
 * Licensed under the MIT license
 */

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery', 'blobjs', 'file-saverjs', 'xlsx-js'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('jquery'), require('blobjs'), require('file-saverjs'), require('xlsx-js'));
    } else {
        // Browser globals
        factory(root, root.jQuery, root.Blob, root.saveAs, root.XLSX);
    }
}(this || window, function (exports, $, Blob, saveAs, XLSX) {
        'use strict';
        /**
         * TableExport main plugin constructor
         * @param selectors {jQuery} jQuery selector(s)
         * @param options {Object} TableExport configuration options
         * @param isUpdate {Boolean}
         * @constructor
         */
        var TableExport = function (selectors, options, isUpdate) {

            var self = this;
            /**
             * TableExport configuration options (user-defined w/ default fallback)
             */
            self.settings = isUpdate ? options : _extend({}, TableExport.prototype.defaults, options);
            /**
             * jQuery selectors (tables) to apply the plugin to
             */
            self.selectors = _nodesArray(selectors);

            var rowD = TableExport.prototype.rowDel,
                ignoreRows = self.settings.ignoreRows instanceof Array ? self.settings.ignoreRows : [self.settings.ignoreRows],
                ignoreCols = self.settings.ignoreCols instanceof Array ? self.settings.ignoreCols : [self.settings.ignoreCols],
                ignoreCSS = self.settings.ignoreCSS instanceof Array ? self.settings.ignoreCSS.join(", ") : self.settings.ignoreCSS,
                emptyCSS = self.settings.emptyCSS instanceof Array ? self.settings.emptyCSS.join(", ") : self.settings.emptyCSS,
                formatValue = TableExport.prototype.formatValue.bind(this, self.settings.trimWhitespace),
                getType = TableExport.prototype.getType,
                store = new TableExport.prototype.LocalStorage.getInstance(),
                bootstrapClass, bootstrapTheme, bootstrapSpacing;

            if (self.settings.bootstrap) {
                bootstrapClass = TableExport.prototype.bootstrap[0] + " ";
                bootstrapTheme = TableExport.prototype.bootstrap[1] + " ";
                bootstrapSpacing = TableExport.prototype.bootstrap[2] + " ";
            } else {
                bootstrapClass = TableExport.prototype.defaultButton + " ";
                bootstrapTheme = bootstrapSpacing = "";
            }

            self.selectors.forEach(function (el) {
                var caption = el.querySelectorAll('caption:not(.head)');
                isUpdate && caption.parentNode.removeChild(caption);

                var rows = _nodesArray(el.querySelectorAll('tbody > tr')),
                    rows = self.settings.headings ? _nodesArray(el.querySelectorAll("thead > tr")).concat(rows) : rows,
                    rows = self.settings.footers ? _nodesArray(el.querySelectorAll("tfoot > tr")).concat(rows) : rows,
                    thAdj = self.settings.headings ? el.querySelectorAll('thead > tr').length : 0,
                    filename = self.settings.filename === "id" ? (el.getAttribute('id') ? el.getAttribute('id') : TableExport.prototype.defaultFilename) : self.settings.filename,
                    exporters = {
                        xlsx: function (rDel, name) {
                            var rcMap = {},
                                dataURL = _nodesArray(rows).map(function (val, ir) {
                                    if (!!~ignoreRows.indexOf(ir - thAdj) || _hasClass(val, ignoreCSS)) {
                                        return;
                                    }
                                    var cols = val.querySelectorAll('th, td');
                                    return _nodesArray(cols).map(function (val, ic) {
                                        if (!!~ignoreCols.indexOf(ic) || _hasClass(val, ignoreCSS)) {
                                            return;
                                        }
                                        if (_hasClass(val, emptyCSS)) {
                                            return " "
                                        }
                                        if (val.hasAttribute('colspan')) {
                                            rcMap[ir] = rcMap[ir] || {};
                                            rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1
                                        }
                                        if (val.hasAttribute('rowspan')) {
                                            for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                                rcMap[ir + i] = rcMap[ir + i] || {};
                                                rcMap[ir + i][ic] = 1
                                            }
                                        }
                                        if (rcMap[ir]) {
                                            var threshold = ic + 1,
                                                total = 0,
                                                count = 0;

                                            for (var i = 0; i <= Math.max.apply(Math, Object.keys(rcMap[ir])); i++) {
                                                (!rcMap[ir][i]) ? count++ : total = count >= ic ? total + rcMap[ir][i] : total;
                                                if (count === threshold) {
                                                    break;
                                                }
                                            }
                                            return new Array(total).concat({
                                                v: formatValue(val.textContent),
                                                t: getType(val.className)
                                            });
                                        }
                                        return {
                                            v: formatValue(val.textContent),
                                            t: getType(val.className)
                                        };
                                    });
                                }).map(function (val, ir) {
                                    return [].concat.apply([], val);
                                }),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        filename: name,
                                        mimeType: TableExport.prototype.xlsx.mimeType,
                                        fileExtension: TableExport.prototype.xlsx.fileExtension
                                    })),
                                myContent = TableExport.prototype.xlsx.buttonContent,
                                myClass = TableExport.prototype.xlsx.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        xlsm: function (rDel, name) {
                            var rcMap = {},
                                dataURL = _nodesArray(rows).map(function (val, ir) {
                                    if (!!~ignoreRows.indexOf(ir - thAdj) || _hasClass(val, ignoreCSS)) {
                                        return;
                                    }
                                    var cols = val.querySelectorAll('th, td');
                                    return _nodesArray(cols).map(function (val, ic) {
                                        if (!!~ignoreCols.indexOf(ic) || _hasClass(val, ignoreCSS)) {
                                            return;
                                        }
                                        if (_hasClass(val, emptyCSS)) {
                                            return " "
                                        }
                                        if (val.hasAttribute('colspan')) {
                                            rcMap[ir] = rcMap[ir] || {};
                                            rcMap[ir][ic + 1] = val.getAttribute('colspan') - 1
                                        }
                                        if (val.hasAttribute('rowspan')) {
                                            for (var i = 1; i < val.getAttribute('rowspan'); i++) {
                                                rcMap[ir + i] = rcMap[ir + i] || {};
                                                rcMap[ir + i][ic] = 1
                                            }
                                        }
                                        if (rcMap[ir]) {
                                            var threshold = ic + 1,
                                                total = 0,
                                                count = 0;

                                            for (var i = 0; i <= Math.max.apply(Math, Object.keys(rcMap[ir])); i++) {
                                                (!rcMap[ir][i]) ? count++ : total = count >= ic ? total + rcMap[ir][i] : total;
                                                if (count === threshold) {
                                                    break;
                                                }
                                            }
                                            return new Array(total).concat({
                                                v: formatValue(val.textContent),
                                                t: getType(val.className)
                                            });
                                        }
                                        return {
                                            v: formatValue(val.textContent),
                                            t: getType(val.className)
                                        };
                                    });
                                }).map(function (val, ir) {
                                    return [].concat.apply([], val);
                                }),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        filename: name,
                                        mimeType: TableExport.prototype.xls.mimeType,
                                        fileExtension: TableExport.prototype.xls.fileExtension
                                    })),
                                myContent = TableExport.prototype.xls.buttonContent,
                                myClass = TableExport.prototype.xls.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        xls: function (rdel, name) {
                            var colD = TableExport.prototype.xls.separator,
                                dataURL = _nodesArray(rows).map(function (val, i) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || _hasClass(val, ignoreCSS)) {
                                        return;
                                    }
                                    var cols = val.querySelectorAll('th, td');
                                    return _nodesArray(cols).map(function (val, i) {
                                        if (!!~ignoreCols.indexOf(i) || _hasClass(val, ignoreCSS)) {
                                            return;
                                        }
                                        if (_hasClass(val, emptyCSS)) {
                                            return " "
                                        }
                                        return {
                                            v: formatValue(val.textContent),
                                            t: getType(val.className)
                                        };
                                    }).join(colD);
                                }).join(rdel).map(function (val, ir) {
                                    return [].concat.apply([], val);
                                }),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        filename: name,
                                        mimeType: TableExport.prototype.xls.mimeType,
                                        fileExtension: TableExport.prototype.xls.fileExtension
                                    })),
                                myContent = TableExport.prototype.xls.buttonContent,
                                myClass = TableExport.prototype.xls.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        csv: function (rdel, name) {
                            var colD = TableExport.prototype.csv.separator,
                                dataURL = _nodesArray(rows).map(function (val, i) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || _hasClass(val, ignoreCSS)) {
                                        return;
                                    }
                                    var cols = val.querySelectorAll('th, td');
                                    return _nodesArray(cols).map(function (val, i) {
                                        if (!!~ignoreCols.indexOf(i) || _hasClass(val, ignoreCSS)) {
                                            return;
                                        }
                                        if (_hasClass(val, emptyCSS)) {
                                            return " "
                                        }
                                        return '"' + formatValue(val.textContent.replace(/"/g, '""')) + '"';
                                    }).join(colD);
                                }).join(rdel),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        filename: name,
                                        mimeType: TableExport.prototype.csv.mimeType,
                                        fileExtension: TableExport.prototype.csv.fileExtension
                                    })),
                                myContent = TableExport.prototype.csv.buttonContent,
                                myClass = TableExport.prototype.csv.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        },
                        txt: function (rdel, name) {
                            var colD = TableExport.prototype.txt.separator,
                                dataURL = _nodesArray(rows).map(function (val, i) {
                                    if (!!~ignoreRows.indexOf(i - thAdj) || _hasClass(val, ignoreCSS)) {
                                        return;
                                    }
                                    var cols = val.querySelectorAll('th, td');
                                    return _nodesArray(cols).map(function (val, i) {
                                        if (!!~ignoreCols.indexOf(i) || _hasClass(val, ignoreCSS)) {
                                            return;
                                        }
                                        if (_hasClass(val, emptyCSS)) {
                                            return " "
                                        }
                                        return formatValue(val.textContent);
                                    }).join(colD);
                                }).join(rdel),
                                dataObject = TableExport.prototype.escapeHtml(
                                    JSON.stringify({
                                        data: dataURL,
                                        filename: name,
                                        mimeType: TableExport.prototype.txt.mimeType,
                                        fileExtension: TableExport.prototype.txt.fileExtension
                                    })),
                                myContent = TableExport.prototype.txt.buttonContent,
                                myClass = TableExport.prototype.txt.defaultClass;
                            createObjButton(dataObject, myContent, myClass);
                        }
                    };

                self.settings.formats.forEach(
                    function (key) {
                        XLSX && key === 'xls' ? key = 'xlsm' : false;
                        !XLSX && key === 'xlsx' ? key = null : false;
                        key && exporters[key](rowD, filename);
                    }
                );

                /**
                 * Initializes table caption with export buttons
                 * @param exportButton {HTMLButtonElement}
                 */
                function checkCaption(exportButton) {
                    var caption = el.querySelectorAll('caption:not(.head)');
                    if (caption.length) {
                        caption[0].appendChild(exportButton);
                    } else {
                        caption = document.createElement('caption');
                        caption.className = bootstrapSpacing + self.settings.position;
                        caption.appendChild(exportButton);
                        el.insertBefore(caption, el.firstChild);
                    }
                }

                /**
                 * Creates file export buttons
                 * @param dataObject {JSON}
                 * @param myContent {String}
                 * @param myClass {String}
                 */
                function createObjButton(dataObject, myContent, myClass) {
                    var exportButton = document.createElement('button');
                    var uuid = _uuid();
                    exportButton.setAttribute('data-fileblob', uuid);
                    store.setItem(uuid, dataObject, true);
                    exportButton.className = bootstrapClass + bootstrapTheme + myClass;
                    exportButton.textContent = myContent;
                    checkCaption(exportButton);
                }
            });

            var exportButton = document.querySelectorAll("button[data-fileblob]");
            _on(exportButton, "click", function () {
                var object = JSON.parse(store.getItem(this.getAttribute("data-fileblob"))),
                    data = object.data,
                    filename = object.filename,
                    mimeType = object.mimeType,
                    fileExtension = object.fileExtension;
                TableExport.prototype.export2file(data, mimeType, filename, fileExtension);
            });

            return self;
        };

        TableExport.prototype = {
            /**
             * Version.
             * @memberof TableExport.prototype
             */
            version: "4.0.0-alpha.5",
            /**
             * Default plugin options.
             * @memberof TableExport.prototype
             */
            defaults: {
                headings: true,                             // (Boolean), display table headings (th or td elements) in the <thead>, (default: true)
                footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
                formats: ["xls", "csv", "txt"],             // (String[]), filetype(s) for the export, (default: ["xls", "csv", "txt"])
                filename: "id",                             // (id, String), filename for the downloaded file, (default: "id")
                bootstrap: true,                            // (Boolean), style buttons using bootstrap, (default: true)
                position: "bottom",                         // (top, bottom), position of the caption element relative to table, (default: "bottom")
                ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
                ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
                ignoreCSS: ".tableexport-ignore",           // (selector, selector[]), selector(s) to exclude cells from the exported file(s) (default: ".tableexport-ignore")
                emptyCSS: ".tableexport-empty",             // (selector, selector[]), selector(s) to replace cells with an empty string in the exported file(s) (default: ".tableexport-empty")
                trimWhitespace: false                       // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
            },
            /**
             * Character set (character encoding) of the HTML.
             * @memberof TableExport.prototype
             */
            charset: "charset=utf-8",
            /**
             * Filename fallback for exported files.
             * @memberof TableExport.prototype
             */
            defaultFilename: "myDownload",
            /**
             * Class applied to each export button element.
             * @memberof TableExport.prototype
             */
            defaultButton: "button-default",
            /**
             * Bootstrap configuration classes ["base", "theme", "container"].
             * @memberof TableExport.prototype
             */
            bootstrap: ["btn", "btn-default", "btn-toolbar"],
            /**
             * Row delimeter
             * @memberof TableExport.prototype
             */
            rowDel: "\r\n",
            /**
             * HTML entity mapping for special characters.
             * @memberof TableExport.prototype
             */
            entityMap: {"&": "&#38;", "<": "&#60;", ">": "&#62;", "'": '&#39;', "/": '&#47;'},
            /**
             * XLSX (Open XML spreadsheet) file extension configuration
             * @memberof TableExport.prototype
             */
            xlsx: {
                defaultClass: "xlsx",
                buttonContent: "Export to xlsx",
                mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileExtension: ".xlsx"
            },
            /**
             * XLS (Binary spreadsheet) file extension configuration
             * @memberof TableExport.prototype
             */
            xls: {
                defaultClass: "xls",
                buttonContent: "Export to xls",
                separator: "\t",
                mimeType: "application/vnd.ms-excel",
                fileExtension: ".xls"
            },
            /**
             * CSV (Comma Separated Values) file extension configuration
             * @memberof TableExport.prototype
             */
            csv: {
                defaultClass: "csv",
                buttonContent: "Export to csv",
                separator: ",",
                mimeType: "text/csv",
                fileExtension: ".csv"
            },
            /**
             * TXT (Plain Text) file extension configuration
             * @memberof TableExport.prototype
             */
            txt: {
                defaultClass: "txt",
                buttonContent: "Export to txt",
                separator: "  ",
                mimeType: "text/plain",
                fileExtension: ".txt"
            },
            /**
             * Cell-types override and assertion configuration
             * @memberof TableExport.prototype
             */
            types: {
                string: {
                    defaultClass: "tableexport-string"
                },
                number: {
                    defaultClass: "tableexport-number",
                    assert: function (v) {
                        return !isNaN(v.replace(/,/g, ''));
                    }
                },
                boolean: {
                    defaultClass: "tableexport-boolean",
                    assert: function (v) {
                        return v.toLowerCase() === 'true' || v.toLowerCase() === 'false';
                    }
                },
                date: {
                    defaultClass: "tableexport-date",
                    assert: function (v) {
                        return !isNaN(Date.parse(v))
                    }
                }
            },
            /**
             * Escapes special characters with HTML entities
             * @memberof TableExport.prototype
             * @param string {String}
             * @returns {String} escaped string
             */
            escapeHtml: function (string) {
                return String(string).replace(/[&<>'\/]/g, function (s) {
                    return TableExport.prototype.entityMap[s];
                });
            },
            /**
             * Removes leading/trailing whitespace from cell string
             * @param isTrimWhitespace {Boolean}
             * @param string {String}
             * @returns {String} trimmed string
             */
            formatValue: function (isTrimWhitespace, string) {
                return isTrimWhitespace ? string.trim() : string;
            },
            /**
             * Get cell data-type
             * @param string {String}
             * @returns {String} data-type
             */
            getType: function (string) {
                if (!string) return '';
                var types = TableExport.prototype.types;
                if (~string.indexOf(types.string.defaultClass)) {
                    return 's';
                } else if (~string.indexOf(types.number.defaultClass)) {
                    return 'n';
                } else if (~string.indexOf(types.boolean.defaultClass)) {
                    return 'b';
                } else if (~string.indexOf(types.date.defaultClass)) {
                    return 'd';
                } else {
                    return '';
                }
            },
            /**
             * Formats datetimes for compatibility with Excel
             * @memberof TableExport.prototype
             * @param v {Number}
             * @param date1904 {Date}
             * @returns {Number} epoch time
             */
            dateNum: function (v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            },
            /**
             * Creates an Excel spreadsheet from a data string
             * @memberof TableExport.prototype
             * @param data {String}
             */
            createSheet: function (data) {
                var ws = {};
                var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
                var types = TableExport.prototype.types;
                for (var R = 0; R !== data.length; ++R) {
                    for (var C = 0; C !== data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = data[R][C];
                        if (!cell || !cell.v) continue;
                        var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

                        if (!cell.t) {
                            if (types.number.assert(cell.v)) cell.t = 'n';
                            else if (types.boolean.assert(cell.v)) cell.t = 'b';
                            else if (types.date.assert(cell.v)) cell.t = 'd';
                            else cell.t = 's';
                        }

                        if (cell.t === 'd') {
                            cell.t = 'n';
                            cell.z = XLSX.SSF._table[14];
                            cell.v = this.dateNum(cell.v);
                        }

                        ws[cell_ref] = cell;
                    }
                }
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            },
            /**
             * Excel Workbook constructor
             * @memberof TableExport.prototype
             * @constructor
             */
            Workbook: function () {
                this.SheetNames = [];
                this.Sheets = {};
            },
            /**
             * Converts a string to an arraybuffer
             * @param s {String}
             * @memberof TableExport.prototype
             * @returns {ArrayBuffer}
             */
            string2ArrayBuffer: function (s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            },
            /**
             * Exports and downloads the file
             * @memberof TableExport.prototype
             * @param data {String}
             * @param mime {String} mime type
             * @param name {String} filename
             * @param extension {String} file extension
             */
            export2file: function (data, mime, name, extension) {
                if (XLSX && extension.substr(0, 4) === (".xls")) {
                    var wb = new this.Workbook(),
                        ws = this.createSheet(data);

                    wb.SheetNames.push(name);
                    wb.Sheets[name] = ws;
                    var wopts = {
                            bookType: extension.substr(1, 3) + (extension.substr(4) || 'm'),
                            bookSST: false,
                            type: 'binary'
                        },
                        wbout = XLSX.write(wb, wopts);

                    data = this.string2ArrayBuffer(wbout);
                }
                saveAs(new Blob([data],
                    {type: mime + ";" + this.charset}),
                    name + extension, true);
            },
            /**
             * LocalStorage main interface constructor
             * @memberof TableExport.prototype
             * @constructor
             */
            LocalStorage: function () {
                this.type = 'localStorage';
                this.store = exports[this.type];
                this.namespace = 'te';
                this.getKey = function (key) {
                    return this.namespace + key;
                };
                this.setItem = function (_key, value, overwrite) {
                    var key = this.getKey(_key);
                    if (this.exists(key) && !overwrite) {
                        return;
                    }
                    return this.store.setItem(key, value);
                };
                this.getItem = function (_key) {
                    var key = this.getKey(_key);
                    return this.store.getItem(key);
                };
                this.exists = function (_key) {
                    var key = this.getKey(_key);
                    return this.store.getItem(key) !== null;
                };
                this.removeItem = function (_key) {
                    var key = this.getKey(_key);
                    return this.store.removeItem(key);
                };
                this.error = function (message) {
                    return new Error('unknown error occurred', message);
                };
            }
        };

        var _store = TableExport.prototype.LocalStorage;
        _store._instance = null;
        _store.getInstance = function () {
            if (!_store._instance) {
                _store._instance = new _store();
            }
            return _store._instance;
        };

        function _uuid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function _extend() {
            var args = arguments;
            for (var i = 1; i < args.length; i++)
                for (var key in args[i])
                    if (args[i].hasOwnProperty(key))
                        args[0][key] = args[i][key];
            return args[0];
        }

        function _nodesArray(els) {
            return [].slice.call(els)
        }

        function _on(el, event, fn) {
            for (var i = 0; i < el.length; ++i) {
                el[i].addEventListener(event, fn, false);
            }
        }

        function _hasClass(el, cls) {
            return el.classList ? el.classList.contains(cls) : new RegExp('(^| )' + cls + '( |$)', 'gi').test(el.cls);
        }

        if ($) {
            /**
             * jQuery TableExport wrapper
             * @param options {Object} TableExport configuration options
             * @param isUpdate {Boolean}
             * @returns {TableExport} TableExport instance
             */
            $.fn.tableExport = function (options, isUpdate) {
                return new TableExport(this, options, isUpdate);
            };

            // alias the TableExport prototype
            for (var prop in TableExport.prototype) {
                $.fn.tableExport[prop] = TableExport.prototype[prop];
            }
        }

        return exports.default = exports.TableExport = TableExport;

    }
));
