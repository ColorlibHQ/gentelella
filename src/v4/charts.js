// Gentelella 2026 v4 — ECharts integration
// Dynamic-imports ECharts only when a [data-chart] element is present on the
// page, keeping pages without charts free of the ~400kB cost.

const tokens = () => {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--primary').trim(),
    primaryDk: cs.getPropertyValue('--primary-dk').trim(),
    azure: cs.getPropertyValue('--azure').trim(),
    blue: cs.getPropertyValue('--blue').trim(),
    yellow: cs.getPropertyValue('--yellow').trim(),
    green: cs.getPropertyValue('--green').trim(),
    red: cs.getPropertyValue('--red').trim(),
    purple: cs.getPropertyValue('--purple').trim(),
    text: cs.getPropertyValue('--text').trim(),
    textMuted: cs.getPropertyValue('--text-muted').trim(),
    borderLight: cs.getPropertyValue('--border-color-light').trim(),
    bgSurface: cs.getPropertyValue('--bg-surface').trim()
  };
};

const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

function baseOption(t) {
  return {
    textStyle: { fontFamily, fontSize: 11, color: t.textMuted },
    grid: { left: 36, right: 12, top: 16, bottom: 28, containLabel: false },
    tooltip: {
      backgroundColor: t.bgSurface,
      borderColor: t.borderLight,
      borderWidth: 1,
      padding: [8, 10],
      textStyle: { color: t.text, fontSize: 12, fontFamily },
      extraCssText: 'box-shadow: 0 2px 8px rgba(30,38,51,0.08); border-radius: 6px;'
    }
  };
}

function dashboardNetwork(echarts, el, t) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sessions = [420, 580, 510, 720, 680, 790, 752];
  const pageviews = [320, 460, 410, 580, 540, 660, 620];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: t.borderLight } } },
    legend: { show: false },
    xAxis: {
      type: 'category',
      data: days,
      boundaryGap: false,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: 'Sessions',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        data: sessions,
        lineStyle: { color: t.primary, width: 2 },
        itemStyle: { color: t.primary, borderColor: t.bgSurface, borderWidth: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: t.primary + '33' },
            { offset: 1, color: t.primary + '00' }
          ])
        }
      },
      {
        name: 'Page views',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: pageviews,
        lineStyle: { color: t.azure, width: 1.5, type: 'dashed' },
        itemStyle: { color: t.azure }
      }
    ]
  });
  return chart;
}

function revenueLine(echarts, el, t) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const rev = [12400, 14200, 15600, 17800, 19200, 21500, 23100, 24800, 26200, 27900, 29400, 30100];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis', valueFormatter: (v) => '$' + v.toLocaleString() },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10, formatter: (v) => '$' + (v / 1000) + 'k' },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [{
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: rev,
      lineStyle: { color: t.primary, width: 2 },
      itemStyle: { color: t.primary },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: t.primary + '40' },
          { offset: 1, color: t.primary + '00' }
        ])
      }
    }]
  });
  return chart;
}

function salesBar(echarts, el, t) {
  const channels = ['Web', 'Mobile', 'Email', 'Social', 'Direct', 'Partner'];
  const values = [82, 96, 64, 45, 88, 58];
  const colors = [t.primary, t.azure, t.yellow, t.green, t.purple, t.red];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    grid: { ...baseOption(t).grid, left: 28 },
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: channels,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors[i], borderRadius: [4, 4, 0, 0] } })),
      barWidth: '52%'
    }]
  });
  return chart;
}

function trafficDonut(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: {
      ...baseOption(t).tooltip,
      trigger: 'item',
      formatter: '{b}: {d}%'
    },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['62%', '88%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: [
        { value: 40, name: 'Organic', itemStyle: { color: t.primary, borderColor: t.bgSurface, borderWidth: 2 } },
        { value: 20, name: 'Direct',  itemStyle: { color: t.azure,   borderColor: t.bgSurface, borderWidth: 2 } },
        { value: 15, name: 'Referral',itemStyle: { color: t.yellow,  borderColor: t.bgSurface, borderWidth: 2 } },
        { value: 12, name: 'Social',  itemStyle: { color: t.purple,  borderColor: t.bgSurface, borderWidth: 2 } },
        { value: 13, name: 'Email',   itemStyle: { color: t.green,   borderColor: t.bgSurface, borderWidth: 2 } }
      ]
    }]
  });
  return chart;
}

