/**
 * Modern ECharts Module
 * Extracted and modernized from init.js - jQuery eliminated
 * Handles all ECharts implementations with modern JavaScript
 */

// Modern DOM utilities
const DOM = {
  select: selector => document.querySelector(selector),
  selectAll: selector => [...document.querySelectorAll(selector)],
  exists: selector => document.querySelector(selector) !== null,
  getAttribute: (element, attr) => element?.getAttribute(attr)
};

/**
 * ECharts Initialization - MODERNIZED FROM JQUERY
 * Detects EChart elements and initializes them automatically
 */
export function initializeECharts() {
  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts library not available');
    return;
  }

  // Check if there are any ECharts elements on the page - MODERNIZED
  const echartElements = DOM.selectAll('[id^="echart"]');
  if (echartElements.length === 0) {
    return;
  }

  console.log(`🎯 Initializing ${echartElements.length} ECharts...`);

  try {
    // Initialize specific chart types
    initializePieCharts();
    initializeBarCharts();
    initializeLineCharts();
    initializeScatterCharts();
    initializeMapCharts();
    initializeGaugeCharts();
    initializeMixedCharts();

    // Setup responsive handling for all ECharts
    setupEChartsResize();

    console.log('✅ All ECharts initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize ECharts:', error);
  }
}

/**
 * Pie Charts - MODERNIZED FROM JQUERY
 */
function initializePieCharts() {
  // Mini Pie Chart
  if (DOM.exists('#echart_mini_pie')) {
    const miniPieChart = echarts.init(DOM.select('#echart_mini_pie'));
    miniPieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: 'Traffic Sources',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 335, name: 'Direct' },
            { value: 310, name: 'Email' },
            { value: 274, name: 'Affiliate' },
            { value: 235, name: 'Video' },
            { value: 400, name: 'Search' }
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
  }

  // Regular Pie Chart
  if (DOM.exists('#echart_pie')) {
    const pieChart = echarts.init(DOM.select('#echart_pie'));
    pieChart.setOption({
      title: { text: 'Website Traffic Sources', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['Direct', 'Email', 'Affiliate', 'Video', 'Search']
      },
      series: [
        {
          name: 'Traffic Sources',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          data: [
            { value: 335, name: 'Direct' },
            { value: 310, name: 'Email' },
            { value: 274, name: 'Affiliate' },
            { value: 235, name: 'Video' },
            { value: 400, name: 'Search' }
          ]
        }
      ]
    });
  }

  // Donut Chart
  if (DOM.exists('#echart_donut')) {
    const donutChart = echarts.init(DOM.select('#echart_donut'));
    donutChart.setOption({
      title: { text: 'User Demographics', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: 10, left: 'center' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          data: [
            { value: 26, name: '18-24 years' },
            { value: 32, name: '25-34 years' },
            { value: 24, name: '35-44 years' },
            { value: 18, name: '45+ years' }
          ],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    });
  }
}

/**
 * Bar Charts - MODERNIZED FROM JQUERY
 */
function initializeBarCharts() {
  // Horizontal Bar Chart - MODERNIZED
  if (DOM.exists('#echart_bar_horizontal')) {
    const hBarChart = echarts.init(DOM.select('#echart_bar_horizontal'));
    hBarChart.setOption({
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
            color: function (params) {
              const colors = [
                '#26B99A',
                '#3498DB',
                '#E74C3C',
                '#F39C12',
                '#9B59B6',
                '#1ABC9C',
                '#E67E22',
                '#34495E'
              ];
              return colors[params.dataIndex];
            }
          }
        }
      ]
    });
  }

  // Vertical Bar Chart
  if (DOM.exists('#echart_bar_vertical')) {
    const vBarChart = echarts.init(DOM.select('#echart_bar_vertical'));
    vBarChart.setOption({
      title: { text: 'Monthly Sales', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1200, 1100, 1400, 1300, 1600],
          itemStyle: { color: '#26B99A' }
        }
      ]
    });
  }
}

/**
 * Line Charts - MODERNIZED FROM JQUERY
 */
function initializeLineCharts() {
  if (DOM.exists('#echart_line')) {
    const lineChart = echarts.init(DOM.select('#echart_line'));
    lineChart.setOption({
      title: { text: 'Website Analytics', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 10 },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Page Views',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320, 1200, 1100, 1400, 1300, 1600],
          smooth: true,
          itemStyle: { color: '#26B99A' }
        },
        {
          name: 'Unique Visitors',
          type: 'line',
          data: [620, 732, 701, 734, 1090, 1130, 1120, 1000, 900, 1200, 1100, 1400],
          smooth: true,
          itemStyle: { color: '#3498DB' }
        }
      ]
    });
  }
}

/**
 * Scatter Chart - MODERNIZED FROM JQUERY
 */
function initializeScatterCharts() {
  if (DOM.exists('#echart_scatter')) {
    const scatterChart = echarts.init(DOM.select('#echart_scatter'));

    // Generate scatter data
    const scatterData = [];
    for (let i = 0; i < 100; i++) {
      scatterData.push([Math.random() * 100, Math.random() * 100, Math.random() * 50 + 10]);
    }

    scatterChart.setOption({
      title: { text: 'Customer Segmentation', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: 'Value: [{c}]'
      },
      xAxis: { name: 'Purchase Frequency' },
      yAxis: { name: 'Average Order Value' },
      series: [
        {
          name: 'Customers',
          type: 'scatter',
          data: scatterData,
          symbolSize: function (data) {
            return data[2];
          },
          itemStyle: {
            color: '#26B99A',
            opacity: 0.7
          }
        }
      ]
    });
  }
}

/**
 * Map Charts - MODERNIZED FROM JQUERY
 */
