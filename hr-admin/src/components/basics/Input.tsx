import React, { useState } from 'react';

export type InputStatus = 'default' | 'error' | 'warning';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  status?: InputStatus;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  contentColor?: string;
}

const sizeStyles = {
  sm: { height: '28px', fontSize: '12px' },
  md: { height: '32px', fontSize: '13px' },
  lg: { height: '36px', fontSize: '14px' },
};

export const Input: React.FC<InputProps> = ({
  prefix,
  suffix,
  status = 'default',
  errorMessage,
  size = 'md',
  contentColor,
  style,
  disabled,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (status === 'error') return 'var(--error-600)';
    if (status === 'warning') return 'var(--warning-600)';
    if (isFocused) return 'var(--primary-500)';
    return 'var(--gray-200)';
  };

  const getBoxShadow = () => {
    if (isFocused && status !== 'error' && status !== 'warning') {
      return '0 0 0 3px rgba(249, 115, 22, 0.1)';
    }
    return 'none';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: sizeStyles[size].height,
    padding: '0 12px',
    backgroundColor: disabled ? 'var(--gray-100)' : 'var(--gray-0)',
    border: `1px solid ${getBorderColor()}`,
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.15s ease',
    boxShadow: getBoxShadow(),
    ...style,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: sizeStyles[size].fontSize,
    color: contentColor || 'var(--gray-800)',
    ...(disabled ? { cursor: 'not-allowed', color: 'var(--gray-400)' } : {}),
  };

  const prefixStyle: React.CSSProperties = {
    marginRight: '8px',
    color: 'var(--gray-400)',
    display: 'flex',
    alignItems: 'center',
  };

  const suffixStyle: React.CSSProperties = {
    marginLeft: '8px',
    color: 'var(--gray-400)',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div>
      <div style={containerStyle}>
        {prefix && <span style={prefixStyle}>{prefix}</span>}
        {typeof prefix === 'string' ? (
          <span style={{ ...prefixStyle, fontSize: sizeStyles[size].fontSize }}>{prefix}</span>
        ) : (
          prefix
        )}
        <input
          style={inputStyle}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {typeof suffix === 'string' ? (
          <span style={{ ...suffixStyle, fontSize: sizeStyles[size].fontSize }}>{suffix}</span>
        ) : (
          suffix
        )}
        {suffix && typeof suffix !== 'string' && <span style={suffixStyle}>{suffix}</span>}
      </div>
      {status === 'error' && errorMessage && (
        <div style={{ fontSize: '12px', color: 'var(--error-600)', marginTop: '4px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Input;
