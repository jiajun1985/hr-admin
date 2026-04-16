import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon, IconName } from './Icon';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  showSearch?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  contentColor?: string;
}

const sizeStyles = {
  sm: { height: '28px', fontSize: '12px' },
  md: { height: '32px', fontSize: '13px' },
  lg: { height: '36px', fontSize: '14px' },
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  multiple = false,
  showSearch = false,
  size = 'md',
  style,
  contentColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updateDirection = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownEstimatedHeight = 240;
      const openUp = spaceBelow < dropdownEstimatedHeight && spaceAbove > spaceBelow;
      const availableHeight = openUp ? Math.max(120, spaceAbove - 8) : Math.max(120, spaceBelow - 8);

      setDropdownPosition({
        position: 'fixed',
        left: rect.left,
        top: openUp ? Math.max(8, rect.top - availableHeight - 4) : rect.bottom + 4,
        width: rect.width,
        maxHeight: Math.min(dropdownEstimatedHeight, availableHeight),
        zIndex: 2000,
      });
    };

    updateDirection();
    window.addEventListener('resize', updateDirection);
    window.addEventListener('scroll', updateDirection, true);

    return () => {
      window.removeEventListener('resize', updateDirection);
      window.removeEventListener('scroll', updateDirection, true);
    };
  }, [isOpen]);

  const getSelectedLabels = () => {
    if (multiple && Array.isArray(value)) {
      const selected = options.filter(opt => value.includes(opt.value));
      return selected.length > 0 ? selected.map(opt => opt.label).join(', ') : '';
    }
    const selected = options.find(opt => opt.value === value);
    return selected?.label || '';
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter(v => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearchValue('');
  };

  const isSelected = (optionValue: string | number) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const filteredOptions = showSearch && searchValue
    ? options.filter(opt => opt.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...style,
  };

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: sizeStyles[size].height,
    padding: '0 12px',
    backgroundColor: disabled ? 'var(--gray-100)' : 'var(--gray-0)',
    border: `1px solid ${isOpen ? 'var(--primary-500)' : 'var(--gray-200)'}`,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: sizeStyles[size].fontSize,
    color: contentColor || (getSelectedLabels() ? 'var(--gray-800)' : 'var(--gray-300)'),
    boxShadow: isOpen ? '0 0 0 3px rgba(249, 115, 22, 0.1)' : 'none',
    transition: 'all 0.15s ease',
  };

  const dropdownStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    maxHeight: '240px',
    overflow: 'auto',
  };

  const searchContainerStyle: React.CSSProperties = {
    padding: '8px',
    borderBottom: '1px solid var(--gray-200)',
  };

  const optionStyle = (selected: boolean, disabled?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '36px',
    padding: '0 12px',
    fontSize: sizeStyles[size].fontSize,
    color: disabled ? 'var(--gray-300)' : selected ? 'var(--primary-600)' : 'var(--gray-600)',
    backgroundColor: selected ? 'var(--primary-50)' : 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.15s',
  });

  return (
    <div style={containerStyle} ref={containerRef}>
      <div
        style={triggerStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {getSelectedLabels() || placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={14}
          color="var(--gray-400)"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </div>

      {isOpen && typeof document !== 'undefined' &&
        createPortal(
          <div ref={dropdownRef} style={{ ...dropdownPosition, zIndex: 2000 }}>
            <div
              style={{
                backgroundColor: 'var(--gray-0)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '100%',
                overflow: 'auto',
              }}
            >
              {showSearch && (
                <div style={searchContainerStyle}>
                  <input
                    ref={inputRef}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="搜索..."
                    style={{
                      width: '100%',
                      height: '28px',
                      padding: '0 8px',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '4px',
                      outline: 'none',
                      fontSize: '12px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              {filteredOptions.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '12px' }}>
                  无匹配选项
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    style={optionStyle(isSelected(option.value), option.disabled)}
                    onMouseEnter={(e) => {
                      if (!option.disabled) e.currentTarget.style.backgroundColor = isSelected(option.value) ? 'var(--primary-100)' : 'var(--gray-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected(option.value) ? 'var(--primary-50)' : 'transparent';
                    }}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{option.label}</span>
                    {multiple && isSelected(option.value) && (
                      <Icon name="check" size={14} color="var(--primary-600)" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Select;
