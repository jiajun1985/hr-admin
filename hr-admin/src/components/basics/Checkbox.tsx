import React from 'react';
import { Icon } from './Icon';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  style,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const boxStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '3px',
    border: `1.5px solid ${
      checked || indeterminate
        ? 'var(--primary-600)'
        : isHovered
        ? 'var(--primary-500)'
        : 'var(--gray-300)'
    }`,
    backgroundColor: checked || indeterminate ? 'var(--primary-600)' : 'var(--gray-0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  };

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div
      style={containerStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={boxStyle}>
        {checked && <Icon name="check" size={12} color="#ffffff" />}
        {indeterminate && !checked && (
          <div
            style={{
              width: '8px',
              height: '2px',
              backgroundColor: '#ffffff',
              borderRadius: '1px',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
