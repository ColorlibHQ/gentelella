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

    // Bootstrap 5 Native Progress Bars
    initializeProgressBars();

    // Initialize all chart components
    initializeCharts();
    initializeNetworkCharts();
    initializeECharts();
    initializeOtherCharts();
    initializeIndex2();
    initializeIndex4();
    initializeIndex3();
    initializeSidebarGauges();
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
        
        
      } catch (error) {
        console.error('❌ Map initialization failed:', error);
      }
    }

    // Chart.js initialization - Main Dashboard Chart
    
    const Chart = window.Chart || globalThis.Chart;
    if (typeof Chart !== 'undefined') {
      
      
      // Main chart in dashboard (chart_plot_01 is a div, so we create canvas inside)
      if ($('#chart_plot_01').length) {
        
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
        
      }

      // Doughnut Chart (using class selector since DOM shows class="canvasDoughnut")
      if ($('.canvasDoughnut').length) {
        

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
        
      }

      // Chart.js pages - Line Chart
      if ($('#lineChart').length) {
        
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
      
    }
  });

  // We still want NProgress to start early, so we'll keep this separate.
  $(document).ready(function() {
    

    if (typeof NProgress != 'undefined') {
      NProgress.start();
    }

  

    // Skycons initialization moved to initializeSkycons() function

    // Top Campaign Performance Progress Bars (handled by initializeProgressBars)

    // Chart initialization moved to main window.on('load') event
  });



  /**
   * Initializes Bootstrap 5 native progress bars with animations
   * Replaces the old bootstrap-progressbar library
   */
  function initializeProgressBars() {
    // Animate all progress bars with data-transitiongoal
    const progressBars = document.querySelectorAll('.progress-bar[data-transitiongoal]');
    
    progressBars.forEach(bar => {
      const targetPercent = parseInt(bar.getAttribute('data-transitiongoal'), 10);
      const displayText = bar.getAttribute('data-display-text') !== 'false';
      
      // Set initial state
      bar.style.width = '0%';
      bar.setAttribute('aria-valuenow', '0');
      
      // Animate to target value
      setTimeout(() => {
        bar.style.transition = 'width 1s ease-in-out';
        bar.style.width = targetPercent + '%';
        bar.setAttribute('aria-valuenow', targetPercent);
        
        if (displayText) {
          bar.textContent = targetPercent + '%';
        }
      }, 100);
    });

    // For progress bars without data-transitiongoal, just show them immediately
    const staticProgressBars = document.querySelectorAll('.progress-bar:not([data-transitiongoal])');
    staticProgressBars.forEach(bar => {
      const currentPercent = bar.style.width || bar.getAttribute('aria-valuenow') + '%' || '0%';
      bar.style.width = currentPercent;
    });
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
      const isChart3 = document.body.classList.contains('page-chart3');
  
  if (!isChartJs1 && !isChartJs2 && !isChart3) {
      return;
    }

    
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
          } else if (isChart3) {
      // Data and options for chart3.html (Chart.js implementation)
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
      
    }
  }

  // ECharts initialization function
  function initializeECharts() {
    if (!document.body.classList.contains('page-echarts')) {
      return;
    }

    const echarts = window.echarts || globalThis.echarts;
    if (typeof echarts === 'undefined') {
      console.warn('⚠️ ECharts library not available');
      return;
    }

    

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
        
      }

             // 9. World Map (echart_world_map) - Interactive scatter plot with geographic visualization
       if (document.getElementById('echart_world_map')) {
         const worldMapChart = echarts.init(document.getElementById('echart_world_map'));
         
         // Global user distribution data with coordinates
         const globalData = [
           {name: 'United States', value: [2300, -95.7129, 37.0902], users: 2300},
           {name: 'China', value: [1800, 104.1954, 35.8617], users: 1800},
           {name: 'Japan', value: [1200, 138.2529, 36.2048], users: 1200},
           {name: 'Germany', value: [1000, 10.4515, 51.1657], users: 1000},
           {name: 'United Kingdom', value: [800, -3.4360, 55.3781], users: 800},
           {name: 'France', value: [750, 2.2137, 46.2276], users: 750},
           {name: 'India', value: [700, 78.9629, 20.5937], users: 700},
           {name: 'Canada', value: [650, -106.3468, 56.1304], users: 650},
           {name: 'Brazil', value: [600, -51.9253, -14.2350], users: 600},
           {name: 'Australia', value: [550, 133.7751, -25.2744], users: 550},
           {name: 'South Korea', value: [500, 127.7669, 35.9078], users: 500},
           {name: 'Italy', value: [450, 12.5674, 41.8719], users: 450},
           {name: 'Spain', value: [400, -3.7492, 40.4637], users: 400},
           {name: 'Netherlands', value: [350, 5.2913, 52.1326], users: 350},
           {name: 'Sweden', value: [300, 18.6435, 60.1282], users: 300},
           {name: 'Russia', value: [275, 105.3188, 61.5240], users: 275},
           {name: 'Mexico', value: [250, -102.5528, 23.6345], users: 250},
           {name: 'Switzerland', value: [225, 8.2275, 46.8182], users: 225},
           {name: 'Singapore', value: [200, 103.8198, 1.3521], users: 200},
           {name: 'Norway', value: [175, 8.4689, 60.4720], users: 175}
         ];
         
         const worldMapOption = {
           backgroundColor: '#f5f5f5',
           title: {
             text: 'Global User Distribution',
             left: 'center',
             top: 20,
             textStyle: { 
               fontSize: 18,
               color: '#333',
               fontWeight: 'bold'
             }
           },
           tooltip: {
             trigger: 'item',
             formatter: function(params) {
               if (params.data) {
                 return `<div style="padding: 8px;">
                   <div style="font-weight: bold; color: #333; margin-bottom: 4px;">${params.data.name}</div>
                   <div style="color: #666;">Active Users: <span style="color: #26B99A; font-weight: bold;">${params.data.users}k</span></div>
                   <div style="color: #999; font-size: 11px;">Coordinates: ${params.data.value[1].toFixed(2)}°, ${params.data.value[2].toFixed(2)}°</div>
                 </div>`;
               }
               return params.name;
             },
             backgroundColor: 'rgba(255, 255, 255, 0.95)',
             borderColor: '#ccc',
             borderWidth: 1,
             textStyle: {
               color: '#333'
             }
           },
           legend: {
             data: ['Global Users'],
             left: 'left',
             top: 60,
             textStyle: {
               color: '#333'
             }
           },
           geo: {
             type: 'map',
             map: 'world',
             roam: true,
             zoom: 1.2,
             center: [0, 20],
             itemStyle: {
               areaColor: '#e6f4ff',
               borderColor: '#99d6ff',
               borderWidth: 1
             },
             emphasis: {
               itemStyle: {
                 areaColor: '#cce7ff'
               }
             },
             regions: [
               {
                 name: 'Antarctica',
                 itemStyle: {
                   areaColor: '#f0f0f0',
                   borderColor: '#ccc'
                 }
               }
             ]
           },
           visualMap: {
             min: 0,
             max: 2500,
             left: 'right',
             top: 'bottom',
             text: ['High Activity', 'Low Activity'],
             textStyle: {
               color: '#333'
             },
             inRange: {
               symbolSize: [6, 60],
               color: ['#26B99A', '#2ECC71', '#F39C12', '#E74C3C']
             },
             calculable: true,
             realtime: false
           },
           series: [
             {
               name: 'Global Users',
               type: 'scatter',
               coordinateSystem: 'geo',
               data: globalData,
               symbol: 'circle',
               symbolSize: function (val) {
                 return Math.max(8, val[0] / 50);
               },
               itemStyle: {
                 color: function(params) {
                   const users = params.data.users;
                   if (users > 1500) return '#E74C3C';
                   if (users > 1000) return '#F39C12';
                   if (users > 500) return '#2ECC71';
                   return '#26B99A';
                 },
                 shadowBlur: 10,
                 shadowColor: 'rgba(0, 0, 0, 0.3)'
               },
               emphasis: {
                 itemStyle: {
                   borderColor: '#333',
                   borderWidth: 2
                 }
               },
               label: {
                 show: false,
                 formatter: '{b}',
                 position: 'right'
               }
             }
           ]
         };
         
         // Load world map from CDN
         fetch('https://geo.datav.aliyun.com/areas_v3/bound/world.json')
           .then(response => response.json())
           .then(geoData => {
             echarts.registerMap('world', geoData);
             worldMapChart.setOption(worldMapOption);
             
           })
           .catch(error => {
             console.warn('⚠️ Failed to load world map data from CDN, using fallback visualization');
             // Fallback to scatter plot only
             const fallbackOption = {
               backgroundColor: '#f5f5f5',
               title: {
                 text: 'Global User Distribution',
                 subtext: 'Interactive Scatter Plot View',
                 left: 'center',
                 top: 20,
                 textStyle: { 
                   fontSize: 18,
                   color: '#333',
                   fontWeight: 'bold'
                 },
                 subtextStyle: {
                   color: '#666',
                   fontSize: 12
                 }
               },
               tooltip: {
                 trigger: 'item',
                 formatter: function(params) {
                   return `<div style="padding: 8px;">
                     <div style="font-weight: bold; color: #333; margin-bottom: 4px;">${params.data.name}</div>
                     <div style="color: #666;">Active Users: <span style="color: #26B99A; font-weight: bold;">${params.data.users}k</span></div>
                   </div>`;
                 },
                 backgroundColor: 'rgba(255, 255, 255, 0.95)',
                 borderColor: '#ccc',
                 borderWidth: 1
               },
               grid: {
                 left: '10%',
                 right: '15%',
                 top: '20%',
                 bottom: '15%'
               },
               xAxis: {
                 type: 'value',
                 name: 'Longitude',
                 nameLocation: 'middle',
                 nameGap: 25,
                 min: -180,
                 max: 180,
                 axisLine: {
                   lineStyle: { color: '#ccc' }
                 },
                 splitLine: {
                   lineStyle: { color: '#eee' }
                 }
               },
               yAxis: {
                 type: 'value',
                 name: 'Latitude',
                 nameLocation: 'middle',
                 nameGap: 35,
                 min: -90,
                 max: 90,
                 axisLine: {
                   lineStyle: { color: '#ccc' }
                 },
                 splitLine: {
                   lineStyle: { color: '#eee' }
                 }
               },
               visualMap: {
                 min: 0,
                 max: 2500,
                 right: 10,
                 top: 'center',
                 text: ['High', 'Low'],
                 inRange: {
                   symbolSize: [8, 40],
                   color: ['#26B99A', '#2ECC71', '#F39C12', '#E74C3C']
                 },
                 textStyle: {
                   color: '#333'
                 }
               },
               series: [
                 {
                   name: 'Global Users',
                   type: 'scatter',
                   data: globalData.map(item => ({
                     name: item.name,
                     value: [item.value[1], item.value[2], item.users],
                     users: item.users
                   })),
                   symbolSize: function (data) {
                     return Math.max(8, data[2] / 50);
                   },
                   itemStyle: {
                     color: function(params) {
                       const users = params.data.users;
                       if (users > 1500) return '#E74C3C';
                       if (users > 1000) return '#F39C12';
                       if (users > 500) return '#2ECC71';
                       return '#26B99A';
                     },
                     shadowBlur: 10,
                     shadowColor: 'rgba(0, 0, 0, 0.3)'
                   },
                   emphasis: {
                     itemStyle: {
                       borderColor: '#333',
                       borderWidth: 2
                     }
                   }
                 }
               ]
             };
             worldMapChart.setOption(fallbackOption);
           });
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
         
       }



      // Make all charts responsive
      window.addEventListener('resize', function() {
        const chartIds = ['mainb', 'echart_mini_pie', 'echart_pie', 'echart_pie2', 'echart_donut', 
                         'echart_scatter', 'echart_line', 'echart_bar_horizontal', 'echart_world_map', 
                         'echart_pyramid', 'echart_sonar'];
        
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
        
        
      }

      // 2. Easy Pie Charts using ECharts gauge charts (circular progress indicators)
      const chartSizes = {
        'chart-large': { width: 150, height: 150, fontSize: 20, lineWidth: 12 },
        'chart-medium': { width: 100, height: 100, fontSize: 16, lineWidth: 8 },
        'chart-small': { width: 70, height: 70, fontSize: 12, lineWidth: 6 },
        'chart': { width: 120, height: 120, fontSize: 18, lineWidth: 10 } // fallback for old charts
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
          
          // Create ECharts gauge chart for circular progress
          if (typeof echarts !== 'undefined') {
            const gaugeChart = echarts.init(chartDiv);
            
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
                  radius: '90%',
                  min: 0,
                  max: 100,
                  startAngle: 90,
                  endAngle: -270,
                  clockwise: true,
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
            
            gaugeChart.setOption(option);
            
            // Add animation on hover for interactivity
            chartDiv.addEventListener('mouseenter', function() {
              gaugeChart.setOption({
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
              gaugeChart.setOption({
                series: [{
                  progress: {
                    itemStyle: {
                      shadowBlur: 0
                    }
                  }
                }]
              });
            });
            
            // Store chart reference for resize handling
            window.addEventListener('resize', function() {
              setTimeout(() => {
                gaugeChart.resize();
              }, 100);
            });
          }
        });
      });
      
      

      // 3. Sparkline Charts using ECharts - Larger size to match pie charts
      const sparklineElements = [
        { 
          selector: '.sparkline_line', 
          type: 'line', 
          data: [45, 52, 38, 64, 51, 47, 59, 68, 42, 58, 73, 65, 78, 82], 
          width: 180, 
          height: 80,
          color: '#26B99A'
        },
        { 
          selector: '.sparkline_area', 
          type: 'area', 
          data: [32, 48, 54, 41, 67, 59, 45, 73, 68, 52, 84, 76, 59, 91], 
          width: 180, 
          height: 80,
          color: '#3498DB'
        },
        { 
          selector: '.sparkline_bar', 
          type: 'bar', 
          data: [25, 42, 58, 31, 49, 63, 37, 54, 48, 66, 52, 71, 45, 68], 
          width: 180, 
          height: 80,
          color: '#E74C3C'
        },
        { 
          selector: '.sparkline_pie', 
          type: 'pie', 
          data: [35, 28, 22, 15], 
          width: 120, 
          height: 120,
          color: '#F39C12'
        },
        { 
          selector: '.sparkline_discreet', 
          type: 'scatter', 
          data: [12, 24, 18, 32, 28, 15, 41, 38, 22, 29, 45, 33, 19, 36, 42, 27, 51, 38], 
          width: 380, 
          height: 80,
          color: '#9B59B6'
        }
      ];

      sparklineElements.forEach(function(config, index) {
        const element = document.querySelector(config.selector);
        if (element && typeof echarts !== 'undefined') {
          const chartId = `sparkline-${index}`;
          
          // Clear existing content
          element.innerHTML = '';
          element.style.width = config.width + 'px';
          element.style.height = config.height + 'px';
          element.style.margin = '0 auto';
          element.style.display = 'block';
          
          const chartDiv = document.createElement('div');
          chartDiv.id = chartId;
          chartDiv.style.width = config.width + 'px';
          chartDiv.style.height = config.height + 'px';
          element.appendChild(chartDiv);
          
          const sparkChart = echarts.init(chartDiv);
          let option;
          
          if (config.type === 'pie') {
            option = {
              series: [
                {
                  type: 'pie',
                  radius: ['35%', '65%'],
                  center: ['50%', '50%'],
                  data: [
                    { value: config.data[0], name: 'Product A', itemStyle: { color: '#26B99A' } },
                    { value: config.data[1], name: 'Product B', itemStyle: { color: '#3498DB' } },
                    { value: config.data[2], name: 'Product C', itemStyle: { color: '#E74C3C' } },
                    { value: config.data[3], name: 'Others', itemStyle: { color: '#F39C12' } }
                  ],
                  label: { show: false },
                  emphasis: { 
                    scale: true,
                    scaleSize: 5
                  },
                  animationType: 'expansion',
                  animationDuration: 800
                }
              ]
            };
          } else {
            option = {
              grid: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5
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
                    color: config.color,
                    width: 3
                  },
                  itemStyle: {
                    color: config.color
                  },
                  areaStyle: config.type === 'area' ? {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        { offset: 0, color: config.color + '80' },
                        { offset: 1, color: config.color + '20' }
                      ]
                    }
                  } : undefined,
                  symbol: config.type === 'scatter' ? 'circle' : 'none',
                  symbolSize: config.type === 'scatter' ? 6 : 0,
                  animation: true,
                  animationDuration: 1000,
                  barWidth: config.type === 'bar' ? '70%' : undefined,
                  smooth: config.type === 'line' || config.type === 'area'
                }
              ]
            };
          }
          
          sparkChart.setOption(option);
          
          // Add hover effects for interactivity
          if (config.type !== 'pie') {
            chartDiv.addEventListener('mouseenter', function() {
              sparkChart.setOption({
                series: [{
                  lineStyle: {
                    width: config.type === 'line' || config.type === 'area' ? 4 : 3,
                    shadowBlur: 10,
                    shadowColor: config.color
                  }
                }]
              });
            });
            
            chartDiv.addEventListener('mouseleave', function() {
              sparkChart.setOption({
                series: [{
                  lineStyle: {
                    width: 3,
                    shadowBlur: 0
                  }
                }]
              });
            });
          }
        }
      });
      
      

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

  // Index2 page specific initialization
  function initializeIndex2() {
    if (!document.body.classList.contains('page-index2')) {
      return;
    }
    

    // Initialize Weekly Summary Charts
    initializeWeeklySummaryCharts();
  }

  // Initialize Weekly Summary Charts
  function initializeWeeklySummaryCharts() {
    const echarts = window.echarts || globalThis.echarts;
    if (typeof echarts === 'undefined') {
      console.warn('⚠️ ECharts library not available for Weekly Summary Charts');
      return;
    }

    // Weekly Sales Trend Chart
    const weeklySalesChart = echarts.init(document.getElementById('weeklySalesChart'));
    weeklySalesChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Sales', 'Revenue', 'Orders']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: [120, 132, 101, 134, 90, 230, 210],
          itemStyle: {
            color: '#26B99A'
          }
        },
        {
          name: 'Revenue',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310],
          itemStyle: {
            color: '#3498DB'
          }
        },
        {
          name: 'Orders',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410],
          itemStyle: {
            color: '#9B59B6'
          }
        }
      ]
    });

    // Sales Distribution Chart
    const salesDistributionChart = echarts.init(document.getElementById('salesDistributionChart'));
    salesDistributionChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Sales Distribution',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Online' },
            { value: 735, name: 'In-Store' },
            { value: 580, name: 'Mobile' },
            { value: 484, name: 'Phone' }
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
    });

    // Daily Activity Chart
    const dailyActivityChart = echarts.init(document.getElementById('dailyActivityChart'));
    dailyActivityChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['Visits', 'Page Views', 'Bounce Rate']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
      },
      yAxis: [
        {
          type: 'value',
          name: 'Count',
          position: 'left'
        },
        {
          type: 'value',
          name: 'Rate',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Visits',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 101, 134, 90, 230, 210, 182]
        },
        {
          name: 'Page Views',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191, 234, 290, 330, 310, 123]
        },
        {
          name: 'Bounce Rate',
          type: 'line',
          yAxisIndex: 1,
          emphasis: {
            focus: 'series'
          },
          data: [45, 42, 38, 35, 32, 30, 28, 25]
        }
      ]
    });

    // Performance Metrics Chart
    const performanceMetricsChart = echarts.init(document.getElementById('performanceMetricsChart'));
    performanceMetricsChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Target', 'Actual']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['Conversion Rate', 'Avg. Order Value', 'Customer Retention', 'ROI']
      },
      series: [
        {
          name: 'Target',
          type: 'bar',
          data: [320, 302, 301, 334],
          itemStyle: {
            color: '#26B99A'
          }
        },
        {
          name: 'Actual',
          type: 'bar',
          data: [280, 290, 280, 310],
          itemStyle: {
            color: '#3498DB'
          }
        }
      ]
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      weeklySalesChart.resize();
      salesDistributionChart.resize();
      dailyActivityChart.resize();
      performanceMetricsChart.resize();
    });
  }

  // Index4 page specific initialization (Store Analytics)
  function initializeIndex4() {
    if (!document.body.classList.contains('page-index4')) {
      return;
    }
    

    // 1. Sales Statistics Chart
    const salesChartCanvas = document.getElementById('salesStatisticsChart');
    if (salesChartCanvas) {
      new Chart(salesChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Sales ($)',
            data: [120, 150, 180, 220, 190, 210, 240],
            backgroundColor: '#26B99A',
            borderRadius: 4,
          }, {
            label: 'Orders',
            data: [80, 95, 110, 130, 120, 140, 155],
            backgroundColor: '#3498DB',
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
      
    }

    // 2. Weekly Sales Chart
    const weeklySalesCanvas = document.getElementById('weeklySalesChart');
    if (weeklySalesCanvas) {
      new Chart(weeklySalesCanvas, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Sales',
            data: [32, 45, 38, 51, 62, 58, 70],
            borderColor: '#1ABB9C',
            backgroundColor: 'rgba(26, 187, 156, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
      
    }

    // 3. Revenue by Location Map
    const revenueMapDiv = document.getElementById('revenueMap');
    if (revenueMapDiv && typeof L !== 'undefined') {
      const map = L.map(revenueMapDiv).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      const locations = [
        { lat: 51.5, lng: -0.09, profit: 12000, name: 'London' },
        { lat: 40.71, lng: -74.00, profit: 18000, name: 'New York' },
        { lat: 34.05, lng: -118.24, profit: 15000, name: 'Los Angeles' },
        { lat: -33.86, lng: 151.20, profit: 11000, name: 'Sydney' },
        { lat: 35.68, lng: 139.69, profit: 9000, name: 'Tokyo' }
      ];

      locations.forEach(loc => {
        L.circle([loc.lat, loc.lng], {
          color: '#E74C3C',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: loc.profit * 20 // Adjust multiplier for radius
        }).addTo(map).bindPopup(`<b>${loc.name}</b><br>Profit: $${loc.profit.toLocaleString()}`);
      });
      
    }
    
    // 4. Top Selling Products (Static for now)
    const topProductsList = document.querySelector('.top_products_scroll');
    if(topProductsList) {
      const products = [
        { name: 'Ergonomic Office Chair', price: 249.99, sold: 124, img: 'images/prod-1.jpg' },
        { name: 'Wireless Bluetooth Headphones', price: 89.99, sold: 98, img: 'images/prod-2.jpg' },
        { name: 'Smart Home Hub', price: 129.00, sold: 76, img: 'images/prod-3.jpg' },
        { name: '4K Action Camera', price: 199.50, sold: 65, img: 'images/prod-4.jpg' },
        { name: 'Mechanical Keyboard', price: 110.00, sold: 52, img: 'images/prod-5.jpg' }
      ];
      let productHTML = '';
      products.forEach(p => {
        productHTML += `
          <li class="media event">
            <a class="pull-left"><img src="${p.img}" class="product_img" alt="product"/></a>
            <div class="media-body">
              <a class="title" href="#">${p.name}</a>
              <p><strong>$${p.price}</strong> | <span class="text-success">${p.sold} Sold</span></p>
            </div>
          </li>
        `;
      });
      topProductsList.innerHTML = productHTML;
      
    }
    
    // 5. Latest Orders DataTable
    const latestOrdersTable = document.getElementById('latestOrdersTable');
    if (latestOrdersTable && typeof $ !== 'undefined' && $.fn.DataTable) {
      const ordersData = [
        ['#ORD-1245', 'John Smith', '2024-07-28', '$145.50', '<span class="badge bg-green">Shipped</span>'],
        ['#ORD-1244', 'Emily Jones', '2024-07-28', '$89.00', '<span class="badge bg-green">Shipped</span>'],
        ['#ORD-1243', 'Michael Brown', '2024-07-27', '$210.00', '<span class="badge bg-orange">Pending</span>'],
        ['#ORD-1242', 'Sarah Davis', '2024-07-26', '$34.99', '<span class="badge bg-red">Cancelled</span>'],
        ['#ORD-1241', 'David Wilson', '2024-07-25', '$499.99', '<span class="badge bg-green">Shipped</span>']
      ];
      
      $(latestOrdersTable).DataTable({
        data: ordersData,
        columns: [
          { title: 'Order ID' },
          { title: 'Customer' },
          { title: 'Date' },
          { title: 'Total' },
          { title: 'Status' }
        ],
        responsive: true,
        paging: true,
        lengthChange: false,
        searching: false,
        ordering: true,
        info: false
      });
      
    }
  }

  // Skycons (Weather Icons) - Fixed initialization for weather widgets
  function initializeSkycons() {
    // Check if we're on a page that has weather widgets
    const hasWeatherWidget = document.body.classList.contains('page-index') || 
                             document.body.classList.contains('page-index3') ||
                             document.querySelector('.weather-icon') !== null;
    
    if (!hasWeatherWidget) {
      return;
    }

    const Skycons = window.Skycons || globalThis.Skycons;
    if (typeof Skycons === 'undefined') {
      console.warn('⚠️ Skycons library not available');
      return;
    }

    

    try {
      var skycons = new Skycons({ 
        color: '#73879C',
        resizeClear: true
      });
      
      // Weather icons mapping with more comprehensive coverage
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
        { id: 'fog', type: Skycons.FOG },
        { id: 'hail', type: Skycons.SLEET }, // Use sleet for hail
        { id: 'thunderstorm', type: Skycons.RAIN } // Use rain for thunderstorm
      ];

      let iconsAdded = 0;

      weatherElements.forEach(function(weather) {
        var element = document.getElementById(weather.id);
        if (element) {
          // Ensure canvas has proper dimensions
          element.width = element.width || 84;
          element.height = element.height || 84;
          
          skycons.add(element, weather.type);
          iconsAdded++;
          
        }
      });

      if (iconsAdded > 0) {
        skycons.play();
        
        
        // Store skycons instance globally for potential cleanup
        window.skycons = skycons;
      } else {
        console.warn('⚠️ No weather canvas elements found for Skycons');
      }
      
    } catch (error) {
      console.error('❌ Skycons initialization error:', error);
    }
  }

  function initializeGeneralElements() {
    if (!document.body.classList.contains('page-general-elements')) {
      return;
    }
  
    
  
    // Check if toast container exists before proceeding
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      
      return;
    }
  
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
  
    // Only add event listeners if the buttons exist
    const toastSuccessBtn = document.getElementById('toast-success-btn');
    if (toastSuccessBtn) {
      toastSuccessBtn.addEventListener('click', () => {
        createToast('Success!', 'This is a success notification.', 'success');
      });
    }
  
    const toastErrorBtn = document.getElementById('toast-error-btn');
    if (toastErrorBtn) {
      toastErrorBtn.addEventListener('click', () => {
        createToast('Error!', 'This is an error notification.', 'error');
      });
    }
  
    const toastInfoBtn = document.getElementById('toast-info-btn');
    if (toastInfoBtn) {
      toastInfoBtn.addEventListener('click', () => {
        createToast('Info', 'This is an informational notification.', 'info');
      });
    }
  
    const toastWarningBtn = document.getElementById('toast-warning-btn');
    if (toastWarningBtn) {
      toastWarningBtn.addEventListener('click', () => {
        createToast('Warning', 'This is a warning notification.', 'warning');
      });
    }
  }

  function initializeMaps() {
    if (!document.body.classList.contains('page-maps')) {
      return;
    }

    const L = window.L || globalThis.L;
    if (typeof L === 'undefined') {
      console.warn('⚠️ Leaflet library not available');
      return;
    }

    

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

  // Sidebar Profile Completion Gauges - ECharts implementation
  function initializeSidebarGauges() {
    

    const echarts = window.echarts || globalThis.echarts;

    // Profile Completion Gauge (index.html)
    const profileGauge = document.getElementById('profile_completion_gauge');
    if (profileGauge && typeof echarts !== 'undefined') {
      const gaugeChart = echarts.init(profileGauge);
      gaugeChart.setOption({
        series: [{
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          progress: { show: true, width: 8 },
          axisLine: { lineStyle: { width: 8, color: [[1, '#E0E0E0']] } },
          pointer: { show: true, length: '70%', width: 4 },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '60%'], color: '#26B99A', formatter: '{value}%' },
          data: [{ value: 67, name: 'Complete' }],
          itemStyle: { color: '#26B99A' }
        }]
      });
      window.addEventListener('resize', () => gaugeChart.resize());
      
    }

    // Profile Completion Gauge (index3.html)
    const profileGauge3 = document.getElementById('profile_completion_gauge_3');
    if (profileGauge3 && typeof echarts !== 'undefined') {
      const gaugeChart3 = echarts.init(profileGauge3);
      gaugeChart3.setOption({
        series: [{
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          progress: { show: true, width: 8 },
          axisLine: { lineStyle: { width: 8, color: [[1, '#E0E0E0']] } },
          pointer: { show: true, length: '70%', width: 4 },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '60%'], color: '#26B99A', formatter: '{value}%' },
          data: [{ value: 75, name: 'Complete' }],
          itemStyle: { color: '#26B99A' }
        }]
      });
      window.addEventListener('resize', () => gaugeChart3.resize());
      
    }

    // Goal Progress Gauge (index3.html)
    const goalGauge = document.getElementById('goal_progress_gauge');
    if (goalGauge && typeof echarts !== 'undefined') {
      const goalChart = echarts.init(goalGauge);
      goalChart.setOption({
        series: [{
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          progress: { show: true, width: 8 },
          axisLine: { lineStyle: { width: 8, color: [[1, '#E0E0E0']] } },
          pointer: { show: true, length: '70%', width: 4 },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '60%'], color: '#3498DB', formatter: '{value}%' },
          data: [{ value: 64, name: 'Goal' }],
          itemStyle: { color: '#3498DB' }
        }]
      });
      window.addEventListener('resize', () => goalChart.resize());
      
    }

    // Profile Completion Gauge (test_page.html)
    const profileGaugeTest = document.getElementById('profile_completion_gauge_test');
    if (profileGaugeTest && typeof echarts !== 'undefined') {
      const gaugeChartTest = echarts.init(profileGaugeTest);
      gaugeChartTest.setOption({
        series: [{
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          min: 0,
          max: 100,
          progress: { show: true, width: 8 },
          axisLine: { lineStyle: { width: 8, color: [[1, '#E0E0E0']] } },
          pointer: { show: true, length: '70%', width: 4 },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '60%'], color: '#26B99A', formatter: '{value}%' },
          data: [{ value: 75, name: 'Complete' }],
          itemStyle: { color: '#26B99A' }
        }]
      });
      window.addEventListener('resize', () => gaugeChartTest.resize());
      
    }
  }

  // Index3 page specific initialization
  function initializeIndex3() {
    if (!document.body.classList.contains('page-index3')) {
      return;
    }

    const echarts = window.echarts || globalThis.echarts;
    if (typeof echarts === 'undefined') {
      console.warn('⚠️ ECharts library not available for Index3');
      return;
    }

    

    try {
      // Sales Overview (Line)
      const salesOverviewContainer = document.getElementById('salesOverviewChart');
      if (!salesOverviewContainer) {
        console.warn('salesOverviewChart container not found');
        return;
      }
      const salesOverviewChart = echarts.init(salesOverviewContainer);
    salesOverviewChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Sales', 'Orders'] },
      xAxis: { type: 'category', data: Array.from({length: 30}, (_, i) => `Day ${i+1}`) },
      yAxis: { type: 'value' },
      series: [
        { name: 'Sales', type: 'line', data: [120, 132, 101, 134, 90, 230, 210, 180, 160, 170, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380], smooth: true, lineStyle: { color: '#26B99A' } },
        { name: 'Orders', type: 'line', data: [80, 95, 110, 130, 120, 140, 155, 160, 150, 145, 140, 135, 130, 125, 120, 115, 110, 105, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45], smooth: true, lineStyle: { color: '#3498DB' } }
      ]
    });
    

    // Revenue Breakdown (Pie)
    const revenueBreakdownContainer = document.getElementById('revenueBreakdownChart');
    if (!revenueBreakdownContainer) {
      console.warn('revenueBreakdownChart container not found');
      return;
    }
    const revenueBreakdownChart = echarts.init(revenueBreakdownContainer);
    revenueBreakdownChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        name: 'Revenue', type: 'pie', radius: '60%',
        data: [
          { value: 10480, name: 'Online' },
          { value: 7350, name: 'In-Store' },
          { value: 5800, name: 'Mobile' },
          { value: 4840, name: 'Phone' }
        ],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
      }]
    });
    

    // Top Products (Bar)
    const topProductsContainer = document.getElementById('topProductsChart');
    if (!topProductsContainer) {
      console.warn('topProductsChart container not found');
      return;
    }
    const topProductsChart = echarts.init(topProductsContainer);
    topProductsChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Chair', 'Headphones', 'Hub', 'Camera', 'Keyboard'] },
      yAxis: { type: 'value' },
      series: [{
        data: [124, 98, 76, 65, 52],
        type: 'bar',
        itemStyle: { color: '#1ABB9C' }
      }]
    });
    

    // Conversion Funnel (Funnel)
    const conversionFunnelContainer = document.getElementById('conversionFunnelChart');
    if (!conversionFunnelContainer) {
      console.warn('conversionFunnelChart container not found');
      return;
    }
    const conversionFunnelChart = echarts.init(conversionFunnelContainer);
    conversionFunnelChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b} : {c}%' },
      series: [{
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 20,
        bottom: 20,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: { show: true, position: 'inside' },
        labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 16 } },
        data: [
          { value: 100, name: 'Visits' },
          { value: 80, name: 'Signups' },
          { value: 60, name: 'Add to Cart' },
          { value: 40, name: 'Checkout' },
          { value: 20, name: 'Purchase' }
        ]
      }]
    });
    

    // Traffic Sources (Radar)
    const trafficSourcesContainer = document.getElementById('trafficSourcesChart');
    if (!trafficSourcesContainer) {
      console.warn('trafficSourcesChart container not found');
      return;
    }
    const trafficSourcesChart = echarts.init(trafficSourcesContainer);
    trafficSourcesChart.setOption({
      tooltip: {},
      legend: { data: ['Traffic'] },
      radar: {
        indicator: [
          { name: 'Organic', max: 100 },
          { name: 'Direct', max: 100 },
          { name: 'Referral', max: 100 },
          { name: 'Social', max: 100 },
          { name: 'Email', max: 100 }
        ]
      },
      series: [{
        name: 'Traffic Sources',
        type: 'radar',
        data: [
          { value: [85, 65, 50, 40, 30], name: 'Traffic' }
        ],
        areaStyle: { opacity: 0.2 },
        lineStyle: { color: '#3498DB' },
        itemStyle: { color: '#3498DB' }
      }]
    });
    

    // Orders Analytics Dashboard
    try {
      
      
      // Orders Analytics Chart (Line Chart)
      const ordersAnalyticsContainer = document.getElementById('ordersAnalyticsChart');
      if (ordersAnalyticsContainer) {
        const ordersChart = echarts.init(ordersAnalyticsContainer);
        
        // Generate data for the last 30 days
        const dates = [];
        const orderCounts = [];
        const revenues = [];
        
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          
          // Simulate realistic order data with some variation
          const baseOrders = 15 + Math.floor(Math.random() * 10);
          const weekendReduction = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
          orderCounts.push(Math.floor(baseOrders * weekendReduction));
          
          // Revenue correlates with orders but has some randomness
          const avgOrderValue = 800 + Math.random() * 400;
          revenues.push(Math.floor(orderCounts[orderCounts.length - 1] * avgOrderValue));
        }

        const ordersOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            formatter: function(params) {
              let result = `<strong>${params[0].axisValue}</strong><br/>`;
              params.forEach(param => {
                const value = param.seriesName === 'Revenue' ? 
                  `$${(param.value / 1000).toFixed(1)}K` : 
                  param.value;
                result += `${param.marker} ${param.seriesName}: ${value}<br/>`;
              });
              return result;
            }
          },
          legend: {
            data: ['Orders', 'Revenue'],
            top: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
              rotate: 45,
              fontSize: 10
            }
          },
          yAxis: [
            {
              type: 'value',
              name: 'Orders',
              position: 'left',
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f0f0'
                }
              }
            },
            {
              type: 'value',
              name: 'Revenue ($)',
              position: 'right',
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: function(value) {
                  return '$' + (value / 1000).toFixed(0) + 'K';
                }
              }
            }
          ],
          series: [
            {
              name: 'Orders',
              type: 'line',
              yAxisIndex: 0,
              data: orderCounts,
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                width: 3,
                color: '#5470c6'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                  { offset: 1, color: 'rgba(84, 112, 198, 0.05)' }
                ])
              }
            },
            {
              name: 'Revenue',
              type: 'line',
              yAxisIndex: 1,
              data: revenues,
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              lineStyle: {
                width: 3,
                color: '#91cc75'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
                  { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
                ])
              }
            }
          ]
        };

        ordersChart.setOption(ordersOption);
        

        // Add to resize handler
        window.addEventListener('resize', () => ordersChart.resize());
      }

      // Order Status Distribution Chart (Donut Chart)
      const orderStatusContainer = document.getElementById('orderStatusChart');
      if (orderStatusContainer) {
        const statusChart = echarts.init(orderStatusContainer);
        
        const statusOption = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            bottom: 20,
            textStyle: {
              fontSize: 11
            }
          },
          series: [
            {
              name: 'Order Status',
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['60%', '45%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { 
                  value: 45, 
                  name: 'Delivered',
                  itemStyle: { color: '#28a745' }
                },
                { 
                  value: 25, 
                  name: 'Shipped',
                  itemStyle: { color: '#17a2b8' }
                },
                { 
                  value: 20, 
                  name: 'Pending',
                  itemStyle: { color: '#ffc107' }
                },
                { 
                  value: 7, 
                  name: 'Cancelled',
                  itemStyle: { color: '#dc3545' }
                },
                { 
                  value: 3, 
                  name: 'Returned',
                  itemStyle: { color: '#6c757d' }
                }
              ]
            }
          ]
        };

        statusChart.setOption(statusOption);
        

        // Add to resize handler
        window.addEventListener('resize', () => statusChart.resize());
      }

      
    } catch (error) {
      console.error('❌ Error initializing Orders Analytics:', error);
    }

    // Responsive
    window.addEventListener('resize', function() {
      salesOverviewChart.resize();
      revenueBreakdownChart.resize();
      topProductsChart.resize();
      conversionFunnelChart.resize();
      trafficSourcesChart.resize();
      // Orders Analytics charts will handle their own resize in their function
    });

    
    } catch (error) {
      console.error('❌ Error initializing Index3 charts:', error);
    }
  }



})(jQuery); 