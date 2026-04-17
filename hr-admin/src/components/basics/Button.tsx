import React from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';

interface ButtonProps {
  type?: ButtonType;
  buttonType?: ButtonType;
  htmlType?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  block?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const buttonStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--primary-600)',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--primary-600)',
    border: '1px solid var(--primary-600)',
  },
  tertiary: {
    backgroundColor: 'transparent',
    color: 'var(--gray-600)',
    border: '1px solid var(--gray-200)',
  },
  danger: {
    backgroundColor: 'var(--error-600)',
    color: '#ffffff',
    border: 'none',
  },
  text: {
    backgroundColor: 'transparent',
    color: 'var(--primary-600)',
    border: 'none',
    padding: '0',
  },
};

const sizeStyles = {
  sm: { height: '26px', padding: '0 10px', fontSize: '12px', gap: '4px' },
  md: { height: '30px', padding: '0 14px', fontSize: '13px', gap: '6px' },
  lg: { height: '34px', padding: '0 18px', fontSize: '14px', gap: '8px' },
};

export const Button: React.FC<ButtonProps> = ({
  type,
  buttonType,
  htmlType = 'button',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  block = false,
  children,
  disabled,
  style,
  onClick,
}) => {
  const effectiveType = buttonType || type || 'primary';
  
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    ...buttonStyles[effectiveType],
    ...sizeStyles[size],
    ...(block ? { width: '100%' } : {}),
    ...style,
  };

  const hoverStyle: React.CSSProperties = {};
  if (effectiveType === 'primary') {
    hoverStyle.backgroundColor = 'var(--primary-700)';
  } else if (effectiveType === 'secondary') {
    hoverStyle.backgroundColor = 'var(--primary-50)';
  } else if (effectiveType === 'tertiary') {
    hoverStyle.backgroundColor = 'var(--gray-100)';
  } else if (effectiveType === 'danger') {
    hoverStyle.backgroundColor = '#b91c1c';
  } else if (effectiveType === 'text') {
    hoverStyle.textDecoration = 'underline';
  }

  const [isHovered, setIsHovered] = React.useState(false);

  const renderIcon = () => {
    if (!icon) return null;
    return <Icon name={icon} size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />;
  };

  return (
    <button
      type={htmlType}
      style={{ ...baseStyle, ...(isHovered && !disabled && !loading ? hoverStyle : {}) }}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading && (
        <Icon
          name="loading"
          size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14}
          className="animate-spin"
        />
      )}
      {!loading && icon && iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
