import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartEmptyState } from './ChartEmptyState';

interface ChartContainerProps {
  height?: number;
  hasData?: boolean;
  emptyText?: string;
  compactBottom?: boolean;
  children: React.ReactElement;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  height = 260,
  hasData = true,
  emptyText,
  compactBottom = false,
  children,
}) => {
  if (!hasData) {
    return <ChartEmptyState height={height} text={emptyText} />;
  }

  return (
    <div style={{ marginBottom: compactBottom ? '-10px' : undefined, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;
