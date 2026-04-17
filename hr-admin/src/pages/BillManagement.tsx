import React, { useMemo, useState } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { DetailPageTemplate } from '../components/composites/DetailPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { TableText } from '../components/basics/TableText';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedBills } from '../mockApi/demoData';

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

const BillManagement: React.FC = () => {
  const [bills, setBills] = useLocalStorageState<Bill[]>(DEMO_STORAGE_KEYS.bills, seedBills);
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
      render: (value) => <TableText>{value}</TableText>,
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
        <TableText align="right" tone="strong" style={{ fontSize: '16px', fontWeight: 600 }}>
          ¥{value.toLocaleString()}
        </TableText>
      ),
    },
    {
      key: 'paidAmount',
      title: '已付金额',
      width: 130,
      dataIndex: 'paidAmount',
      align: 'right',
      render: (value, record) => (
        <TableText
          align="right"
          tone={value === record.totalAmount ? 'strong' : 'default'}
          style={{ color: value === record.totalAmount ? 'var(--success-600)' : 'var(--warning-600)' }}
        >
          ¥{value.toLocaleString()}
        </TableText>
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

  const stats = useMemo(() => {
    const currentPeriod = bills[0]?.period || '2026年4月';
    const currentBills = bills.filter((bill) => bill.period === currentPeriod);
    const currentTotal = currentBills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const pending = bills.filter((bill) => bill.status === 'pending');
    const overdue = bills.filter((bill) => bill.status === 'overdue');
    const paidTotal = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    return [
      { title: '本月应付', value: currentTotal.toLocaleString(), trend: { value: currentPeriod, direction: 'neutral' as const }, subText: `${currentBills.length}笔账单` },
      { title: '待支付', value: String(pending.length), subText: pending.length ? '需要财务处理' : '无待支付账单' },
      { title: '已逾期', value: String(overdue.length), subText: overdue.length ? '请尽快处理' : '无逾期账单' },
      { title: '累计已付', value: paidTotal.toLocaleString(), subText: '2026年度' },
    ];
  }, [bills]);

  const periodOptions = useMemo(() => {
    return Array.from(new Set(bills.map((bill) => bill.period))).map((period) => ({ label: period, value: period }));
  }, [bills]);

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
        ...periodOptions,
      ],
    },
  ];

  const filteredData = bills.filter((bill) => {
    const matchesSearch = !searchValue || bill.billNo.includes(searchValue) || bill.companyName.includes(searchValue);
    const matchesStatus = !filterValues.status || bill.status === filterValues.status;
    const matchesPeriod = !filterValues.period || bill.period === filterValues.period;
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
                <TableText tone="strong" style={{ fontSize: '14px', fontWeight: 500 }}>{selectedBill.billNo}</TableText>
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
