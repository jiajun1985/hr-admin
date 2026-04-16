import type React from 'react';

export type ChartDatum = Record<string, string | number | null | undefined>;

export type ChartColorName = 'primary' | 'success' | 'warning' | 'info' | 'error' | 'gray';

export interface ChartSeries {
  dataKey: string;
  name: string;
  color?: ChartColorName | string;
  labelFormatter?: (value: string | number | null | undefined, item?: ChartDatum) => React.ReactNode;
}

export interface ChartSummaryItem {
  label: string;
  value: string | number;
  unit?: string;
}

export interface BaseChartProps<T extends object = ChartDatum> {
  data: T[];
  height?: number;
  showTooltip?: boolean;
  showLabels?: boolean;
  emptyText?: string;
}
