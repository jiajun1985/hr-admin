import React, { useState } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { TableText } from '../components/basics/TableText';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedOperationLogs } from '../mockApi/demoData';

interface OperationLog {
  id: string;
  action: string;
  module: string;
  operator: string;
  operatorRole: string;
  ip: string;
  status: 'success' | 'failed';
  detail: string;
  createTime: string;
  duration: number;
}

const OperationLog: React.FC = () => {
  const [logs] = useLocalStorageState<OperationLog[]>(DEMO_STORAGE_KEYS.operationLogs, seedOperationLogs);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const columns: TableColumn<OperationLog>[] = [
    {
      key: 'action',
      title: '操作名称',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{record.action}</div>
          <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{record.module}</div>
        </div>
      ),
    },
    {
      key: 'operator',
      title: '操作人',
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{record.operator}</div>
          <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{record.operatorRole}</div>
        </div>
      ),
    },
    {
      key: 'ip',
      title: 'IP地址',
      width: 130,
      dataIndex: 'ip',
      render: (value) => <TableText>{value}</TableText>,
    },
    {
      key: 'status',
      title: '状态',
      width: 80,
      dataIndex: 'status',
      render: (value) => (
        <Tag color={value === 'success' ? 'success' : 'error'}>
          {value === 'success' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      key: 'detail',
      title: '操作详情',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {value}
          </span>
          <Button type="tertiary" size="sm" onClick={() => {
            setSelectedLog(record);
            setDetailModalOpen(true);
          }}>
            详情
          </Button>
        </div>
      ),
    },
    {
      key: 'duration',
      title: '耗时',
      width: 80,
      dataIndex: 'duration',
      align: 'right',
      render: (value) => (
        <TableText align="right" tone="muted" style={{ fontSize: '12px' }}>
          {value === 0 ? '-' : `${value}ms`}
        </TableText>
      ),
    },
    {
      key: 'createTime',
      title: '操作时间',
      width: 170,
      dataIndex: 'createTime',
    },
  ];

  const stats = [
    { title: '今日操作', value: '156', subText: '次' },
    { title: '操作成功', value: '148', subText: '次', trend: { value: '成功率', direction: 'up' as const, percentage: '94.9%' } },
    { title: '操作失败', value: '8', subText: '次' },
    { title: '活跃用户', value: '23', subText: '人' },
  ];

  const filters = [
    {
      key: 'module',
      label: '模块',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '系统', value: '系统' },
        { label: '员工管理', value: '员工管理' },
        { label: '积分管理', value: '积分管理' },
        { label: '福利管理', value: '福利管理' },
        { label: '财务管理', value: '财务管理' },
        { label: '运营管理', value: '运营管理' },
        { label: '权限管理', value: '权限管理' },
      ],
    },
    {
      key: 'status',
      label: '状态',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' },
      ],
    },
    {
      key: 'operator',
      label: '操作人',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: 'admin', value: 'admin' },
        { label: 'hr_001', value: 'hr_001' },
        { label: 'hr_002', value: 'hr_002' },
        { label: 'finance_001', value: 'finance_001' },
      ],
    },
  ];

  const filteredData = logs.filter((log) => {
    const matchesSearch = !searchValue || 
      log.action.includes(searchValue) || 
      log.operator.includes(searchValue) ||
      log.detail.includes(searchValue);
    const matchesModule = !filterValues.module || log.module === filterValues.module;
    const matchesStatus = !filterValues.status || log.status === filterValues.status;
    const matchesOperator = !filterValues.operator || log.operator === filterValues.operator;
    return matchesSearch && matchesModule && matchesStatus && matchesOperator;
  });

  return (
    <>
      <ListPageTemplate
        title="操作日志"
        description="记录系统所有操作行为，便于问题追溯和安全审计"
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '系统管理' },
          { label: '操作日志' },
        ]}
        stats={stats}
        searchPlaceholder="搜索操作名称/操作人/详情..."
        filters={filters}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pageActions={[
          { buttonType: 'secondary' as const, label: '导出日志', icon: 'download' as const, onClick: () => console.log('导出') },
        ]}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData.length,
          onChange: () => {},
        }}
        onSearch={setSearchValue}
        onFilterChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
        onReset={() => {
          setFilterValues({});
          setSearchValue('');
        }}
      />

      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="操作详情"
        size="md"
        footer={[
          <Button key="close" type="secondary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedLog && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>操作名称</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{selectedLog.action}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>所属模块</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{selectedLog.module}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>操作人</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{selectedLog.operator}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>角色</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{selectedLog.operatorRole}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>IP地址</div>
                <TableText tone="strong" style={{ fontSize: '14px' }}>{selectedLog.ip}</TableText>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>执行耗时</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>
                  {selectedLog.duration === 0 ? '-' : `${selectedLog.duration} ms`}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>执行状态</div>
                <Tag color={selectedLog.status === 'success' ? 'success' : 'error'}>
                  {selectedLog.status === 'success' ? '成功' : '失败'}
                </Tag>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>操作时间</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-800)' }}>{selectedLog.createTime}</div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '8px' }}>操作详情</div>
              <div style={{ padding: '12px', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                {selectedLog.detail}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OperationLog;
