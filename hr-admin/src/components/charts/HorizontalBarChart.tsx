import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts';
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
import type { BaseChartProps } from './types';

interface HorizontalBarChartProps<T extends object = Record<string, unknown>> extends BaseChartProps<T> {
  nameKey: keyof T & string;
  valueKey: keyof T & string;
  maxValue?: number;
  nameAxisWidth?: number;
  valueFormatter?: (value: number) => string;
}

export function HorizontalBarChart<T extends object = Record<string, unknown>>({
  data,
  nameKey,
  valueKey,
  height = 260,
  showTooltip = true,
  emptyText,
  maxValue = 100,
  nameAxisWidth = 88,
  valueFormatter = (value) => `${value}%`,
}: HorizontalBarChartProps<T>) {
  return (
    <ChartContainer height={height} hasData={data.length > 0} emptyText={emptyText}>
      <RechartsBarChart data={data} layout="vertical" margin={{ top: 12, right: 28, left: 58, bottom: 0 }}>
        <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, maxValue]}
          tickFormatter={(value) => valueFormatter(Number(value))}
          tickLine={false}
          axisLine={false}
          tick={axisTickStyle}
        />
        <YAxis
          type="category"
          dataKey={nameKey as any}
          tickLine={false}
          axisLine={false}
          tick={{ ...axisTickStyle, fill: 'var(--gray-600)' }}
          width={nameAxisWidth}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            cursor={chartTooltipCursor}
            formatter={(value) => [valueFormatter(Number(value)), '完成率']}
          />
        )}
        <Bar
          dataKey={valueKey as any}
          radius={[0, 8, 8, 0]}
          barSize={14}
          background={{ fill: 'var(--gray-50)', radius: 8 }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`${String(entry[nameKey])}-${index}`}
              fill={resolveChartColor(String((entry as Record<string, unknown>).color || ''), index)}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}

export default HorizontalBarChart;
