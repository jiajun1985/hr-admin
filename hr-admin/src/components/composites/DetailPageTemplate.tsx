import React, { useState } from 'react';
import { Breadcrumb } from '../basics/Breadcrumb';
import { Button } from '../basics/Button';
import { Icon, type IconName } from '../basics/Icon';

export interface TabItem {
  key: string;
  label: string;
  badge?: number | string;
  disabled?: boolean;
}

interface Action {
  type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  label: string;
  icon?: IconName;
  onClick: () => void;
  loading?: boolean;
}

interface DetailPageTemplateProps {
  breadcrumb?: Array<{ label: string; path?: string }>;
  onBack?: () => void;
  title: string;
  subtitle?: string;
  actions?: Action[];
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  leftWidth?: number | string;
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  breadcrumb,
  onBack,
  title,
  subtitle,
  actions = [],
  tabs = [],
  activeTab,
  onTabChange,
  leftContent,
  rightContent,
  leftWidth = 280,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.key || '');

  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab;
  const handleTabChange = (key: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(key);
    }
    onTabChange?.(key);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '20px',
  };

  const breadcrumbStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--gray-800)',
    marginBottom: subtitle ? '4px' : 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--gray-400)',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0 20px',
  };

  const tabStyle = (isActive: boolean, isDisabled?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: isActive ? 'var(--primary-600)' : isDisabled ? 'var(--gray-300)' : 'var(--gray-500)',
    borderBottom: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
    fontWeight: isActive ? 500 : 400,
  });

  const tabBadgeStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: '0 6px',
    fontSize: '11px',
    borderRadius: '9px',
    backgroundColor: isActive ? 'var(--primary-100)' : 'var(--gray-100)',
    color: isActive ? 'var(--primary-600)' : 'var(--gray-500)',
    fontWeight: 500,
  });

  const contentStyle: React.CSSProperties = {
    display: 'flex',
  };

  const leftStyle: React.CSSProperties = {
    width: typeof leftWidth === 'number' ? `${leftWidth}px` : leftWidth,
    padding: '20px',
    flexShrink: 0,
  };

  const rightStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    minWidth: 0,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'relative',
  };

  const dropdownMenuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    minWidth: '160px',
    backgroundColor: 'var(--gray-0)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    padding: '4px',
    zIndex: 100,
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--gray-600)',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    textAlign: 'left',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        {breadcrumb && breadcrumb.length > 0 && (
          <div style={breadcrumbStyle}>
            <Breadcrumb items={breadcrumb} onBack={onBack} />
          </div>
        )}
        <div style={titleRowStyle}>
          <div>
            <h1 style={titleStyle}>{title}</h1>
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          <div style={actionsStyle}>
            {actions.map((action, index) => {
              if (action.type === 'tertiary' && index === actions.length - 1) {
                return (
                  <DropdownButton key={index} action={action} />
                );
              }
              return (
                <Button
                  key={index}
                  type={action.type}
                  icon={action.icon as any}
                  onClick={action.onClick}
                  loading={action.loading}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {tabs.length > 0 && (
        <div style={tabsStyle}>
          {tabs.map((tab) => (
            <div
              key={tab.key}
              style={tabStyle(currentTab === tab.key, tab.disabled)}
              onClick={() => !tab.disabled && handleTabChange(tab.key)}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span style={tabBadgeStyle(currentTab === tab.key)}>
                  {tab.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {(leftContent || rightContent) && (
        <div style={contentStyle}>
          {leftContent && <div style={leftStyle}>{leftContent}</div>}
          {rightContent && <div style={rightStyle}>{rightContent}</div>}
        </div>
      )}
    </div>
  );
};

interface DropdownButtonProps {
  action: Action;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ action }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownStyle: React.CSSProperties = {
    position: 'relative',
  };

  return (
    <div style={dropdownStyle}>
      <Button
        type={action.type}
        icon={action.icon as any}
        onClick={() => setIsOpen(!isOpen)}
      >
        {action.label}
        <Icon name="chevron-down" size={14} />
      </Button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          minWidth: '160px',
          backgroundColor: 'var(--gray-0)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          padding: '4px',
          zIndex: 100,
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--gray-600)',
              fontSize: '13px',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
            }}
            onClick={() => setIsOpen(false)}
          >
            <Icon name="edit" size={14} />
            编辑信息
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--error-600)',
              fontSize: '13px',
              cursor: 'pointer',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
            }}
            onClick={() => setIsOpen(false)}
          >
            <Icon name="delete" size={14} color="var(--error-600)" />
            删除员工
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailPageTemplate;
