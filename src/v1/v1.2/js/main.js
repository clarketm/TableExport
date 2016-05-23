$(function () {

    var breakHeight = parseFloat($('body').css('line-height').slice(0, -2));
    var footerHeight = 0;

    $('footer').each(function () {
        footerHeight += $(this).outerHeight();
    });

    $('.navbar-fixed-top').autoHidingNavbar({
        hideOffset: 400,
        animationDuration: 100
    });

    $('#side-nav').affix({
        offset: {
            top: $('main').offset().top,
            bottom: (breakHeight * 3) + footerHeight
        }
    });

    $('#side-nav').on('click', 'a', function (e) {
        var top = $($(this).attr('href')).offset().top;

        $('html, body').animate({scrollTop: top - 80}, 'slow');

        return false;
    });

    $('body').scrollspy({
        target: '.scrollspy',
        offset: 90
    });


    var client = $('.btn-clipboard');
    new ZeroClipboard(client);

    client.on("mouseenter mouseleave", function (e) {
        $(this).attr('data-original-title', "Copy to clipboard");
        $(this).tooltip('show');
    });

    client.on("click", function (e) {
        $(this).attr('data-original-title', "Copied!");
        $(this).tooltip('show');

    });

    ZeroClipboard.on("copy", function (e) {
        var target = e.target;
        var text = $(target).nextAll('pre').text();
//            alert(text);
        e.clipboardData.setData("text/plain", text);
    });

    var $tables = $('table').slice(1, 3);


    $tables.tableExport({
        formats: ["xls","csv","txt"],
    });


});