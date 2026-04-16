import React from 'react';
import { Icon } from './Icon';

export type TagColor = 'default' | 'success' | 'warning' | 'error' | 'primary' | 'info';

interface TagProps {
  color?: TagColor;
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  style?: React.CSSProperties;
}

const colorStyles: Record<TagColor, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'var(--gray-100)',
    text: 'var(--gray-600)',
    border: 'var(--gray-200)',
  },
  success: {
    bg: 'var(--success-50)',
    text: 'var(--success-600)',
    border: 'var(--success-50)',
  },
  warning: {
    bg: 'var(--warning-50)',
    text: 'var(--warning-600)',
    border: 'var(--warning-50)',
  },
  error: {
    bg: 'var(--error-50)',
    text: 'var(--error-600)',
    border: 'var(--error-50)',
  },
  primary: {
    bg: 'var(--primary-50)',
    text: 'var(--primary-600)',
    border: 'var(--primary-200)',
  },
  info: {
    bg: 'var(--info-50)',
    text: 'var(--info-600)',
    border: 'var(--info-50)',
  },
};

export const Tag: React.FC<TagProps> = ({
  color = 'default',
  children,
  removable = false,
  onRemove,
  style,
}) => {
  const colors = colorStyles[color];

  const tagStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: '22px',
    padding: '0 8px',
    fontSize: '12px',
    lineHeight: '22px',
    color: colors.text,
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 'var(--radius-sm)',
    gap: '4px',
    ...style,
  };

  return (
    <span style={tagStyle}>
      {children}
      {removable && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '2px',
            opacity: 0.7,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
        >
          <Icon name="close" size={12} />
        </span>
      )}
    </span>
  );
};

export default Tag;