function donut(echarts, el, t, segments, _totalLabel) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: {
      ...baseOption(t).tooltip,
      trigger: 'item',
      formatter: '{b}: {d}%'
    },
    legend: { show: false },
    series: [{
      type: 'pie',
      radius: ['62%', '88%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: segments.map(([name, value, color]) => ({
        name,
        value,
        itemStyle: { color: t[color] || color, borderColor: t.bgSurface, borderWidth: 2 }
      }))
    }]
  });
  return chart;
}

const deviceUsage = (echarts, el, t) => donut(echarts, el, t, [
  ['iOS',     30, 'primary'],
  ['Android', 25, 'azure'],
  ['Desktop', 20, 'yellow'],
  ['Tablet',  15, 'purple'],
  ['Other',   10, 'red']
]);

const browsers = (echarts, el, t) => donut(echarts, el, t, [
  ['Chrome',  62, 'primary'],
  ['Safari',  25, 'azure'],
  ['Firefox', 13, 'yellow']
]);

// ────────────────────────
//  Stacked area — multi-series stacked with smooth fills
// ────────────────────────
function stackedArea(echarts, el, t) {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const series = [
    { name: 'Pro',      color: t.primary, data: [12, 14, 15, 18, 19, 22, 23, 25, 26, 28, 29, 30] },
    { name: 'Business', color: t.azure,   data: [8, 9, 10, 12, 13, 14, 16, 18, 19, 20, 22, 24] },
    { name: 'Starter',  color: t.yellow,  data: [4, 5, 5, 6, 7, 7, 8, 8, 9, 9, 10, 11] }
  ];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis' },
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      itemGap: 16,
      textStyle: { color: t.textMuted, fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8
    },
    grid: { ...baseOption(t).grid, bottom: 36 },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10, formatter: '{value}k' },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      stack: 'total',
      smooth: true,
      showSymbol: false,
      lineStyle: { color: s.color, width: 1.5 },
      itemStyle: { color: s.color },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: s.color + '55' },
          { offset: 1, color: s.color + '08' }
        ])
      },
      data: s.data
    }))
  });
  return chart;
}

// ────────────────────────
//  Horizontal bar — top categories ranked
// ────────────────────────
function horizontalBar(echarts, el, t) {
  const items = [
    ['United States', 4280, t.primary],
    ['Germany',       3140, t.azure],
    ['United Kingdom', 2680, t.purple],
    ['Japan',         1920, t.yellow],
    ['Brazil',        1430, t.green],
    ['Australia',     1180, t.cyan],
    ['Canada',         960, t.red]
  ];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v) => v.toLocaleString() + ' users' },
    grid: { ...baseOption(t).grid, left: 90, right: 24 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: items.map((d) => d[0]).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: t.text, fontSize: 11.5 }
    },
    series: [{
      type: 'bar',
      barWidth: '52%',
      data: items.map((d) => ({ value: d[1], itemStyle: { color: d[2], borderRadius: [0, 4, 4, 0] } })).reverse()
    }]
  });
  return chart;
}

