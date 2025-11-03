/**
 * Comprehensive Chart Initialization System
 * Handles ALL chart types across ALL pages systematically
 */

// Chart configuration templates
const CHART_CONFIGS = {
  line: {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { x: { display: true }, y: { beginAtZero: true } }
    }
  },
  bar: {
    type: 'bar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { x: { display: true }, y: { beginAtZero: true } }
    }
  },
  doughnut: {
    type: 'doughnut',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  },
  pie: {
    type: 'pie',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  },
  radar: {
    type: 'radar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { r: { beginAtZero: true } }
    }
  },
  polarArea: {
    type: 'polarArea',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: { r: { beginAtZero: true } }
    }
  },
  sparkline: {
    type: 'line',
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
      elements: { point: { radius: 0 } }
    }
  }
};

// Sample data templates
const SAMPLE_DATA = {
  line: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: '#26B99A',
      backgroundColor: 'rgba(38, 185, 154, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  bar: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: 'Dataset 1',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ]
    }]
  },
  doughnut: {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [{
      data: [300, 50, 100, 80],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  },
  pie: {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [{
      data: [300, 50, 100, 80],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  },
  radar: {
    labels: ['Running', 'Swimming', 'Eating', 'Cycling', 'Programming'],
    datasets: [{
      label: 'Dataset 1',
      data: [20, 10, 4, 2, 5],
      borderColor: '#26B99A',
      backgroundColor: 'rgba(38, 185, 154, 0.2)',
      borderWidth: 2
    }]
  },
  polarArea: {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [{
      data: [11, 16, 7, 3, 14],
      backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
    }]
  },
  sparkline: {
    labels: Array.from({length: 20}, (_, i) => i),
    datasets: [{
      data: [2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4],
      borderColor: '#26B99A',
      backgroundColor: 'rgba(38, 185, 154, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0
    }]
  }
};

class ChartInitializer {
  constructor() {
    this.charts = new Map();
    this.DOM = window.DOM || this.createDOMUtils();
  }

  createDOMUtils() {
    return {
      select: (selector) => document.querySelector(selector),
      selectAll: (selector) => [...document.querySelectorAll(selector)],
      addClass: (element, className) => element?.classList.add(className),
      removeClass: (element, className) => element?.classList.remove(className),
      toggleClass: (element, className) => element?.classList.toggle(className),
      hasClass: (element, className) => element?.classList.contains(className)
    };
  }

  async waitForChart(maxAttempts = 100) {
    return new Promise((resolve) => {
      let attempts = 0;
      const checkChart = () => {
        if (typeof window.Chart !== 'undefined' && window.Chart.register) {
          resolve(true);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkChart, 50);
        } else {
          resolve(false);
        }
      };
      checkChart();
    });
  }

  createCanvas(container, width = 400, height = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    container.innerHTML = '';
    container.appendChild(canvas);
    return canvas;
  }

  getCanvasContext(canvasOrId, containerWidth, containerHeight) {
    let canvas;

    if (typeof canvasOrId === 'string') {
      const element = this.DOM.select(canvasOrId);
      if (!element) {
        // Element doesn't exist on this page - this is normal
        return null;
      }

      if (element.tagName === 'CANVAS') {
        canvas = element;
      } else {
        // Create canvas inside container
        canvas = this.createCanvas(element, containerWidth, containerHeight);
      }
    } else {
      canvas = canvasOrId;
    }

    return canvas ? canvas.getContext('2d') : null;
  }

  initChart(canvasOrId, chartType, customData = null, customOptions = {}) {
    const ctx = this.getCanvasContext(canvasOrId, 800, 400);
    if (!ctx) {
      // Don't log warnings for elements that don't exist - this is normal
      return null;
    }

    const config = { ...CHART_CONFIGS[chartType] };
    const data = customData || SAMPLE_DATA[chartType];

    if (!config || !data) {
      return null;
    }

    // Merge custom options
    config.options = { ...config.options, ...customOptions };

    try {
      const chart = new Chart(ctx, {
        type: config.type,
        data: data,
        options: config.options
      });

      const canvasId = ctx.canvas.id || `chart_${Date.now()}`;
      this.charts.set(canvasId, chart);

      return chart;
    } catch (error) {
      return null;
    }
  }

  initSparkline(container, data = null, color = '#26B99A', chartType = 'line') {
    let canvas = container.querySelector('canvas');

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = container.offsetWidth || 200;
      canvas.height = 80;
      container.appendChild(canvas);
    } else {
      // Update existing canvas size for better visibility
      canvas.width = container.offsetWidth || 200;
      canvas.height = 80;
    }

    const sparklineData = data || SAMPLE_DATA.sparkline.datasets[0].data;
    const customData = {
      labels: sparklineData.map((_, i) => i),
      datasets: [{
        data: sparklineData,
        borderColor: color,
        backgroundColor: color + '33',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    };

    const config = chartType === 'bar' ? 'bar' : 'sparkline';
    const options = chartType === 'bar' ?
      { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } } :
      { responsive: true, maintainAspectRatio: false };

    return this.initChart(canvas, config, customData, options);
  }

  initKnobChart(container, percent = 50) {
    const canvas = this.createCanvas(container, 100, 100);
    const data = {
      datasets: [{
        data: [percent, 100 - percent],
        backgroundColor: ['#26B99A', '#E8E8E8'],
        borderWidth: 0,
        cutout: '70%'
      }]
    };

    const chart = this.initChart(canvas, 'doughnut', data, {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    });

    // Add percentage text overlay
    const centerText = document.createElement('div');
    centerText.style.position = 'absolute';
    centerText.style.top = '50%';
    centerText.style.left = '50%';
    centerText.style.transform = 'translate(-50%, -50%)';
    centerText.style.fontSize = '14px';
    centerText.style.fontWeight = 'bold';
    centerText.style.color = '#26B99A';
    centerText.textContent = percent + '%';

    container.style.position = 'relative';
    container.appendChild(centerText);

    return chart;
  }

  // Initialize all charts on the page
  async initializeAllCharts() {
    const chartReady = await this.waitForChart();
    if (!chartReady) {return;}


    // 1. Chart.js demo pages (chartjs.html, chartjs2.html)
    this.initChartjsPages();

    // 2. Main dashboard charts
    this.initDashboardCharts();

    // 3. Widget charts
    this.initWidgetCharts();

    // 4. Sparkline charts
    this.initSparklineCharts();

    // 5. Knob/circular progress charts
    this.initKnobCharts();

    // 6. Initialize maps (Leaflet for US and World maps)
    this.initMaps();

    // 7. Initialize DataTables for table pages
    this.initDataTables();

    // 8. Weather icons handled by dedicated weather.js module

  }

  initChartjsPages() {
    // Handle canvas elements with data-chart attribute
    const chartCanvases = this.DOM.selectAll('canvas[data-chart]');

    chartCanvases.forEach(canvas => {
      const chartType = canvas.getAttribute('data-chart');
      this.initChart(canvas, chartType);
    });
  }

  initDashboardCharts() {
    // Main dashboard chart (chart_plot_01)
    if (this.DOM.select('#chart_plot_01')) {
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue',
          data: [12, 19, 8, 15, 22, 18, 25, 32, 28, 35, 30, 40],
          borderColor: '#1ABB9C',
          backgroundColor: 'rgba(26, 187, 156, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }, {
          label: 'Expenses',
          data: [8, 12, 6, 10, 15, 12, 18, 22, 20, 25, 22, 28],
          borderColor: '#5DADE2',
          backgroundColor: 'rgba(93, 173, 226, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      };
      this.initChart('#chart_plot_01', 'line', data);
    }

    // Index2 chart (chart_plot_02)
    if (this.DOM.select('#chart_plot_02')) {
      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales',
          data: [10, 15, 12, 18, 25, 22, 30, 35, 28, 40, 38, 45],
          borderColor: '#E74C3C',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }, {
          label: 'Revenue',
          data: [8, 12, 10, 14, 20, 18, 25, 28, 24, 32, 30, 38],
          borderColor: '#3498DB',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      };
      this.initChart('#chart_plot_02', 'line', data);
    }

    // Index4 charts - only initialize if elements exist
    if (this.DOM.select('#salesStatisticsChart')) {
      this.initChart('#salesStatisticsChart', 'bar', {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sales Statistics',
          data: [12000, 15000, 18000, 22000],
          backgroundColor: ['rgba(52, 152, 219, 0.8)', 'rgba(26, 188, 156, 0.8)', 'rgba(241, 196, 15, 0.8)', 'rgba(231, 76, 60, 0.8)']
        }]
      });
    }

    if (this.DOM.select('#weeklySalesChart')) {
      this.initChart('#weeklySalesChart', 'line', {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Weekly Sales',
          data: [1200, 1900, 800, 1500, 2200, 1800, 2500],
          borderColor: '#1ABB9C',
          backgroundColor: 'rgba(26, 187, 156, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      });
    }

    // Profile completion gauge
    if (this.DOM.select('#profile_completion_gauge')) {
      this.initKnobChart(this.DOM.select('#profile_completion_gauge'), 67);
    }

    // Index2.html specific charts
    if (this.DOM.select('#salesDistributionChart')) {
      this.initChart('#salesDistributionChart', 'pie', {
        labels: ['Online', 'Retail', 'Wholesale', 'Partner'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#26B99A', '#3498DB', '#E74C3C', '#F39C12'],
          borderWidth: 2
        }]
      });
    }

    if (this.DOM.select('#dailyActivityChart')) {
      this.initChart('#dailyActivityChart', 'line', {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
        datasets: [{
          label: 'User Activity',
          data: [120, 80, 200, 350, 450, 380, 200],
          borderColor: '#9B59B6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      });
    }

    if (this.DOM.select('#performanceMetricsChart')) {
      this.initChart('#performanceMetricsChart', 'radar', {
        labels: ['Speed', 'Reliability', 'Usability', 'Security', 'Performance'],
        datasets: [{
          label: 'Current',
          data: [85, 90, 78, 95, 88],
          borderColor: '#E67E22',
          backgroundColor: 'rgba(230, 126, 34, 0.2)',
          borderWidth: 2
        }, {
          label: 'Target',
          data: [90, 95, 85, 98, 92],
          borderColor: '#27AE60',
          backgroundColor: 'rgba(39, 174, 96, 0.2)',
          borderWidth: 2
        }]
      });
    }

    // Index3.html specific charts
    if (this.DOM.select('#salesOverviewChart')) {
      this.initChart('#salesOverviewChart', 'line', {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales Overview',
          data: [65, 75, 70, 80, 85, 78, 90, 95, 88, 100, 105, 110],
          borderColor: '#1ABB9C',
          backgroundColor: 'rgba(26, 187, 156, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      });
    }

    if (this.DOM.select('#revenueBreakdownChart')) {
      this.initChart('#revenueBreakdownChart', 'doughnut', {
        labels: ['Products', 'Services', 'Subscriptions', 'Consulting'],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ['#3498DB', '#E74C3C', '#F39C12', '#9B59B6'],
          borderWidth: 2
        }]
      });
    }

    if (this.DOM.select('#topProductsChart')) {
      this.initChart('#topProductsChart', 'bar', {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        datasets: [{
          label: 'Sales',
          data: [120, 190, 300, 500, 200],
          backgroundColor: ['rgba(52, 152, 219, 0.8)', 'rgba(26, 188, 156, 0.8)', 'rgba(241, 196, 15, 0.8)', 'rgba(231, 76, 60, 0.8)', 'rgba(155, 89, 182, 0.8)'],
          borderWidth: 1
        }]
      });
    }

    if (this.DOM.select('#conversionFunnelChart')) {
      this.initChart('#conversionFunnelChart', 'bar', {
        labels: ['Visitors', 'Leads', 'Prospects', 'Customers'],
        datasets: [{
          label: 'Conversion Funnel',
          data: [1000, 400, 200, 50],
          backgroundColor: ['rgba(52, 152, 219, 0.9)', 'rgba(26, 188, 156, 0.9)', 'rgba(241, 196, 15, 0.9)', 'rgba(231, 76, 60, 0.9)'],
          borderWidth: 1
        }]
      }, { indexAxis: 'y' });
    }

    // Additional index3.html charts - Traffic Sources and below
    if (this.DOM.select('#trafficSourcesChart')) {
      this.initChart('#trafficSourcesChart', 'doughnut', {
        labels: ['Direct', 'Organic Search', 'Social Media', 'Referrals', 'Email'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: ['#3498DB', '#2ECC71', '#E74C3C', '#F39C12', '#9B59B6'],
          borderWidth: 2
        }]
      });
    }

    if (this.DOM.select('#ordersAnalyticsChart')) {
      this.initChart('#ordersAnalyticsChart', 'line', {
        labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Order Volume',
          data: Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 50),
          borderColor: '#1ABB9C',
          backgroundColor: 'rgba(26, 187, 156, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        }, {
          label: 'Order Value ($)',
          data: Array.from({length: 30}, () => Math.floor(Math.random() * 5000) + 1000),
          borderColor: '#E67E22',
          backgroundColor: 'rgba(230, 126, 34, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: 'y1'
        }]
      }, {
        scales: {
          y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Order Count' } },
          y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Order Value ($)' }, grid: { drawOnChartArea: false } }
        }
      });
    }

    if (this.DOM.select('#orderStatusChart')) {
      this.initChart('#orderStatusChart', 'doughnut', {
        labels: ['Delivered', 'Pending', 'Shipped', 'Cancelled', 'Processing'],
        datasets: [{
          data: [45, 25, 15, 10, 5],
          backgroundColor: ['#2ECC71', '#F39C12', '#3498DB', '#E74C3C', '#95A5A6'],
          borderWidth: 2
        }]
      });
    }

    // Index4.html - Revenue by Location chart
    if (this.DOM.select('#revenueMap')) {
      this.initChart('#revenueMap', 'bar', {
        labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'],
        datasets: [{
          label: 'Revenue by Region ($000s)',
          data: [2400, 1800, 3200, 800, 600, 400],
          backgroundColor: [
            'rgba(52, 152, 219, 0.8)',
            'rgba(26, 188, 156, 0.8)',
            'rgba(241, 196, 15, 0.8)',
            'rgba(230, 126, 34, 0.8)',
            'rgba(155, 89, 182, 0.8)',
            'rgba(231, 76, 60, 0.8)'
          ],
          borderWidth: 1
        }]
      }, {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Revenue ($000s)' }
          },
          x: {
            title: { display: true, text: 'Geographic Regions' }
          }
        }
      });
    }
  }

  initWidgetCharts() {
    // Specific canvas elements in widgets - only initialize if they exist
    const widgetCanvases = [
      { id: '#canvas_line', type: 'line' },
      { id: '#canvas_line1', type: 'line' },
      { id: '#canvas_line2', type: 'line' },
      { id: '#canvas_doughnut', type: 'doughnut' },
      { id: '#canvas_doughnut4', type: 'doughnut' },
      { id: '#agentPerformanceChart', type: 'bar' }
    ];

    widgetCanvases.forEach(({ id, type }) => {
      if (this.DOM.select(id)) {
        if (type === 'bar' && id === '#agentPerformanceChart') {
          this.initChart(id, type, {
            labels: ['Agent A', 'Agent B', 'Agent C', 'Agent D'],
            datasets: [{
              label: 'Orders',
              data: [8, 6, 5, 5],
              backgroundColor: ['rgba(52, 152, 219, 0.8)', 'rgba(26, 188, 156, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(243, 156, 18, 0.8)']
            }]
          }, { indexAxis: 'y' });
        } else {
          this.initChart(id, type);
        }
      }
    });

    // Device Usage doughnut chart with matching colors and data
    const doughnutCanvases = this.DOM.selectAll('canvas.canvasDoughnut');
    if (doughnutCanvases.length > 0) {
      doughnutCanvases.forEach(canvas => {
        this.initChart(canvas, 'doughnut', {
          labels: ['IOS', 'Android', 'Blackberry', 'Symbian', 'Others'],
          datasets: [{
            data: [30, 10, 20, 15, 30],
            backgroundColor: [
              '#3498db', // IOS - blue
              '#26b99a', // Android - green
              '#9b59b6', // Blackberry - purple
              '#1abb9c', // Symbian - aero (teal)
              '#e74c3c'  // Others - red
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        }, {
          plugins: {
            legend: { display: false }, // Hide legend since labels are on the right
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        });
      });
    }
  }

  initSparklineCharts() {
    const sparklineSelectors = [
      '.sparkline_one', '.sparkline_two', '.sparkline_three',
      '.sparkline11', '.sparkline22',
      '.sparkline_line', '.sparkline_area', '.sparkline_bar', '.sparkline_discreet'
    ];

    sparklineSelectors.forEach(selector => {
      this.DOM.selectAll(selector).forEach((element, index) => {
        const color = element.classList.contains('sparkline_three') ? '#34495E' : '#26B99A';
        let data, chartType = 'line';

        // Different data and chart types based on sparkline class
        if (element.classList.contains('sparkline_line')) {
          data = [12, 14, 18, 21, 19, 25, 22, 28, 24, 32, 30, 35];
          chartType = 'line';
        } else if (element.classList.contains('sparkline_area')) {
          data = [5, 8, 12, 15, 18, 22, 25, 20, 24, 28, 30, 26];
          chartType = 'line';
        } else if (element.classList.contains('sparkline_bar')) {
          data = [10, 15, 12, 18, 25, 22, 30, 35, 28, 40, 38, 45];
          chartType = 'bar';
        } else if (element.classList.contains('sparkline_discreet')) {
          data = [2, 4, 6, 8, 5, 3, 7, 9, 6, 4, 8, 5, 7, 9, 3, 6, 8, 4];
          chartType = 'line';
        } else {
          data = element.classList.contains('sparkline_three') ?
            [2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6] :
            [2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6];
        }

        this.initSparkline(element, data, color, chartType);
      });
    });

    // Handle sparkline_pie separately as it needs a different chart type
    this.DOM.selectAll('.sparkline_pie').forEach(element => {
      let canvas = element.querySelector('canvas');

      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        element.appendChild(canvas);
      }

      // Ensure the parent element has proper centering
      element.style.textAlign = 'center';
      element.style.display = 'flex';
      element.style.justifyContent = 'center';
      element.style.alignItems = 'center';

      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
          datasets: [{
            data: [35, 25, 25, 15],
            backgroundColor: ['#26B99A', '#3498DB', '#E74C3C', '#F39C12'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    });
  }

  initKnobCharts() {
    // Standard knob charts
    this.DOM.selectAll('.chart').forEach(element => {
      const percent = parseInt(element.dataset.percent) || 50;
      this.initKnobChart(element, percent);
    });

    // Medium-sized pie charts for other_charts.html
    this.DOM.selectAll('.chart-medium').forEach(element => {
      const percent = parseInt(element.dataset.percent) || 50;
      const label = element.dataset.label || 'Metric';

      // Create canvas for the chart
      let canvas = element.querySelector('canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        element.innerHTML = '';
        element.appendChild(canvas);
      }

      new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [percent, 100 - percent],
            backgroundColor: ['#26B99A', '#ECF0F1'],
            borderWidth: 0,
            cutout: '65%'
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });

      // Add percentage text overlay
      const centerText = document.createElement('div');
      centerText.style.position = 'absolute';
      centerText.style.top = '50%';
      centerText.style.left = '50%';
      centerText.style.transform = 'translate(-50%, -50%)';
      centerText.style.fontSize = '18px';
      centerText.style.fontWeight = 'bold';
      centerText.style.color = '#26B99A';
      centerText.textContent = percent + '%';

      element.style.position = 'relative';
      element.style.display = 'inline-block';
      element.appendChild(centerText);

    });
  }

  initMaps() {
    // Initialize US map with Chart.js (better than broken vector maps)
    if (this.DOM.select('#usa_map') && typeof Chart !== 'undefined') {
      try {
        const usaMapContainer = this.DOM.select('#usa_map');
        usaMapContainer.innerHTML = '';

        const canvas = document.createElement('canvas');
        canvas.width = usaMapContainer.offsetWidth || 600;
        canvas.height = 400;
        usaMapContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
            datasets: [{
              label: 'Revenue by State ($000s)',
              data: [4500, 3200, 3800, 2100, 1800, 1500, 1300, 1100, 900, 800],
              backgroundColor: [
                'rgba(26, 188, 156, 0.8)', 'rgba(52, 152, 219, 0.8)', 'rgba(241, 196, 15, 0.8)',
                'rgba(230, 126, 34, 0.8)', 'rgba(155, 89, 182, 0.8)', 'rgba(231, 76, 60, 0.8)',
                'rgba(46, 204, 113, 0.8)', 'rgba(142, 68, 173, 0.8)', 'rgba(22, 160, 133, 0.8)', 'rgba(211, 84, 0, 0.8)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Top 10 US States by Revenue' }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Revenue ($000s)' }
              },
              x: {
                title: { display: true, text: 'US States' }
              }
            }
          }
        });
      } catch (error) {
      }
    }

    // Initialize World map with Leaflet
    if (this.DOM.select('#world-map-gdp') && typeof L !== 'undefined') {
      try {
        const worldMapContainer = this.DOM.select('#world-map-gdp');

        // Check if map is already initialized
        if (worldMapContainer._leaflet_id) {
          return;
        }

        // Create interactive world map
        const map = L.map('world-map-gdp').setView([20, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 5,
          minZoom: 1
        }).addTo(map);

        // Add revenue markers for major markets
        const markets = [
          { lat: 39.8283, lng: -98.5795, name: 'United States', revenue: '$2.4M' },
          { lat: 54.5260, lng: 15.2551, name: 'Europe', revenue: '$1.8M' },
          { lat: 35.8617, lng: 104.1954, name: 'China', revenue: '$1.2M' },
          { lat: 20.5937, lng: 78.9629, name: 'India', revenue: '$800K' },
          { lat: 35.6762, lng: 139.6503, name: 'Japan', revenue: '$600K' },
          { lat: -14.2350, lng: -51.9253, name: 'Brazil', revenue: '$400K' }
        ];

        markets.forEach(market => {
          const marker = L.marker([market.lat, market.lng]).addTo(map);
          marker.bindPopup(`<b>${market.name}</b><br>Revenue: ${market.revenue}`);
        });

      } catch (error) {
      }
    }
  }

  initDataTables() {
    // Wait for DataTables to be available
    if (typeof DataTable === 'undefined') {
      return;
    }


    // Basic DataTable
    const basicTable = this.DOM.select('#datatable');
    if (basicTable && !basicTable.dataTableInstance) {
      try {
        const dataTable = new DataTable(basicTable, {
          responsive: true,
          pageLength: 10,
          lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']],
          order: [[0, 'asc']],
          language: {
            search: 'Search employees:',
            lengthMenu: 'Show _MENU_ entries per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries',
            paginate: {
              first: 'First',
              last: 'Last',
              next: 'Next',
              previous: 'Previous'
            }
          }
        });
        basicTable.dataTableInstance = dataTable;
      } catch (error) {
      }
    }

    // DataTable with Buttons (Export functionality)
    const buttonsTable = this.DOM.select('#datatable-buttons');
    if (buttonsTable && !buttonsTable.dataTableInstance) {
      try {
        const dataTable = new DataTable(buttonsTable, {
          responsive: true,
          pageLength: 10,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'copy',
              text: 'Copy',
              className: 'btn btn-secondary btn-sm'
            },
            {
              extend: 'csv',
              text: 'CSV',
              className: 'btn btn-success btn-sm'
            },
            {
              extend: 'excel',
              text: 'Excel',
              className: 'btn btn-primary btn-sm'
            },
            {
              extend: 'print',
              text: 'Print',
              className: 'btn btn-info btn-sm'
            }
          ],
          language: {
            search: 'Search records:',
            lengthMenu: 'Show _MENU_ entries per page'
          }
        });
        buttonsTable.dataTableInstance = dataTable;
      } catch (error) {
      }
    }

    // Responsive DataTable
    const responsiveTable = this.DOM.select('#datatable-responsive');
    if (responsiveTable && !responsiveTable.dataTableInstance) {
      try {
        const dataTable = new DataTable(responsiveTable, {
          responsive: true,
          pageLength: 10,
          order: [[0, 'asc']],
          language: {
            search: 'Search records:',
            lengthMenu: 'Show _MENU_ entries per page'
          },
          columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
          ]
        });
        responsiveTable.dataTableInstance = dataTable;
      } catch (error) {
      }
    }

  }

  destroyAllCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }
}

// Global chart initializer instance
window.chartInitializer = new ChartInitializer();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.chartInitializer.initializeAllCharts();
});

export default ChartInitializer;
