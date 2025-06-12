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
    initializeECharts();
    initializeOtherCharts();
    initializeSkycons();
    initializeGeneralElements();
    initializeMaps();

    // World Map (for Visitors Location) - Using Leaflet
    if ($('#world-map-gdp').length) {
      try {
        var mapContainer = document.getElementById('world-map-gdp');
        mapContainer.style.height = '400px'; // Set a specific height for the map
        
        // Initialize Leaflet map
        var visitorsMap = L.map('world-map-gdp').setView([40, 0], 2);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(visitorsMap);
        
        // Add markers for visitor locations with popups showing percentages
        var visitorData = [
          { coords: [39.8283, -98.5795], country: 'United States', percentage: '33%' },
          { coords: [46.2276, 2.2137], country: 'France', percentage: '27%' },
          { coords: [51.1657, 10.4515], country: 'Germany', percentage: '16%' },
          { coords: [40.4637, -3.7492], country: 'Spain', percentage: '11%' },
          { coords: [55.3781, -3.4360], country: 'United Kingdom', percentage: '10%' }
        ];
        
        visitorData.forEach(function(location) {
          L.marker(location.coords)
            .addTo(visitorsMap)
            .bindPopup(`<b>${location.country}</b><br/>Visitors: ${location.percentage}`)
            .openPopup();
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

  // Modern gauge initialization function with Canvas fallback
  function initializeGauges() {
    try {
      // Simple Canvas Gauge implementation as fallback
      function createCanvasGauge(canvas, value, maxValue, options = {}) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Colors from theme
        const trackColor = options.strokeColor || '#E0E0E0';
        const progressColor = options.colorStart || '#26B99A';
        const pointerColor = options.pointerColor || '#73879C';
        
        // Draw gauge track (background arc)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.25 * Math.PI);
        ctx.strokeStyle = trackColor;
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Calculate progress angle
        const progress = value / maxValue;
        const startAngle = 0.75 * Math.PI;
        const endAngle = startAngle + progress * 1.5 * Math.PI;
        
        // Draw progress arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = progressColor;
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = pointerColor;
        ctx.fill();
        
        // Draw pointer
        const pointerAngle = startAngle + progress * 1.5 * Math.PI;
        const pointerLength = radius - 15;
        const pointerX = centerX + Math.cos(pointerAngle) * pointerLength;
        const pointerY = centerY + Math.sin(pointerAngle) * pointerLength;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pointerX, pointerY);
        ctx.strokeStyle = pointerColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw value text
        ctx.fillStyle = pointerColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(value) + (options.suffix || ''), centerX, centerY + 35);
      }

      // Initialize chart_gauge_01 (Profile Completion in index.html)
      const gauge01Element = document.getElementById('chart_gauge_01');
      if (gauge01Element) {
        // Set canvas size
        gauge01Element.width = 160;
        gauge01Element.height = 100;
        
        createCanvasGauge(gauge01Element, 75, 100, {
          colorStart: '#26B99A',
          strokeColor: '#E0E0E0',
          pointerColor: '#73879C',
          suffix: '%'
        });
        
        console.log('✅ Canvas Gauge 01 initialized (75%)');
      }

      // Initialize chart_gauge_02 (Goal gauge in index3.html) 
      const gauge02Element = document.getElementById('chart_gauge_02');
      if (gauge02Element) {
        // Set canvas size
        gauge02Element.width = 160;
        gauge02Element.height = 100;
        
        createCanvasGauge(gauge02Element, 3200, 5000, {
          colorStart: '#6FADCF',
          strokeColor: '#E0E0E0',
          pointerColor: '#26B99A',
          suffix: ''
        });
        
        console.log('✅ Canvas Gauge 02 initialized (3200/5000)');
      }

    } catch (error) {
      console.error('❌ Gauge initialization error:', error);
    }
  }

  /**
   * Initializes all Chart.js instances on a page.
   *
   * This function discovers all canvas elements with a `data-chart` attribute
   * and initializes a chart of the specified type.
   */
  function initializeCharts() {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded.');
      return;
    }

    const isChartJs1 = document.body.classList.contains('page-chartjs1');
    const isChartJs2 = document.body.classList.contains('page-chartjs2');
    const isMorrisJs = document.body.classList.contains('page-morisjs');

    if (!isChartJs1 && !isChartJs2 && !isMorrisJs) {
      return;
    }

    console.log('Initializing charts...');
    const chartCanvases = document.querySelectorAll('[data-chart]');

    chartCanvases.forEach((canvas, index) => {
      let type = canvas.dataset.chart;
      const ctx = canvas.getContext('2d');
      if (!type || !ctx) return;

      let chartType = type; // Use separate variable for Chart.js type
      let data, options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 8
            }
          },
          title: { 
            display: true, 
            padding: {
              top: 5,
              bottom: 8
            }
          }
        }
      };

      if (isChartJs1) {
        // Data and options for chartjs.html
        options.plugins.title.text = `Chart.js ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;

        if (type === 'line' || type === 'bar' || type === 'radar') {
          data = {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Primary Sales",
              backgroundColor: "rgba(38, 185, 154, 0.31)",
              borderColor: "rgba(38, 185, 154, 0.7)",
              data: [65, 59, 80, 81, 56, 55, 40, 58, 70, 60, 75, 68]
            }, {
              label: "Secondary Sales",
              backgroundColor: "rgba(3, 88, 106, 0.3)",
              borderColor: "rgba(3, 88, 106, 0.70)",
              data: [28, 48, 40, 19, 86, 27, 90, 75, 88, 70, 80, 72]
            }]
          };
          if (type === 'line') data.datasets.forEach(d => d.tension = 0.4);
        } else {
          data = {
            labels: ["Green", "Blue", "Gray", "Purple", "Red"],
            datasets: [{
              data: [120, 50, 140, 180, 100],
              backgroundColor: ["#26B99A", "#3498DB", "#BDC3C7", "#9B59B6", "#E74C3C"]
            }]
          };
        }
      } else if (isChartJs2) {
        // Data and options for chartjs2.html
        options.plugins.title.text = `Chart.js ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;

        if (type === 'line' || type === 'bar' || type === 'radar') {
          data = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
              label: "Online Orders",
              backgroundColor: "rgba(243, 156, 18, 0.3)",
              borderColor: "rgba(243, 156, 18, 0.7)",
              data: [45, 62, 55, 78, 58, 65, 80]
            }, {
              label: "In-Store Pickups",
              backgroundColor: "rgba(231, 76, 60, 0.3)",
              borderColor: "rgba(231, 76, 60, 0.7)",
              data: [33, 40, 32, 51, 44, 48, 55]
            }]
          };
          if (type === 'line') data.datasets.forEach(d => d.stepped = true);
        } else {
          data = {
            labels: ["Laptops", "Monitors", "Keyboards", "Mice", "Webcams"],
            datasets: [{
              data: [350, 250, 180, 220, 150],
              backgroundColor: ["#F39C12", "#E74C3C", "#8E44AD", "#3498DB", "#16A085"]
            }]
          };
        }
      } else if (isMorrisJs) {
        // Data and options for morisjs.html (Chart.js implementation)
        options.plugins.title.text = `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
        
        // Make charts fill more space and be visually appealing
        options.aspectRatio = 2.2; // Make charts even taller
        options.layout = {
          padding: {
            top: 5,    // Minimal top padding
            bottom: 10,
            left: 10,
            right: 10
          }
        };
        options.plugins.legend.labels = {
          padding: 10  // Reduce legend padding
        };
        options.plugins.title.padding = {
          top: 5,
          bottom: 10
        };
        options.elements = {
          bar: {
            borderWidth: 2,
            borderRadius: 4
          },
          line: {
            tension: 0.4
          },
          point: {
            radius: 4,
            hoverRadius: 6
          }
        };

        switch (index) {
          case 0: // Bar
            data = { 
              labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"], 
              datasets: [
                { 
                  label: 'Licensed Vehicles (thousands)', 
                  data: [3407, 3551, 3269, 3846, 4171, 4387, 4625, 4891, 5156, 5423, 5678, 5945, 6201], 
                  backgroundColor: '#26B99A',
                  borderColor: '#1e8e7a',
                  borderWidth: 1
                }, 
                { 
                  label: 'SORN (Off Road)', 
                  data: [660, 729, 818, 761, 681, 645, 598, 567, 534, 501, 468, 435, 402], 
                  backgroundColor: '#34495E',
                  borderColor: '#2c3e50',
                  borderWidth: 1
                }
              ] 
            };
            break;
          case 1: // Grouped Bar
            data = { 
              labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"], 
              datasets: [
                { 
                  label: 'Cloud Services (millions)', 
                  data: [2407, 2851, 3469, 4246, 5057, 5687, 6225, 6891, 7456, 8123, 8678, 9245, 9801], 
                  backgroundColor: '#26B99A',
                  borderColor: '#1e8e7a',
                  borderWidth: 1
                }, 
                { 
                  label: 'AI/ML Adoption (millions)', 
                  data: [360, 529, 718, 961, 1281, 1645, 2098, 2567, 3034, 3501, 3968, 4435, 4902], 
                  backgroundColor: '#3498DB',
                  borderColor: '#2980b9',
                  borderWidth: 1
                }
              ] 
            };
            break;
          case 2: // Line
            data = { 
              labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'], 
              datasets: [
                { 
                  label: 'Revenue (millions)', 
                  data: [100, 125, 95, 138, 164, 195, 226, 258, 291, 325, 360, 396, 433], 
                  borderColor: '#26B99A', 
                  backgroundColor: 'rgba(38, 185, 154, 0.1)',
                  tension: 0.4,
                  pointBackgroundColor: '#26B99A',
                  pointBorderColor: '#1e8e7a',
                  pointRadius: 4
                }, 
                { 
                  label: 'Profit (millions)', 
                  data: [25, 35, 18, 42, 58, 72, 89, 108, 127, 147, 168, 190, 213], 
                  borderColor: '#3498DB', 
                  backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  tension: 0.4,
                  pointBackgroundColor: '#3498DB',
                  pointBorderColor: '#2980b9',
                  pointRadius: 4
                }, 
                { 
                  label: 'Expenses (millions)', 
                  data: [75, 90, 77, 96, 106, 123, 137, 150, 164, 178, 192, 206, 220], 
                  borderColor: '#E74C3C', 
                  backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  tension: 0.4,
                  pointBackgroundColor: '#E74C3C',
                  pointBorderColor: '#c0392b',
                  pointRadius: 4
                }
              ] 
            };
            break;
          case 3: // Area
            options.plugins.title.text = 'Area Chart';
            data = { 
              labels: ["2018 Q1", "2018 Q2", "2018 Q3", "2018 Q4", "2019 Q1", "2019 Q2", "2019 Q3", "2019 Q4", "2020 Q1", "2020 Q2", "2020 Q3", "2020 Q4", "2021 Q1", "2021 Q2", "2021 Q3", "2021 Q4", "2022 Q1", "2022 Q2", "2022 Q3", "2022 Q4", "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1"], 
              datasets: [
                { 
                  label: 'Mobile Revenue (millions)', 
                  data: [2666, 2778, 4912, 3767, 6810, 7234, 8156, 9023, 8567, 9234, 10456, 11789, 12345, 13567, 14890, 16123, 17456, 18789, 20123, 21456, 22789, 24123, 25456, 26789, 28123], 
                  fill: true, 
                  backgroundColor: 'rgba(38, 185, 154, 0.3)', 
                  borderColor: '#26B99A',
                  tension: 0.4,
                  pointBackgroundColor: '#26B99A',
                  pointBorderColor: '#1e8e7a',
                  pointRadius: 3
                }, 
                { 
                  label: 'Web Revenue (millions)', 
                  data: [1890, 2294, 1969, 3597, 1914, 2456, 2789, 3123, 3456, 3789, 4123, 4456, 4789, 5123, 5456, 5789, 6123, 6456, 6789, 7123, 7456, 7789, 8123, 8456, 8789], 
                  fill: true, 
                  backgroundColor: 'rgba(52, 152, 219, 0.3)', 
                  borderColor: '#3498DB',
                  tension: 0.4,
                  pointBackgroundColor: '#3498DB',
                  pointBorderColor: '#2980b9',
                  pointRadius: 3
                }
              ] 
            };
            chartType = 'line'; // Area chart is a line chart with fill
            break;
          case 4: // Donut
            data = { 
              labels: ['Mobile Apps', 'Web Applications', 'Desktop Software', 'IoT Solutions', 'AI Services', 'Cloud Platforms', 'Data Analytics'], 
              datasets: [
                { 
                  data: [32, 28, 18, 12, 7, 5, 3], 
                  backgroundColor: ['#26B99A', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6', '#1ABC9C', '#34495E'],
                  borderColor: ['#1e8e7a', '#2980b9', '#c0392b', '#d68910', '#7d3c98', '#16a085', '#2c3e50'],
                  borderWidth: 2,
                  hoverOffset: 10
                }
              ] 
            };
            break;
          case 5: // Line 2
            data = { 
              labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'], 
              datasets: [
                { 
                  label: 'Performance Score (%)', 
                  data: [72, 68, 58, 65, 78, 85, 89, 92, 95, 97, 98, 99, 100], 
                  borderColor: '#3498DB',
                  backgroundColor: 'rgba(52, 152, 219, 0.1)', 
                  fill: false,
                  tension: 0.4,
                  pointBackgroundColor: '#3498DB',
                  pointBorderColor: '#2980b9',
                  pointRadius: 5,
                  pointHoverRadius: 7
                },
                { 
                  label: 'User Satisfaction (%)', 
                  data: [78, 82, 75, 80, 85, 88, 91, 93, 96, 97, 98, 99, 99], 
                  borderColor: '#26B99A',
                  backgroundColor: 'rgba(38, 185, 154, 0.1)', 
                  fill: false,
                  tension: 0.4,
                  pointBackgroundColor: '#26B99A',
                  pointBorderColor: '#1e8e7a',
                  pointRadius: 5,
                  pointHoverRadius: 7
                }
              ] 
            };
            break;
        }
      }

      new Chart(ctx, { type: chartType, data, options });
      console.log(`Chart "${type}" on ${isChartJs1 ? 'Page 1' : isChartJs2 ? 'Page 2' : 'Morris Page'} initialized.`);
    });
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
          labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
          datasets: [{
            label: 'Network Requests (millions)',
            data: [128, 148, 140, 119, 186, 227, 290, 360, 430, 480, 550, 620, 700],
            backgroundColor: 'rgba(38, 185, 154, 0.3)',
            borderColor: 'rgba(38, 185, 154, 0.7)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }, {
            label: 'Data Transfer (TB)',
            data: [65, 89, 120, 181, 256, 355, 440, 545, 660, 770, 855, 950, 1050],
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
          labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
          datasets: [{
            label: 'Email Campaigns (thousands)',
            data: [1120, 1490, 1800, 2200, 2650, 3100, 3580, 4090, 4620, 5180, 5760, 6360, 7000],
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
          labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
          datasets: [{
            label: 'User Registrations (thousands)',
            data: [450, 650, 580, 720, 890, 1050, 1230, 1420, 1620, 1830, 2050, 2280, 2520],
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

  // ECharts initialization function
  function initializeECharts() {
    if (!document.body.classList.contains('page-echarts')) {
      return;
    }

    if (typeof echarts === 'undefined') {
      console.warn('⚠️ ECharts library not available');
      return;
    }

    console.log('Initializing ECharts...');

    try {
      // 1. Bar Chart (mainb)
      if (document.getElementById('mainb')) {
        const mainbChart = echarts.init(document.getElementById('mainb'));
        const mainbOption = {
          title: {
            text: 'Revenue by Technology Stack',
            left: 'center',
            textStyle: { fontSize: 16 }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          legend: {
            data: ['2023', '2024', '2025'],
            top: 30
          },
          xAxis: {
            type: 'category',
            data: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'Go', '.NET']
          },
          yAxis: {
            type: 'value',
            name: 'Revenue (millions)'
          },
          series: [
            {
              name: '2023',
              type: 'bar',
              data: [120, 90, 85, 110, 95, 105, 70, 80],
              itemStyle: { color: '#26B99A' }
            },
            {
              name: '2024',
              type: 'bar',
              data: [140, 105, 95, 130, 115, 125, 85, 95],
              itemStyle: { color: '#3498DB' }
            },
            {
              name: '2025',
              type: 'bar',
              data: [165, 125, 110, 155, 140, 150, 105, 115],
              itemStyle: { color: '#E74C3C' }
            }
          ]
        };
        mainbChart.setOption(mainbOption);
        console.log('✅ ECharts Bar Chart initialized');
      }

      // 2. Mini Pie Chart (echart_mini_pie)
      if (document.getElementById('echart_mini_pie')) {
        const miniPieChart = echarts.init(document.getElementById('echart_mini_pie'));
        const miniPieOption = {
          title: {
            text: 'User Devices',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: 'Devices',
              type: 'pie',
              radius: '60%',
              data: [
                { value: 45, name: 'Mobile', itemStyle: { color: '#26B99A' } },
                { value: 35, name: 'Desktop', itemStyle: { color: '#3498DB' } },
                { value: 20, name: 'Tablet', itemStyle: { color: '#E74C3C' } }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        miniPieChart.setOption(miniPieOption);
        console.log('✅ ECharts Mini Pie Chart initialized');
      }

      // 3. Regular Pie Chart (echart_pie)
      if (document.getElementById('echart_pie')) {
        const pieChart = echarts.init(document.getElementById('echart_pie'));
        const pieOption = {
          title: {
            text: 'Market Share 2024',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['React', 'Vue', 'Angular', 'Svelte', 'Others']
          },
          series: [
            {
              name: 'Framework Usage',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 42, name: 'React', itemStyle: { color: '#61DAFB' } },
                { value: 28, name: 'Vue', itemStyle: { color: '#4FC08D' } },
                { value: 18, name: 'Angular', itemStyle: { color: '#DD0031' } },
                { value: 8, name: 'Svelte', itemStyle: { color: '#FF3E00' } },
                { value: 4, name: 'Others', itemStyle: { color: '#34495E' } }
              ]
            }
          ]
        };
        pieChart.setOption(pieOption);
        console.log('✅ ECharts Pie Chart initialized');
      }

      // 4. Pie Area Chart (echart_pie2)
      if (document.getElementById('echart_pie2')) {
        const pie2Chart = echarts.init(document.getElementById('echart_pie2'));
        const pie2Option = {
          title: {
            text: 'Cloud Services',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: 'Cloud Services',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              data: [
                { value: 35, name: 'AWS', itemStyle: { color: '#FF9900' } },
                { value: 28, name: 'Azure', itemStyle: { color: '#0078D4' } },
                { value: 22, name: 'Google Cloud', itemStyle: { color: '#4285F4' } },
                { value: 10, name: 'Digital Ocean', itemStyle: { color: '#0080FF' } },
                { value: 5, name: 'Others', itemStyle: { color: '#34495E' } }
              ],
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              }
            }
          ]
        };
        pie2Chart.setOption(pie2Option);
        console.log('✅ ECharts Pie Area Chart initialized');
      }

      // 5. Donut Chart (echart_donut)
      if (document.getElementById('echart_donut')) {
        const donutChart = echarts.init(document.getElementById('echart_donut'));
        const donutOption = {
          title: {
            text: 'Revenue Sources',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: 'Revenue',
              type: 'pie',
              radius: ['40%', '70%'],
              data: [
                { value: 45, name: 'Subscriptions', itemStyle: { color: '#26B99A' } },
                { value: 30, name: 'Consulting', itemStyle: { color: '#3498DB' } },
                { value: 15, name: 'Training', itemStyle: { color: '#F39C12' } },
                { value: 10, name: 'Support', itemStyle: { color: '#9B59B6' } }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        donutChart.setOption(donutOption);
        console.log('✅ ECharts Donut Chart initialized');
      }

      // 6. Scatter Chart (echart_scatter)
      if (document.getElementById('echart_scatter')) {
        const scatterChart = echarts.init(document.getElementById('echart_scatter'));
        const scatterOption = {
          title: {
            text: 'Performance vs Experience',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return `${params.seriesName}<br/>Performance: ${params.value[0]}<br/>Experience: ${params.value[1]} years<br/>Salary: $${params.value[2]}k`;
            }
          },
          xAxis: {
            type: 'value',
            name: 'Performance Score',
            min: 60,
            max: 100
          },
          yAxis: {
            type: 'value',
            name: 'Years of Experience'
          },
          series: [
            {
              name: 'Developers',
              type: 'scatter',
              data: [
                [85, 3, 75], [92, 5, 95], [78, 2, 65], [88, 4, 85], [95, 7, 120],
                [82, 3, 70], [90, 6, 110], [75, 1, 55], [87, 4, 80], [93, 8, 135],
                [80, 2, 60], [89, 5, 90], [91, 6, 105], [86, 3, 75], [94, 9, 150]
              ],
              symbolSize: function (data) {
                return Math.sqrt(data[2]) * 2;
              },
              itemStyle: {
                color: '#26B99A',
                opacity: 0.7
              }
            }
          ]
        };
        scatterChart.setOption(scatterOption);
        console.log('✅ ECharts Scatter Chart initialized');
      }

      // 7. Line Chart (echart_line)
      if (document.getElementById('echart_line')) {
        const lineChart = echarts.init(document.getElementById('echart_line'));
        const lineOption = {
          title: {
            text: 'Growth Trends 2018-2030',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Users', 'Revenue', 'Profit'],
            top: 30
          },
          xAxis: {
            type: 'category',
            data: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Users',
              type: 'line',
              data: [1200, 1450, 1300, 1680, 1950, 2200, 2500, 2850, 3200, 3600, 4000, 4450, 4900],
              smooth: true,
              itemStyle: { color: '#26B99A' }
            },
            {
              name: 'Revenue',
              type: 'line',
              data: [100, 125, 95, 138, 164, 195, 226, 258, 291, 325, 360, 396, 433],
              smooth: true,
              itemStyle: { color: '#3498DB' }
            },
            {
              name: 'Profit',
              type: 'line',
              data: [25, 35, 18, 42, 58, 72, 89, 108, 127, 147, 168, 190, 213],
              smooth: true,
              itemStyle: { color: '#E74C3C' }
            }
          ]
        };
        lineChart.setOption(lineOption);
        console.log('✅ ECharts Line Chart initialized');
      }

      // 8. Horizontal Bar Chart (echart_bar_horizontal)
      if (document.getElementById('echart_bar_horizontal')) {
        const hBarChart = echarts.init(document.getElementById('echart_bar_horizontal'));
        const hBarOption = {
          title: {
            text: 'Top Programming Languages',
            left: 'center',
            textStyle: { fontSize: 14 }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          yAxis: {
            type: 'category',
            data: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 'Go', 'Rust', 'Swift']
          },
          xAxis: {
            type: 'value',
            name: 'Popularity %'
          },
          series: [
            {
              name: 'Popularity',
              type: 'bar',
              data: [68, 62, 58, 45, 38, 28, 18, 15],
              itemStyle: {
                color: function(params) {
                  const colors = ['#26B99A', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'];
                  return colors[params.dataIndex];
                }
              }
            }
          ]
        };
        hBarChart.setOption(hBarOption);
        console.log('✅ ECharts Horizontal Bar Chart initialized');
      }

             // 9. World Map (echart_world_map) - Using scatter plot to simulate world distribution
       if (document.getElementById('echart_world_map')) {
         const worldMapChart = echarts.init(document.getElementById('echart_world_map'));
         const worldMapOption = {
           title: {
             text: 'Global User Distribution',
             left: 'center',
             textStyle: { fontSize: 16 }
           },
           tooltip: {
             trigger: 'item',
             formatter: function(params) {
               return `${params.data[3]}<br/>Users: ${params.data[2]}k<br/>Lat: ${params.data[1]}, Lng: ${params.data[0]}`;
             }
           },
           xAxis: {
             type: 'value',
             name: 'Longitude',
             min: -180,
             max: 180,
             show: false
           },
           yAxis: {
             type: 'value',
             name: 'Latitude', 
             min: -90,
             max: 90,
             show: false
           },
           series: [
             {
               name: 'Global Users',
               type: 'scatter',
               data: [
                 [-74, 40.7, 1200, 'New York'],
                 [2.3, 48.9, 950, 'Paris'],
                 [-0.1, 51.5, 800, 'London'],
                 [139.7, 35.7, 1100, 'Tokyo'],
                 [-122.4, 37.8, 750, 'San Francisco'],
                 [13.4, 52.5, 600, 'Berlin'],
                 [151.2, -33.9, 500, 'Sydney'],
                 [77.2, 28.6, 650, 'Delhi'],
                 [-43.2, -22.9, 400, 'Rio de Janeiro'],
                 [121.5, 31.2, 900, 'Shanghai']
               ],
               symbolSize: function(data) {
                 return Math.sqrt(data[2]) / 2;
               },
               itemStyle: {
                 color: function(params) {
                   const colors = ['#26B99A', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6'];
                   return colors[params.dataIndex % colors.length];
                 },
                 opacity: 0.8
               }
             }
           ],
           backgroundColor: '#f8f9fa'
         };
         worldMapChart.setOption(worldMapOption);
         console.log('✅ ECharts World Map initialized');
       }

             // 10. Pyramid Chart (echart_pyramid) - Using bar chart to create pyramid effect
       if (document.getElementById('echart_pyramid')) {
         const pyramidChart = echarts.init(document.getElementById('echart_pyramid'));
         const pyramidOption = {
           title: {
             text: 'User Hierarchy',
             left: 'center',
             textStyle: { fontSize: 14 }
           },
           tooltip: {
             trigger: 'item',
             formatter: '{b}: {c}%'
           },
           xAxis: {
             type: 'value',
             show: false
           },
           yAxis: {
             type: 'category',
             data: ['Admin', 'Enterprise', 'Pro Users', 'Premium Users', 'Basic Users'],
             axisLabel: {
               fontSize: 12
             }
           },
           series: [
             {
               name: 'User Levels',
               type: 'bar',
               data: [
                 { value: 20, name: 'Admin', itemStyle: { color: '#E74C3C' } },
                 { value: 40, name: 'Enterprise', itemStyle: { color: '#9B59B6' } },
                 { value: 60, name: 'Pro Users', itemStyle: { color: '#F39C12' } },
                 { value: 80, name: 'Premium Users', itemStyle: { color: '#3498DB' } },
                 { value: 100, name: 'Basic Users', itemStyle: { color: '#26B99A' } }
               ],
               label: {
                 show: true,
                 position: 'right',
                 formatter: '{c}%'
               },
               barWidth: '60%'
             }
           ],
           grid: {
             left: '30%',
             right: '10%',
             top: '15%',
             bottom: '10%'
           }
         };
         pyramidChart.setOption(pyramidOption);
         console.log('✅ ECharts Pyramid Chart initialized');
       }

             // 11. Sonar/Radar Chart (echart_sonar)
       if (document.getElementById('echart_sonar')) {
         const sonarChart = echarts.init(document.getElementById('echart_sonar'));
         const sonarOption = {
           title: {
             text: 'Technology Skills Radar',
             left: 'center',
             top: 10,
             textStyle: { fontSize: 14 }
           },
           tooltip: {
             trigger: 'item'
           },
           legend: {
             data: ['Senior Developer', 'Full Stack Engineer'],
             top: 30,
             left: 'center'
           },
           radar: {
             center: ['50%', '60%'],
             radius: '60%',
             indicator: [
               { name: 'Frontend', max: 100 },
               { name: 'Backend', max: 100 },
               { name: 'Database', max: 100 },
               { name: 'DevOps', max: 100 },
               { name: 'Mobile', max: 100 },
               { name: 'AI/ML', max: 100 }
             ],
             name: {
               textStyle: {
                 color: '#333',
                 fontSize: 11
               }
             },
             splitArea: {
               areaStyle: {
                 color: ['#f8f9fa', '#ecf0f1']
               }
             }
           },
           series: [
             {
               name: 'Skills Comparison',
               type: 'radar',
               data: [
                 {
                   value: [90, 85, 80, 70, 75, 60],
                   name: 'Senior Developer',
                   areaStyle: {
                     color: 'rgba(38, 185, 154, 0.3)'
                   },
                   lineStyle: {
                     color: '#26B99A'
                   },
                   itemStyle: {
                     color: '#26B99A'
                   }
                 },
                 {
                   value: [70, 95, 90, 85, 60, 80],
                   name: 'Full Stack Engineer',
                   areaStyle: {
                     color: 'rgba(52, 152, 219, 0.3)'
                   },
                   lineStyle: {
                     color: '#3498DB'
                   },
                   itemStyle: {
                     color: '#3498DB'
                   }
                 }
               ]
             }
           ]
         };
         sonarChart.setOption(sonarOption);
         console.log('✅ ECharts Sonar/Radar Chart initialized');
       }

             // 12. Gauge Chart (echart_gauge) - Simplified gauge
       if (document.getElementById('echart_gauge')) {
         const gaugeChart = echarts.init(document.getElementById('echart_gauge'));
         const gaugeOption = {
           title: {
             text: 'System Performance',
             left: 'center',
             top: 10,
             textStyle: { fontSize: 14 }
           },
           tooltip: {
             formatter: '{a} <br/>{b} : {c}%'
           },
           series: [
             {
               name: 'Performance',
               type: 'gauge',
               center: ['50%', '60%'],
               radius: '80%',
               min: 0,
               max: 100,
               splitNumber: 10,
               data: [
                 {
                   value: 87,
                   name: 'CPU Usage'
                 }
               ],
               axisLine: {
                 lineStyle: {
                   width: 30,
                   color: [
                     [0.3, '#E74C3C'],
                     [0.7, '#F39C12'],
                     [1, '#26B99A']
                   ]
                 }
               },
               pointer: {
                 itemStyle: {
                   color: '#26B99A'
                 }
               },
               axisTick: {
                 distance: -35,
                 length: 8,
                 lineStyle: {
                   color: '#fff',
                   width: 2
                 }
               },
               splitLine: {
                 distance: -35,
                 length: 30,
                 lineStyle: {
                   color: '#fff',
                   width: 4
                 }
               },
               axisLabel: {
                 color: 'auto',
                 distance: 45,
                 fontSize: 12
               },
               detail: {
                 valueAnimation: true,
                 formatter: '{value}%',
                 fontSize: 20,
                 offsetCenter: [0, '70%']
               },
               title: {
                 offsetCenter: [0, '85%'],
                 fontSize: 14
               }
             }
           ]
         };
         gaugeChart.setOption(gaugeOption);
         console.log('✅ ECharts Gauge Chart initialized');
       }

      // Make all charts responsive
      window.addEventListener('resize', function() {
        const chartIds = ['mainb', 'echart_mini_pie', 'echart_pie', 'echart_pie2', 'echart_donut', 
                         'echart_scatter', 'echart_line', 'echart_bar_horizontal', 'echart_world_map', 
                         'echart_pyramid', 'echart_sonar', 'echart_gauge'];
        
        chartIds.forEach(id => {
          const element = document.getElementById(id);
          if (element) {
            const chart = echarts.getInstanceByDom(element);
            if (chart) {
              chart.resize();
            }
          }
        });
      });

    } catch (error) {
      console.error('❌ ECharts initialization error:', error);
    }
  }

  // Other Charts initialization function (Leaflet + ECharts)
  function initializeOtherCharts() {
    if (!document.body.classList.contains('page-other-charts')) {
      return;
    }

    console.log('Initializing Other Charts...');

    try {
      // 1. USA Map using Leaflet (replacing vector map)
      if (document.getElementById('usa_map')) {
        const usaMapContainer = document.getElementById('usa_map');
        usaMapContainer.style.height = '400px';
        
        // Initialize Leaflet map focused on USA
        const usaMap = L.map('usa_map').setView([39.8283, -98.5795], 4);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(usaMap);
        
        // Add markers for major US cities with business data
        const usaCities = [
          { coords: [40.7128, -74.0060], city: 'New York', value: '$2.5M', color: '#26B99A' },
          { coords: [34.0522, -118.2437], city: 'Los Angeles', value: '$1.8M', color: '#3498DB' },
          { coords: [41.8781, -87.6298], city: 'Chicago', value: '$1.2M', color: '#E74C3C' },
          { coords: [29.7604, -95.3698], city: 'Houston', value: '$950K', color: '#F39C12' },
          { coords: [33.4484, -112.0740], city: 'Phoenix', value: '$750K', color: '#9B59B6' },
          { coords: [39.9526, -75.1652], city: 'Philadelphia', value: '$850K', color: '#1ABC9C' },
          { coords: [32.7767, -96.7970], city: 'Dallas', value: '$920K', color: '#E67E22' },
          { coords: [37.7749, -122.4194], city: 'San Francisco', value: '$2.1M', color: '#2ECC71' }
        ];
        
        usaCities.forEach(function(location) {
          const marker = L.circleMarker(location.coords, {
            color: location.color,
            fillColor: location.color,
            fillOpacity: 0.7,
            radius: 12
          }).addTo(usaMap);
          
          marker.bindPopup(`<b>${location.city}</b><br/>Revenue: ${location.value}`);
        });
        
        console.log('✅ USA Leaflet Map initialized');
      }

      // 2. Easy Pie Charts using ECharts mini gauges (with different sizes)
      const chartSizes = {
        'chart-large': { width: 150, height: 150, fontSize: 20, lineWidth: 25 },
        'chart-medium': { width: 100, height: 100, fontSize: 16, lineWidth: 18 },
        'chart-small': { width: 70, height: 70, fontSize: 12, lineWidth: 12 },
        'chart': { width: 120, height: 120, fontSize: 18, lineWidth: 20 } // fallback for old charts
      };

      // Handle all chart types with different sizes
      Object.keys(chartSizes).forEach(function(chartClass) {
        const charts = document.querySelectorAll(`.${chartClass}[data-percent]`);
        const config = chartSizes[chartClass];
        
        charts.forEach(function(element, index) {
          const percent = parseInt(element.getAttribute('data-percent'));
          const label = element.getAttribute('data-label') || '';
          const chartId = `${chartClass}-${index}`;
          
          // Clear existing content and create container for ECharts
          element.innerHTML = '';
          element.style.position = 'relative';
          element.style.width = config.width + 'px';
          element.style.height = config.height + 'px';
          element.style.margin = '0 auto';
          element.style.display = 'block';
          
          const chartDiv = document.createElement('div');
          chartDiv.id = chartId;
          chartDiv.style.width = config.width + 'px';
          chartDiv.style.height = config.height + 'px';
          element.appendChild(chartDiv);
          
          // Create ECharts gauge
          if (typeof echarts !== 'undefined') {
            const pieChart = echarts.init(chartDiv);
            
            // Dynamic color based on percentage and critical thresholds
            let color;
            if (label === 'Storage' && percent >= 90) {
              color = '#E74C3C'; // Critical storage
            } else if (label === 'CPU Usage' && percent >= 85) {
              color = '#F39C12'; // High CPU
            } else if (percent >= 90) {
              color = '#E74C3C'; // Critical
            } else if (percent >= 80) {
              color = '#26B99A'; // Good
            } else if (percent >= 60) {
              color = '#F39C12'; // Warning
            } else {
              color = '#3498DB'; // Low
            }
            
            const option = {
              series: [
                {
                  type: 'gauge',
                  center: ['50%', '50%'],
                  radius: '85%',
                  min: 0,
                  max: 100,
                  startAngle: 90,
                  endAngle: -270,
                  pointer: {
                    show: false
                  },
                  progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false,
                    itemStyle: {
                      borderWidth: 1,
                      borderColor: '#464646',
                      color: color
                    }
                  },
                  axisLine: {
                    lineStyle: {
                      width: config.lineWidth,
                      color: [[1, '#E6E6E6']]
                    }
                  },
                  splitLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  },
                  axisLabel: {
                    show: false
                  },
                  data: [
                    {
                      value: percent,
                      name: label,
                      detail: {
                        valueAnimation: true,
                        offsetCenter: [0, 0],
                        fontSize: config.fontSize,
                        fontWeight: 'bold',
                        formatter: '{value}%',
                        color: '#333'
                      }
                    }
                  ],
                  title: {
                    show: false
                  },
                  detail: {
                    width: config.width * 0.6,
                    height: config.fontSize + 4,
                    fontSize: config.fontSize,
                    fontWeight: 'bold',
                    color: '#333',
                    borderColor: 'auto',
                    borderRadius: 15,
                    borderWidth: 1,
                    formatter: '{value}%'
                  }
                }
              ]
            };
            pieChart.setOption(option);
            
            // Add animation on hover for interactivity
            chartDiv.addEventListener('mouseenter', function() {
              pieChart.setOption({
                series: [{
                  progress: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowColor: color
                    }
                  }
                }]
              });
            });
            
            chartDiv.addEventListener('mouseleave', function() {
              pieChart.setOption({
                series: [{
                  progress: {
                    itemStyle: {
                      shadowBlur: 0
                    }
                  }
                }]
              });
            });
          }
        });
      });
      
      console.log('✅ Easy Pie Charts initialized');

      // 3. Sparkline Charts using ECharts mini charts
      const sparklineElements = [
        { selector: '.sparkline_line', type: 'line', data: [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14] },
        { selector: '.sparkline_area', type: 'area', data: [5, 6, 2, 9, 4, 5, 3, 8, 5, 7, 9, 4, 2, 14] },
        { selector: '.sparkline_bar', type: 'bar', data: [5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14] },
        { selector: '.sparkline_pie', type: 'pie', data: [20, 30, 25, 25] },
        { selector: '.sparkline_discreet', type: 'scatter', data: [4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 5, 6, 3, 4] }
      ];

      sparklineElements.forEach(function(config, index) {
        const element = document.querySelector(config.selector);
        if (element && typeof echarts !== 'undefined') {
          const chartId = `sparkline-${index}`;
          
          // Clear existing content
          element.innerHTML = '';
          element.style.width = '100px';
          element.style.height = '40px';
          
          const chartDiv = document.createElement('div');
          chartDiv.id = chartId;
          chartDiv.style.width = '100px';
          chartDiv.style.height = '40px';
          element.appendChild(chartDiv);
          
          const sparkChart = echarts.init(chartDiv);
          let option;
          
          if (config.type === 'pie') {
            option = {
              series: [
                {
                  type: 'pie',
                  radius: ['40%', '70%'],
                  data: [
                    { value: config.data[0], itemStyle: { color: '#26B99A' } },
                    { value: config.data[1], itemStyle: { color: '#3498DB' } },
                    { value: config.data[2], itemStyle: { color: '#E74C3C' } },
                    { value: config.data[3], itemStyle: { color: '#F39C12' } }
                  ],
                  label: { show: false },
                  emphasis: { disabled: true }
                }
              ]
            };
          } else {
            option = {
              grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              },
              xAxis: {
                type: 'category',
                show: false,
                data: config.data.map((_, i) => i)
              },
              yAxis: {
                type: 'value',
                show: false
              },
              series: [
                {
                  type: config.type === 'area' ? 'line' : config.type,
                  data: config.data,
                  lineStyle: {
                    color: '#26B99A',
                    width: 2
                  },
                  itemStyle: {
                    color: '#26B99A'
                  },
                  areaStyle: config.type === 'area' ? {
                    color: 'rgba(38, 185, 154, 0.3)'
                  } : undefined,
                  symbol: config.type === 'scatter' ? 'circle' : 'none',
                  symbolSize: config.type === 'scatter' ? 4 : 0,
                  animation: false,
                  barWidth: config.type === 'bar' ? '60%' : undefined
                }
              ]
            };
          }
          
          sparkChart.setOption(option);
        }
      });
      
      console.log('✅ Sparkline Charts initialized');

      // Make charts responsive
      window.addEventListener('resize', function() {
        // Resize ECharts instances
        const allCharts = document.querySelectorAll('[id^="chart-large-"], [id^="chart-medium-"], [id^="chart-small-"], [id^="chart-"], [id^="sparkline-"]');
        allCharts.forEach(function(chartElement) {
          const chart = echarts.getInstanceByDom(chartElement);
          if (chart) {
            chart.resize();
          }
        });
        
        // Resize Leaflet maps
        if (window.usaMap) {
          setTimeout(() => window.usaMap.invalidateSize(), 100);
        }
      });

    } catch (error) {
      console.error('❌ Other Charts initialization error:', error);
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

  function initializeGeneralElements() {
    if (!document.body.classList.contains('page-general-elements')) {
      return;
    }
  
    console.log('Initializing General Elements...');
  
    const toastContainer = document.querySelector('.toast-container');
  
    const createToast = (title, body, type = 'success') => {
      const toastId = `toast-${Date.now()}`;
      const bgClass = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info',
        warning: 'bg-warning'
      }[type];
  
      const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header ${bgClass} text-white">
            <strong class="me-auto">${title}</strong>
            <small>Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${body}
          </div>
        </div>
      `;
      toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
  
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
      });
    };
  
    document.getElementById('toast-success-btn').addEventListener('click', () => {
      createToast('Success!', 'This is a success notification.', 'success');
    });
  
    document.getElementById('toast-error-btn').addEventListener('click', () => {
      createToast('Error!', 'This is an error notification.', 'error');
    });
  
    document.getElementById('toast-info-btn').addEventListener('click', () => {
      createToast('Info', 'This is an informational notification.', 'info');
    });
  
    document.getElementById('toast-warning-btn').addEventListener('click', () => {
      createToast('Warning', 'This is a warning notification.', 'warning');
    });
  }

  function initializeMaps() {
    if (!document.body.classList.contains('page-maps')) {
      return;
    }

    console.log('Initializing Leaflet map...');

    try {
      const map = L.map('leaflet-map').setView([51.505, -0.09], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Example marker
      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
    } catch (error) {
      console.error('❌ Leaflet map initialization error:', error);
    }
  }

})(jQuery); 