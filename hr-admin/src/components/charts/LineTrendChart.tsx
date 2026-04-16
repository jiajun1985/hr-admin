import React from 'react';
import { CartesianGrid, Legend, Line, LineChart as RechartsLineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer } from './ChartContainer';
import {
  axisTickStyle,
  chartGridStroke,
  chartTooltipCursor,
  resolveChartColor,
  tooltipItemStyle,
  tooltipLabelStyle,
  tooltipStyle,
} from './theme';
import type { BaseChartProps, ChartSeries } from './types';

interface LineTrendChartProps<T extends object = Record<string, unknown>> extends BaseChartProps<T> {
  xKey: keyof T & string;
  series: ChartSeries[];
  hideYAxis?: boolean;
  showLegend?: boolean;
}

export function LineTrendChart<T extends object = Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 260,
  showTooltip = true,
  hideYAxis = false,
  showLegend = series.length > 1,
  emptyText,
}: LineTrendChartProps<T>) {
  return (
    <ChartContainer height={height} hasData={data.length > 0 && series.length > 0} emptyText={emptyText}>
      <RechartsLineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey={xKey as any} tickLine={false} axisLine={false} tick={axisTickStyle} />
        <YAxis hide={hideYAxis} allowDecimals={false} tickLine={false} axisLine={false} tick={axisTickStyle} />
        {showTooltip && (
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            cursor={chartTooltipCursor}
          />
        )}
        {showLegend && <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--gray-500)' }} />}
        {series.map((item, index) => (
          <Line
            key={item.dataKey}
            type="monotone"
            dataKey={item.dataKey}
            name={item.name}
            stroke={resolveChartColor(item.color, index)}
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 2, fill: 'var(--gray-0)' }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}

export default LineTrendChart;
