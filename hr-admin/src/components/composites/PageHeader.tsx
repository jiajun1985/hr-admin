import React from 'react';
import { Breadcrumb, type BreadcrumbItem } from '../basics/Breadcrumb';
import { Button } from '../basics/Button';
import { type IconName } from '../basics/Icon';
import { pageTitleStyle, panelPadding, panelSurfaceStyle, panelSubtitleStyle } from './surfaceStyles';

interface Action {
  type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  label: string;
  icon?: IconName;
  onClick: () => void;
  loading?: boolean;
}

interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  onBack?: () => void;
  title?: React.ReactNode;
  description?: string;
  titleExtra?: React.ReactNode;
  actions?: Action[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  onBack,
  title,
  description,
  titleExtra,
  actions = [],
}) => {
  const containerStyle: React.CSSProperties = {
    ...panelSurfaceStyle,
    padding: `${panelPadding}px`,
    marginBottom: '16px',
  };

  const breadcrumbStyle: React.CSSProperties = {
    marginBottom: '12px',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  };

  const leftSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    ...pageTitleStyle,
    marginBottom: description ? '4px' : 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const descriptionStyle: React.CSSProperties = {
    ...panelSubtitleStyle,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      {breadcrumb && breadcrumb.length > 0 && (
        <div style={breadcrumbStyle}>
          <Breadcrumb items={breadcrumb} onBack={onBack} />
        </div>
      )}
      <div style={contentStyle}>
        <div style={leftSectionStyle}>
          <h1 style={titleStyle}>
            {title}
            {titleExtra}
          </h1>
          {description && (
            <p style={descriptionStyle}>{description}</p>
          )}
        </div>
        <div style={actionsStyle}>
          {actions.map((action, index) => (
            <Button
              key={index}
              type={action.type}
              icon={action.icon}
              onClick={action.onClick}
              loading={action.loading}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
