/**
 * Chart Core Module
 * Modernized chart initialization and utilities
 * Extracted and modernized from init.js - jQuery eliminated
 */

// Modern DOM utilities (imported from ui-components)
const DOM = {
  select: selector => document.querySelector(selector),
  selectAll: selector => [...document.querySelectorAll(selector)],
  exists: selector => document.querySelector(selector) !== null,
  getAttribute: (element, attr) => element?.getAttribute(attr),
  setAttribute: (element, attr, value) => element?.setAttribute(attr, value)
};

/**
 * Chart.js Initialization - MODERNIZED FROM JQUERY
 * Discovers and initializes Chart.js charts via data attributes
 */
export function initializeCharts() {
  if (typeof Chart === 'undefined') {
    console.error('❌ Chart.js not loaded.');
    return;
  }

  // Find all canvas elements with data-chart attribute - MODERNIZED
  const chartElements = DOM.selectAll('canvas[data-chart]');

  if (chartElements.length === 0) {
    return; // No charts to initialize
  }

  chartElements.forEach(canvas => {
    try {
      const chartType = DOM.getAttribute(canvas, 'data-chart');
      const chartData = DOM.getAttribute(canvas, 'data-chart-data');
      const chartOptions = DOM.getAttribute(canvas, 'data-chart-options');

      if (!chartType) {
        console.warn('⚠️ Chart type not specified for canvas:', canvas.id);
        return;
      }

      // Parse chart data and options
      let data = {};
      let options = {};

      try {
        if (chartData) {
          data = JSON.parse(chartData);
        }
        if (chartOptions) {
          options = JSON.parse(chartOptions);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse chart data/options:', parseError);
      }

      // Create Chart.js instance
      const chart = new Chart(canvas, {
        type: chartType,
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }
      });

      // Store chart reference for external access
      canvas.chartInstance = chart;

      console.log(`✅ Chart.js ${chartType} initialized: ${canvas.id || 'unnamed'}`);
    } catch (error) {
      console.error('❌ Failed to initialize chart:', error);
    }
  });
}

/**
 * Network Activity Charts - MODERNIZED FROM JQUERY
 * Creates real-time network monitoring charts
 */
export function initializeNetworkCharts() {
  // Network activity chart containers
  const networkCharts = [
    { id: 'network_load', title: 'Network Load', color: '#26B99A' },
    { id: 'cpu_load', title: 'CPU Usage', color: '#3498DB' },
    { id: 'memory_usage', title: 'Memory Usage', color: '#E74C3C' }
  ];

  networkCharts.forEach(chartConfig => {
    const element = DOM.select(`#${chartConfig.id}`);
    if (!element) {
      return;
    }

    try {
      const ctx = element.getContext('2d');

      // Generate initial data
      const data = generateNetworkData();

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: chartConfig.title,
              data: data.values,
              borderColor: chartConfig.color,
              backgroundColor: chartConfig.color + '20',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      // Store chart for real-time updates
      element.chartInstance = chart;

      // Start real-time updates
      startNetworkUpdates(chart, chartConfig.id);

      console.log(`✅ Network chart initialized: ${chartConfig.id}`);
    } catch (error) {
      console.error(`❌ Failed to initialize network chart ${chartConfig.id}:`, error);
    }
  });
}

/**
 * Generate simulated network data
 */
function generateNetworkData() {
  const labels = [];
  const values = [];
  const now = new Date();

  for (let i = 9; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    labels.push(time.toLocaleTimeString());
    values.push(Math.random() * 100);
  }

  return { labels, values };
}

/**
 * Real-time network chart updates
 */
function startNetworkUpdates(chart, chartId) {
  setInterval(() => {
    // Add new data point
    const newValue = Math.random() * 100;
    const newLabel = new Date().toLocaleTimeString();

    chart.data.labels.push(newLabel);
    chart.data.datasets[0].data.push(newValue);

    // Keep only last 10 data points
    if (chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }

    chart.update('none'); // Update without animation for real-time feel
  }, 2000); // Update every 2 seconds
}

/**
 * Gauge Chart Creation - MODERNIZED
 * Creates circular progress/gauge charts using Chart.js
 */
export function createGaugeChart(canvasId, value, options = {}) {
  const canvas = DOM.select(`#${canvasId}`);
  if (!canvas) {
    console.warn(`⚠️ Canvas element not found: ${canvasId}`);
    return null;
  }

  const ctx = canvas.getContext('2d');
  const config = {
    color: '#26B99A',
    backgroundColor: '#E0E0E0',
    centerText: true,
    ...options
  };

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [config.color, config.backgroundColor],
          borderWidth: 0,
          cutout: '80%'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      animation: {
        animateRotate: true,
        duration: 1000
      }
    },
    plugins: config.centerText
      ? [
        {
          id: 'centerText',
          beforeDraw: function (chart) {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;

            ctx.restore();
            const fontSize = (height / 100).toFixed(2);
            ctx.font = fontSize + 'em Arial';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = config.color;

            const text = value + '%';
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }
      ]
      : []
  });

  return chart;
}

/**
 * Chart Utility Functions - MODERNIZED
 */
