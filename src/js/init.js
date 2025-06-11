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
      $(".progress .progress-bar[data-transitiongoal]").progressbar({
        transition_delay: 1000,
        refresh_speed: 50,
        display_text: 'fill',
        use_percentage: true,
        percent_format: function(percent) { return percent + '%'; },
        amount_format: function(amount_part, amount_max) { return amount_part + ' / ' + amount_max; }
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
        selectedColor: '#666666',
        enableZoom: true,
        showTooltip: true,
        values: {
          'AF': 16.63,
          'AL': 11.58,
          'DZ': 158.97,
          'AO': 85.81,
          'AG': 1.1,
          'AR': 351.02,
          'AM': 8.83,
          'AU': 1219.72,
          'AT': 366.26,
          'AZ': 52.17,
          'BS': 7.54,
          'BH': 21.73,
          'BD': 105.4,
          'BB': 3.96,
          'BY': 52.89,
          'BE': 461.33,
          'BZ': 1.43,
          'BJ': 6.49,
          'BT': 1.4,
          'BO': 19.18,
          'BA': 16.2,
          'BW': 12.5,
          'BR': 2023.53,
          'BN': 11.96,
          'BG': 44.84,
          'BF': 8.67,
          'BI': 1.47,
          'KH': 11.36,
          'CM': 21.88,
          'CA': 1563.66,
          'CV': 1.57,
          'CF': 2.11,
          'TD': 7.59,
          'CL': 199.18,
          'CN': 5745.13,
          'CO': 283.11,
          'KM': 0.56,
          'CD': 12.6,
          'CG': 11.88,
          'CR': 35.02,
          'CI': 22.38,
          'HR': 59.92,
          'CY': 22.75,
          'CZ': 195.05,
          'DK': 304.56,
          'DJ': 1.14,
          'DM': 0.40,
          'DO': 50.87,
          'EC': 61.49,
          'EG': 216.83,
          'SV': 21.80,
          'GQ': 14.55,
          'ER': 2.25,
          'EE': 19.22,
          'ET': 30.94,
          'FJ': 3.15,
          'FI': 231.98,
          'FR': 2555.44,
          'GA': 12.56,
          'GM': 1.04,
          'GE': 11.23,
          'DE': 3305.90,
          'GH': 18.06,
          'GR': 305.01,
          'GD': 0.65,
          'GT': 40.77,
          'GN': 4.34,
          'GW': 0.83,
          'GY': 2.26,
          'HT': 6.5,
          'HN': 15.34,
          'HK': 226.49,
          'HU': 132.28,
          'IS': 12.77,
          'IN': 1430.02,
          'ID': 695.06,
          'IR': 337.90,
          'IQ': 84.14,
          'IE': 204.14,
          'IL': 201.25,
          'IT': 2036.69,
          'JM': 13.74,
          'JP': 5390.90,
          'JO': 27.13,
          'KZ': 129.76,
          'KE': 32.42,
          'KI': 0.15,
          'KR': 986.26,
          'KW': 117.32,
          'KG': 4.44,
          'LA': 6.34,
          'LV': 23.39,
          'LB': 39.15,
          'LS': 1.8,
          'LR': 0.98,
          'LY': 77.91,
          'LT': 35.73,
          'LU': 52.43,
          'MK': 9.58,
          'MG': 8.33,
          'MW': 5.04,
          'MY': 218.95,
          'MV': 1.43,
          'ML': 9.08,
          'MT': 7.8,
          'MR': 3.49,
          'MU': 9.43,
          'MX': 1004.04,
          'MD': 5.36,
          'MN': 5.81,
          'ME': 3.88,
          'MA': 91.7,
          'MZ': 10.21,
          'MM': 35.65,
          'NA': 11.45,
          'NP': 15.11,
          'NL': 770.31,
          'NZ': 138,
          'NI': 6.38,
          'NE': 5.6,
          'NG': 206.66,
          'NO': 413.51,
          'OM': 53.78,
          'PK': 174.79,
          'PA': 27.2,
          'PG': 8.81,
          'PY': 17.17,
          'PE': 153.55,
          'PH': 189.06,
          'PL': 438.88,
          'PT': 223.7,
          'QA': 126.52,
          'RO': 158.39,
          'RU': 1476.91,
          'RW': 5.69,
          'WS': 0.55,
          'ST': 0.19,
          'SA': 434.44,
          'SN': 12.66,
          'RS': 38.92,
          'SC': 0.92,
          'SL': 1.9,
          'SG': 217.38,
          'SK': 86.26,
          'SI': 46.44,
          'SB': 0.67,
          'ZA': 354.41,
          'ES': 1374.78,
          'LK': 48.24,
          'KN': 0.56,
          'LC': 1,
          'VC': 0.58,
          'SD': 65.93,
          'SR': 3.3,
          'SZ': 3.17,
          'SE': 444.59,
          'CH': 522.44,
          'SY': 59.63,
          'TW': 426.98,
          'TJ': 5.58,
          'TZ': 22.43,
          'TH': 312.61,
          'TL': 0.62,
          'TG': 3.07,
          'TO': 0.30,
          'TT': 21.2,
          'TN': 43.86,
          'TR': 729.05,
          'TM': 0,
          'UG': 17.12,
          'UA': 136.56,
          'AE': 239.65,
          'GB': 2258.57,
          'US': 14624.18,
          'UY': 40.71,
          'UZ': 37.72,
          'VU': 0.72,
          'VE': 285.21,
          'VN': 101.99,
          'YE': 30.02,
          'ZM': 15.69,
          'ZW': 5.57
        },
        scaleColors: ['#E2E2E2', '#c9dfaf', '#a4d65e', '#81d25c', '#6bcf7f', '#51b364', '#31954c', '#046149'],
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
    console.log("✅ Init.js loaded, DOM ready");

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

    // Top Campaign Performance Progress Bars with data-transitiongoal
    if ($(".progress .progress-bar[data-transitiongoal]").length) {
      $(".progress .progress-bar[data-transitiongoal]").progressbar({
        transition_delay: 1000,
        refresh_speed: 50,
        display_text: 'fill',
        use_percentage: true,
        percent_format: function(percent) { return percent + '%'; },
        amount_format: function(amount_part, amount_max) { return amount_part + ' / ' + amount_max; }
      });
    }

    // Chart.js v4 - Charts initialization
    initializeCharts();
  });

  // Listen for gauge loaded event
  document.addEventListener('gaugeLoaded', function() {
    // Gauge Chart (for Quick Settings Profile Completion)
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
      console.log('✅ Gauge chart initialized');
    }
  });

  // Chart.js v4 initialization
  function initializeCharts() {
    // Line Chart
    if ($('#lineChart').length) {
      const lineCtx = document.getElementById('lineChart').getContext('2d');
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgba(38, 185, 154, 0.31)',
            borderColor: 'rgba(38, 185, 154, 0.7)',
            pointBorderColor: 'rgba(38, 185, 154, 0.7)',
            pointBackgroundColor: 'rgba(38, 185, 154, 0.7)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointBorderWidth: 1,
            data: [31, 74, 6, 39, 20, 85, 7]
          }, {
            label: 'My Second dataset',
            backgroundColor: 'rgba(3, 88, 106, 0.3)',
            borderColor: 'rgba(3, 88, 106, 0.70)',
            pointBorderColor: 'rgba(3, 88, 106, 0.70)',
            pointBackgroundColor: 'rgba(3, 88, 106, 0.70)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(151,187,205,1)',
            pointBorderWidth: 1,
            data: [82, 23, 66, 9, 99, 4, 2]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Line Chart'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Bar Chart  
    if ($('#mybarChart').length) {
      const barCtx = document.getElementById('mybarChart').getContext('2d');
      new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: '# of Votes',
            data: [51, 30, 40, 28, 92, 50, 45],
            backgroundColor: [
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)',
              'rgba(38, 185, 154, 0.31)'
            ],
            borderColor: [
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)',
              'rgba(38, 185, 154, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Bar Chart'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Doughnut Chart
    if ($('#canvasDoughnut').length) {
      const doughnutCtx = document.getElementById('canvasDoughnut').getContext('2d');
      new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: [
            'Dark Grey',
            'Purple',
            'Info',
            'Success',
            'Primary',
            'Danger',
            'Warning'
          ],
          datasets: [{
            data: [120, 50, 140, 180, 100, 105, 110],
            backgroundColor: [
              '#455C73',
              '#9B59B6',
              '#BDC3C7',
              '#26B99A',
              '#3498DB',
              '#E74C3C',
              '#F39C12'
            ],
            hoverBackgroundColor: [
              '#34495E',
              '#B370CF',
              '#CFD4D8',
              '#36CAAB',
              '#49A9EA',
              '#E95E4F',
              '#F8C471'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Chart.js Doughnut Chart'
            }
          }
        }
      });
    }
  }

})(jQuery); 