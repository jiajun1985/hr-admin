import React from 'react';
import { Icon } from '../basics/Icon';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    percentage?: string;
  };
  suffix?: string;
  subText?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  suffix,
  subText,
  action,
  style,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--radius-md)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--gray-500)',
    marginBottom: '8px',
    fontWeight: 500,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 700,
    color: 'var(--gray-800)',
    lineHeight: '1.2',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  };

  const suffixStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    color: 'var(--gray-500)',
  };

  const trendContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    marginBottom: '8px',
  };

  const getTrendColor = () => {
    if (!trend) return 'var(--gray-400)';
    if (trend.direction === 'up') return 'var(--primary-600)';
    if (trend.direction === 'down') return 'var(--gray-400)';
    return 'var(--gray-400)';
  };

  const subTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--gray-400)',
    marginTop: 'auto',
    paddingTop: '8px',
  };

  const actionStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--primary-600)',
    cursor: 'pointer',
    marginTop: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    padding: 0,
    textAlign: 'left',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === 'up') return 'arrow-up';
    if (trend.direction === 'down') return 'arrow-down';
    return null;
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>
        <span>{value}</span>
        {suffix && <span style={suffixStyle}>{suffix}</span>}
      </div>
      {trend && (
        <div style={trendContainerStyle}>
          {getTrendIcon() && (
            <Icon name={getTrendIcon()!} size={12} color={getTrendColor()} />
          )}
          <span style={{ color: getTrendColor() }}>
            {trend.percentage && `${trend.percentage} `}
            {trend.value}
          </span>
        </div>
      )}
      {subText && <div style={subTextStyle}>{subText}</div>}
      {action && (
        <button
          style={actionStyle}
          onClick={action.onClick}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default StatCard;
