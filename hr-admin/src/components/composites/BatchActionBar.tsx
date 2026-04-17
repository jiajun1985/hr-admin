import React, { useState } from 'react';
import { Button } from '../basics/Button';
import { Checkbox } from '../basics/Checkbox';
import { Icon } from '../basics/Icon';

export interface BatchAction {
  key: string;
  label: string;
  icon?: string;
  type?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  onClick: (selectedKeys: (string | number)[], selectedItems?: Array<{ key: string | number; label: string }>) => void;
}

interface BatchActionBarProps {
  selectedCount: number;
  actions: BatchAction[];
  onClear: () => void;
  selectedItems?: Array<{ key: string | number; label: string }>;
  showSelectedList?: boolean;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedCount,
  actions,
  onClear,
  selectedItems = [],
  showSelectedList = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (selectedCount === 0) return null;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: 'var(--primary-50)',
    border: '1px solid var(--primary-200)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '12px',
    animation: 'slideDown 0.2s ease',
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const countStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--gray-600)',
  };

  const selectedCountStyle: React.CSSProperties = {
    color: 'var(--primary-600)',
    fontWeight: 600,
  };

  const viewListButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 7px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--gray-500)',
    fontSize: '12px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
  };

  const selectedListStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '4px',
    width: '280px',
    maxHeight: '300px',
    overflow: 'auto',
    backgroundColor: 'var(--gray-0)',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
  };

  const selectedItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 10px',
    fontSize: '13px',
    color: 'var(--gray-600)',
    borderBottom: '1px solid var(--gray-100)',
  };

  const removeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--gray-400)',
    cursor: 'pointer',
    borderRadius: '50%',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const selectedKeys = selectedItems.map((item) => item.key);

  return (
    <div style={containerStyle}>
      <div style={leftSectionStyle}>
        <div style={countStyle}>
          <span>已选</span>
          <span style={selectedCountStyle}>{selectedCount}</span>
          <span>项</span>
        </div>

        {showSelectedList && selectedItems.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              style={viewListButtonStyle}
              onClick={() => setIsExpanded(!isExpanded)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gray-100)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>查看已选</span>
              <Icon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={12}
              />
            </button>

            {isExpanded && (
              <div style={selectedListStyle}>
                {selectedItems.map((item, index) => (
                  <div key={item.key} style={selectedItemStyle}>
                    <span>{item.label}</span>
                    <button
                      style={removeButtonStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                        e.currentTarget.style.color = 'var(--gray-600)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--gray-400)';
                      }}
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
                {selectedItems.length > 5 && (
                  <div style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--gray-400)',
                    textAlign: 'center',
                  }}>
                    ... 等 {selectedItems.length} 项
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Button type="text" size="sm" onClick={onClear}>
          清空
        </Button>
      </div>

      <div style={actionsStyle}>
        {actions.map((action) => (
          <Button
            key={action.key}
            type={action.type || 'secondary'}
            size="sm"
            disabled={action.disabled}
            onClick={() => action.onClick(selectedKeys, selectedItems)}
          >
            {action.label}
          </Button>
        ))}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BatchActionBar;
