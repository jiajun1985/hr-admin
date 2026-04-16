import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { chartColors, resolveChartColor, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from './theme';
import type { BaseChartProps } from './types';

interface DonutChartProps<T extends object = Record<string, unknown>> extends BaseChartProps<T> {
  nameKey: keyof T & string;
  valueKey: keyof T & string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

const legendGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '10px 16px',
  marginTop: '2px',
};

export function DonutChart<T extends object = Record<string, unknown>>({
  data,
  nameKey,
  valueKey,
  height = 260,
  showTooltip = true,
  showLegend = true,
  innerRadius = 58,
  outerRadius = 90,
  emptyText,
}: DonutChartProps<T>) {
  const total = data.reduce((sum, item) => {
    const value = Number(item[valueKey]);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return (
    <>
      <div style={{ position: 'relative' }}>
        <ChartContainer height={height} hasData={data.length > 0} emptyText={emptyText}>
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey as any}
              nameKey={nameKey as any}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              cornerRadius={5}
              stroke="var(--gray-0)"
              strokeWidth={3}
            >
              {data.map((entry, index) => {
                const color = (entry as Record<string, unknown>).color;
                return (
                  <Cell
                    key={String(entry[nameKey])}
                    fill={resolveChartColor(String(color || chartColors[index % chartColors.length]), index)}
                  />
                );
              })}
            </Pie>
            {showTooltip && <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />}
          </PieChart>
        </ChartContainer>
        {data.length > 0 && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: `${height / 2 - 25}px`,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <strong style={{ color: 'var(--gray-900)', fontSize: '24px', lineHeight: 1, fontWeight: 800 }}>
              {total}
            </strong>
            <span style={{ color: 'var(--gray-400)', fontSize: '12px', marginTop: '6px' }}>合计</span>
          </div>
        )}
      </div>
      {showLegend && data.length > 0 && (
        <div style={legendGridStyle}>
          {data.map((item, index) => (
            <div
              key={String(item[nameKey])}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gray-600)', minWidth: 0 }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '3px',
                  flexShrink: 0,
                  backgroundColor: resolveChartColor(String((item as Record<string, unknown>).color || chartColors[index % chartColors.length]), index),
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {String(item[nameKey] ?? '')}
              </span>
              <strong style={{ marginLeft: 'auto', color: 'var(--gray-900)', fontWeight: 700 }}>
                {String(item[valueKey] ?? '')}
              </strong>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default DonutChart;
