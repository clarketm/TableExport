(function ($) {
    $.fn.table2CSV = function (options) {

        var settings = $.extend({}, $.fn.table2CSV.defaults, options),
            colDelim = '"' + settings.separator + '"',      // user-defined separator (default is ",")
            rowDelim = '"\r\n"';                            // Windows new line character

        return this.each(function () {
            var $el = $(this);

            var $rows = settings.headings ? $el.find('tr') : $el.find('tr:has(td)'),
                data = '"' + $rows.map(function (i, row) {
                        var $row = $(row),
                            $cols = $row.find('th, td');

                        return $cols.map(function (j, col) {
                            var $col = $(col),
                                text = $col.text();

                            return text.replace(/"/g, '""');

                        }).get().join(colDelim);

                    }).get().join(rowDelim) + '"',
                dataType,
                fileName,
                $caption = $el.find('caption');


            switch (settings.type) {
                case "csv":
                default:
                    dataType = 'data:text/csv;charset=utf-8,';
                    break;

                case "txt":
                    console.log(data);
                    data = $.fn.table2CSV.txtFormat(data, settings.stripQuotes);
                    dataType = 'data:text/plain;charset=utf-8,';
                    break;
            }
            dataType += encodeURIComponent(data);

            switch (settings.fileName) {
                case "id":
                    fileName = $el.attr('id');
                    break;

                case "name":
                    fileName = $el.attr('name');
                    break;

                default:
                    fileName = settings.fileName;
                    break;
            }
            var $exportButton = '<a href="'+dataType+'" download="'+fileName+'" class="export"><button>'+settings.buttonContent+'</button></a>';

            $caption.length ? $caption.append($exportButton) : $el.prepend('<caption>' + $exportButton + '</caption>');

        });
    };

    // Define the plugin default properties.
    $.fn.table2CSV.defaults = {
        separator: ",",                         // [String] column separator, [default: ","]
        headings: true,                         // [Boolean], display table headings (th elements) in the first row, [default: true]
        buttonContent: "Export file",           // [String], text/html to display in the export button, [default: "Export file"]
        type: "csv",                            // [csv, txt], type of file, [default: "csv"]
        fileName: "export",                     // [String], filename for the downloaded file, [default: "export"]
        stripQuotes: true                       // [Boolean], remove containing double quotes (.txt files ONLY), [default: true]
    };

    // Define the format for .txt files.
    $.fn.table2CSV.txtFormat = function (txt, strip) {
        if (strip) { return txt.replace(/"(?!")/g, '');}    // strips surrounding double quotes

        return txt.replace(/""/g, '"');
    };

}(jQuery));

