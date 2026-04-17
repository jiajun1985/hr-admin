import React, { useState, useEffect } from 'react';
import { DetailPageTemplate, type TabItem } from '../components/composites/DetailPageTemplate';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Icon } from '../components/basics/Icon';
import { TableText } from '../components/basics/TableText';
import { DataTable, type TableColumn } from '../components/composites/DataTable';
import { useNavigation } from '../contexts/NavigationContext';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { seedEmployees } from '../mockApi/employeeSeedData';

const mockEmployeesData = seedEmployees;

const getMockEmployee = (employeeId?: string, employees = mockEmployeesData) => {
  if (!employeeId) return employees[0] || mockEmployeesData[0];
  const employee = employees.find(e => e.empNo === employeeId || e.id === employeeId);
  const fallback = mockEmployeesData.find(e => e.empNo === employeeId || e.id === employeeId);
  return employee ? { ...fallback, ...employee } : fallback || employees[0] || mockEmployeesData[0];
};

const mockInsurance = [
  { id: '1', name: '补充医疗保险', status: 'active', company: '平安保险', policyNo: 'PA2026001234', startDate: '2026-01-01', amount: '2万/年' },
  { id: '2', name: '意外险', status: 'pending', company: '太平洋保险', policyNo: 'CP2026005678', startDate: '2026-03-01', amount: '10万/年' },
];

const mockClaims = [
  { id: '1', date: '2026-03-15', type: '门诊', amount: 320, status: '已赔付' },
  { id: '2', date: '2026-01-20', type: '住院', amount: 5000, status: '已赔付' },
];

const mockMedical = {
  current: '2026年度全面体检',
  company: '美年大健康',
  appointment: '2026-05-20 14:00',
  status: '已预约',
  rate: 67,
};

const mockPoints = {
  balance: 2560,
  totalIncome: 5200,
  totalExpense: 2640,
};

const mockOrders = [
  { id: '1', orderNo: 'ORD20260315001', product: '颈椎按摩仪', points: -500, date: '2026-03-15', status: '已完成' },
  { id: '2', orderNo: 'ORD20260310002', product: '电影票×2', points: -80, date: '2026-03-10', status: '已完成' },
];