// ────────────────────────
//  Mixed bar+line — bars with a trend line on a secondary axis
// ────────────────────────
function mixedBarLine(echarts, el, t) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const orders = [240, 312, 285, 360, 420, 395, 460, 510];
  const aov = [82, 88, 86, 92, 95, 94, 99, 104];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis' },
    legend: {
      data: ['Orders', 'Avg order value'],
      bottom: 0, itemGap: 16, icon: 'circle', itemWidth: 8, itemHeight: 8,
      textStyle: { color: t.textMuted, fontSize: 11 }
    },
    grid: { ...baseOption(t).grid, right: 44, bottom: 36 },
    xAxis: {
      type: 'category', data: months,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value', name: 'Orders',
        nameTextStyle: { color: t.textMuted, fontSize: 10 },
        splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
        axisLabel: { color: t.textMuted, fontSize: 10 },
        axisLine: { show: false }, axisTick: { show: false }
      },
      {
        type: 'value', name: 'AOV $',
        nameTextStyle: { color: t.textMuted, fontSize: 10 },
        splitLine: { show: false },
        axisLabel: { color: t.textMuted, fontSize: 10, formatter: '${value}' },
        axisLine: { show: false }, axisTick: { show: false }
      }
    ],
    series: [
      {
        name: 'Orders', type: 'bar', yAxisIndex: 0, data: orders,
        barWidth: '40%',
        itemStyle: { color: t.azure, borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Avg order value', type: 'line', yAxisIndex: 1, data: aov,
        smooth: true, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: t.primary, width: 2 },
        itemStyle: { color: t.primary, borderColor: t.bgSurface, borderWidth: 2 }
      }
    ]
  });
  return chart;
}

// ────────────────────────
//  Radar — multi-axis comparison of two series
// ────────────────────────
function radar(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, trigger: 'item' },
    legend: {
      data: ['v3', 'v4'],
      bottom: 0, itemGap: 16, icon: 'circle', itemWidth: 8, itemHeight: 8,
      textStyle: { color: t.textMuted, fontSize: 11 }
    },
    radar: {
      indicator: [
        { name: 'Performance', max: 100 },
        { name: 'Bundle size', max: 100 },
        { name: 'A11y',        max: 100 },
        { name: 'DX',          max: 100 },
        { name: 'Polish',      max: 100 },
        { name: 'Coverage',    max: 100 }
      ],
      center: ['50%', '46%'],
      radius: '64%',
      splitNumber: 4,
      axisName: { color: t.textMuted, fontSize: 11 },
      splitLine: { lineStyle: { color: t.borderLight } },
      splitArea: { areaStyle: { color: ['transparent'] } },
      axisLine: { lineStyle: { color: t.borderLight } }
    },
    series: [{
      type: 'radar',
      symbol: 'circle', symbolSize: 5,
      data: [
        {
          name: 'v3',
          value: [72, 58, 65, 70, 60, 80],
          lineStyle: { color: t.azure, width: 1.5, type: 'dashed' },
          itemStyle: { color: t.azure },
          areaStyle: { color: t.azure + '22' }
        },
        {
          name: 'v4',
          value: [94, 90, 86, 92, 89, 95],
          lineStyle: { color: t.primary, width: 2 },
          itemStyle: { color: t.primary, borderColor: t.bgSurface, borderWidth: 2 },
          areaStyle: { color: t.primary + '33' }
        }
      ]
    }]
  });
  return chart;
}

// ────────────────────────
//  Gauge — single KPI with progress arc
// ────────────────────────
function gauge(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      progress: { show: true, width: 14, itemStyle: { color: t.primary } },
      axisLine: { lineStyle: { width: 14, color: [[1, t.borderLight]] } },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, 0],
        formatter: '{value}%',
        color: t.text,
        fontSize: 28,
        fontWeight: 700,
        fontFamily
      },
      data: [{ value: 78 }]
    }]
  });
  return chart;
}

// ────────────────────────
//  Scatter — bubble plot with sized points
// ────────────────────────
function scatter(echarts, el, t) {
  // [hours-spent, retention-pct, MAU-thousands]
  const data = [
    [2.1, 32, 6],   [3.4, 41, 12],  [4.8, 56, 22],  [6.1, 64, 32],
    [7.2, 71, 44],  [8.6, 78, 58],  [10.2, 84, 72], [11.5, 89, 88],
    [4.1, 38, 14],  [5.8, 51, 28],  [7.9, 66, 48],  [9.1, 74, 60]
  ];
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: {
      ...baseOption(t).tooltip,
      formatter: (p) => `${p.value[2]}k MAU<br>${p.value[0]}h/wk · ${p.value[1]}% retention`
    },
    grid: { ...baseOption(t).grid, left: 40, right: 24 },
    xAxis: {
      type: 'value',
      name: 'Hours/week',
      nameTextStyle: { color: t.textMuted, fontSize: 10 },
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'Retention',
      nameTextStyle: { color: t.textMuted, fontSize: 10 },
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10, formatter: '{value}%' },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'scatter',
      data,
      symbolSize: (val) => Math.sqrt(val[2]) * 3.4,
      itemStyle: {
        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
          { offset: 0, color: t.primary + 'ff' },
          { offset: 1, color: t.primary + '55' }
        ]),
        borderColor: t.bgSurface,
        borderWidth: 1
      }
    }]
  });
  return chart;
}

