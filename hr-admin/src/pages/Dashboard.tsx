import React, { useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { StatCard } from '../components/composites/StatCard';
import { Icon, type IconName } from '../components/basics/Icon';
import { BarTrendChart, ChartCard, DonutChart, HorizontalBarChart } from '../components/charts';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { useNavigation, type PageKey } from '../contexts/NavigationContext';
import * as seedData from '../mockApi/seedData';
import type {
  Announcement,
  Bill,
  Employee,
  EmployeePoints,
  InsurancePlan,
  InsuranceProgressRecord,
  MedicalPlan,
  MedicalRecord,
} from '../mockApi/types';

interface DashboardMetric {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    percentage?: string;
  };
  subText: string;
}

interface TrendPoint {
  month: string;
  monthLabel: string;
  count: number;
}

interface DepartmentPoint {
  name: string;
  value: number;
}

interface WelfareProgressItem {
  name: string;
  value: number;
  total: number;
  percent: number;
  color: string;
}

interface TodoItem {
  key: string;
  title: string;
  description: string;
  count: number;
  icon: IconName;
  color: string;
  page: PageKey;
}

const formatNumber = (value: number) => value.toLocaleString('zh-CN');

const calculatePercent = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

const getMonthKey = (date?: string) => {
  if (!date) return '';
  const match = date.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : '';
};

const formatMonthLabel = (month: string) => {
  const [, monthValue] = month.split('-');
  return monthValue ? `${Number(monthValue)}月` : month;
};

const getYearMonthKeys = (year: number) =>
  Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

const getLatestMonthCount = (employees: Employee[]) => {
  const months = employees.map((employee) => getMonthKey(employee.entryDate)).filter(Boolean).sort();
  const latestMonth = months[months.length - 1];
  if (!latestMonth) return { month: '-', count: 0 };
  return {
    month: latestMonth,
    count: employees.filter((employee) => getMonthKey(employee.entryDate) === latestMonth).length,
  };
};

