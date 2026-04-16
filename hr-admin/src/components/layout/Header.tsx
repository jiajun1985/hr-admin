import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../basics/Icon';
import { resetStore } from '../../mockApi/store';

interface HeaderProps {
  companyName?: string;
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  companyName = 'FAFULI',
  userName = '管理员',
  userAvatar,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height)',
    backgroundColor: 'var(--gray-0)',
    borderBottom: '1px solid var(--gray-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    zIndex: 100,
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '200px',
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--primary-600)',
    letterSpacing: '1px',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const iconButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-500)',
    transition: 'all 0.15s',
  };

  const userMenuStyle: React.CSSProperties = {
    position: 'relative',
  };

  const userButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  };

  const avatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-100)',
    color: 'var(--primary-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '4px',
    width: '160px',
    backgroundColor: 'var(--gray-0)',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    padding: '4px',
    zIndex: 1000,
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--gray-600)',
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.15s',
    textAlign: 'left',
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--primary-600)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>F</span>
        </div>
        <span style={logoTextStyle}>{companyName}</span>
      </div>

      <div style={rightSectionStyle}>
        <button
          style={iconButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gray-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="帮助"
        >
          <Icon name="question-circle" size={18} />
        </button>

        <button
          style={iconButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gray-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="通知"
        >
          <Icon name="bell" size={18} />
        </button>

        <div style={userMenuStyle} ref={menuRef}>
          <button
            style={userButtonStyle}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--gray-100)';
            }}
            onMouseLeave={(e) => {
              if (!isUserMenuOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={avatarStyle}>
              {userAvatar ? (
                <img src={userAvatar} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{userName}</span>
            <Icon name="chevron-down" size={14} color="var(--gray-400)" />
          </button>

          {isUserMenuOpen && (
            <div style={dropdownStyle}>
              <button
                style={menuItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon name="user" size={14} />
                <span>个人中心</span>
              </button>
              <button
                style={menuItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon name="settings" size={14} />
                <span>账号设置</span>
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--gray-200)', margin: '4px 0' }} />
              <button
                style={menuItemStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  resetStore();
                  window.location.reload();
                }}
              >
                <Icon name="refresh" size={14} />
                <span>重置演示数据</span>
              </button>
              <div style={{ height: '1px', backgroundColor: 'var(--gray-200)', margin: '4px 0' }} />
              <button
                style={{ ...menuItemStyle, color: 'var(--error-600)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--error-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  onLogout?.();
                  setIsUserMenuOpen(false);
                }}
              >
                <Icon name="arrow-right" size={14} color="var(--error-600)" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