// ────────────────────────
//  Heatmap — week × hour activity
// ────────────────────────
function heatmap(echarts, el, t) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = ['0', '3', '6', '9', '12', '15', '18', '21'];
  const data = [];
  for (let d = 0; d < days.length; d += 1) {
    for (let h = 0; h < hours.length; h += 1) {
      // Synthesize a believable activity surface
      const hourPeak = 1 - Math.abs(h - 4) / 6; // peak around index 4 (~12:00)
      const dayWeight = d >= 1 && d <= 5 ? 1 : 0.45; // weekdays > weekends
      const noise = 0.55 + Math.random() * 0.45;
      const v = Math.max(0, Math.round(hourPeak * dayWeight * noise * 100));
      data.push([h, d, v]);
    }
  }
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: {
      ...baseOption(t).tooltip,
      formatter: (p) => `${days[p.value[1]]} ${hours[p.value[0]]}:00<br><strong>${p.value[2]}</strong> events`
    },
    grid: { left: 50, right: 18, top: 12, bottom: 30, containLabel: false },
    xAxis: {
      type: 'category', data: hours,
      splitArea: { show: true },
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10, formatter: '{value}:00' }
    },
    yAxis: {
      type: 'category', data: days,
      splitArea: { show: true },
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    visualMap: {
      min: 0, max: 100,
      show: false,
      inRange: { color: [t.borderLight, t.primary] }
    },
    series: [{
      type: 'heatmap',
      data,
      label: { show: false },
      itemStyle: { borderColor: t.bgSurface, borderWidth: 2 },
      emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.18)' } }
    }]
  });
  return chart;
}

// ────────────────────────
//  Funnel — conversion stages
// ────────────────────────
function funnel(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: 24, right: 24, top: 12, bottom: 12,
      width: 'auto',
      min: 0, max: 100,
      gap: 2,
      label: {
        show: true, position: 'inside', color: '#fff',
        fontSize: 12, fontWeight: 600, fontFamily,
        formatter: '{b}: {c}'
      },
      labelLine: { show: false },
      itemStyle: { borderColor: t.bgSurface, borderWidth: 1 },
      data: [
        { value: 100, name: 'Visitors',  itemStyle: { color: t.primary } },
        { value: 62,  name: 'Sign-ups',  itemStyle: { color: t.azure } },
        { value: 38,  name: 'Activated', itemStyle: { color: t.purple } },
        { value: 18,  name: 'Trial',     itemStyle: { color: t.yellow } },
        { value: 9,   name: 'Paid',      itemStyle: { color: t.green } }
      ]
    }]
  });
  return chart;
}