export const ChartUtils = {
  /**
   * Destroy all charts on page - MODERNIZED FROM JQUERY
   */
  destroyAllCharts() {
    DOM.selectAll('canvas').forEach(canvas => {
      if (canvas.chartInstance) {
        canvas.chartInstance.destroy();
        canvas.chartInstance = null;
      }
    });
    console.log('✅ All charts destroyed');
  },

  /**
   * Update chart data - MODERN API
   */
  updateChart(chartId, newData) {
    const canvas = DOM.select(`#${chartId}`);
    if (canvas && canvas.chartInstance) {
      canvas.chartInstance.data = newData;
      canvas.chartInstance.update();
      return true;
    }
    return false;
  },

  /**
   * Resize all charts - MODERNIZED FROM JQUERY
   */
  resizeAllCharts() {
    DOM.selectAll('canvas').forEach(canvas => {
      if (canvas.chartInstance) {
        canvas.chartInstance.resize();
      }
    });
  },

  /**
   * Export chart as image
   */
  exportChart(chartId, filename = 'chart.png') {
    const canvas = DOM.select(`#${chartId}`);
    if (canvas && canvas.chartInstance) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      return true;
    }
    return false;
  },

  /**
   * Get chart data
   */
  getChartData(chartId) {
    const canvas = DOM.select(`#${chartId}`);
    return canvas?.chartInstance?.data || null;
  }
};

/**
 * Responsive chart handling - MODERNIZED FROM JQUERY
 */
export function setupResponsiveCharts() {
  // Handle window resize for all charts
  window.addEventListener('resize', () => {
    ChartUtils.resizeAllCharts();
  });

  // Handle sidebar toggle for chart resize
  DOM.selectAll('[data-toggle="sidebar"]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Delay resize to allow sidebar animation to complete
      setTimeout(() => {
        ChartUtils.resizeAllCharts();
      }, 350);
    });
  });

  console.log('✅ Responsive chart handling initialized');
}

/**
 * Initialize Index Dashboard Charts - SPECIFIC TO INDEX.HTML
 * Creates the specific charts that exist in the main dashboard
 */
export function initializeIndexDashboardCharts() {
  console.log('🎯 Initializing index dashboard charts...');

  // 1. Main Network Activities Chart (chart_plot_01)
  const mainChartContainer = DOM.select('#chart_plot_01');
  if (mainChartContainer) {
    // Create canvas inside the div container
    const canvas = document.createElement('canvas');
    canvas.id = 'chart_plot_01_canvas';
    canvas.style.width = '100%';
    canvas.style.height = '350px';
    mainChartContainer.appendChild(canvas);

    // Initialize Chart.js line chart
    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Network Activities',
            data: [10, 40, 30, 60, 35, 65],
            borderColor: '#26B99A',
            backgroundColor: 'rgba(38, 185, 154, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    canvas.chartInstance = chart;
    console.log('✅ Main network activities chart initialized');
  }

  // 2. Device Usage Doughnut Chart (canvasDoughnut)
  const doughnutCanvas = DOM.select('.canvasDoughnut');
  if (doughnutCanvas) {
    const ctx = doughnutCanvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['iOS', 'Android', 'Blackberry', 'Windows Phone', 'Other'],
        datasets: [
          {
            data: [45, 35, 10, 7, 3],
            backgroundColor: ['#26B99A', '#3498DB', '#E74C3C', '#F39C12', '#9B59B6'],
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          }
        },
        cutout: '50%'
      }
    });

    doughnutCanvas.chartInstance = chart;
    console.log('✅ Device usage doughnut chart initialized');
  }

  // 3. Profile Completion Gauge (profile_completion_gauge)
  const gaugeContainer = DOM.select('#profile_completion_gauge');
  if (gaugeContainer && typeof echarts !== 'undefined') {
    const gauge = echarts.init(gaugeContainer);

    const option = {
      series: [
        {
          name: 'Profile Completion',
          type: 'gauge',
          min: 0,
          max: 100,
          splitNumber: 10,
          radius: '80%',
          axisLine: {
            lineStyle: {
              color: [
                [0.2, '#FF6B6B'],
                [0.8, '#4ECDC4'],
                [1, '#45B7D1']
              ],
              width: 10
            }
          },
          axisLabel: {
            fontWeight: 'bolder',
            color: '#999',
            shadowColor: '#999',
            shadowBlur: 10
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              shadowColor: '#999',
              shadowBlur: 10
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              shadowColor: '#999',
              shadowBlur: 10
            }
          },
          pointer: {
            shadowColor: '#999',
            shadowBlur: 5
          },
          title: {
            fontWeight: 'bolder',
            fontSize: 14,
            fontStyle: 'italic',
            color: '#333',
            shadowColor: '#999',
            shadowBlur: 10
          },
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#999',
            shadowBlur: 5,
            offsetCenter: [0, '50%'],
            fontWeight: 'bolder',
            color: '#fff'
          },
          data: [
            {
              value: 67,
              name: 'SCORE'
            }
          ]
        }
      ]
    };

    gauge.setOption(option);
    gaugeContainer.chartInstance = gauge;
    console.log('✅ Profile completion gauge initialized');
  }

  console.log('✅ Index dashboard charts initialization complete');
}

// Auto-initialize charts when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Chart.js is available
    if (typeof Chart !== 'undefined') {
      initializeCharts();
      setupResponsiveCharts();

      // Initialize specific dashboard charts for index.html
      initializeIndexDashboardCharts();
    }

    // Initialize network charts if containers exist
    if (DOM.exists('#network_load') || DOM.exists('#cpu_load') || DOM.exists('#memory_usage')) {
      initializeNetworkCharts();
    }
  });
}
