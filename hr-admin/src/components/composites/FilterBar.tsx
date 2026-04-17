import React from 'react';
import { Input } from '../basics/Input';
import { Select, type SelectOption } from '../basics/Select';
import { Button } from '../basics/Button';
import { Icon } from '../basics/Icon';

export interface Filter {
  key: string;
  label: string;
  type?: 'select' | 'input';
  buttonType?: 'select' | 'input';
  options?: SelectOption[];
  placeholder?: string;
}

interface BatchAction {
  key: string;
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  danger?: boolean;
  onClick: () => void;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: Filter[];
  filterValues?: Record<string, string | number | (string | number)[]>;
  onFilterChange?: (key: string, value: string | number | (string | number)[]) => void;
  onReset?: () => void;
  hideLabels?: boolean;
  batchBar?: {
    selectedCount: number;
    actions: BatchAction[];
    onClear: () => void;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = '搜索...',
  onSearch,
  searchValue: externalSearchValue,
  filters = [],
  filterValues = {},
  onFilterChange,
  onReset,
  hideLabels = false,
  batchBar,
}) => {
  const [internalSearchValue, setInternalSearchValue] = React.useState('');

  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue;
  const controlWidth = '240px';

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    marginBottom: '16px',
  };

  const batchBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    backgroundColor: 'var(--primary-50)',
    border: '1px solid var(--primary-200)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '16px',
  };

  const filterRowStyle: React.CSSProperties = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'max-content',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'start',
  };

  const filterItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: hideLabels ? '0' : '8px',
    minWidth: '0',
    flex: '0 0 auto',
  };

  const filterLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--gray-500)',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };

  const actionGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: 'auto',
  };

  const handleSearch = (value: string) => {
    setInternalSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div>
      {batchBar && batchBar.selectedCount > 0 && (
        <div style={batchBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
              已选 <strong style={{ color: 'var(--primary-600)' }}>{batchBar.selectedCount}</strong> 人
            </span>
            <Button type="text" size="sm" onClick={batchBar.onClear}>
              清空
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {batchBar.actions.map((action) => (
              <Button
                key={action.key}
                type={action.type === 'danger' ? 'danger' : 'secondary'}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div style={containerStyle}>
        <div style={filterRowStyle}>
          <Input
            prefix={<Icon name="search" size={14} />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            contentColor="var(--gray-500)"
            style={{ width: controlWidth }}
          />

          {filters.map((filter) => (
            <div key={filter.key} style={filterItemStyle}>
              {!hideLabels && <span style={filterLabelStyle}>{filter.label}</span>}
              {(filter.type === 'select' || filter.buttonType === 'select') && filter.options && (
                <Select
                  options={filter.options}
                  value={filterValues[filter.key]}
                  onChange={(value) => onFilterChange?.(filter.key, value)}
                  placeholder={filter.placeholder || (hideLabels ? filter.label : '全部')}
                  style={{ width: controlWidth }}
                  contentColor="var(--gray-500)"
                />
              )}
              {(filter.type === 'input' || filter.buttonType === 'input') && (
                <Input
                  placeholder={filter.placeholder || (hideLabels ? filter.label : undefined)}
                  value={filterValues[filter.key] as string}
                  onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                  style={{ width: controlWidth }}
                  contentColor="var(--gray-500)"
                />
              )}
            </div>
          ))}

          {(onReset || onSearch) && (
            <div style={actionGroupStyle}>
              {onReset && (
                <Button type="tertiary" size="sm" onClick={onReset}>
                  重置
                </Button>
              )}
              {onSearch && (
                <Button type="primary" size="sm" onClick={() => onSearch?.(searchValue)}>
                  查询
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
