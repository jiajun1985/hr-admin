import React from 'react';

interface ChartEmptyStateProps {
  text?: string;
  height?: number;
}

export const ChartEmptyState: React.FC<ChartEmptyStateProps> = ({
  text = '暂无图表数据',
  height = 260,
}) => {
  return (
    <div
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--gray-400)',
        fontSize: '13px',
        backgroundColor: 'var(--gray-50)',
      }}
    >
      <span
        style={{
          width: '32px',
          height: '4px',
          borderRadius: '999px',
          backgroundColor: 'var(--gray-200)',
        }}
      />
      <span>{text}</span>
    </div>
  );
};

export default ChartEmptyState;
