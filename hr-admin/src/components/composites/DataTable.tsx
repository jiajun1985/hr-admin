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
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface RowAction {
  key: string;
  label: string;
  type?: 'primary' | 'danger' | 'default';
  onClick: (record: any) => void;
  hidden?: (record: any) => boolean;
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
  layoutMode?: 'fixed' | 'content';
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
  layoutMode = 'fixed',
}: DataTableProps<T>) {
  const paginatedData = pagination
    ? dataSource.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)
    : dataSource;

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  const isAllSelected = () => {
    if (!rowSelection || paginatedData.length === 0) return false;
    return paginatedData.every((record) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, 0))
    );
  };

  const isIndeterminate = () => {
    if (!rowSelection || paginatedData.length === 0) return false;
    const selectedCount = paginatedData.filter((record) =>
      rowSelection.selectedRowKeys.includes(getRowKey(record, 0))
    ).length;
    return selectedCount > 0 && selectedCount < paginatedData.length;
  };

  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection) return;
    if (checked) {
      const allKeys = paginatedData.map((record) => getRowKey(record, 0));
      rowSelection.onChange(allKeys, paginatedData);
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
    const selectedRows = paginatedData.filter((record) =>
      selectedKeys.includes(getRowKey(record, 0))
    );
    rowSelection.onChange(selectedKeys, selectedRows);
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-0)',
    borderRadius: 'var(--radius-md)',
    overflowX: 'auto',
    overflowY: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: layoutMode === 'content' ? 'max-content' : '100%',
    minWidth: '100%',
    borderCollapse: 'collapse',
    tableLayout: layoutMode === 'content' ? 'auto' : 'fixed',
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: 'var(--gray-50)',
  };

  const thStyle = (align: 'left' | 'center' | 'right' = 'left'): React.CSSProperties => ({
    padding: '12px 14px',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.4,
    color: 'var(--gray-600)',
    textAlign: align,
    borderBottom: '1px solid var(--gray-200)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    letterSpacing: 0,
  });

  const tdStyle = (align: 'left' | 'center' | 'right' = 'left'): React.CSSProperties => ({
    padding: '12px 14px',
    fontSize: '13px',
    lineHeight: 1.35,
    color: 'var(--gray-600)',
    textAlign: align,
    borderBottom: '1px solid var(--gray-100)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum" 1, "lnum" 1',
    letterSpacing: 0,
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
    padding: '10px 14px',
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
                  minWidth: column.minWidth,
                }}
              >
                {column.title}
              </th>
            ))}
            {rowActions && rowActions.length > 0 && (
              <th style={{ ...thStyle('center'), width: rowActions.length * 40 + 12 }}>
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
            paginatedData.map((record, index) => {
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
            minWidth: column.minWidth,
          }}
        >
          {column.render
            ? column.render(record[column.dataIndex as keyof T], record, index)
            : (record[column.dataIndex as keyof T] as React.ReactNode)}
        </td>
      ))}
      {rowActions && rowActions.length > 0 && (
        <td style={{ ...tdStyle('center'), width: rowActions.length * 40 + 12, paddingTop: '0', paddingBottom: '0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '20px' }}>
            {rowActions.map((action) =>
              action.hidden?.(record) ? null : (
                <button
                  key={action.key}
                  onClick={() => action.onClick(record)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: getActionColor(action.type),
                    cursor: 'pointer',
                    fontSize: '12px',
                    lineHeight: 1,
                    height: '20px',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        </td>
      )}
    </tr>
  );
}

export default DataTable;
