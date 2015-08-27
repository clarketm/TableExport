(function ($) {

    $.fn.tableExport = function (options) {

        var settings = $.extend({}, $.fn.tableExport.defaults, options),
            colDelim = '"' + settings.separator + '"',      // user-defined separator (default is ",")
            rowDelim = '"\r\n"',                            // Windows new line character
            spacing = settings.spacing ? "btn-toolbar" : "",
            eventEl = "." + settings.defaultClass;

        return [this.each(function () {
            var $el = $(this),
                $rows = settings.headings ? $el.find('tr') : $el.find('tr:has(td)'),

                data = '"' + $rows.map(function (i, val) {
                        var $cols = $(val).find('th, td');
                        return $cols.map(function (i, val) {
                            return $(val).text().replace(/"/g, '""')
                        }).get().join(colDelim);
                    }).get().join(rowDelim) + '"',

                data2 = $rows.map(function (i, val) {
                    var $cols = $(val).find('th, td');
                    return $cols.map(function (i, val) {
                        return $(val).text()
                    });
                }).get(),

                dataType = "#",
                dataObject = "",
                fileName = settings.fileName,
                $caption = $el.find('caption:not(.head)');

            switch (fileName) {
                case "id":
                    fileName = $el.attr('id');
                    break;
                case "name":
                    fileName = $el.data('name');
                    break;
            }

            switch (settings.type) {
                case "xlsx":
                    dataObject = JSON.stringify({
                        data: data2,
                        name: fileName
                    });
                    break;
                case "csv":
                default:
                    dataType = 'data:text/csv;charset=utf-8,' + encodeURIComponent(data);
                    fileName += ".csv";
                    break;
                case "txt":
                    data = $.fn.tableExport.txtFormat(data, settings.stripQuotes);
                    dataType = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
                    fileName += ".txt";
                    break;
            }

            var exportButton = "<a href='" + dataType + "' data-obj='" + dataObject + "' download='" + fileName + "' role='button' class='" + settings.defaultClass + " "  + settings.defaultTheme + " " + settings.addClass + "'>" + settings.buttonContent + "</a>";

            $caption.length ? $caption.append(exportButton) : $el.prepend('<caption class="' + spacing + ' ' + settings.position + '">' + exportButton + '</caption>');

        }), $.fn.tableExport.addEvent(eventEl)];
    };

    // Define the plugin default properties.
    $.fn.tableExport.defaults = {
        separator: ",",                         // [String] column separator, [default: ","]
        headings: true,                         // [Boolean], display table headings (th elements) in the first row, [default: true]
        buttonContent: "Export",                // [String], text/html to display in the export button, [default: "Export file"]
        addClass: "",                           // [String], additional button classes to add, [default: ""]
        defaultClass: "btn",                    // [String], the default button class, [default: "btn"]
        defaultTheme: "btn-default",            // [String], the default button theme, [default: "btn-default"]
        type: "csv",                            // [xlsx, csv, txt], type of file, [default: "csv"]
        fileName: "export",                     // [id, name, String], filename for the downloaded file, [default: "export"]
        position: "bottom",                     // [top, bottom], position of the caption element relative to table, [default: "bottom"]
        spacing: true,                          // [Boolean], display spacing between buttons, [default: true]
        stripQuotes: true                       // [Boolean], remove containing double quotes (.txt files ONLY), [default: true]
    };

    // Define the format for .txt files.
    $.fn.tableExport.txtFormat = function (txt, strip) {
        if (strip) {
            return txt.replace(/"(?!")/g, '');
        }    // strips surrounding double quotes
        return txt.replace(/""/g, '"');
    };

    // Define the event listener for the export button.
    $.fn.tableExport.addEvent = function (el) {
        return [$(el).off('click'), $(el).on("click", function (e) {
            if ($(this).data("obj")) {
                e.preventDefault();
                var object = $(this).data("obj"),
                    data2 = object.data,
                    fileName = object.name;
                export2xlsx(data2, fileName);
            }
        })];
    }

}(jQuery));




