/**
 * Tree-shaken ECharts bundle.
 *
 * Importing the full `echarts` package ships ~1.1 MB minified because it
 * pulls in every chart type, every component, every renderer, plus SVG and
 * canvas paths. Gentelella only uses a small subset, so we register exactly
 * what the dashboards need via the modular API.
 *
 * Add a chart/component here when introducing a new chart type. The full
 * registry is documented at https://echarts.apache.org/handbook/en/basics/import.
 */

import * as echarts from 'echarts/core';

import {
  BarChart,
  FunnelChart,
  GaugeChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart
} from 'echarts/charts';

import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';

import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  // Charts
  BarChart,
  FunnelChart,
  GaugeChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,

  // Components
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent,

  // Animation features
  LabelLayout,
  UniversalTransition,

  // Renderer
  CanvasRenderer
]);

export default echarts;
export * from 'echarts/core';
