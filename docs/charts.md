# Charts

v4 uses **Apache ECharts 6** for all charting. ECharts is lazy-imported only when a `[data-chart]` element is present, so chartless pages pay no cost.

Live gallery: [`production/echarts.html`](../production/echarts.html) — every variant on one page.

## The pattern

Drop a `<div>` with `data-chart="<id>"` and a height. That's it.

```html
<div class="card chart-card">
  <div class="card-header">
    <div class="card-title">Revenue</div>
  </div>
  <div class="card-body">
    <div data-chart="revenue-line" style="width:100%;height:300px"></div>
  </div>
</div>
```

[`src/v4/charts.js`](../src/v4/charts.js) discovers every `[data-chart]`, lazy-imports ECharts (and only the chart types actually registered), and runs the matching factory.

## Available chart types

The `charts` map in [`src/v4/charts.js`](../src/v4/charts.js) registers:

| ID | What it is |
| --- | --- |
| `dashboard-network` | Mini-line with sessions + pageviews |
| `revenue-line` | Smooth line + area gradient |
| `sales-bar` | Vertical bars, multi-series |
| `traffic-donut` | Donut with center label |
| `device-usage` | Donut (mobile / desktop / tablet) |
| `browsers` | Donut (Chrome / Safari / Firefox / …) |
| `stacked-area` | Two-series stacked area |
| `horizontal-bar` | Horizontal bars (top-N rankings) |
| `mixed-bar-line` | Bars + a line on a secondary axis |
| `radar` | Five-axis radar (skill / category comparison) |
| `gauge` | Speedometer-style gauge |
| `scatter` | Scatter with two series |
| `heatmap` | Hour-by-day heatmap |
| `funnel` | Conversion funnel |
| `candlestick` | OHLC stock chart |
| `treemap` | Hierarchical rectangles |
| `sankey` | Flow / source-sink diagram |
| `calendar-heatmap` | GitHub-style year heatmap |
| `gantt` | Task timeline |
| `polar-bar` | Radial bar chart |

## Adding a new chart

1. **Write a factory** in [`src/v4/charts.js`](../src/v4/charts.js):

   ```js
   function myChart(echarts, el, t) {
     const chart = echarts.init(el);
     chart.setOption({
       ...baseOption(t),
       tooltip: { ...baseOption(t).tooltip, trigger: 'axis' },
       xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar'] },
       yAxis: { type: 'value' },
       series: [{
         type: 'line',
         data: [120, 200, 150],
         itemStyle: { color: t.primary },
         lineStyle: { color: t.primary, width: 2 },
         smooth: true
       }]
     });
     return chart;
   }
   ```

2. **Register it** in the `charts` map (near the bottom of the file):

   ```js
   const charts = {
     // …existing entries
     'my-chart': myChart
   };
   ```

3. **Use it** on any page:

   ```html
   <div data-chart="my-chart" style="width:100%;height:300px"></div>
   ```

Done. ECharts will pick it up on next dev reload.

## Tokens — the only rule

**Never use raw hex colors inside chart factories.** Always read from the `t` (tokens) object passed in:

```js
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
```

This is the magic that makes dark mode and the theme generator work — when `data-theme` flips, `initCharts` re-runs and the factories read fresh values. Hard-coded `#123456` would not redraw.

## The `baseOption` helper

Most charts share a base config (font family, grid padding, tooltip style). Use `baseOption(t)` as your starting point:

```js
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
```

Spread it as the base of your option:

```js
chart.setOption({
  ...baseOption(t),
  // …chart-specific overrides
});
```

## Auto-resize and theme reactivity

`initCharts` wires up two automatic behaviors:

- **Window resize**: a single `ResizeObserver` calls `chart.resize()` when the viewport changes.
- **Theme change**: a `MutationObserver` watches `<html data-theme="…">` and re-inits every chart with fresh tokens.

You don't need to manage either. Just write factories that read from `t`.

## Lazy import — what actually ships

The dynamic import at the top of `initCharts` only pulls in the chart types and components that are registered. Trimmed for size:

```js
const [echartsCore, charts, components, renderers] = await Promise.all([
  import('echarts/core'),
  import('echarts/charts'),     // LineChart, BarChart, PieChart, RadarChart, GaugeChart, …
  import('echarts/components'), // GridComponent, TooltipComponent, LegendComponent, …
  import('echarts/renderers')   // CanvasRenderer
]);
echartsCore.use([...]);
```

A page with one line chart still downloads ~350 KB of ECharts (the full minified vendor chunk). The optimization room is in **per-page chart-type tree-shaking** — that's on the roadmap.

## Multiple charts per page

`initCharts` handles any number of `[data-chart]` elements:

```html
<div class="row col-2">
  <div class="card chart-card">
    <div data-chart="revenue-line" style="width:100%;height:240px"></div>
  </div>
  <div class="card chart-card">
    <div data-chart="sales-bar" style="width:100%;height:240px"></div>
  </div>
</div>
```

Each gets its own `echarts.init()` instance. They re-render independently.

## Skeleton placeholders

While ECharts is downloading, `initCharts` adds `.skeleton.chart-skeleton` to every empty `[data-chart]` element. That triggers a shimmering placeholder (defined in [`_components.scss`](../src/scss/v4/_components.scss)). The class is removed once the chart mounts.

To opt out of the placeholder (e.g. if you've pre-rendered an SVG fallback inside the host), put any child element inside the `<div data-chart>`. The skeleton is only applied to empty hosts.

## Common ECharts options

A reminder for chart-builders:

```js
{
  // Hide a series legend
  legend: { show: false },

  // Multiple series share a single y-axis or use yAxisIndex: 1
  series: [
    { type: 'bar',  data: […],         yAxisIndex: 0 },
    { type: 'line', data: […], yAxisIndex: 1 }
  ],
  yAxis: [
    { type: 'value' },
    { type: 'value', show: false }
  ],

  // Smooth, gradient-fill area
  series: [{
    type: 'line',
    smooth: true,
    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(26,187,156,0.25)' },
      { offset: 1, color: 'rgba(26,187,156,0)' }
    ])},
    data: […]
  }]
}
```

## Where to look

- [`src/v4/charts.js`](../src/v4/charts.js) — the full factory library; copy from here
- [`production/echarts.html`](../production/echarts.html) — every variant live in the browser
- [ECharts docs](https://echarts.apache.org/option.html) — the option reference

## Want fewer chart types?

If you only need a couple of variants, delete the unused factories and shrink the modular import at the top of `initCharts`. Removing `RadarChart`, `GaugeChart`, `TreemapChart`, `SankeyChart`, `CalendarComponent`, etc. takes the vendor chunk down significantly.
