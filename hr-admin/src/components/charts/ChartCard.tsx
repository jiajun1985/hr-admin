import React from 'react';
import { chartPanelShadow } from './theme';
import type { ChartSummaryItem } from './types';

interface ChartCardProps {
  title: string;
  description?: string;
  summary?: ChartSummaryItem[];
  height?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  summary,
  action,
  children,
  height,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--gray-0)',
        border: 'none',
        borderRadius: '8px',
        boxShadow: chartPanelShadow,
        padding: '22px',
        minWidth: 0,
        minHeight: height,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: summary && summary.length > 0 ? '14px' : '16px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '6px' }}>
            {title}
          </h3>
          {description && (
            <p style={{ fontSize: '12px', color: 'var(--gray-500)', lineHeight: 1.6 }}>{description}</p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>

      {summary && summary.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(summary.length, 3)}, minmax(0, 1fr))`,
            margin: '0 0 14px',
            padding: '10px 0',
            gap: '12px',
          }}
        >
          {summary.map((item) => (
            <span
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '5px',
                fontSize: '12px',
                color: 'var(--gray-500)',
                minWidth: 0,
                padding: '0',
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              <strong style={{ color: 'var(--gray-900)', fontSize: '20px', lineHeight: 1, letterSpacing: 0 }}>
                {item.value}
              </strong>
              {item.unit && <span>{item.unit}</span>}
            </span>
          ))}
        </div>
      )}

      {children}
    </div>
  );
};

export default ChartCard;