// ────────────────────────
//  Candlestick — OHLC market data
// ────────────────────────
function candlestick(echarts, el, t) {
  // [open, close, low, high]
  const data = [
    [120, 132, 118, 135], [132, 128, 125, 138], [128, 142, 126, 145],
    [142, 140, 135, 148], [140, 156, 138, 158], [156, 162, 152, 168],
    [162, 158, 154, 166], [158, 172, 156, 175], [172, 168, 164, 178],
    [168, 184, 166, 188], [184, 180, 176, 190], [180, 196, 178, 200],
    [196, 188, 184, 202], [188, 204, 186, 208]
  ];
  const days = data.map((_, i) => `D${i + 1}`);
  const chart = echarts.init(el);
  chart.setOption({
    ...baseOption(t),
    tooltip: { ...baseOption(t).tooltip, trigger: 'axis', axisPointer: { type: 'cross' } },
    grid: { ...baseOption(t).grid, left: 40, right: 24 },
    xAxis: {
      type: 'category', data: days,
      axisLine: { lineStyle: { color: t.borderLight } },
      axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'value', scale: true,
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLabel: { color: t.textMuted, fontSize: 10, formatter: '${value}' },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'candlestick',
      data,
      itemStyle: {
        color: t.green,                 // bullish fill
        color0: t.red,                  // bearish fill
        borderColor: t.green,
        borderColor0: t.red
      }
    }]
  });
  return chart;
}

// ────────────────────────
//  Polar bar — circular bar/categorical
// ────────────────────────
function polarBar(echarts, el, t) {
  const data = [78, 64, 92, 56, 71, 85];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const colors = [t.primary, t.azure, t.purple, t.yellow, t.green, t.red];
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, formatter: '{b}: {c}' },
    polar: { radius: ['28%', '78%'], center: ['50%', '52%'] },
    radiusAxis: { max: 100, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false } },
    angleAxis: {
      type: 'category', data: labels,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 11 },
      startAngle: 90
    },
    series: [{
      type: 'bar',
      data: data.map((v, i) => ({ value: v, itemStyle: { color: colors[i % colors.length], borderRadius: [4, 4, 0, 0] } })),
      coordinateSystem: 'polar',
      barCategoryGap: '20%'
    }]
  });
  return chart;
}

// ────────────────────────
//  Treemap — hierarchical proportional view
// ────────────────────────
function treemap(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, formatter: (p) => `${p.name}: ${p.value.toLocaleString()}` },
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: { show: true, color: '#fff', fontSize: 11, fontWeight: 600, fontFamily },
      itemStyle: { borderColor: t.bgSurface, borderWidth: 2, gapWidth: 2 },
      levels: [{
        itemStyle: { borderColor: t.bgSurface, borderWidth: 2, gapWidth: 2 }
      }],
      data: [
        { name: 'SaaS · Pro',       value: 4280, itemStyle: { color: t.primary } },
        { name: 'SaaS · Business',  value: 3140, itemStyle: { color: t.primaryDk } },
        { name: 'SaaS · Starter',   value: 1180, itemStyle: { color: t.azure } },
        { name: 'Marketplace',      value: 2680, itemStyle: { color: t.purple } },
        { name: 'Services',         value: 1920, itemStyle: { color: t.yellow } },
        { name: 'Add-ons',          value: 1430, itemStyle: { color: t.green } },
        { name: 'Training',         value: 960,  itemStyle: { color: t.cyan } },
        { name: 'Misc',             value: 540,  itemStyle: { color: t.red } }
      ]
    }]
  });
  return chart;
}

// ────────────────────────
//  Sankey — flow diagram
// ────────────────────────
function sankey(echarts, el, t) {
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, trigger: 'item' },
    series: [{
      type: 'sankey',
      left: 12, right: 100, top: 12, bottom: 12,
      nodeWidth: 14,
      nodeGap: 12,
      data: [
        { name: 'Search',   itemStyle: { color: t.primary } },
        { name: 'Direct',   itemStyle: { color: t.azure } },
        { name: 'Social',   itemStyle: { color: t.purple } },
        { name: 'Sign-up',  itemStyle: { color: t.yellow } },
        { name: 'Trial',    itemStyle: { color: t.green } },
        { name: 'Paid',     itemStyle: { color: t.primaryDk } },
        { name: 'Churned',  itemStyle: { color: t.red } }
      ],
      links: [
        { source: 'Search',  target: 'Sign-up', value: 4200 },
        { source: 'Direct',  target: 'Sign-up', value: 1800 },
        { source: 'Social',  target: 'Sign-up', value: 1100 },
        { source: 'Sign-up', target: 'Trial',   value: 4400 },
        { source: 'Sign-up', target: 'Churned', value: 2700 },
        { source: 'Trial',   target: 'Paid',    value: 1850 },
        { source: 'Trial',   target: 'Churned', value: 2550 }
      ],
      label: { color: t.text, fontSize: 11, fontFamily },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.55 },
      emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.9 } }
    }]
  });
  return chart;
}

