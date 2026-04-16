import React from 'react';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
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
import type { BaseChartProps, ChartColorName } from './types';

interface BarTrendChartProps<T extends object = Record<string, unknown>> extends BaseChartProps<T> {
  xKey: keyof T & string;
  yKey: keyof T & string;
  hideYAxis?: boolean;
  highlightKey?: string | number;
  highlightLastNonZero?: boolean;
  color?: ChartColorName | string;
  highlightColor?: ChartColorName | string;
  zeroColor?: ChartColorName | string;
  barCategoryGap?: string | number;
  compactBottom?: boolean;
  labelFormatter?: (value: string | number | null | undefined, item?: T) => string | number;
  tooltipLabelFormatter?: (label: string | number, item?: T) => React.ReactNode;
}

const getNumberValue = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export function BarTrendChart<T extends object = Record<string, unknown>>({
  data,
  xKey,
  yKey,
  height = 260,
  showTooltip = true,
  showLabels = true,
  hideYAxis = true,
  highlightKey,
  highlightLastNonZero = false,
  color = 'primary',
  highlightColor = 'warning',
  zeroColor = 'var(--gray-100)',
  barCategoryGap = '20%',
  compactBottom = false,
  emptyText,
  labelFormatter,
  tooltipLabelFormatter,
}: BarTrendChartProps<T>) {
  const hasData = data.length > 0;
  const lastNonZeroIndex = highlightLastNonZero
    ? data.findLastIndex((item) => getNumberValue(item[yKey]) > 0)
    : -1;

  return (
    <ChartContainer height={height} hasData={hasData} emptyText={emptyText} compactBottom={compactBottom}>
      <RechartsBarChart data={data} margin={{ top: 30, right: 8, left: 8, bottom: 0 }} barCategoryGap={barCategoryGap}>
        <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey={xKey as any}
          interval={0}
          height={20}
          tickMargin={3}
          tickLine={false}
          axisLine={false}
          tick={axisTickStyle}
        />
        <YAxis
          hide={hideYAxis}
          allowDecimals={false}
          domain={[0, (dataMax: number) => Math.max(dataMax + 2, 4)]}
          tickLine={false}
          axisLine={false}
          tick={axisTickStyle}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            cursor={chartTooltipCursor}
            labelFormatter={(label, payload) => {
              const item = payload?.[0]?.payload as T | undefined;
              return tooltipLabelFormatter ? tooltipLabelFormatter(label, item) : label;
            }}
          />
        )}
        <Bar dataKey={yKey as any} radius={[8, 8, 3, 3]} maxBarSize={42}>
          {data.map((item, index) => {
            const value = getNumberValue(item[yKey]);
            const isHighlighted =
              item[xKey] === highlightKey || (highlightLastNonZero && index === lastNonZeroIndex);
            return (
              <Cell
                key={`${String(item[xKey])}-${index}`}
                fill={value === 0 ? resolveChartColor(zeroColor) : resolveChartColor(isHighlighted ? highlightColor : color)}
                fillOpacity={value === 0 ? 0.9 : isHighlighted ? 1 : 0.78}
              />
            );
          })}
          {showLabels && (
            <LabelList
              dataKey={yKey as any}
              position="top"
              offset={8}
              formatter={(value) => {
                const numberValue = getNumberValue(value);
                if (numberValue <= 0) return '';
                return labelFormatter ? labelFormatter(value as string | number, undefined) : String(value);
              }}
              style={{ fill: 'var(--gray-700)', fontSize: 12, fontWeight: 600 }}
            />
          )}
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}

export default BarTrendChart;
