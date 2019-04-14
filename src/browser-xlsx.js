/*!
 * TableExport.js v5.2.0 (https://www.travismclarke.com)
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
 * @license Apache-2.0
 * @copyright Travis Clarke <travis.m.clarke@gmail.com> (https://www.travismclarke.com/)
 */

/**
 * @author fedeTibaldo <fedetibaldo@protonmail.com>
 * @summary Summary of changes
 * @description
 * Summary of changes:
 * - rename main object;
 * - remove anything related to DOM manipulation, including CSS classes and selectors;
 * - get rid of jQuery;
 * - embed constants in the respective configuration objects;
 * - accept file extensions in the form of `ext` instead of `.ext`;
 * - hence, change parameters list of `export2file`, `getRawData`, `getFileSize` and `getBookType`
 * 	 methods and refactor them accordingly;
 * - move some of the previously inner variables and functions into the prototype (e.g. `isEnchanced`)
 * 	 or actually remove any need for them (e.g. `_TYPES`, `_FORMATS`);
 * - add the `getFormatConfig` and the `getMimeType` methods; leverage them when appropriate;
 * - update jsDocs accordingly.
 * A more accurate list of changes may be found in the commit history.
 */

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(function(require) {
      return factory(require("blobjs"), require("file-saverjs"), require("xlsx"));
    });
  } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
    // CommonJS
    module.exports = factory(require("blobjs"), require("file-saverjs"), require("xlsx"));
  } else {
    // Browser globals
    root.BrowserXLSX = factory(root.Blob, root.saveAs, root.XLSX);
  }
})(this, function(Blob, saveAs, XLSX) {
  "use strict";
  /**
   * BrowserXLSX main library constructor
   * @param {Object[][]} data
   * @constructor
   */
  var BrowserXLSX = function(data) {
    this.data = data;
  };

  BrowserXLSX.prototype = {
    /**
     * Version.
     * @memberof BrowserXLSX.prototype
     */
    version: "0.0.1",
    /**
     * Character set (character encoding) of the HTML.
     * @memberof BrowserXLSX.prototype
     */
    charset: "charset=utf-8",
    /**
     * Format configuration
     * @memberof BrowserXLSX.prototype
     */
    formatConfig: {
      /**
       * XLSX (Open XML spreadsheet) file extension configuration
       * @memberof BrowserXLSX.prototype
       */
      xlsx: {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        bookType: "xlsx",
        format: "xlsx"
      },
      xlsm: {
        mimeType: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
        bookType: "xlsm",
        format: "xlsm"
      },
      xlsb: {
        mimeType: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
        bookType: "xlsb",
        format: "xlsb"
      },
      /**
       * XLS (Binary spreadsheet) file extension configuration
       * @memberof BrowserXLSX.prototype
       */
      xls: {
        separator: "\t",
        mimeType: "application/vnd.ms-excel",
        bookType: "biff2",
        format: "xls",
        enforceStrictRFC4180: false
      },
      /**
       * CSV (Comma Separated Values) file extension configuration
       * @memberof BrowserXLSX.prototype
       */
      csv: {
        separator: ",",
        mimeType: "text/csv",
        bookType: "csv",
        format: "csv",
        enforceStrictRFC4180: true
      },
      /**
       * TXT (Plain Text) file extension configuration
       * @memberof BrowserXLSX.prototype
       */
      txt: {
        separator: "  ",
        mimeType: "text/plain",
        bookType: "txt",
        format: "txt",
        enforceStrictRFC4180: true
      }
    },
    /**
     * Cell-types override and assertion configuration
     * @memberof BrowserXLSX.prototype
     */
    typeConfig: {
      string: {
        type: "s",
        assert: function(v) {
          return true;
        }
      },
      number: {
        type: "n",
        assert: function(v) {
          return !isNaN(v);
        }
      },
      boolean: {
        type: "b",
        assert: function(v) {
          return v.toLowerCase() === "true" || v.toLowerCase() === "false";
        }
      },
      date: {
        type: "d",
        assert: function(v) {
          return !/.*%/.test(v) && !isNaN(Date.parse(v));
        }
      }
    },
    /**
     * Formats datetimes for compatibility with Excel
     * @memberof BrowserXLSX.prototype
     * @param {number} v
     * @param {boolean} date1904
     * @returns {number} epoch time
     */
    dateNum: function(v, date1904) {
      if (date1904) v += 1462;
      var epoch = Date.parse(v);
      var result = (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
      return Math.floor(result);
    },
    /**
     * Creates an Excel spreadsheet from a data 3D array
     * @memberof BrowserXLSX.prototype
     * @param {Object[][]} data
     * @param {Object[]} merges
     * @returns {Object} the work sheet
     */
    createSheet: function(data, merges) {
      var ws = {};
      var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
      var types = this.typeConfig;
      for (var R = 0; R !== data.length; ++R) {
        for (var C = 0; C !== data[R].length; ++C) {
          if (range.s.r > R) range.s.r = R;
          if (range.s.c > C) range.s.c = C;
          if (range.e.r < R) range.e.r = R;
          if (range.e.c < C) range.e.c = C;
          var cell = {
            v: data[R][C]
          };
          if (!cell.v) continue;
          var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

          if (!cell.t) {
            if (types.number.assert(cell.v)) cell.t = types.number.type;
            else if (types.boolean.assert(cell.v)) cell.t = types.boolean.type;
            else if (types.date.assert(cell.v)) cell.t = types.date.type;
            else cell.t = types.string.type;
          }
          if (cell.t === types.date.type) {
            cell.t = types.number.type;
            cell.z = XLSX.SSF._table[14];
            cell.v = this.dateNum(cell.v);
          }
          ws[cell_ref] = cell;
        }
      }
      ws["!merges"] = merges;
      if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
      return ws;
    },
    /**
     * Excel Workbook constructor
     * @memberof BrowserXLSX.prototype
     * @constructor
     */
    Workbook: function() {
      this.Workbook = { Views: [] };
      this.SheetNames = [];
      this.Sheets = {};
    },
    /**
     * Converts a string to an arraybuffer
     * @param {string} s
     * @memberof BrowserXLSX.prototype
     * @returns {ArrayBuffer}
     */
    string2ArrayBuffer: function(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    },
    /**
     * Exports and downloads the file
     * @memberof BrowserXLSX.prototype
     * @param {string} name filename
     * @param {string} format file extension (with no leading dot)
     * @param {string} sheetname
     * @param {boolean} [RTL]
     * @param {Object[]} [merges]
     */
    export2file: function(name, format, sheetname, RTL, merges) {
      var mime = this.getMimeType(format),
        data = this.getRawData(this.data, format, sheetname, RTL, merges);

      if (_isMobile && (format === this.formatConfig.csv.format || format === this.formatConfig.txt.format)) {
        var dataURI = "data:" + mime + ";" + this.charset + "," + data;
        this.downloadDataURI(dataURI, name, format);
      } else {
        // TODO: error and fallback when `saveAs` not available
        saveAs(new Blob([data], { type: mime + ";" + this.charset }), name + "." + format, true);
      }
    },
    /**
     * Download the file on mobile devices
     * @memberof BrowserXLSX.prototype
     * @param {string} dataURI
     * @param {string} name filename
     * @param {string} format file extension (with no leading dot)
     */
    downloadDataURI: function(dataURI, name, format) {
      var encodedUri = encodeURI(dataURI);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", name + "." + format);
      document.body.appendChild(link);
      link.click();
    },
    /**
     * Get the configuration object of the file type with the given format
     * @param {string} format
     * @returns {Object}
     */
    getFormatConfig: function(format) {
      for (var key in this.formatConfig) {
        if (this.formatConfig[key].format == format) {
          return this.formatConfig[key];
        }
      }
    },
    /**
     * Does the passed format not strictly enforce RFC4180?
     * @param {string} format
     * @returns {boolean}
     */
    isEnhanced: function(format) {
      return XLSX && !this.getFormatConfig(format).enforceStrictRFC4180;
    },
    /**
     * Get the mime type of the format
     * @param {string} format
     * @returns {string}
     */
    getMimeType: function(format) {
      return this.getFormatConfig(format).mimeType || "";
    },
    /**
     * Get the book type of the format
     * @param {string} format
     * @returns {string}
     */
    getBookType: function(format) {
      return this.getFormatConfig(format).bookType || "";
    },
    /**
     * Get binary data
     * @param {Object[][]} data
     * @param {string} format
     * @param {string} sheetname
     * @param {boolean} [RTL]
     * @param {Object[]} [merges]
     * @returns {ArrayBuffer|Object[][]}
     */
    getRawData: function(data, format, sheetname, RTL, merges) {
      if (this.isEnhanced(format)) {
        var wb = new this.Workbook(),
          ws = this.createSheet(data, merges),
          bookType = this.getBookType(format);

        sheetname = sheetname || "";
        wb.SheetNames.push(sheetname);
        wb.Sheets[sheetname] = ws;
        wb.Workbook.Views[0] = { RTL: RTL };
        var wopts = {
            bookType: bookType,
            bookSST: false,
            type: "binary"
          },
          wbout = XLSX.write(wb, wopts);

        data = this.string2ArrayBuffer(wbout);
      }
      return data;
    },
    /**
     * Get the file size
     * @param {string} format
     * @returns {number} the byte length
     */
    getFileSize: function(format) {
      var binary = this.getRawData(this.data, format);
      return binary instanceof ArrayBuffer ? binary.byteLength : this.string2ArrayBuffer(binary).byteLength;
    }
  };

  var _isMobile = (function isMobile(ua) {
    return (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        ua
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        ua.substring(0, 4)
      )
    );
  })(navigator.userAgent || navigator.vendor || window.opera);

  BrowserXLSX.BrowserXLSX = BrowserXLSX;

  return BrowserXLSX;
});
