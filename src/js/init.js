(function($) {
  /**
   * This file contains all the component initialization logic.
   * It is loaded after all vendor and custom libraries, so it has access to everything.
   */
  $(window).on('load', function() {

    // NProgress (we start it on document ready, but stop it on window load)
    if (typeof NProgress != 'undefined') {
      NProgress.done();
    }

    // Panel Toolbox
    $('.collapse-link').on('click', function() {
      var $BOX_PANEL = $(this).closest('.x_panel');
      var $ICON = $(this).find('i');
      var $BOX_CONTENT = $BOX_PANEL.find('.x_content');

      if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function() {
          $BOX_PANEL.removeAttr('style');
        });
      } else {
        $BOX_CONTENT.slideToggle(200);
        $BOX_PANEL.css('height', 'auto');
      }
      $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function() {
      var $BOX_PANEL = $(this).closest('.x_panel');
      $BOX_PANEL.remove();
    });

    // Tooltip
    if ($.fn.tooltip) {
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
      });
    }

    // Popover
    if ($.fn.popover) {
      $('body').popover({
        selector: '[data-popover]',
        trigger: 'click hover',
        delay: {
          show: 50,
          hide: 400
        }
      });
    }

    // Switchery
    if (typeof Switchery !== 'undefined') {
      var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
      elems.forEach(function(html) {
        var switchery = new Switchery(html, {
          size: 'small'
        });
      });
    }

    // Bootstrap Progressbar
    if ($(".progress .progress-bar")[0]) {
      $('.progress .progress-bar').progressbar();
    }

    // Bootstrap Progressbar with data-transitiongoal (for Top Campaign Performance)
    if ($(".progress .progress-bar[data-transitiongoal]").length) {
      $(".progress .progress-bar[data-transitiongoal]").each(function() {
        var $this = $(this);
        var goal = $this.data('transitiongoal');
        $this.progressbar({
          transition_delay: 1000,
          refresh_speed: 50,
          display_text: 'none'
        });
      });
    }

    // Gauge Chart (for Quick Settings Profile Completion)
    // Temporarily disabled due to library loading issues
    // TODO: Fix gauge.js loading
    if ($('#chart_gauge_01').length && typeof Gauge !== 'undefined') {
      var gauge = new Gauge(document.getElementById("chart_gauge_01")).setOptions({
        colorStart: '#55BF3B',
        colorStop: '#55BF3B',
        strokeColor: '#E0E0E0',
        generateGradient: true,
        percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]]
      });
      gauge.maxValue = 100;
      gauge.animationSpeed = 32;
      gauge.set(75); // Set to 75%
      document.getElementById("gauge-text").innerHTML = "75";
    }

    // World Map (for Visitors Location)
    if ($('#world-map-gdp').length) {
      $('#world-map-gdp').vectorMap({
        map: 'world_en',
        backgroundColor: null,
        color: '#ffffff',
        hoverOpacity: 0.7,
        selectedColor: '#1de9b6',
        enableZoom: true,
        showTooltip: true,
        values: {
          'us': 33,
          'fr': 27,
          'de': 16,
          'es': 11,
          'gb': 10
        },
        scaleColors: ['#E2E2E2', '#1de9b6'],
        normalizeFunction: 'polynomial'
      });
    }

    // Chart.js initialization - Main Dashboard Chart
    console.log("Chart.js init script started");
    if (typeof Chart !== 'undefined') {
      console.log("Chart.js is loaded");
      
      // Main chart in dashboard (chart_plot_01 is a div, so we create canvas inside)
      if ($('#chart_plot_01').length) {
        console.log("#chart_plot_01 found, creating main chart");
        var chartDiv = document.getElementById("chart_plot_01");
        
        // Clear any existing content and create canvas
        chartDiv.innerHTML = '';
        var canvas = document.createElement('canvas');
        canvas.id = 'mainChart';
        canvas.width = chartDiv.offsetWidth || 800;
        canvas.height = 300;
        chartDiv.appendChild(canvas);
        
        var ctx = canvas.getContext('2d');
        var lineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "My First dataset",
              backgroundColor: "rgba(38, 185, 154, 0.31)",
              borderColor: "rgba(38, 185, 154, 0.7)",
              pointBorderColor: "rgba(38, 185, 154, 0.7)",
              pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointBorderWidth: 1,
              data: [31, 74, 6, 39, 20, 85, 7, 45, 38, 62, 29, 41],
              fill: true,
              tension: 0.4
            }, {
              label: "My Second dataset",
              backgroundColor: "rgba(3, 88, 106, 0.3)",
              borderColor: "rgba(3, 88, 106, 0.70)",
              pointBorderColor: "rgba(3, 88, 106, 0.70)",
              pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(151,187,205,1)",
              pointBorderWidth: 1,
              data: [82, 23, 66, 9, 99, 4, 2, 25, 67, 44, 55, 33],
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        console.log("#chart_plot_01 not found");
      }

      // Doughnut Chart (using class selector since DOM shows class="canvasDoughnut")
      if ($('.canvasDoughnut').length) {
        console.log(".canvasDoughnut found, re-rendering inside a clean container.");

        var originalCanvas = document.querySelector('.canvasDoughnut');
        var xContent = originalCanvas.closest('.x_content');
        var panel = originalCanvas.closest('.x_panel');

        // Make the widget taller to fit the chart and legend
        if (panel) {
          panel.style.height = 'auto';
          panel.style.minHeight = '320px';
        }

        if (xContent) {
          // 1. Clear the problematic table layout
          xContent.innerHTML = '';

          // 2. Create a new, simple container for the chart
          var chartContainer = document.createElement('div');
          chartContainer.style.height = '250px'; // Adjust container height
          chartContainer.style.position = 'relative';
          
          var newCanvas = document.createElement('canvas');
          chartContainer.appendChild(newCanvas);
          xContent.appendChild(chartContainer);
          
          // 3. Initialize the chart in the new clean container
          var ctx_doughnut = newCanvas.getContext('2d');
          var data = {
            labels: ["IOS", "Android", "Blackberry", "Symbian", "Others"],
            datasets: [{
              data: [30, 10, 20, 15, 30],
              backgroundColor: ["#3498DB", "#2ECC71", "#9B59B6", "#1ABC9C", "#E74C3C"],
              hoverBackgroundColor: ["#5DADE2", "#58D68D", "#BB8FCE", "#52C9B4", "#EC7063"]
            }]
          };

          new Chart(ctx_doughnut, {
            type: 'doughnut',
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    boxWidth: 12
                  }
                }
              }
            }
          });

        } else {
          console.error("Doughnut chart's .x_content container not found.");
        }
      } else {
        console.log(".canvasDoughnut not found");
      }

      // Chart.js pages - Line Chart
      if ($('#lineChart').length) {
        console.log("#lineChart found, creating line chart");
        var canvas = document.getElementById("lineChart");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
              label: "My First dataset",
              backgroundColor: "rgba(38, 185, 154, 0.31)",
              borderColor: "rgba(38, 185, 154, 0.7)",
              pointBorderColor: "rgba(38, 185, 154, 0.7)",
              pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointBorderWidth: 1,
              data: [31, 74, 6, 39, 20, 85, 7],
              tension: 0.4
            }, {
              label: "My Second dataset",
              backgroundColor: "rgba(3, 88, 106, 0.3)",
              borderColor: "rgba(3, 88, 106, 0.70)",
              pointBorderColor: "rgba(3, 88, 106, 0.70)",
              pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(151,187,205,1)",
              pointBorderWidth: 1,
              data: [82, 23, 66, 9, 99, 4, 2],
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

      // Chart.js pages - Bar Chart
      if ($('#mybarChart').length) {
        console.log("#mybarChart found, creating bar chart");
        var canvas = document.getElementById("mybarChart");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
              label: '# of Votes',
              data: [51, 30, 40, 28, 92, 50, 45],
              backgroundColor: [
                'rgba(38, 185, 154, 0.31)',
                'rgba(3, 88, 106, 0.3)',
                'rgba(38, 185, 154, 0.31)',
                'rgba(3, 88, 106, 0.3)',
                'rgba(38, 185, 154, 0.31)',
                'rgba(3, 88, 106, 0.3)',
                'rgba(38, 185, 154, 0.31)'
              ],
              borderColor: [
                'rgba(38, 185, 154, 0.7)',
                'rgba(3, 88, 106, 0.70)',
                'rgba(38, 185, 154, 0.7)',
                'rgba(3, 88, 106, 0.70)',
                'rgba(38, 185, 154, 0.7)',
                'rgba(3, 88, 106, 0.70)',
                'rgba(38, 185, 154, 0.7)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }

      // Chart.js pages - Radar Chart
      if ($('#canvasRadar').length) {
        console.log("#canvasRadar found, creating radar chart");
        var canvas = document.getElementById("canvasRadar");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [{
              label: "My First dataset",
              backgroundColor: "rgba(38, 185, 154, 0.2)",
              borderColor: "rgba(38, 185, 154, 0.85)",
              pointBackgroundColor: "rgba(38, 185, 154, 0.85)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(38, 185, 154, 0.85)",
              data: [65, 59, 90, 81, 56, 55, 40]
            }, {
              label: "My Second dataset",
              backgroundColor: "rgba(3, 88, 106, 0.2)",
              borderColor: "rgba(3, 88, 106, 0.85)",
              pointBackgroundColor: "rgba(3, 88, 106, 0.85)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgba(3, 88, 106, 0.85)",
              data: [28, 48, 40, 19, 96, 27, 100]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

      // Chart.js pages - Doughnut Chart (ID version)
      if ($('#canvasDoughnut').length) {
        console.log("#canvasDoughnut found, creating doughnut chart");
        var canvas = document.getElementById("canvasDoughnut");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["Dark Grey", "Purple", "Blue", "Grey", "Green"],
            datasets: [{
              data: [15, 20, 30, 10, 30],
              backgroundColor: [
                "#455C73",
                "#9B59B6",
                "#26B99A",
                "#3498DB",
                "#BDC3C7"
              ],
              hoverBackgroundColor: [
                "#34495E",
                "#B370CF",
                "#36CAAB",
                "#49A9EA",
                "#CFD4D8"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

      // Chart.js pages - Pie Chart
      if ($('#pieChart').length) {
        console.log("#pieChart found, creating pie chart");
        var canvas = document.getElementById("pieChart");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ["Dark Grey", "Purple", "Blue", "Grey", "Green"],
            datasets: [{
              data: [20, 50, 30, 25, 40],
              backgroundColor: [
                "#455C73",
                "#9B59B6",
                "#26B99A",
                "#3498DB",
                "#BDC3C7"
              ],
              hoverBackgroundColor: [
                "#34495E",
                "#B370CF",
                "#36CAAB",
                "#49A9EA",
                "#CFD4D8"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

      // Chart.js pages - Polar Area Chart
      if ($('#polarArea').length) {
        console.log("#polarArea found, creating polar area chart");
        var canvas = document.getElementById("polarArea");
        canvas.style.height = '400px'; // Set explicit height
        var ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: ["Dark Grey", "Purple", "Blue", "Grey", "Green"],
            datasets: [{
              data: [20, 50, 30, 25, 40],
              backgroundColor: [
                "#455C73",
                "#9B59B6",
                "#26B99A",
                "#3498DB",
                "#BDC3C7"
              ],
              hoverBackgroundColor: [
                "#34495E",
                "#B370CF",
                "#36CAAB",
                "#49A9EA",
                "#CFD4D8"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }

    } else {
      console.log("Chart.js is not loaded");
    }
  });

  // We still want NProgress to start early, so we'll keep this separate.
  $(document).ready(function() {
    if (typeof NProgress != 'undefined') {
      NProgress.start();
    }

    // ---------------------------------
    // Gauge (Quick Settings)
    // ---------------------------------
    if (typeof Gauge !== 'undefined' && document.getElementById('chart_gauge_01')) {
      var chartGaugeSettings = {
        lines: 12,
        angle: 0,
        lineWidth: 0.4,
        pointer: {
          length: 0.75,
          strokeWidth: 0.042,
          color: '#1D212A'
        },
        limitMax: false,
        colorStart: '#1ABC9C',
        colorStop: '#1ABC9C',
        strokeColor: '#F0F3F3',
        generateGradient: true
      };

      var gaugeElem = document.getElementById('chart_gauge_01');
      var gaugeChart = new Gauge(gaugeElem).setOptions(chartGaugeSettings);

      gaugeChart.maxValue = 6000;
      gaugeChart.animationSpeed = 32;
      gaugeChart.set(3200);
      var gaugeText = document.getElementById('gauge-text');
      if (gaugeText) {
        gaugeChart.setTextField(gaugeText);
      }
    }

    // ---------------------------------
    // Skycons (Daily Active Users)
    // ---------------------------------
    if (typeof Skycons !== 'undefined') {
      var skycons = new Skycons({ color: '#73879C' });
      var skyconTypes = [
        'clear-day', 'clear-night', 'partly-cloudy-day',
        'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind',
        'fog'
      ];
      skyconTypes.forEach(function (type) {
        skycons.add(type, Skycons[type.replace(/-([a-z])/g, function(_, c){ return c.toUpperCase(); })] || type);
      });
      skycons.play();
    }
  });

})(jQuery); 