/**
 * Dashboard Pages Module
 * Page-specific functionality extracted from init.js
 * Modernized from jQuery to vanilla JavaScript
 */

// Modern DOM utilities
const DOM = {
  select: selector => document.querySelector(selector),
  selectAll: selector => [...document.querySelectorAll(selector)],
  exists: selector => document.querySelector(selector) !== null,
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className)
};

/**
 * Index2 Dashboard - Weekly Summary Charts
 * MODERNIZED FROM JQUERY - was using $('#element').length
 */
export function initializeIndex2() {
  // Only run on index2 page
  if (!document.body.classList.contains('page-index2') && !DOM.exists('#weekly_summary')) {
    return;
  }

  console.log('🎯 Initializing Index2 dashboard...');

  try {
    initializeWeeklySummaryChart();
    initializeDailyActivitiesChart();
    console.log('✅ Index2 dashboard initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Index2 dashboard:', error);
  }
}

/**
 * Weekly Summary Chart - MODERNIZED FROM JQUERY
 */
function initializeWeeklySummaryChart() {
  if (!DOM.exists('#weekly_summary')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts not available for weekly summary');
    return;
  }

  const weeklySummaryChart = echarts.init(DOM.select('#weekly_summary'));

  const weeklyData = generateWeeklyData();

  weeklySummaryChart.setOption({
    title: {
      text: 'Weekly Performance Summary',
      left: 'center',
      textStyle: { fontSize: 16, color: '#333' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      bottom: 10,
      data: ['Sales', 'Visitors', 'Orders']
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Sales',
        type: 'line',
        data: weeklyData.sales,
        smooth: true,
        itemStyle: { color: '#26B99A' },
        areaStyle: { opacity: 0.3 }
      },
      {
        name: 'Visitors',
        type: 'line',
        data: weeklyData.visitors,
        smooth: true,
        itemStyle: { color: '#3498DB' },
        areaStyle: { opacity: 0.3 }
      },
      {
        name: 'Orders',
        type: 'bar',
        data: weeklyData.orders,
        itemStyle: { color: '#F39C12' }
      }
    ]
  });

  // Auto-refresh every 30 seconds
  setInterval(() => {
    const newData = generateWeeklyData();
    weeklySummaryChart.setOption({
      series: [{ data: newData.sales }, { data: newData.visitors }, { data: newData.orders }]
    });
  }, 30000);
}

/**
 * Daily Activities Chart
 */
function initializeDailyActivitiesChart() {
  if (!DOM.exists('#daily_activities')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts not available for daily activities');
    return;
  }

  const dailyChart = echarts.init(DOM.select('#daily_activities'));

  dailyChart.setOption({
    title: {
      text: 'Daily Activities',
      left: 'center'
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        data: [
          { value: 35, name: 'Meetings' },
          { value: 25, name: 'Development' },
          { value: 20, name: 'Planning' },
          { value: 20, name: 'Other' }
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

/**
 * Index3 Dashboard - Sales Analytics
 * MODERNIZED FROM JQUERY
 */
export function initializeIndex3() {
  // Only run on index3 page or if specific elements exist
  if (!document.body.classList.contains('page-index3') && !DOM.exists('#sales_overview')) {
    return;
  }

  console.log('🎯 Initializing Index3 sales analytics...');

  try {
    initializeSalesOverviewChart();
    initializeRevenueChart();
    initializeTopProductsChart();
    console.log('✅ Index3 sales analytics initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Index3 dashboard:', error);
  }
}

/**
 * Sales Overview Chart - MODERNIZED FROM JQUERY
 */
function initializeSalesOverviewChart() {
  if (!DOM.exists('#sales_overview')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts not available for sales overview');
    return;
  }

  const salesChart = echarts.init(DOM.select('#sales_overview'));

  const salesData = generateSalesData();

  salesChart.setOption({
    title: {
      text: 'Sales Overview',
      left: 'center',
      textStyle: { fontSize: 18 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          result +=
            param.marker + param.seriesName + ': $' + param.value.toLocaleString() + '<br/>';
        });
        return result;
      }
    },
    legend: {
      bottom: 10,
      data: ['Revenue', 'Profit', 'Expenses']
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}K'
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        data: salesData.revenue,
        smooth: true,
        itemStyle: { color: '#26B99A' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Profit',
        type: 'line',
        data: salesData.profit,
        smooth: true,
        itemStyle: { color: '#3498DB' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Expenses',
        type: 'line',
        data: salesData.expenses,
        smooth: true,
        itemStyle: { color: '#E74C3C' },
        lineStyle: { width: 3 }
      }
    ]
  });
}

/**
 * Revenue Chart with different visualization
 */
function initializeRevenueChart() {
  if (!DOM.exists('#revenue_chart')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    return;
  }

  const revenueChart = echarts.init(DOM.select('#revenue_chart'));

  revenueChart.setOption({
    title: { text: 'Monthly Revenue Breakdown', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: [450, 520, 480, 650],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#26B99A' },
            { offset: 1, color: '#1ABC9C' }
          ])
        },
        barWidth: '60%'
      }
    ]
  });
}

