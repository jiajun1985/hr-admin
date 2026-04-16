import React from 'react';
import { PageHeader } from './PageHeader';
import { Button } from '../basics/Button';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = '该功能正在开发中，敬请期待...',
}) => {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: '首页', path: '/' }, { label: title }]}
        title={title}
        description={description}
        actions={[
          {
            label: '新增',
            type: 'primary',
            icon: 'plus',
            onClick: () => window.alert?.('该功能正在开发中'),
          },
        ]}
      />
      <div
        style={{
          backgroundColor: 'var(--gray-0)',
          borderRadius: 'var(--radius-md)',
          padding: '40px',
          textAlign: 'center',
          color: 'var(--gray-400)',
          border: '1px dashed var(--gray-200)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--gray-100)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--gray-600)', marginBottom: '8px' }}>
            {title}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--gray-400)', maxWidth: '400px', margin: '0 auto' }}>
            {description}
          </p>
        </div>
        <Button
          type="primary"
          onClick={() => window.alert?.('该功能正在开发中，敬请期待')}
        >
          了解后续计划
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