const getEntryTrend = (employees: Employee[]): TrendPoint[] => {
  const countByMonth = employees.reduce<Record<string, number>>((acc, employee) => {
    const month = getMonthKey(employee.entryDate);
    if (!month) return acc;
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const demoYear = 2026;
  return getYearMonthKeys(demoYear)
    .map((month) => ({
      month,
      monthLabel: formatMonthLabel(month),
      count: countByMonth[month] || 0,
    }));
};

const getDepartmentData = (employees: Employee[]): DepartmentPoint[] => {
  const countByDepartment = employees.reduce<Record<string, number>>((acc, employee) => {
    const department = employee.department || '未分配';
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(countByDepartment)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
  return rest > 0 ? [...top, { name: '其他', value: rest }] : top;
};

const getWelfareProgress = (
  employees: Employee[],
  medicalRecords: MedicalRecord[],
  insuranceProgress: InsuranceProgressRecord[],
  bills: Bill[],
  employeePoints: EmployeePoints[]
): WelfareProgressItem[] => {
  const activeEmployees = employees.filter((employee) => employee.status === 'active');
  const activatedEmployees = activeEmployees.filter((employee) => employee.activationStatus);
  const validMedicalRecords = medicalRecords.filter((record) => record.status !== 'cancelled');
  const appointedMedicalRecords = validMedicalRecords.filter((record) =>
    ['appointed', 'checked'].includes(record.status)
  );
  const checkedMedicalRecords = validMedicalRecords.filter((record) => record.status === 'checked');
  const insuredRecords = insuranceProgress.filter((record) => record.status === 'insured');
  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const paidBillAmount = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);

  return [
    {
      name: '福利账号激活',
      value: activatedEmployees.length,
      total: activeEmployees.length,
      percent: calculatePercent(activatedEmployees.length, activeEmployees.length),
      color: '#2563EB',
    },
    {
      name: '体检预约',
      value: appointedMedicalRecords.length,
      total: validMedicalRecords.length,
      percent: calculatePercent(appointedMedicalRecords.length, validMedicalRecords.length),
      color: '#16A34A',
    },
    {
      name: '体检完成',
      value: checkedMedicalRecords.length,
      total: validMedicalRecords.length,
      percent: calculatePercent(checkedMedicalRecords.length, validMedicalRecords.length),
      color: '#EA580C',
    },
    {
      name: '投保承保',
      value: insuredRecords.length,
      total: insuranceProgress.length,
      percent: calculatePercent(insuredRecords.length, insuranceProgress.length),
      color: '#7C3AED',
    },
    {
      name: '账单支付',
      value: paidBillAmount,
      total: totalBillAmount,
      percent: calculatePercent(paidBillAmount, totalBillAmount),
      color: '#0891B2',
    },
    {
      name: '积分账户覆盖',
      value: employeePoints.length,
      total: activeEmployees.length,
      percent: calculatePercent(employeePoints.length, activeEmployees.length),
      color: '#DC2626',
    },
  ];
};

const Dashboard: React.FC = () => {
  const { navigate } = useNavigation();
  const [employees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedData.seedEmployees);
  const [medicalPlans] = useLocalStorageState<MedicalPlan[]>(DEMO_STORAGE_KEYS.medicalPlans, seedData.seedMedicalPlans);
  const [medicalRecords] = useLocalStorageState<MedicalRecord[]>(DEMO_STORAGE_KEYS.medicalRecords, seedData.seedMedicalRecords);
  const [employeePoints] = useLocalStorageState<EmployeePoints[]>(DEMO_STORAGE_KEYS.employeePoints, seedData.seedEmployeePoints);
  const [insurancePlans] = useLocalStorageState<InsurancePlan[]>(DEMO_STORAGE_KEYS.insurancePlans, seedData.seedInsurancePlans);
  const [insuranceProgress] = useLocalStorageState<InsuranceProgressRecord[]>(DEMO_STORAGE_KEYS.insuranceProgress, seedData.seedInsuranceProgress);
  const [bills] = useLocalStorageState<Bill[]>(DEMO_STORAGE_KEYS.bills, seedData.seedBills);
  const [announcements] = useLocalStorageState<Announcement[]>(DEMO_STORAGE_KEYS.announcements, seedData.seedAnnouncements);

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.status === 'active'),
    [employees]
  );
  const inactiveEmployees = employees.length - activeEmployees.length;
  const activatedEmployees = activeEmployees.filter((employee) => employee.activationStatus);
  const latestEntry = getLatestMonthCount(employees);
  const overdueBills = bills.filter((bill) => bill.status === 'overdue');
  const pendingBills = bills.filter((bill) => bill.status === 'pending');
  const pendingInsuranceRecords = insuranceProgress.filter((record) =>
    ['pending', 'submitting', 'underwriting'].includes(record.status)
  );

  const entryTrend = useMemo(() => getEntryTrend(employees), [employees]);
  const entryTrendTotal = entryTrend.reduce((sum, item) => sum + item.count, 0);
  const entryTrendPeak = entryTrend.reduce<TrendPoint | null>(
    (peak, item) => (!peak || item.count > peak.count ? item : peak),
    null
  );
  const departmentData = useMemo(() => getDepartmentData(employees), [employees]);
  const welfareProgress = useMemo(
    () => getWelfareProgress(employees, medicalRecords, insuranceProgress, bills, employeePoints),
    [employees, medicalRecords, insuranceProgress, bills, employeePoints]
  );

  const metrics: DashboardMetric[] = [
    {
      title: '在职员工',
      value: formatNumber(activeEmployees.length),
      trend: { value: '当前在职规模', direction: 'up', percentage: `${formatNumber(employees.length)}人` },
      subText: `离职 ${formatNumber(inactiveEmployees)} 人`,
    },
    {
      title: '最近入职月',
      value: formatNumber(latestEntry.count),
      trend: { value: latestEntry.month, direction: 'neutral' },
      subText: '按员工入职日期聚合',
    },
    {
      title: '福利激活率',
      value: calculatePercent(activatedEmployees.length, activeEmployees.length),
      suffix: '%',
      trend: { value: '已激活账号', direction: 'up', percentage: `${formatNumber(activatedEmployees.length)}人` },
      subText: `未激活 ${formatNumber(activeEmployees.length - activatedEmployees.length)} 人`,
    },
    {
      title: '待支付账单',
      value: pendingBills.length + overdueBills.length,
      trend: {
        value: overdueBills.length > 0 ? '存在逾期账单' : '账单状态正常',
        direction: overdueBills.length > 0 ? 'down' : 'neutral',
      },
      subText: `逾期 ${formatNumber(overdueBills.length)} 笔`,
    },
  ];

  const todoItems: TodoItem[] = [
    {
      key: 'inactive-benefit',
      title: '福利账号未激活',
      description: '需要提醒员工完成账号激活',
      count: activeEmployees.length - activatedEmployees.length,
      icon: 'bell',
      color: 'var(--warning-600)',
      page: 'employee-list',
    },
    {
      key: 'insurance-progress',
      title: '投保流程待跟进',
      description: '包含待提交、待确认和承保中记录',
      count: pendingInsuranceRecords.length,
      icon: 'insurance',
      color: 'var(--primary-600)',
      page: 'insurance-progress',
    },
    {
      key: 'medical-pending',
      title: '体检名单待安排',
      description: '体检状态仍处于待预约',
      count: medicalRecords.filter((record) => record.status === 'pending').length,
      icon: 'medical',
      color: 'var(--success-600)',
      page: 'medical-plan',
    },
    {
      key: 'bill-overdue',
      title: '逾期账单',
      description: '需要财务尽快完成支付处理',
      count: overdueBills.length,
      icon: 'bill',
      color: 'var(--error-600)',
      page: 'bill-management',
    },
    {
      key: 'announcement-draft',
      title: '公告待发布',
      description: '草稿或定时公告等待处理',
      count: announcements.filter((announcement) => announcement.status !== 'published').length,
      icon: 'announcement',
      color: 'var(--gray-600)',
      page: 'announcement',
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '数据看板' },
        ]}
        title="数据看板"
        description={`欢迎回来，FAFULI | 数据来源：本地 demo 数据 | 上次更新：${new Date().toLocaleString('zh-CN')}`}
        actions={[
          { type: 'secondary', label: '导出报表', icon: 'export', onClick: () => {} },
        ]}
      />

      <section style={metricGridStyle}>
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </section>

      <section style={quickActionStyle}>
        <QuickAction icon="user" title="员工档案" description="新增、导入与维护员工数据" onClick={() => navigate('employee-list')} />
        <QuickAction icon="points" title="发放积分" description="单人或批量发放福利积分" onClick={() => navigate('employee-points')} />
        <QuickAction icon="medical" title="体检导入" description="维护体检方案与名单" onClick={() => navigate('medical-plan')} />
        <QuickAction icon="gift" title="发布福利" description="配置员工福利与公告" onClick={() => navigate('announcement')} />
      </section>

      <section style={chartGridStyle}>
        <ChartCard
          title="员工入职趋势"
          description="2026 年度每月入职人数"
          summary={[
            { label: '年度入职', value: entryTrendTotal, unit: '人' },
            { label: '峰值', value: entryTrendPeak ? entryTrendPeak.monthLabel : '-', unit: entryTrendPeak ? `${entryTrendPeak.count} 人` : undefined },
          ]}
        >
          <BarTrendChart
            data={entryTrend}
            xKey="monthLabel"
            yKey="count"
            highlightLastNonZero
            compactBottom
            tooltipLabelFormatter={(_, item) => item?.month || ''}
          />
        </ChartCard>

        <ChartCard title="部门人数分布" description={`覆盖 ${departmentData.length} 个部门`}>
          <DonutChart data={departmentData} nameKey="name" valueKey="value" />
        </ChartCard>
      </section>

      <section style={lowerGridStyle}>
        <ChartCard title="福利运营概览" description={`${insurancePlans.length} 个保险方案，${medicalPlans.length} 个体检方案`}>
          <HorizontalBarChart data={welfareProgress} nameKey="name" valueKey="percent" />
        </ChartCard>

        <div style={todoPanelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h3 style={panelTitleStyle}>待处理事项</h3>
              <p style={panelDescriptionStyle}>按当前 demo 数据自动聚合</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todoItems.map((item) => (
              <button key={item.key} style={todoItemStyle} onClick={() => navigate(item.page)}>
                <span style={{ ...todoIconStyle, color: item.color }}>
                  <Icon name={item.icon} size={18} />
                </span>
                <span style={{ flex: 1, textAlign: 'left' }}>
                  <span style={todoTitleStyle}>{item.title}</span>
                  <span style={todoDescriptionStyle}>{item.description}</span>
                </span>
                <span style={todoCountStyle}>{item.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

const metricGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '16px',
  marginBottom: '16px',
};

const quickActionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
  marginBottom: '16px',
};

const chartGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 0.8fr)',
  gap: '16px',
  marginBottom: '16px',
};

const lowerGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)',
  gap: '16px',
  marginBottom: '16px',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: 'var(--gray-0)',
  borderRadius: 'var(--radius-md)',
  padding: '20px',
  minWidth: 0,
};

const panelHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--gray-800)',
  marginBottom: '4px',
};

const panelDescriptionStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--gray-400)',
};

const todoPanelStyle: React.CSSProperties = {
  ...panelStyle,
  display: 'flex',
  flexDirection: 'column',
};

const todoItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px',
  borderRadius: 'var(--radius-md)',
  border: 'none',
  backgroundColor: 'var(--gray-0)',
  cursor: 'pointer',
};

const todoIconStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--gray-50)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const todoTitleStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: 'var(--gray-700)',
  marginBottom: '2px',
};

const todoDescriptionStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--gray-400)',
};

const todoCountStyle: React.CSSProperties = {
  minWidth: '32px',
  height: '28px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--gray-50)',
  color: 'var(--gray-700)',
  fontSize: '14px',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: IconName;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      backgroundColor: 'var(--gray-0)',
      cursor: 'pointer',
      textAlign: 'left',
    }}
      onClick={onClick}
    >
      <span
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={20} />
      </span>
      <span>
        <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>
          {title}
        </span>
        <span style={{ display: 'block', fontSize: '12px', color: 'var(--gray-400)' }}>{description}</span>
      </span>
    </button>
  );
}

export default Dashboard;
