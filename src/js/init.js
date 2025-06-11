/**
 * Essential initialization for Gentelella template
 * This file contains the core functionality that should work even with missing vendor dependencies
 */

$(document).ready(function() {
    console.log('Gentelella initialization starting...');
    
    // Always initialize sidebar (this is the most important functionality)
    if (typeof init_sidebar === 'function') {
        init_sidebar();
        console.log('Sidebar initialized');
    }
    
    // Initialize basic functionality that doesn't require external dependencies
    
    // Panel toolbox (collapse/close panels)
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

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
    
    // Bootstrap tooltips
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
    }
    
    // Initialize components that have dependencies available
    
    // iCheck if available
    if ($.fn.iCheck && $("input.flat")[0]) {
        $('input.flat').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        console.log('iCheck initialized');
    }
    
    // Bootstrap progress bars if available
    if ($.fn.progressbar && $(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
        console.log('Progress bars initialized');
    }
    
    // Try to initialize other components if their dependencies are available
    var components = [
        'init_sparklines',
        'init_flot_chart', 
        'init_JQVmap',
        'init_chart_doughnut',
        'init_gauge',
        'init_skycons'
    ];
    
    components.forEach(function(componentName) {
        if (typeof window[componentName] === 'function') {
            try {
                window[componentName]();
                console.log(componentName + ' initialized');
            } catch(e) {
                console.warn(componentName + ' failed to initialize:', e.message);
            }
        }
    });
    
    console.log('Gentelella initialization completed');
}); 