// ────────────────────────
//  Calendar heatmap — GitHub-contribution-style year view
// ────────────────────────
function calendarHeatmap(echarts, el, t) {
  // Build a year of synthetic activity ending today.
  const today = new Date();
  const start = new Date(today);
  start.setMonth(start.getMonth() - 11);
  start.setDate(1);
  const data = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    const wd = dow >= 1 && dow <= 5 ? 1 : 0.4;
    const v = Math.max(0, Math.round(wd * (Math.random() * 100)));
    data.push([d.toISOString().slice(0, 10), v]);
  }
  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: { ...baseOption(t).tooltip, formatter: (p) => `${p.value[0]}: ${p.value[1]} contributions` },
    visualMap: {
      min: 0, max: 100,
      show: false,
      inRange: { color: [t.borderLight, t.primary, t.primaryDk] }
    },
    calendar: {
      top: 30, left: 24, right: 24, bottom: 12,
      cellSize: ['auto', 14],
      range: [start.toISOString().slice(0, 7), today.toISOString().slice(0, 10)],
      itemStyle: { color: t.bgSurfaceSecondary || t.borderLight, borderColor: t.bgSurface, borderWidth: 2 },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: { color: t.textMuted, fontSize: 10, fontFamily },
      dayLabel: { color: t.textMuted, fontSize: 10, fontFamily, firstDay: 1 }
    },
    series: { type: 'heatmap', coordinateSystem: 'calendar', data }
  });
  return chart;
}

// ────────────────────────
//  Gantt — project timeline (custom series on a time axis)
// ────────────────────────
function gantt(echarts, el, t) {
  const today = new Date();
  const day = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.getTime(); };
  // Each row: [trackIndex, start, end, name, color]
  const rows = [
    [0, day(-12), day(-2),  'Discovery & research', t.azure],
    [1, day(-8),  day(8),   'Design system v4',     t.primary],
    [2, day(-3),  day(14),  'Build inbox',          t.purple],
    [3, day(2),   day(10),  'Build kanban',         t.yellow],
    [4, day(7),   day(20),  'Charts gallery',       t.green],
    [5, day(14),  day(28),  'Theme generator',      t.red],
    [6, day(20),  day(35),  'PWA + screenshots',    t.cyan]
  ];
  const tracks = rows.map((r) => r[3]);

  const chart = echarts.init(el);
  chart.setOption({
    textStyle: { fontFamily, color: t.textMuted },
    tooltip: {
      ...baseOption(t).tooltip,
      formatter: (p) => {
        const [, start, end, name] = p.value;
        const f = (ms) => new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `<strong>${name}</strong><br>${f(start)} → ${f(end)}`;
      }
    },
    grid: { left: 132, right: 24, top: 12, bottom: 28, containLabel: false },
    xAxis: {
      type: 'time',
      splitLine: { lineStyle: { color: t.borderLight, type: [4, 3] } },
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: t.textMuted, fontSize: 10 }
    },
    yAxis: {
      type: 'category',
      data: tracks,
      inverse: true,
      axisLine: { show: false }, axisTick: { show: false },
      axisLabel: { color: t.text, fontSize: 11.5, fontFamily }
    },
    series: [{
      type: 'custom',
      renderItem: (params, api) => {
        const idx = api.value(0);
        const startCoord = api.coord([api.value(1), idx]);
        const endCoord = api.coord([api.value(2), idx]);
        const height = api.size([0, 1])[1] * 0.55;
        const x = startCoord[0];
        const y = startCoord[1] - height / 2;
        const width = endCoord[0] - startCoord[0];
        return {
          type: 'rect',
          shape: { x, y, width, height, r: 4 },
          style: { fill: api.value(4) }
        };
      },
      encode: { x: [1, 2], y: 0, tooltip: [3, 1, 2] },
      data: rows
    }]
  });
  return chart;
}