const EmployeeDetail: React.FC = () => {
  const { currentParams } = useNavigation();
  const [employees] = useLocalStorageState(DEMO_STORAGE_KEYS.employees, mockEmployeesData);
  const [activeTab, setActiveTab] = useState('basic');
  
  const employeeId = currentParams.employeeId;
  const mockEmployee = getMockEmployee(employeeId, employees);

  const tabs: TabItem[] = [
    { key: 'basic', label: '基本信息' },
    { key: 'insurance', label: '保险', badge: 2 },
    { key: 'medical', label: '体检' },
    { key: 'points', label: '积分' },
    { key: 'orders', label: '订单' },
  ];

  const insuranceColumns: TableColumn<typeof mockInsurance[0]>[] = [
    { key: 'name', title: '方案名称', dataIndex: 'name' },
    { key: 'company', title: '保险公司', dataIndex: 'company' },
    { key: 'policyNo', title: '保单号', dataIndex: 'policyNo', render: (v) => <TableText>{v}</TableText> },
    { key: 'amount', title: '保额', dataIndex: 'amount', align: 'right' },
    { key: 'status', title: '状态', dataIndex: 'status', render: (v) => <Tag color={v === 'active' ? 'success' : 'warning'}>{v === 'active' ? '保障中' : '处理中'}</Tag> },
  ];

  const claimColumns: TableColumn<typeof mockClaims[0]>[] = [
    { key: 'date', title: '理赔日期', dataIndex: 'date' },
    { key: 'type', title: '理赔类型', dataIndex: 'type' },
    { key: 'amount', title: '理赔金额', dataIndex: 'amount', align: 'right', render: (v) => `¥${v}` },
    { key: 'status', title: '状态', dataIndex: 'status', render: (v) => <Tag color="success">{v}</Tag> },
  ];

  const orderColumns: TableColumn<typeof mockOrders[0]>[] = [
    { key: 'orderNo', title: '订单号', dataIndex: 'orderNo', render: (v) => <TableText>{v}</TableText> },
    { key: 'product', title: '商品', dataIndex: 'product' },
    { key: 'points', title: '积分', dataIndex: 'points', align: 'right', render: (v) => <span style={{ color: v < 0 ? 'var(--error-600)' : 'var(--success-600)' }}>{v}</span> },
    { key: 'date', title: '兑换日期', dataIndex: 'date' },
    { key: 'status', title: '状态', dataIndex: 'status', render: (v) => <Tag color="success">{v}</Tag> },
  ];

  const renderLeftContent = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-100)',
          color: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 600,
          margin: '0 auto 12px',
        }}>
          {mockEmployee.name.charAt(0)}
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>
          {mockEmployee.name}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
          {mockEmployee.department} · {mockEmployee.position}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>基础信息</h3>
        <InfoRow label="工号" value={mockEmployee.empNo} />
        <InfoRow label="入职" value={mockEmployee.entryDate} />
        <InfoRow label="手机" value={mockEmployee.phone} />
        <InfoRow label="邮箱" value={mockEmployee.email || '-'} />
      </div>

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>快捷操作</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button type="secondary" block onClick={() => {}}>
            <Icon name="edit" size={14} /> 编辑信息
          </Button>
          <Button type="secondary" block onClick={() => {}}>
            <Icon name="department" size={14} /> 调整部门
          </Button>
          <Button type="danger" block onClick={() => {}}>
            <Icon name="delete" size={14} /> 办理离职
          </Button>
        </div>
      </div>
    </div>
  );

  const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
      <span style={{ color: 'var(--gray-400)' }}>{label}</span>
      <span style={{ color: 'var(--gray-600)' }}>{value}</span>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div>
            <Section title="个人信息">
              <InfoGrid items={[
                { label: '姓名', value: mockEmployee.name },
                { label: '性别', value: mockEmployee.gender },
                { label: '生日', value: mockEmployee.birthday || '-' },
                { label: '学历', value: mockEmployee.education || '-' },
                { label: '毕业院校', value: mockEmployee.graduateSchool || '-' },
                { label: '证件号', value: mockEmployee.idCard || '-' },
              ]} />
            </Section>
            <Section title="联系信息">
              <InfoGrid items={[
                { label: '手机号', value: mockEmployee.phone },
                { label: '邮箱', value: mockEmployee.email || '-' },
              ]} />
            </Section>
            <Section title="工作信息">
              <InfoGrid items={[
                { label: '工号', value: mockEmployee.empNo },
                { label: '部门', value: mockEmployee.department },
                { label: '职位', value: mockEmployee.position },
                { label: '入职日期', value: mockEmployee.entryDate },
              ]} />
            </Section>
          </div>
        );
      case 'insurance':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>当前生效方案</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="sm" type="secondary">加员</Button>
                <Button size="sm" type="secondary">减员</Button>
              </div>
            </div>
            {mockInsurance.map((insurance) => (
              <InsuranceCard key={insurance.id} data={insurance} />
            ))}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>历史理赔</h3>
                <Button type="text" size="sm">查看全部</Button>
              </div>
              <DataTable
                columns={claimColumns}
                dataSource={mockClaims}
                rowKey="id"
              />
            </div>
          </div>
        );
      case 'medical':
        return (
          <div>
            <div style={{ backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>
                {mockMedical.current}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '12px' }}>
                体检机构: {mockMedical.company}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="calendar" size={14} color="var(--gray-400)" />
                  <span style={{ fontSize: '13px', color: 'var(--gray-600)' }}>
                    已预约 {mockMedical.appointment}
                  </span>
                </div>
                <Tag color="primary">{mockMedical.status}</Tag>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>到检进度</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${mockMedical.rate}%`, height: '100%', backgroundColor: 'var(--primary-500)', borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-600)' }}>{mockMedical.rate}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'points':
        return (
          <div>
            <div style={{ backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-md)', padding: '24px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>积分余额</div>
              <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--primary-600)' }}>
                {mockPoints.balance}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>累计收入</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--success-600)' }}>+{mockPoints.totalIncome}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>累计支出</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--error-600)' }}>{mockPoints.totalExpense}</div>
                </div>
              </div>
            </div>
            <Button type="primary">发放积分</Button>
          </div>
        );
      case 'orders':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>兑换记录</h3>
              <Button type="text" size="sm">查看全部</Button>
            </div>
            <DataTable
              columns={orderColumns}
              dataSource={mockOrders}
              rowKey="id"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>{title}</h3>
      {children}
    </div>
  );

  const InfoGrid: React.FC<{ items: Array<{ label: string; value: string }> }> = ({ items }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
      {items.map((item, index) => (
        <div key={index}>
          <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>{item.label}</div>
          <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );

  const InsuranceCard: React.FC<{ data: typeof mockInsurance[0] }> = ({ data }) => (
    <div style={{
      border: '1px solid var(--gray-200)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>{data.name}</span>
          <Tag color={data.status === 'active' ? 'success' : 'warning'}>
            {data.status === 'active' ? '生效中' : '处理中'}
          </Tag>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '13px' }}>
        <div>
          <div style={{ color: 'var(--gray-400)', marginBottom: '2px' }}>保险公司</div>
          <div style={{ color: 'var(--gray-600)' }}>{data.company}</div>
        </div>
        <div>
          <div style={{ color: 'var(--gray-400)', marginBottom: '2px' }}>保单号</div>
          <TableText tone="default">{data.policyNo}</TableText>
        </div>
        <div>
          <div style={{ color: 'var(--gray-400)', marginBottom: '2px' }}>生效日</div>
          <div style={{ color: 'var(--gray-600)' }}>{data.startDate}</div>
        </div>
        <div>
          <div style={{ color: 'var(--gray-400)', marginBottom: '2px' }}>保额</div>
          <div style={{ color: 'var(--gray-600)' }}>{data.amount}</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DetailPageTemplate
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '员工列表', path: '/employees' },
          { label: mockEmployee.name },
        ]}
        title={mockEmployee.name}
        subtitle={`${mockEmployee.empNo} - 员工福利档案`}
        actions={[
          { buttonType: 'secondary', label: '编辑信息', icon: 'edit', onClick: () => {} },
          { buttonType: 'tertiary', label: '更多操作', icon: 'more', onClick: () => {} },
        ]}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        leftContent={renderLeftContent()}
        rightContent={renderTabContent()}
        leftWidth={260}
      />
    </>
  );
};

export default EmployeeDetail;
