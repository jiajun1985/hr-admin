import React, { useState } from 'react';
import { Icon } from './Icon';

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  onPageSizeChange,
  showSizeChanger = true,
  showQuickJumper = false,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const [inputValue, setInputValue] = useState('');
  const totalPages = Math.ceil(total / pageSize);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (current >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  };

  const infoStyle: React.CSSProperties = {
    color: 'var(--gray-500)',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const pageButtonStyle = (active: boolean, disabled?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30px',
    height: '30px',
    padding: '0 7px',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: active ? 'var(--primary-600)' : 'var(--gray-0)',
    color: active ? '#ffffff' : 'var(--gray-600)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontWeight: active ? 500 : 400,
    transition: 'all 0.15s',
  });

  const navButtonStyle = (disabled?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--gray-0)',
    color: 'var(--gray-600)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
  });

  const selectStyle: React.CSSProperties = {
    height: '30px',
    padding: '0 8px',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    color: 'var(--gray-600)',
    backgroundColor: 'var(--gray-0)',
    cursor: 'pointer',
    outline: 'none',
  };

  const jumperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginLeft: '12px',
  };

  const jumperInputStyle: React.CSSProperties = {
    width: '44px',
    height: '30px',
    padding: '0 8px',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    textAlign: 'center',
    outline: 'none',
  };

  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>
        共 {total} 条，每页 {pageSize} 条
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={controlsStyle}>
          <button
            style={navButtonStyle(current === 1)}
            onClick={() => current > 1 && onChange(current - 1)}
            disabled={current === 1}
          >
            <Icon name="chevron-left" size={14} />
          </button>

          {getPageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                style={{ width: '32px', textAlign: 'center', color: 'var(--gray-400)' }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                style={pageButtonStyle(page === current)}
                onClick={() => onChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            style={navButtonStyle(current === totalPages)}
            onClick={() => current < totalPages && onChange(current + 1)}
            disabled={current === totalPages}
          >
            <Icon name="chevron-right" size={14} />
          </button>
        </div>

        {showQuickJumper && (
          <div style={jumperStyle}>
            <span style={{ color: 'var(--gray-500)' }}>跳至</span>
            <input
              style={jumperInputStyle}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(inputValue);
                  if (page >= 1 && page <= totalPages) {
                    onChange(page);
                    setInputValue('');
                  }
                }
              }}
            />
            <span style={{ color: 'var(--gray-500)' }}>页</span>
          </div>
        )}

        {showSizeChanger && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
            <span style={{ color: 'var(--gray-500)' }}>每页</span>
            <select
              style={selectStyle}
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}条
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
