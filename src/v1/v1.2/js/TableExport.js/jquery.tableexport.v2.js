(function ($) {

    $.fn.tableExport = function (options) {

        var settings = $.extend({}, $.fn.tableExport.defaults, options),
            rowD = $.fn.tableExport.rowDel, bootstrapClass, bootstrapTheme, bootstrapSpacing;

        if (settings.bootstrap) {
            bootstrapClass = $.fn.tableExport.bootstrap[0] + " ";
            bootstrapTheme = $.fn.tableExport.bootstrap[1] + " ";
            bootstrapSpacing = $.fn.tableExport.bootstrap[2] + " ";
        } else {
            bootstrapClass = bootstrapTheme = bootstrapSpacing = "";
        }


        return this.each(function () {
            var $el = $(this),
                $rows = settings.headings ? $el.find('tr') : $el.find('tr:has(td)'),
                fileName = settings.fileName === "id" ? $el.attr('id') : settings.fileName,
                exporters = {
                    xls: function (rdel, name) {
                        var colD = $.fn.tableExport.xls.separator,
                            dataURL = 'data:application/vnd.ms-excel;charset=utf-8,' +
                                encodeURIComponent($rows.map(function (i, val) {
                                    var $cols = $(val).find('th, td');
                                    return $cols.map(function (i, val) {
                                        return $(val).html()
                                    }).get().join(colD);
                                }).get().join(rdel)),
                            myFile = name + ".xls",
                            myContent = $.fn.tableExport.xls.buttonContent,
                            myClass = $.fn.tableExport.xls.defaultClass;
                        createButton(dataURL, myFile, myContent, myClass);
                    },
                    csv: function (rdel, name) {
                        rdel = '"' + rdel + '"';
                        var colD = '"' + $.fn.tableExport.csv.separator + '"',
                            dataURL = 'data:text/csv;charset=utf-8,' +
                                encodeURIComponent('"' + $rows.map(function (i, val) {
                                        var $cols = $(val).find('th, td');
                                        return $cols.map(function (i, val) {
                                            return $(val).text().replace(/"/g, '""')
                                        }).get().join(colD);
                                    }).get().join(rdel) + '"'),
                            myFile = name + ".csv",
                            myContent = $.fn.tableExport.csv.buttonContent,
                            myClass = $.fn.tableExport.csv.defaultClass;
                        createButton(dataURL, myFile, myContent, myClass);
                    },
                    txt: function (rdel, name) {
                        var colD = $.fn.tableExport.txt.separator,
                            dataURL = 'data:text/plain;charset=utf-8,' +
                                encodeURIComponent($rows.map(function (i, val) {
                                    var $cols = $(val).find('th, td');
                                    return $cols.map(function (i, val) {
                                        return $(val).text()
                                    }).get().join(colD);
                                }).get().join(rdel)),
                            myFile = name + ".txt",
                            myContent = $.fn.tableExport.txt.buttonContent,
                            myClass = $.fn.tableExport.txt.defaultClass;
                        createButton(dataURL, myFile, myContent, myClass);
                    }
                };

            settings.formats.forEach(
                function (key) {
                    exporters[key](rowD, fileName);
                }
            );

            function checkCaption(exportButton) {
                var $caption = $el.find('caption:not(.head)');
                $caption.length ? $caption.append(exportButton) : $el.prepend('<caption class="' + bootstrapSpacing + settings.position + '">' + exportButton + '</caption>');
            }

            function createButton(dataURL, myFile, myContent, myClass) {
                var exportButton = "<a href='" + dataURL + "' download='" + myFile + "' role='button' class='" + bootstrapClass + bootstrapTheme + myClass + "'>" + myContent + "</a>";
                checkCaption(exportButton);
            }
        });
    };

    // Define the plugin default properties.
    $.fn.tableExport.defaults = {
        headings: true,                         // [Boolean], display table headings (th elements) in the first row, [default: true]
        formats: ["xls", "csv", "txt"],
        fileName: "id",                     // [id, name, String], filename for the downloaded file, [default: "export"]
        bootstrap: true,                           // [String], additional button classes to add, [default: ""]
        position: "bottom"                     // [top, bottom], position of the caption element relative to table, [default: "bottom"]
    };

    $.fn.tableExport.xls = {
        defaultClass: "xls",
        buttonContent: "Export to xls",
        separator: "\t"
    };

    $.fn.tableExport.csv = {
        defaultClass: "csv",
        buttonContent: "Export to csv",
        separator: ","
    };

    $.fn.tableExport.txt = {
        defaultClass: "txt",
        buttonContent: "Export to txt",
        separator: "  "
    };

    $.fn.tableExport.bootstrap = ["btn", "btn-default", "btn-toolbar"];

    $.fn.tableExport.rowDel = "\r\n";


}(jQuery));




