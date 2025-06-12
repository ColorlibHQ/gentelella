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

    // Initialize all chart components
    initializeGauges();
    initializeCharts();
    initializeNetworkCharts();
    initializeSkycons();

    // World Map (for Visitors Location)
    if ($('#world-map-gdp').length) {
      try {
        $('#world-map-gdp').vectorMap({
          map: 'world_en',
          backgroundColor: null,
          color: '#f0f0f0',
          hoverOpacity: 0.8,
          selectedColor: '#73879C',
          enableZoom: true,
          showTooltip: true,
          series: {
            regions: [{
              values: {
                'us': 33,
                'fr': 27, 
                'de': 16,
                'es': 11,
                'gb': 10
              },
              scale: ['#A3E4D7', '#26B99A'],
              normalizeFunction: 'polynomial'
            }]
          },
          onRegionTipShow: function(e, el, code) {
            var value = this.series.regions[0].values[code];
            if (value) {
              el.html(el.html() + '<br/>Visitors: ' + value + '%');
            }
          },
          onRegionOver: function(e, code) {
            console.log('Hovering country:', code);
          }
        });
        console.log('✅ Visitors location map initialized successfully');
      } catch (error) {
        console.error('❌ Map initialization failed:', error);
      }
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

    // Gauge initialization is handled by initializeGauges() function

    // Skycons initialization moved to initializeSkycons() function

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

    // Chart initialization moved to main window.on('load') event
  });

  // Modern gauge initialization function
  function initializeGauges() {
    if (typeof Gauge === 'undefined') {
      console.warn('⚠️ Gauge library not available');
      return;
    }

    try {
      // Initialize chart_gauge_01 (Profile Completion in index.html)
      const gauge01Element = document.getElementById('chart_gauge_01');
      if (gauge01Element) {
        // Check if Gauge needs to be accessed from a different property
        const GaugeConstructor = Gauge.default || Gauge;
        const gauge01 = new GaugeConstructor(gauge01Element);
        
        gauge01.setOptions({
          angle: 0.15,
          lineWidth: 0.44,
          radiusScale: 1,
          pointer: {
            length: 0.6,
            strokeWidth: 0.035,
            color: '#73879C'  // Main font color for pointer
          },
          limitMax: false,
          limitMin: false,
          colorStart: '#26B99A',  // Theme green color start
          colorStop: '#26B99A',   // Theme green color end (solid color instead of gradient)
          strokeColor: '#E0E0E0',
          generateGradient: false,  // Disable gradient for solid color
          highDpiSupport: true,
          percentColors: [[0.0, "#26B99A"], [0.50, "#26B99A"], [1.0, "#26B99A"]]  // All green instead of orange progression
        });
        
        gauge01.maxValue = 100;
        gauge01.setMinValue(0);
        gauge01.animationSpeed = 32;
        gauge01.set(75); // Set to 75%
        
        const gaugeText = document.getElementById('gauge-text');
        if (gaugeText) {
          gauge01.setTextField(gaugeText);
        }
        
        console.log('✅ Gauge 01 initialized');
      }

      // Initialize chart_gauge_02 (Goal gauge in index3.html)
      const gauge02Element = document.getElementById('chart_gauge_02');
      if (gauge02Element) {
        const GaugeConstructor = Gauge.default || Gauge;
        const gauge02 = new GaugeConstructor(gauge02Element);
        
        gauge02.setOptions({
          angle: 0.15,
          lineWidth: 0.44,
          radiusScale: 1,
          pointer: {
            length: 0.6,
            strokeWidth: 0.035,
            color: '#26B99A'
          },
          limitMax: false,
          limitMin: false,
          colorStart: '#6FADCF',
          colorStop: '#8FC0DA',
          strokeColor: '#E0E0E0',
          generateGradient: true,
          highDpiSupport: true
        });
        
        gauge02.maxValue = 5000;
        gauge02.setMinValue(0);
        gauge02.animationSpeed = 32;
        gauge02.set(3200);
        
        const gaugeText2 = document.getElementById('gauge-text2');
        if (gaugeText2) {
          gauge02.setTextField(gaugeText2);
        }
        
        console.log('✅ Gauge 02 initialized');
      }
    } catch (error) {
      console.error('❌ Gauge initialization error:', error);
    }
  }

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

  // Network Activity Charts (Chart.js replacement for Flot)
  function initializeNetworkCharts() {
    // Network Activity Chart 1 (index.html)
    if (document.getElementById('chart_plot_01')) {
      const netCtx1 = document.getElementById('chart_plot_01');
      const canvas1 = document.createElement('canvas');
      canvas1.id = 'networkChart1';
      canvas1.width = netCtx1.offsetWidth;
      canvas1.height = 250;
      netCtx1.appendChild(canvas1);
      
      new Chart(canvas1, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Network Requests',
            data: [28, 48, 40, 19, 86, 27, 90, 60, 30, 80, 50, 70],
            backgroundColor: 'rgba(38, 185, 154, 0.3)',
            borderColor: 'rgba(38, 185, 154, 0.7)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }, {
            label: 'Data Transfer',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 55, 50],
            backgroundColor: 'rgba(3, 88, 106, 0.3)',
            borderColor: 'rgba(3, 88, 106, 0.7)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#E4E7ED'
              }
            },
            x: {
              grid: {
                color: '#E4E7ED'
              }
            }
          }
        }
      });
      console.log('✅ Network Chart 1 initialized');
    }

    // Network Activity Chart 2 (index2.html)  
    if (document.getElementById('chart_plot_02')) {
      const netCtx2 = document.getElementById('chart_plot_02');
      const canvas2 = document.createElement('canvas');
      canvas2.id = 'networkChart2';
      canvas2.width = netCtx2.offsetWidth;
      canvas2.height = 250;
      netCtx2.appendChild(canvas2);
      
      new Chart(canvas2, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [{
            label: 'Email Sent',
            data: [120, 190, 300, 500],
            backgroundColor: 'rgba(150, 202, 89, 0.3)',
            borderColor: 'rgba(150, 202, 89, 0.7)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#E4E7ED'
              }
            },
            x: {
              grid: {
                color: '#E4E7ED'
              }
            }
          }
        }
      });
      console.log('✅ Network Chart 2 initialized');
    }

    // Network Activity Chart 3 (index3.html)
    if (document.getElementById('chart_plot_03')) {
      const netCtx3 = document.getElementById('chart_plot_03');
      const canvas3 = document.createElement('canvas');
      canvas3.id = 'networkChart3';
      canvas3.width = netCtx3.offsetWidth;
      canvas3.height = 250;
      netCtx3.appendChild(canvas3);
      
      new Chart(canvas3, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            label: 'Registrations',
            data: [450, 650, 800, 1200],
            backgroundColor: 'rgba(150, 202, 89, 0.3)',
            borderColor: 'rgba(150, 202, 89, 0.7)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#E4E7ED'
              }
            },
            x: {
              grid: {
                color: '#E4E7ED'
              }
            }
          }
        }
      });
      console.log('✅ Network Chart 3 initialized');
    }
  }

  // Skycons (Weather Icons) - Fixed initialization
  function initializeSkycons() {
    if (typeof Skycons === 'undefined') {
      console.warn('⚠️ Skycons library not available');
      return;
    }

    try {
      var skycons = new Skycons({ color: '#73879C' });
      
      // Weather icons mapping
      var weatherElements = [
        { id: 'clear-day', type: Skycons.CLEAR_DAY },
        { id: 'clear-night', type: Skycons.CLEAR_NIGHT },
        { id: 'partly-cloudy-day', type: Skycons.PARTLY_CLOUDY_DAY },
        { id: 'partly-cloudy-night', type: Skycons.PARTLY_CLOUDY_NIGHT },
        { id: 'cloudy', type: Skycons.CLOUDY },
        { id: 'rain', type: Skycons.RAIN },
        { id: 'sleet', type: Skycons.SLEET },
        { id: 'snow', type: Skycons.SNOW },
        { id: 'wind', type: Skycons.WIND },
        { id: 'fog', type: Skycons.FOG }
      ];

      weatherElements.forEach(function(weather) {
        var element = document.getElementById(weather.id);
        if (element) {
          skycons.add(element, weather.type);
  
        }
      });

      skycons.play();
      
    } catch (error) {
      console.error('❌ Skycons initialization error:', error);
    }
  }

})(jQuery); 