/**
 * This is the final, corrected implementation of the sidebar menu.
 */

function init_sidebar() {
    //
    // Helper function to set the content height
    //
    var setContentHeight = function () {
        var $BODY = $('body'),
            $RIGHT_COL = $('.right_col'),
            $SIDEBAR_FOOTER = $('.sidebar-footer'),
            $LEFT_COL = $('.left_col'),
            $NAV_MENU = $('.nav_menu'),
            $FOOTER = $('footer');

        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    var $SIDEBAR_MENU = $('#sidebar-menu'),
        $BODY = $('body'),
        CURRENT_URL = window.location.href.split('#')[0].split('?')[0];

    //
    // The definitive sidebar menu click handler
    //
    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        // If the clicked menu has no submenu, let the link work as normal
        if(!$li.children('ul').length) {
            return;
        }

        // For menus with submenus, prevent the browser from navigating away
        ev.preventDefault();

        // If the one we clicked is already active...
        if ($li.hasClass('active')) {
            // ...close it.
            $li.removeClass('active');
            $li.children('ul').slideUp(function() {
                setContentHeight();
            });
        } else {
            // It's not active.
            // First, find and close any other open menu.
            var $activeLi = $SIDEBAR_MENU.find('li.active');
            
            if ($activeLi.length) {
                // If an active menu exists, slide it up.
                // In its callback, slide down the new one.
                $activeLi.children('ul').slideUp(function() {
                    $activeLi.removeClass('active');
                    $li.addClass('active');
                    $li.children('ul').slideDown(function() {
                        setContentHeight();
                    });
                });
            } else {
                // If no other menu is active, just open the new one.
                $li.addClass('active');
                $li.children('ul').slideDown(function() {
                    setContentHeight();
                });
            }
        }
    });

    //
    // Menu toggle (hamburger menu)
    //
    var $MENU_TOGGLE = $('#menu_toggle');
    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $BODY.toggleClass('nav-md nav-sm');
        } else {
            $SIDEBAR_MENU.find('li.active ul').show();
            $BODY.toggleClass('nav-md nav-sm');
        }
        setContentHeight();
    });

    //
    // Set current page as active and open the menu
    //
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('active').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    //
    // Recalculate content height on window resize
    //
    $(window).smartresize(function() {
        setContentHeight();
    });

    // Set initial height
    setContentHeight();
}

// Initialize the sidebar when the document is ready
$(document).ready(function() {
    init_sidebar();
});

// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
$(document).ready(function () {
    if ($(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
    }
});
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).on('load', function () {
        NProgress.done();
    });
}
