import type { ChartColorName } from './types';

export const chartColorMap: Record<ChartColorName, string> = {
  primary: '#2563EB',
  success: '#16A34A',
  warning: '#EA580C',
  info: '#0891B2',
  error: '#DC2626',
  gray: 'var(--gray-400)',
};

export const chartColors = [
  chartColorMap.primary,
  chartColorMap.success,
  chartColorMap.warning,
  '#7C3AED',
  chartColorMap.info,
  chartColorMap.error,
];

export const chartGridStroke = 'var(--gray-100)';

export const chartPanelBorder = '1px solid rgba(226, 232, 240, 0.9)';

export const chartPanelShadow = '0 12px 32px rgba(15, 23, 42, 0.05)';

export const chartTooltipCursor = {
  fill: 'rgba(37, 99, 235, 0.06)',
};

export const resolveChartColor = (color?: ChartColorName | string, fallbackIndex = 0) => {
  if (!color) return chartColors[fallbackIndex % chartColors.length];
  return chartColorMap[color as ChartColorName] || color;
};

export const axisTickStyle = {
  fontSize: 12,
  fill: 'var(--gray-500)',
};

export const tooltipStyle = {
  border: chartPanelBorder,
  borderRadius: '8px',
  boxShadow: '0 14px 34px rgba(15, 23, 42, 0.12)',
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  padding: '10px 12px',
  color: 'var(--gray-700)',
};

export const tooltipLabelStyle = {
  color: 'var(--gray-800)',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 4,
};

export const tooltipItemStyle = {
  color: 'var(--gray-600)',
  fontSize: 12,
  padding: 0,
};
