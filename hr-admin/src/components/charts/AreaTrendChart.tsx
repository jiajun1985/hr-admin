import React from 'react';
import { Area, AreaChart as RechartsAreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
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

interface AreaTrendChartProps<T extends object = Record<string, unknown>> extends BaseChartProps<T> {
  xKey: keyof T & string;
  series: ChartSeries[];
  hideYAxis?: boolean;
  showLegend?: boolean;
}

export function AreaTrendChart<T extends object = Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 260,
  showTooltip = true,
  hideYAxis = false,
  showLegend = series.length > 1,
  emptyText,
}: AreaTrendChartProps<T>) {
  return (
    <ChartContainer height={height} hasData={data.length > 0 && series.length > 0} emptyText={emptyText}>
      <RechartsAreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
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
        {series.map((item, index) => {
          const color = resolveChartColor(item.color, index);
          return (
            <Area
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name}
              stroke={color}
              fill={color}
              fillOpacity={0.16}
              strokeWidth={3}
            />
          );
        })}
      </RechartsAreaChart>
    </ChartContainer>
  );
}

export default AreaTrendChart;
