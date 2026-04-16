import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { StatCard } from '../components/composites/StatCard';
import { FilterBar } from '../components/composites/FilterBar';
import { DataTable, type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';

interface Employee {
  id: string;
  empNo: string;
  name: string;
  department: string;
  gender: string;
  phone: string;
  status: 'active' | 'inactive';
  entryDate: string;
}

const mockEmployees: Employee[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', gender: '男', phone: '138****8001', status: 'active', entryDate: '2021-05-10' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', gender: '女', phone: '139****8002', status: 'active', entryDate: '2022-03-15' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', gender: '男', phone: '137****8003', status: 'active', entryDate: '2020-08-20' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', gender: '女', phone: '136****8004', status: 'inactive', entryDate: '2019-12-01' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', gender: '男', phone: '135****8005', status: 'active', entryDate: '2023-01-08' },
];

const Dashboard: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const columns: TableColumn<Employee>[] = [
    {
      key: 'empNo',
      title: '工号',
      width: 100,
      dataIndex: 'empNo',
    },
    {
      key: 'name',
      title: '姓名',
      width: 100,
      dataIndex: 'name',
      render: (value) => (
        <span style={{ color: 'var(--primary-600)', cursor: 'pointer' }}>{value}</span>
      ),
    },
    {
      key: 'department',
      title: '部门',
      width: 120,
      dataIndex: 'department',
      render: (value) => <Tag>{value}</Tag>,
    },
    {
      key: 'gender',
      title: '性别',
      width: 60,
      align: 'center',
      dataIndex: 'gender',
    },
    {
      key: 'phone',
      title: '手机号',
      width: 120,
      dataIndex: 'phone',
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Tag color={value === 'active' ? 'success' : 'default'}>
            {value === 'active' ? '在职' : '离职'}
          </Tag>
          {value === 'active' && <Tag color="primary">已激活</Tag>}
        </div>
      ),
    },
    {
      key: 'entryDate',
      title: '入职时间',
      width: 110,
      dataIndex: 'entryDate',
    },
  ];

  const rowActions = [
    { key: 'view', label: '查看详情', type: 'primary' as const, onClick: () => {} },
    { key: 'leave', label: '离职', type: 'danger' as const, onClick: () => {} },
  ];

  const filters = [
    { key: 'department', label: '部门', type: 'select' as const, options: [
      { label: '全部', value: '' },
      { label: '研发部', value: '研发部' },
      { label: '市场部', value: '市场部' },
      { label: '销售部', value: '销售部' },
    ]},
    { key: 'status', label: '状态', type: 'select' as const, options: [
      { label: '全部', value: '' },
      { label: '在职', value: 'active' },
      { label: '离职', value: 'inactive' },
    ]},
  ];

  const filteredData = mockEmployees.filter((emp) => {
    const matchesSearch = !searchValue || 
      emp.name.includes(searchValue) || 
      emp.empNo.includes(searchValue) ||
      emp.department.includes(searchValue);
    return matchesSearch;
  });

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '数据看板' },
        ]}
        title="数据看板"
        description="欢迎回来，XX科技有限公司 | 上次更新：刚刚"
        actions={[
          { buttonType: 'secondary', label: '导出报表', icon: 'export', onClick: () => {} },
          { buttonType: 'tertiary', label: '设置看板', icon: 'config', onClick: () => {} },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <StatCard
          title="在职员工"
          value="1,205"
          trend={{ value: '较上月', direction: 'up', percentage: '+1.2%' }}
          subText="本月新增 18 人"
          action={{ label: '查看全部', onClick: () => {} }}
        />
        <StatCard
          title="本月新入职"
          value="18"
          trend={{ value: '较上月', direction: 'up', percentage: '+5.0%' }}
          subText="待完善: 3人"
        />
        <StatCard
          title="本月离职"
          value="12"
          trend={{ value: '较上月', direction: 'down', percentage: '-2.5%' }}
          subText="已结算: 12人"
        />
        <StatCard
          title="福利激活率"
          value="97.9"
          suffix="%"
          trend={{ value: '较上月', direction: 'up', percentage: '+0.5%' }}
          subText="未激活: 25人"
          action={{ label: '一键提醒', onClick: () => {} }}
        />
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <Button icon="plus" type="primary" onClick={() => {}}>新增员工</Button>
        <Button icon="import" type="secondary" onClick={() => {}}>批量导入</Button>
        <Button icon="points" type="secondary" onClick={() => {}}>发放积分</Button>
        <Button icon="medical" type="secondary" onClick={() => {}}>体检导入</Button>
        <Button icon="gift" type="secondary" onClick={() => {}}>发布福利</Button>
      </div>

      <PageHeader
        title="员工列表"
        description="管理企业员工信息，包括入职、离职、部门调动及福利账号状态维护"
        actions={[
          { buttonType: 'secondary', label: '批量导入', icon: 'import', onClick: () => {} },
          { buttonType: 'primary', label: '新增员工', icon: 'plus', onClick: () => {} },
        ]}
      />

      <FilterBar
        searchPlaceholder="输入姓名/工号/部门..."
        filters={filters}
        searchValue={searchValue}
        onSearch={setSearchValue}
        batchBar={
          selectedRowKeys.length > 0
            ? {
                selectedCount: selectedRowKeys.length,
                actions: [
                  { key: 'points', label: '发放积分', onClick: () => {} },
                  { key: 'department', label: '调整部门', onClick: () => {} },
                  { key: 'leave', label: '批量离职', type: 'danger', onClick: () => {} },
                ],
                onClear: () => setSelectedRowKeys([]),
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        rowActions={rowActions}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData.length,
          onChange: () => {},
        }}
      />
    </>
  );
};

export default Dashboard;
