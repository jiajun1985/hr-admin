import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
  companyName?: string;
  onLogout?: () => void;
}

function getActiveKeyFromPath(path: string): string {
  const clean = path.replace(/^\//, '');
  return clean || 'dashboard-home';
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  userName,
  companyName,
  onLogout,
}) => {
  const location = useLocation();
  const activeMenuKey = getActiveKeyFromPath(location.pathname);

  const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'var(--gray-50)',
  };

  const mainStyle: React.CSSProperties = {
    marginTop: 'var(--header-height)',
    marginLeft: 'var(--sidebar-width)',
    minHeight: 'calc(100vh - var(--header-height))',
  };

  const contentStyle: React.CSSProperties = {
    padding: '16px 20px',
  };

  return (
    <div style={layoutStyle}>
      <Header
        userName={userName}
        companyName={companyName}
        onLogout={onLogout}
      />
      <Sidebar
        activeKey={activeMenuKey}
      />
      <main style={mainStyle}>
        <div style={contentStyle}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
