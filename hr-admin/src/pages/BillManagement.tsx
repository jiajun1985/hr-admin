import React, { useState } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { DetailPageTemplate } from '../components/composites/DetailPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface Bill {
  id: string;
  billNo: string;
  period: string;
  companyName: string;
  insurancePlan: string;
  employeeCount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

const mockBills: Bill[] = [
  { id: '1', billNo: 'BILL-2024-04-001', period: '2024年4月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1205, totalAmount: 486000, paidAmount: 486000, status: 'paid', dueDate: '2024-04-30', paidDate: '2024-04-25' },
  { id: '2', billNo: 'BILL-2024-04-002', period: '2024年4月', companyName: '示例科技公司', insurancePlan: '企业版套餐', employeeCount: 320, totalAmount: 256000, paidAmount: 256000, status: 'paid', dueDate: '2024-04-30', paidDate: '2024-04-28' },
  { id: '3', billNo: 'BILL-2024-03-003', period: '2024年3月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1187, totalAmount: 474800, paidAmount: 474800, status: 'paid', dueDate: '2024-03-31', paidDate: '2024-03-28' },
  { id: '4', billNo: 'BILL-2024-02-004', period: '2024年2月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1150, totalAmount: 460000, paidAmount: 0, status: 'overdue', dueDate: '2024-02-29' },
  { id: '5', billNo: 'BILL-2024-01-005', period: '2024年1月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1100, totalAmount: 440000, paidAmount: 440000, status: 'paid', dueDate: '2024-01-31', paidDate: '2024-01-25' },
];

const BillManagement: React.FC = () => {
  const [bills, setBills] = useLocalStorageState<Bill[]>(DEMO_STORAGE_KEYS.bills, mockBills);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  const handlePayBill = (bill: Bill) => {
    const paidDate = new Date().toISOString().slice(0, 10);
    const paidBill: Bill = {
      ...bill,
      paidAmount: bill.totalAmount,
      status: 'paid',
      paidDate,
    };
    setBills((prev) => prev.map((item) => (item.id === bill.id ? paidBill : item)));
    setSelectedBill((prev) => (prev?.id === bill.id ? paidBill : prev));
    setDetailModalOpen(false);
  };

  const columns: TableColumn<Bill>[] = [
    {
      key: 'billNo',
      title: '账单编号',
      width: 180,
      dataIndex: 'billNo',
      render: (value) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>{value}</span>
      ),
    },
    {
      key: 'period',
      title: '账单周期',
      width: 120,
      dataIndex: 'period',
    },
    {
      key: 'insurancePlan',
      title: '保险方案',
      width: 140,
      dataIndex: 'insurancePlan',
      render: (value) => <Tag color="primary">{value}</Tag>,
    },
    {
      key: 'employeeCount',
      title: '员工人数',
      width: 100,
      dataIndex: 'employeeCount',
      align: 'center',
    },
    {
      key: 'totalAmount',
      title: '账单金额',
      width: 130,
      dataIndex: 'totalAmount',
      align: 'right',
      render: (value) => (
        <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)' }}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paidAmount',
      title: '已付金额',
      width: 130,
      dataIndex: 'paidAmount',
      align: 'right',
      render: (value, record) => (
        <span style={{ color: value === record.totalAmount ? 'var(--success-600)' : 'var(--warning-600)' }}>
          ¥{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value) => {
        const config = {
          pending: { color: 'warning' as const, label: '待支付' },
          paid: { color: 'success' as const, label: '已支付' },
          overdue: { color: 'error' as const, label: '已逾期' },
        };
        return <Tag color={config[value].color}>{config[value].label}</Tag>;
      },
    },
    {
      key: 'dueDate',
      title: '到期日',
      width: 120,
      dataIndex: 'dueDate',
    },
    {
      key: 'actions',
      title: '操作',
      width: 140,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="tertiary" size="sm" onClick={() => {
            setSelectedBill(record);
            setDetailModalOpen(true);
          }}>
            查看详情
          </Button>
          {record.status !== 'paid' && (
            <Button type="primary" size="sm" onClick={() => handlePayBill(record)}>
              支付
            </Button>
          )}
        </div>
      ),
    },
  ];

  const stats = [
    { title: '本月应付', value: '742,000', trend: { value: '较上月', direction: 'up' as const, percentage: '+2.3%' }, subText: '2笔账单' },
    { title: '待支付', value: '0', subText: '无待支付账单' },
    { title: '已逾期', value: '0', subText: '无逾期账单' },
    { title: '累计已付', value: '1,656,800', subText: '2024年度' },
  ];

  const filters = [
    {
      key: 'status',
      label: '状态',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '待支付', value: 'pending' },
        { label: '已支付', value: 'paid' },
        { label: '已逾期', value: 'overdue' },
      ],
    },
    {
      key: 'period',
      label: '账单周期',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '2024年4月', value: '2024-04' },
        { label: '2024年3月', value: '2024-03' },
        { label: '2024年2月', value: '2024-02' },
        { label: '2024年1月', value: '2024-01' },
      ],
    },
  ];

  const filteredData = bills.filter((bill) => {
    const matchesSearch = !searchValue || bill.billNo.includes(searchValue) || bill.companyName.includes(searchValue);
    const matchesStatus = !filterValues.status || bill.status === filterValues.status;
    const matchesPeriod = !filterValues.period || bill.period.includes(filterValues.period);
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  return (
    <>
      <ListPageTemplate
        title="账单管理"
        description="查看和管理企业福利账单，包括保费支付、账单查询等功能"
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '财务结算' },
          { label: '账单管理' },
        ]}
        stats={stats}
        searchPlaceholder="搜索账单编号/公司名称..."
        filters={filters}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pageActions={[
          { buttonType: 'secondary' as const, label: '导出账单', icon: 'download' as const, onClick: () => console.log('导出') },
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
        title="账单详情"
        size="lg"
        footer={[
          <Button key="close" type="secondary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
          selectedBill?.status !== 'paid' && (
            <Button key="pay" type="primary" onClick={() => {
              if (selectedBill) {
                handlePayBill(selectedBill);
              }
            }}>
              立即支付
            </Button>
          ),
        ]}
      >
        {selectedBill && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>账单编号</div>
                <div style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'monospace' }}>{selectedBill.billNo}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>账单周期</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.period}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>保险方案</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.insurancePlan}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>员工人数</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.employeeCount} 人</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>账单金额</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--gray-800)' }}>¥{selectedBill.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>已付金额</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: selectedBill.paidAmount === selectedBill.totalAmount ? 'var(--success-600)' : 'var(--warning-600)' }}>
                  ¥{selectedBill.paidAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>到期日</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.dueDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>支付状态</div>
                <Tag color={selectedBill.status === 'paid' ? 'success' : selectedBill.status === 'pending' ? 'warning' : 'error'}>
                  {selectedBill.status === 'paid' ? '已支付' : selectedBill.status === 'pending' ? '待支付' : '已逾期'}
                </Tag>
              </div>
              {selectedBill.paidDate && (
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>支付时间</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.paidDate}</div>
                </div>
              )}
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon name="info" size={16} color="var(--primary-600)" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-700)' }}>账单说明</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', lineHeight: 1.6, margin: 0 }}>
                本账单包含 {selectedBill.employeeCount} 名员工的商业保险费用，保险期间为 {selectedBill.period} 1日至{selectedBill.period.replace('年', '-').replace('月', '月1日')}末日。
              </p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BillManagement;
