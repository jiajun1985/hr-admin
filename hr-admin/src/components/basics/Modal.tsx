import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { panelSurfaceStyle } from '../composites/surfaceStyles';
import { panelTitleStyle } from '../composites/surfaceStyles';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  footer?: React.ReactNode;
  children: React.ReactNode;
  closeOnOverlay?: boolean;
  showClose?: boolean;
  bodyContentStyle?: React.CSSProperties;
}

const sizeWidths: Record<ModalSize, number> = {
  sm: 400,
  md: 560,
  lg: 720,
  xl: 960,
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  children,
  closeOnOverlay = true,
  showClose = true,
  bodyContentStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!isVisible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: isAnimating ? 1 : 0,
    transition: 'opacity 0.2s ease',
  };

  const modalStyle: React.CSSProperties = {
    width: sizeWidths[size],
    maxWidth: '90vw',
    maxHeight: '90vh',
    ...panelSurfaceStyle,
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
    opacity: isAnimating ? 1 : 0,
    transition: 'all 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--gray-200)',
  };

  const titleStyle: React.CSSProperties = {
    ...panelTitleStyle,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--gray-400)',
    backgroundColor: 'transparent',
    border: 'none',
    transition: 'all 0.15s',
  };

  const bodyContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid var(--gray-200)',
  };

  return (
    <div style={overlayStyle} onClick={closeOnOverlay ? onClose : undefined}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {(title || showClose) && (
          <div style={headerStyle}>
            {title && <div style={titleStyle}>{title}</div>}
            {showClose && (
              <button
                style={closeButtonStyle}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                  e.currentTarget.style.color = 'var(--gray-600)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--gray-400)';
                }}
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        )}
        <div style={{ ...bodyContainerStyle, ...bodyContentStyle }}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
