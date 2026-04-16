import React from 'react';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onBack,
  separator,
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
  };

  const itemStyle = (isLast: boolean): React.CSSProperties => ({
    color: isLast ? 'var(--gray-600)' : 'var(--gray-400)',
    fontWeight: isLast ? 500 : 400,
    cursor: !isLast && onBack ? 'pointer' : 'default',
  });

  const separatorStyle: React.CSSProperties = {
    color: 'var(--gray-300)',
    display: 'flex',
    alignItems: 'center',
  };

  const backButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: 'var(--gray-400)',
    cursor: 'pointer',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 0',
  };

  return (
    <div style={containerStyle}>
      {onBack && (
        <>
          <button style={backButtonStyle} onClick={onBack}>
            <Icon name="arrow-left" size={14} />
            <span>返回</span>
          </button>
          {items.length > 0 && <span style={separatorStyle}>/</span>}
        </>
      )}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span style={itemStyle(index === items.length - 1)}>
            {index === items.length - 1 ? (
              item.label
            ) : (
              <span style={{ cursor: item.path ? 'pointer' : 'default' }}>
                {item.label}
              </span>
            )}
          </span>
          {index < items.length - 1 && (
            <span style={separatorStyle}>
              {separator || <Icon name="chevron-right" size={12} />}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
