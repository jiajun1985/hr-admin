import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { StatCard } from './StatCard';
import { FilterBar, type Filter } from './FilterBar';
import { DataTable, TableColumn } from './DataTable';
import { BatchActionBar, BatchAction } from './BatchActionBar';
import { type IconName } from '../basics/Icon';

interface StatData {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    percentage?: string;
  };
  subText?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface PageAction {
  type?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  label: string;
  icon?: IconName;
  onClick: () => void;
}

interface ListPageTemplateProps<T> {
  title?: string;
  description?: string;
  breadcrumb?: Array<{ label: string; path?: string }>;
  stats?: StatData[];
  searchPlaceholder?: string;
  filters?: Filter[];
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (keys: (string | number)[], rows: T[]) => void;
  };
  rowActions?: Array<{
    key: string;
    label: string;
    type?: 'primary' | 'danger' | 'default';
    onClick: (record: T) => void;
  }>;
  batchActions?: BatchAction[];
  pageActions?: PageAction[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  loading?: boolean;
  emptyText?: string;
  onSearch?: (value: string) => void;
  onFilterChange?: (key: string, value: string | number | (string | number)[]) => void;
  onReset?: () => void;
  getSelectedItems?: (keys: (string | number)[]) => Array<{ key: string | number; label: string }>;
}

export function ListPageTemplate<T extends Record<string, any>>({
  title,
  description,
  breadcrumb,
  stats = [],
  searchPlaceholder = '搜索...',
  filters = [],
  columns,
  dataSource,
  rowKey = 'id',
  rowSelection,
  rowActions,
  batchActions = [],
  pageActions = [],
  pagination,
  loading = false,
  emptyText = '暂无数据',
  onSearch,
  onFilterChange,
  onReset,
  getSelectedItems,
}: ListPageTemplateProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  const handleSelectionChange = (keys: (string | number)[], rows: T[]) => {
    setSelectedRowKeys(keys);
    rowSelection?.onChange(keys, rows);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    onFilterChange?.(key, value);
  };

  const handleReset = () => {
    setFilterValues({});
    setSearchValue('');
    onReset?.();
  };

  const selectedItems = getSelectedItems ? getSelectedItems(selectedRowKeys) : [];

  return (
    <div>
      {breadcrumb && breadcrumb.length > 0 && (
        <PageHeader
          breadcrumb={breadcrumb}
          title={title}
          description={description}
          actions={pageActions.map((action) => ({
            ...action,
            onClick: action.onClick,
          }))}
        />
      )}

      {!breadcrumb && (
        <PageHeader
          title={title}
          description={description}
          actions={pageActions.map((action) => ({
            ...action,
            onClick: action.onClick,
          }))}
        />
      )}

      {stats.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          gap: '16px',
          marginBottom: '16px',
        }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {batchActions.length > 0 && (
        <BatchActionBar
          selectedCount={selectedRowKeys.length}
          actions={batchActions}
          onClear={() => handleSelectionChange([], [])}
          selectedItems={selectedItems}
        />
      )}

      <FilterBar
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={(value) => {
          setSearchValue(value);
          onSearch?.(value);
        }}
      />

      <DataTable
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        rowSelection={rowSelection ? {
          selectedRowKeys,
          onChange: handleSelectionChange,
        } : undefined}
        rowActions={rowActions}
        pagination={pagination}
        loading={loading}
        emptyText={emptyText}
      />
    </div>
  );
}

export default ListPageTemplate;