/**
 * Top Products Chart
 */
function initializeTopProductsChart() {
  if (!DOM.exists('#top_products')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    return;
  }

  const topProductsChart = echarts.init(DOM.select('#top_products'));

  topProductsChart.setOption({
    title: { text: 'Top Selling Products', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 1048, name: 'Laptop Pro' },
          { value: 735, name: 'Smartphone X' },
          { value: 580, name: 'Tablet Air' },
          { value: 484, name: 'Smart Watch' },
          { value: 300, name: 'Headphones' }
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

/**
 * Index4 Dashboard - Store Analytics
 * MODERNIZED FROM JQUERY
 */
export function initializeIndex4() {
  // Only run on index4 page or if specific elements exist
  if (!document.body.classList.contains('page-index4') && !DOM.exists('#store_analytics')) {
    return;
  }

  console.log('🎯 Initializing Index4 store analytics...');

  try {
    initializeStoreAnalyticsChart();
    initializeCustomerSegmentChart();
    initializeInventoryChart();
    console.log('✅ Index4 store analytics initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Index4 dashboard:', error);
  }
}

/**
 * Store Analytics Chart - MODERNIZED FROM JQUERY
 */
function initializeStoreAnalyticsChart() {
  if (!DOM.exists('#store_analytics')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts not available for store analytics');
    return;
  }

  const storeChart = echarts.init(DOM.select('#store_analytics'));

  storeChart.setOption({
    title: {
      text: 'Store Performance Analytics',
      left: 'center',
      textStyle: { fontSize: 18 }
    },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 10,
      data: ['Foot Traffic', 'Conversion Rate', 'Average Order Value']
    },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    yAxis: [
      { type: 'value', name: 'Count', position: 'left' },
      { type: 'value', name: 'Percentage', position: 'right', max: 100 }
    ],
    series: [
      {
        name: 'Foot Traffic',
        type: 'bar',
        data: [1200, 1350, 1180, 1420],
        itemStyle: { color: '#26B99A' }
      },
      {
        name: 'Conversion Rate',
        type: 'line',
        yAxisIndex: 1,
        data: [12.5, 15.2, 11.8, 16.3],
        smooth: true,
        itemStyle: { color: '#3498DB' }
      },
      {
        name: 'Average Order Value',
        type: 'line',
        data: [85, 92, 78, 98],
        smooth: true,
        itemStyle: { color: '#F39C12' }
      }
    ]
  });
}

/**
 * Customer Segment Chart
 */
function initializeCustomerSegmentChart() {
  if (!DOM.exists('#customer_segments')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    return;
  }

  const segmentChart = echarts.init(DOM.select('#customer_segments'));

  segmentChart.setOption({
    title: { text: 'Customer Segments', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['30%', '70%'],
        data: [
          { value: 40, name: 'Regular Customers' },
          { value: 25, name: 'Premium Members' },
          { value: 20, name: 'New Customers' },
          { value: 15, name: 'VIP Customers' }
        ],
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ]
  });
}

/**
 * Inventory Chart
 */
function initializeInventoryChart() {
  if (!DOM.exists('#inventory_status')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    return;
  }

  const inventoryChart = echarts.init(DOM.select('#inventory_status'));

  inventoryChart.setOption({
    title: { text: 'Inventory Status', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Stock Level',
        type: 'bar',
        data: [450, 280, 180, 320, 210],
        itemStyle: {
          color: function (params) {
            const colors = ['#26B99A', '#3498DB', '#F39C12', '#E74C3C', '#9B59B6'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  });
}

/**
 * Sidebar Gauges - MODERNIZED FROM JQUERY
 * Profile completion and other gauge indicators
 */
export function initializeSidebarGauges() {
  // Only initialize if gauge elements exist
  const gaugeElements = DOM.selectAll('.sidebar-gauge, [data-gauge]');
  if (gaugeElements.length === 0) {
    return;
  }

  console.log('🎯 Initializing sidebar gauges...');

  try {
    initializeProfileCompletionGauge();
    initializeSystemHealthGauges();
    console.log('✅ Sidebar gauges initialized');
  } catch (error) {
    console.error('❌ Failed to initialize sidebar gauges:', error);
  }
}

/**
 * Profile Completion Gauge - MODERNIZED FROM JQUERY
 */
function initializeProfileCompletionGauge() {
  if (!DOM.exists('#profile_completion')) {
    return;
  }

  if (typeof echarts === 'undefined') {
    console.warn('⚠️ ECharts not available for profile completion gauge');
    return;
  }

  const profileGauge = echarts.init(DOM.select('#profile_completion'));

  profileGauge.setOption({
    series: [
      {
        name: 'Profile Completion',
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        data: [{ value: 75, name: 'Completed' }],
        axisLine: {
          lineStyle: {
            width: 8,
            color: [
              [0.5, '#E74C3C'],
              [0.8, '#F39C12'],
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
          fontSize: 14,
          color: '#333'
        },
        detail: {
          fontSize: 20,
          offsetCenter: [0, '10%'],
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

/**
 * System Health Gauges
 */
function initializeSystemHealthGauges() {
  const healthGauges = [
    { id: 'cpu_gauge', value: 65, title: 'CPU Usage' },
    { id: 'memory_gauge', value: 78, title: 'Memory Usage' },
    { id: 'disk_gauge', value: 45, title: 'Disk Usage' }
  ];

  healthGauges.forEach(config => {
    if (!DOM.exists(`#${config.id}`)) {
      return;
    }

    if (typeof echarts === 'undefined') {
      return;
    }

    const gauge = echarts.init(DOM.select(`#${config.id}`));

    gauge.setOption({
      series: [
        {
          name: config.title,
          type: 'gauge',
          radius: '90%',
          min: 0,
          max: 100,
          data: [{ value: config.value, name: config.title }],
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.7, '#26B99A'],
                [0.9, '#F39C12'],
                [1, '#E74C3C']
              ]
            }
          },
          pointer: {
            itemStyle: { color: 'auto' }
          },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          title: {
            fontSize: 12,
            color: '#666'
          },
          detail: {
            fontSize: 16,
            valueAnimation: true,
            formatter: '{value}%',
            color: 'auto'
          }
        }
      ]
    });

    // Simulate real-time updates
    setInterval(() => {
      const newValue = Math.max(10, Math.min(95, config.value + (Math.random() - 0.5) * 20));
      gauge.setOption({
        series: [
          {
            data: [{ value: newValue, name: config.title }]
          }
        ]
      });
    }, 5000);
  });
}

/**
 * Data Generation Utilities
 */
function generateWeeklyData() {
  return {
    sales: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50),
    visitors: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) + 100),
    orders: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 20)
  };
}

function generateSalesData() {
  return {
    revenue: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 300),
    profit: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 150),
    expenses: Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 100)
  };
}

// Auto-initialize based on page context
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize based on page class or element presence
    initializeIndex2();
    initializeIndex3();
    initializeIndex4();
    initializeSidebarGauges();
  });
}
