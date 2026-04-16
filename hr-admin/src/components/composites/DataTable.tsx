import React from 'react';
import { Checkbox } from '../basics/Checkbox';
import { Tag } from '../basics/Tag';
import { Icon } from '../basics/Icon';
import { Pagination } from '../basics/Pagination';

export interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface RowAction {
  key: string;
  label: string;
  type?: 'primary' | 'danger' | 'default';
  onClick: (record: any) => void;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (keys: (string | number)[], rows: T[]) => void;
  };
  rowActions?: RowAction[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  loading?: boolean;
  emptyText?: string;
  emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'id' as keyof T,
  rowSelection,
  rowActions,
  pagination,
  loading = false,
  emptyText = '暂无数据',
  emptyDescription,
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  const isAllSelected = () => {
    if (!rowSelection || dataSource.length === 0) return false;
    return dataSource.every((record) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, 0))
    );
  };

  const isIndeterminate = () => {
    if (!rowSelection || dataSource.length === 0) return false;
    const selectedCount = dataSource.filter((record) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, 0))
    ).length;
    return selectedCount > 0 && selectedCount < dataSource.length;
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    if (checked) {
      const allKeys = dataSource.map((record) => getRowKey(record, 0));
      rowSelection.onChange(allKeys, dataSource);
    } else {
      rowSelection.onChange([], []);
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    if (!rowSelection) return;
    const key = getRowKey(record, 0);
    const selectedKeys = checked
      ? [...rowSelection.selectedRowKeys, key]
      : rowSelection.selectedRowKeys.filter((k) => k !== key);
    const selectedRows = dataSource.filter((record) =>
      selectedKeys.includes(getRowKey(record, 0))
    );
    rowSelection.onChange(selectedKeys, selectedRows);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-50)',
  };

  const thStyle = (align: 'left' | 'center' | 'right' = 'left'): React.CSSProperties => ({
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--gray-600)',
    textAlign: align,
    borderBottom: '1px solid var(--gray-200)',
    whiteSpace: 'nowrap',
  });

  const tdStyle = (align: 'left' | 'center' | 'right' = 'left'): React.CSSProperties => ({
    padding: '14px 16px',
    fontSize: '13px',
    color: 'var(--gray-600)',
    textAlign: align,
    borderBottom: '1px solid var(--gray-100)',
  });

  const trStyle = (isHovered: boolean): React.CSSProperties => ({
    backgroundColor: isHovered ? 'var(--gray-50)' : 'transparent',
    transition: 'background-color 0.15s',
  });

  const checkboxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: 'var(--gray-400)',
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  };

  const paginationContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 16px',
    borderTop: '1px solid var(--gray-100)',
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            {rowSelection && (
              <th style={{ ...thStyle('center'), width: '48px' }}>
                <div style={checkboxStyle}>
                  <Checkbox
                    checked={isAllSelected()}
                    indeterminate={isIndeterminate()}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...thStyle(column.align || 'left'),
                  width: column.width,
                }}
              >
                {column.title}
              </th>
            ))}
            {rowActions && rowActions.length > 0 && (
              <th style={{ ...thStyle('right'), width: rowActions.length * 60 + 20 }}>
                操作
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (rowSelection ? 1 : 0) + (rowActions ? 1 : 0)}>
                <div style={loadingStyle}>
                  <Icon name="loading" size={24} className="animate-spin" />
                </div>
              </td>
            </tr>
          ) : dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (rowSelection ? 1 : 0) + (rowActions ? 1 : 0)}>
                <div style={emptyStyle}>
                  <Icon name="document" size={48} color="var(--gray-300)" />
                  <div style={{ marginTop: '12px', fontSize: '14px' }}>{emptyText}</div>
                  {emptyDescription && (
                    <div style={{ marginTop: '4px', fontSize: '12px' }}>{emptyDescription}</div>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            dataSource.map((record, index) => {
              const rowKeyValue = getRowKey(record, index);
              const isSelected = rowSelection?.selectedRowKeys.includes(rowKeyValue);
              return (
                <RowRenderer
                  key={rowKeyValue}
                  record={record}
                  index={index}
                  columns={columns}
                  rowKey={rowKeyValue}
                  isSelected={isSelected}
                  rowSelection={rowSelection}
                  rowActions={rowActions}
                  onSelectRow={handleSelectRow}
                  trStyle={trStyle}
                  tdStyle={tdStyle}
                  checkboxStyle={checkboxStyle}
                />
              );
            })
          )}
        </tbody>
      </table>
      {pagination && (
        <div style={paginationContainerStyle}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}

interface RowRendererProps<T> {
  record: T;
  index: number;
  columns: TableColumn<T>[];
  rowKey: string | number;
  isSelected?: boolean;
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (keys: (string | number)[], rows: T[]) => void;
  };
  rowActions?: RowAction[];
  onSelectRow: (record: T, checked: boolean) => void;
  trStyle: (isHovered: boolean) => React.CSSProperties;
  tdStyle: (align: 'left' | 'center' | 'right') => React.CSSProperties;
  checkboxStyle: React.CSSProperties;
}

function RowRenderer<T extends Record<string, any>>({
  record,
  index,
  columns,
  rowKey,
  isSelected,
  rowSelection,
  rowActions,
  onSelectRow,
  trStyle,
  tdStyle,
  checkboxStyle,
}: RowRendererProps<T>) {
  const [isHovered, setIsHovered] = React.useState(false);

  const getActionColor = (type?: string) => {
    switch (type) {
      case 'primary':
        return 'var(--primary-600)';
      case 'danger':
        return 'var(--error-600)';
      default:
        return 'var(--gray-500)';
    }
  };

  return (
    <tr
      style={{
        ...trStyle(isHovered),
        backgroundColor: isSelected ? 'var(--primary-50)' : isHovered ? 'var(--gray-50)' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {rowSelection && (
        <td style={{ ...tdStyle('center'), width: '48px' }}>
          <div style={checkboxStyle}>
            <Checkbox
              checked={isSelected}
              onChange={(checked) => onSelectRow(record, checked)}
            />
          </div>
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.key}
          style={{
            ...tdStyle(column.align || 'left'),
            width: column.width,
          }}
        >
          {column.render
            ? column.render(record[column.dataIndex as keyof T], record, index)
            : (record[column.dataIndex as keyof T] as React.ReactNode)}
        </td>
      ))}
      {rowActions && rowActions.length > 0 && (
        <td style={{ ...tdStyle('right'), width: rowActions.length * 60 + 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            {rowActions.map((action) => (
              <button
                key={action.key}
                onClick={() => action.onClick(record)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: getActionColor(action.type),
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {action.label}
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
}

export default DataTable;