const charts = {
  'dashboard-network': dashboardNetwork,
  'revenue-line':      revenueLine,
  'sales-bar':         salesBar,
  'traffic-donut':     trafficDonut,
  'device-usage':      deviceUsage,
  'browsers':          browsers,
  'stacked-area':      stackedArea,
  'horizontal-bar':    horizontalBar,
  'mixed-bar-line':    mixedBarLine,
  'radar':             radar,
  'gauge':             gauge,
  'scatter':           scatter,
  'heatmap':           heatmap,
  'funnel':            funnel,
  'candlestick':       candlestick,
  'treemap':           treemap,
  'sankey':            sankey,
  'calendar-heatmap':  calendarHeatmap,
  'gantt':             gantt,
  'polar-bar':         polarBar
};

/**
 * Mount ECharts on every `<div data-chart="…">` on the page. The `data-chart`
 * value selects a registered factory (see `charts` map below — e.g.
 * `revenue-line`, `traffic-donut`). Charts auto-resize on window resize and
 * re-init when the document `data-theme` attribute changes so they pick up
 * fresh CSS-custom-property colors.
 *
 * Lazily imports `echarts/core` + the chart types and components actually used;
 * the import never fires on pages without a matching element.
 * @returns {Promise<void>}
 */
export async function initCharts() {
  const elements = document.querySelectorAll('[data-chart]');
  if (!elements.length) {return;}
  // Show skeleton placeholders while ECharts loads. Removed once each chart
  // mounts. Skipped if the page already pre-renders content inside the host.
  elements.forEach((el) => {
    if (!el.children.length && !el.classList.contains('skeleton')) {
      el.classList.add('skeleton', 'chart-skeleton');
    }
  });

  // Modular import keeps the bundle smaller than the full echarts barrel.
  const [
    echartsCore,
    {
      LineChart, BarChart, PieChart,
      RadarChart, GaugeChart, ScatterChart,
      HeatmapChart, FunnelChart, CandlestickChart,
      TreemapChart, SankeyChart, CustomChart
    },
    {
      GridComponent, TooltipComponent, LegendComponent,
      VisualMapComponent, PolarComponent, CalendarComponent
    },
    { CanvasRenderer }
  ] = await Promise.all([
    import('echarts/core'),
    import('echarts/charts'),
    import('echarts/components'),
    import('echarts/renderers')
  ]);
  echartsCore.use([
    LineChart, BarChart, PieChart,
    RadarChart, GaugeChart, ScatterChart,
    HeatmapChart, FunnelChart, CandlestickChart,
    TreemapChart, SankeyChart, CustomChart,
    GridComponent, TooltipComponent, LegendComponent,
    VisualMapComponent, PolarComponent, CalendarComponent,
    CanvasRenderer
  ]);

  const mounted = []; // { el, factory, instance }

  const buildAll = () => {
    const t = tokens();
    elements.forEach((el) => {
      const factory = charts[el.dataset.chart];
      if (!factory) {return;}
      el.classList.remove('skeleton', 'chart-skeleton');
      mounted.push({ el, factory, instance: factory(echartsCore, el, t) });
    });
  };

  buildAll();

  // Resize all charts on viewport changes.
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => mounted.forEach((m) => m.instance.resize()), 120);
  });

  // Rebuild all charts when the theme changes — tokens come from CSS custom
  // properties, so a fresh setOption isn't enough; dispose + re-init picks up
  // new colors cleanly. Listens for both data-theme attribute changes (light/
  // dark toggle) and a 'themechange' custom event (theme generator page).
  const rebuild = () => {
    const t = tokens();
    mounted.forEach((m) => {
      m.instance.dispose();
      m.instance = m.factory(echartsCore, m.el, t);
    });
  };
  const themeObserver = new MutationObserver((records) => {
    if (records.some((r) => r.attributeName === 'data-theme')) {rebuild();}
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.documentElement.addEventListener('themechange', rebuild);
}