function initializeMapCharts() {
  if (DOM.exists('#echart_world_map')) {
    const worldMapChart = echarts.init(DOM.select('#echart_world_map'));

    // Global user distribution data
    const globalData = [
      { name: 'United States', value: 2300 },
      { name: 'China', value: 1800 },
      { name: 'Japan', value: 1200 },
      { name: 'Germany', value: 1000 },
      { name: 'United Kingdom', value: 800 }
    ];

    worldMapChart.setOption({
      title: {
        text: 'Global User Distribution',
        left: 'center',
        textStyle: { fontSize: 16 }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} users'
      },
      visualMap: {
        min: 0,
        max: 2500,
        left: 'left',
        top: 'bottom',
        text: ['High', 'Low'],
        calculable: true,
        inRange: {
          color: ['#e0f3f1', '#26B99A']
        }
      },
      series: [
        {
          name: 'User Distribution',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: globalData.map(item => ({
            name: item.name,
            value: [Math.random() * 360 - 180, Math.random() * 180 - 90, item.value]
          })),
          symbolSize: function (val) {
            return Math.max(val[2] / 100, 8);
          },
          itemStyle: {
            color: '#26B99A',
            shadowBlur: 10,
            shadowColor: 'rgba(38, 185, 154, 0.5)'
          }
        }
      ],
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#f3f3f3',
          borderColor: '#999'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#e6f3ff'
          }
        }
      }
    });
  }
}

/**
 * Gauge Charts - MODERNIZED FROM JQUERY
 */
function initializeGaugeCharts() {
  const gaugeConfigs = [
    { id: 'echart_gauge1', value: 75, title: 'Performance Score' },
    { id: 'echart_gauge2', value: 60, title: 'User Satisfaction' },
    { id: 'goal_progress_gauge', value: 85, title: 'Goal Progress' }
  ];

  gaugeConfigs.forEach(config => {
    if (DOM.exists(`#${config.id}`)) {
      const gaugeChart = echarts.init(DOM.select(`#${config.id}`));
      gaugeChart.setOption({
        series: [
          {
            name: config.title,
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            data: [{ value: config.value, name: config.title }],
            axisLine: {
              lineStyle: {
                width: 8,
                color: [
                  [0.3, '#E74C3C'],
                  [0.7, '#F39C12'],
                  [1, '#26B99A']
                ]
              }
            },
            pointer: {
              icon: 'circle',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-60%'],
              itemStyle: { color: 'auto' }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: {
              offsetCenter: [0, '-20%'],
              fontSize: 14
            },
            detail: {
              fontSize: 24,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value) + '%';
              },
              color: 'auto'
            }
          }
        ]
      });
    }
  });
}

/**
 * Mixed Charts - MODERNIZED FROM JQUERY
 */
function initializeMixedCharts() {
  if (DOM.exists('#echart_mixed')) {
    const mixedChart = echarts.init(DOM.select('#echart_mixed'));
    mixedChart.setOption({
      title: { text: 'Sales & Revenue Overview', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { bottom: 10 },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: [
        { type: 'value', name: 'Sales', position: 'left' },
        { type: 'value', name: 'Revenue', position: 'right' }
      ],
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: [320, 332, 301, 334, 390, 330],
          itemStyle: { color: '#26B99A' }
        },
        {
          name: 'Revenue',
          type: 'line',
          yAxisIndex: 1,
          data: [220, 182, 191, 234, 290, 330],
          smooth: true,
          itemStyle: { color: '#3498DB' }
        }
      ]
    });
  }
}

/**
 * Setup responsive handling for all ECharts - MODERNIZED FROM JQUERY
 */
function setupEChartsResize() {
  const echartElements = DOM.selectAll('[id^="echart"]');

  // Store chart instances for resize handling
  const chartInstances = [];
  echartElements.forEach(element => {
    // Get ECharts instance if it exists
    const instance = echarts.getInstanceByDom(element);
    if (instance) {
      chartInstances.push(instance);
    }
  });

  // Handle window resize - MODERNIZED FROM JQUERY
  window.addEventListener('resize', function () {
    chartInstances.forEach(chart => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    });
  });

  console.log(`✅ Responsive handling setup for ${chartInstances.length} ECharts`);
}

/**
 * ECharts Utility Functions - MODERNIZED
 */
export const EChartsUtils = {
  /**
   * Get chart instance by ID - MODERNIZED FROM JQUERY
   */
  getChart(chartId) {
    const element = DOM.select(`#${chartId}`);
    return element ? echarts.getInstanceByDom(element) : null;
  },

  /**
   * Update chart data
   */
  updateChart(chartId, newOption) {
    const chart = this.getChart(chartId);
    if (chart) {
      chart.setOption(newOption, true);
      return true;
    }
    return false;
  },

  /**
   * Export chart as image
   */
  exportChart(chartId, options = {}) {
    const chart = this.getChart(chartId);
    if (chart) {
      const dataURL = chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
        ...options
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `${chartId}.png`;
      link.href = dataURL;
      link.click();
      return true;
    }
    return false;
  },

  /**
   * Dispose all charts - MODERNIZED FROM JQUERY
   */
  disposeAllCharts() {
    DOM.selectAll('[id^="echart"]').forEach(element => {
      const instance = echarts.getInstanceByDom(element);
      if (instance) {
        instance.dispose();
      }
    });
    console.log('✅ All ECharts disposed');
  }
};

// Auto-initialize ECharts when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if ECharts is available and elements exist
    if (typeof echarts !== 'undefined') {
      const echartElements = DOM.selectAll('[id^="echart"]');
      if (echartElements.length > 0) {
        initializeECharts();
      }
    }
  });
}
