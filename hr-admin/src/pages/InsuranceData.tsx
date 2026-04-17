import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../components/composites/PageHeader';
import { panelPadding, panelSurfaceStyle, panelTitleStyle } from '../components/composites/surfaceStyles';
import { StatCard } from '../components/composites/StatCard';
import { Tag } from '../components/basics/Tag';
import { ChartCard, DonutChart } from '../components/charts';
import { chartGridStroke, tooltipItemStyle, tooltipLabelStyle, tooltipStyle } from '../components/charts/theme';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import {
  DEMO_STORAGE_KEYS,
  seedEmployees,
  seedInsuranceClaims,
  seedInsurancePlans,
  seedInsuranceProgress,
} from '../mockApi/demoData';
import type { Employee, InsuranceClaimRecord, InsurancePlan, InsuranceProgressRecord } from '../mockApi/types';

const money = (value: number) => `¥${Math.round(value).toLocaleString()}`;
const percent = (value: number) => `${value.toFixed(1)}%`;

const cardStyle: React.CSSProperties = {
  ...panelSurfaceStyle,
  padding: `${panelPadding}px`,
  minWidth: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  ...panelTitleStyle,
  marginBottom: '14px',
};

const getClaimAmountByType = (claims: InsuranceClaimRecord[], type: InsuranceClaimRecord['claimType']) =>
  claims.filter((claim) => claim.claimType === type).reduce((sum, claim) => sum + claim.applyAmount, 0);

const getEmployeeAge = (employee?: Employee) => {
  if (!employee?.birthday) return 0;
  const year = Number(employee.birthday.slice(0, 4));
  return Number.isFinite(year) ? 2026 - year : 0;
};

const getAgeGroup = (age: number) => {
  if (age <= 18) return '18岁以下';
  if (age <= 30) return '19-30岁';
  if (age <= 45) return '31-45岁';
  if (age <= 60) return '46-60岁';
  return '61岁以上';
};

const formatLastUpdated = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const InsuranceData: React.FC = () => {
  const [employees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedEmployees);
  const [plans] = useLocalStorageState<InsurancePlan[]>(DEMO_STORAGE_KEYS.insurancePlans, seedInsurancePlans);
  const [progress] = useLocalStorageState<InsuranceProgressRecord[]>(DEMO_STORAGE_KEYS.insuranceProgress, seedInsuranceProgress);
  const [claims] = useLocalStorageState<InsuranceClaimRecord[]>(DEMO_STORAGE_KEYS.insuranceClaims, seedInsuranceClaims);
  const lastUpdated = useMemo(() => formatLastUpdated(new Date()), []);

  const dashboard = useMemo(() => {
    const activeEmployees = employees.filter((employee) => employee.status === 'active');
    const insuredRecords = progress.filter((item) => item.status === 'insured');
    const settledClaims = claims.filter((claim) => ['paid', 'rejected'].includes(claim.status));
    const paidClaims = claims.filter((claim) => claim.status === 'paid');
    const pendingClaims = claims.filter((claim) => !['paid', 'rejected'].includes(claim.status));
    const paidAmount = claims.reduce((sum, claim) => sum + claim.paidAmount, 0);
    const applyAmount = claims.reduce((sum, claim) => sum + claim.applyAmount, 0);
    const annualPremium = plans.reduce((sum, plan) => sum + plan.price * (plan.priceUnit === '月' ? 12 : 1), 0);
    const claimantEmpNos = new Set(claims.map((claim) => claim.empNo));
    const highPriorityClaims = claims.filter((claim) => claim.applyAmount >= 10000 || claim.status === 'draft');

    return {
      activeEmployees: activeEmployees.length,
      insuredCount: insuredRecords.length,
      claimCount: claims.length,
      settledCount: settledClaims.length,
      pendingCount: pendingClaims.length,
      paidCount: paidClaims.length,
      paidAmount,
      applyAmount,
      annualPremium,
      auditAccuracy: 98.6,
      closeRate: claims.length ? (settledClaims.length / claims.length) * 100 : 0,
      responseRate: 96.4,
      costClaimRate: annualPremium ? (paidAmount / annualPremium) * 100 : 0,
      claimantCount: claimantEmpNos.size,
      highPriorityCount: highPriorityClaims.length,
      consultationTotal: 126,
      consultationDone: 118,
      consultationPending: 8,
      timelyRate: 93.7,
    };
  }, [claims, employees, plans, progress]);

  const claimSummary = useMemo(() => [
    { label: '申请件量', value: dashboard.claimCount, color: 'var(--primary-500)' },
    { label: '结案件量', value: dashboard.settledCount, color: 'var(--success-500)' },
    { label: '待结案件量', value: dashboard.pendingCount, color: 'var(--warning-500)' },
  ], [dashboard.claimCount, dashboard.pendingCount, dashboard.settledCount]);

  const efficiencyData = [
    { name: '材料初审', target: 1.5, actual: 1.2, standard: 1.8 },
    { name: '保险审核', target: 4.5, actual: 3.8, standard: 5.5 },
    { name: '结案打款', target: 2.5, actual: 2.1, standard: 3.2 },
  ];

  const claimTypeData = useMemo(() => {
    const data = (['门诊', '住院', '意外', '重疾'] as InsuranceClaimRecord['claimType'][]).map((type) => ({
      name: type,
      value: getClaimAmountByType(claims, type),
    }));
    return data.filter((item) => item.value > 0);
  }, [claims]);

  const responsibilityData = useMemo(() => {
    const total = Math.max(dashboard.applyAmount, 1);
    return claimTypeData.map((item) => {
      const caseCount = claims.filter((claim) => claim.claimType === item.name).length;
      return {
        name: item.name,
        ratio: (item.value / total) * 100,
        amount: item.value,
        avg: caseCount ? item.value / caseCount : 0,
        large: claims.filter((claim) => claim.claimType === item.name && claim.applyAmount >= 10000).length,
      };
    });
  }, [claimTypeData, claims, dashboard.applyAmount]);

  const ageGroups = useMemo(() => {
    const base = ['18岁以下', '19-30岁', '31-45岁', '46-60岁', '61岁以上'].map((name) => ({ name, male: 0, female: 0 }));
    claims.forEach((claim) => {
      const employee = employees.find((item) => item.empNo === claim.empNo);
      const group = getAgeGroup(getEmployeeAge(employee));
      const bucket = base.find((item) => item.name === group);
      if (!bucket) return;
      if (employee?.gender === '女') bucket.female += 1;
      else bucket.male += 1;
    });
    return base;
  }, [claims, employees]);

  const genderStats = useMemo(() => {
    const male = claims.filter((claim) => employees.find((employee) => employee.empNo === claim.empNo)?.gender !== '女').length;
    const female = claims.length - male;
    return {
      male: claims.length ? Math.round((male / claims.length) * 100) : 0,
      female: claims.length ? Math.round((female / claims.length) * 100) : 0,
    };
  }, [claims, employees]);

  const productDistribution = useMemo(() => plans.map((plan) => ({
    name: plan.name,
    value: plan.employeeCount + plan.dependentCount,
  })), [plans]);

  const radarData = [
    { subject: '门诊医疗', current: 82, market: 72 },
    { subject: '住院医疗', current: 76, market: 68 },
    { subject: '意外责任', current: 68, market: 62 },
    { subject: '重大疾病', current: 58, market: 64 },
  ];

  const operationVolumeData = [
    { name: '预报案件量', value: Math.max(dashboard.claimCount * 64, 120) },
    { name: '递交案件量', value: Math.max(dashboard.claimCount * 51, 96) },
    { name: '结案件量', value: Math.max(dashboard.settledCount * 69, 80) },
  ];

  return (
    <>
      <PageHeader
        title="保险数据"
        description={`上次更新：${lastUpdated}`}
        breadcrumb={[{ label: '首页', path: '/' }, { label: '保险管理' }, { label: '保险数据' }]}
        actions={[
          { type: 'secondary', label: '下载报告', icon: 'export', onClick: () => {} },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '18px' }}>
        <StatCard title="实际总赔付金额" value={money(dashboard.paidAmount)} trend={{ value: '较上期', direction: 'up', percentage: '+6.8%' }} subText="当前客户已赔付总额" />
        <StatCard title="理赔审核准确率" value={percent(dashboard.auditAccuracy)} trend={{ value: '目标 ≥98%', direction: 'neutral' }} subText="理赔审核一致性" />
        <StatCard title="成本赔付率" value={percent(dashboard.costClaimRate)} trend={{ value: `年度保费 ${money(dashboard.annualPremium)}`, direction: 'neutral' }} subText="赔付金额 / 年度保费" />
        <StatCard title="出险人数" value={`${dashboard.claimantCount}`} suffix="人" trend={{ value: `覆盖 ${dashboard.activeEmployees} 名在职员工`, direction: 'neutral' }} subText="当前客户出险员工数" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.1fr', gap: '18px', marginBottom: '18px' }}>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>案量汇总</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {claimSummary.map((item) => (
              <ProgressRow key={item.label} label={item.label} value={item.value} max={Math.max(dashboard.claimCount, 1)} color={item.color} />
            ))}
          </div>
          <div style={{ marginTop: '22px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--warning-50)', color: 'var(--warning-700)', fontSize: '13px' }}>
            高优先级待处理：{dashboard.highPriorityCount} 件，建议优先跟进大额理赔与待补材料案件。
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px' }}>
            <div>
              <div style={sectionTitleStyle}>时效效率监控</div>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <ComposedChart data={efficiencyData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="target" name="目标时效" fill="#93C5FD" radius={[6, 6, 2, 2]} />
                    <Bar dataKey="actual" name="实际时效" fill="#2563EB" radius={[6, 6, 2, 2]} />
                    <Line dataKey="standard" name="行业标准" stroke="#EA580C" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <MiniStat title="结案率" value={percent(dashboard.closeRate)} trend="目标 ≥90%" />
              <MiniStat title="咨询响应率" value={percent(dashboard.responseRate)} trend="24小时内响应" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>赔付金额类型分布</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: '16px', alignItems: 'center' }}>
            <DonutChart data={claimTypeData} nameKey="name" valueKey="value" height={260} showLegend={false} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {claimTypeData.map((item, index) => (
                <LegendLine key={item.name} label={item.name} value={money(item.value)} color={['#2563EB', '#16A34A', '#EA580C', '#0891B2'][index % 4]} />
              ))}
            </div>
          </div>
          <div style={{ marginTop: '14px' }}>
            <div style={sectionTitleStyle}>补偿责任分析</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: 'var(--gray-500)', backgroundColor: 'var(--gray-50)' }}>
                  <th style={thStyle}>责任名称</th>
                  <th style={thStyle}>责任占比</th>
                  <th style={thStyle}>总金额</th>
                  <th style={thStyle}>件均赔付</th>
                  <th style={thStyle}>大额案件</th>
                </tr>
              </thead>
              <tbody>
                {responsibilityData.map((item) => (
                  <tr key={item.name}>
                    <td style={tdStyle}>{item.name}</td>
                    <td style={tdStyle}>{percent(item.ratio)}</td>
                    <td style={tdStyle}>{money(item.amount)}</td>
                    <td style={tdStyle}>{money(item.avg)}</td>
                    <td style={tdStyle}><Tag color={item.large > 0 ? 'warning' : 'success'}>{item.large} 件</Tag></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>就诊/出险人员信息管控</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <MiniStat title="出险频次" value={`${(dashboard.claimCount / Math.max(dashboard.claimantCount, 1)).toFixed(1)}`} trend="次/人" />
            <MiniStat title="高频出险人员占比" value="18.4%" trend="需关注" />
            <MiniStat title="既往症人员赔付占比" value="12.3%" trend="较低风险" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--gray-600)', fontSize: '13px' }}>
            <span>出险人群赔付占比</span>
            <span>男性 <strong style={{ color: 'var(--primary-600)' }}>{genderStats.male}%</strong> / 女性 <strong style={{ color: 'var(--success-600)' }}>{genderStats.female}%</strong></span>
          </div>
          <div style={{ width: '100%', height: 260, backgroundColor: 'var(--gray-50)', borderRadius: '8px', padding: '12px 8px 0' }}>
            <ResponsiveContainer>
              <BarChart data={ageGroups} margin={{ top: 20, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={chartGridStroke} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--gray-500)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="male" name="男性" stackId="age" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="female" name="女性" stackId="age" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', marginBottom: '18px' }}>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>客户规模管理</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <MiniStat title="在保人数" value={`${dashboard.insuredCount}`} trend="已承保员工" />
            <MiniStat title="变动幅度" value="-3.2%" trend="较上周期" />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px' }}>在保人群结构</div>
          <div style={{ height: '18px', borderRadius: '999px', overflow: 'hidden', display: 'flex', backgroundColor: 'var(--gray-100)' }}>
            <span style={{ width: '72%', backgroundColor: 'var(--primary-500)' }} />
            <span style={{ width: '28%', backgroundColor: 'var(--success-500)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: 'var(--gray-500)' }}>
            <span>员工本人 72%</span>
            <span>员工+家属 28%</span>
          </div>
        </div>

        <ChartCard title="产品方案分类" description="当前客户已购保险产品组合">
          <DonutChart data={productDistribution} nameKey="name" valueKey="value" height={220} />
        </ChartCard>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>产品线经营利润</div>
          <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '6px' }}>产品线 GP</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '18px' }}>
            {money(Math.max(dashboard.annualPremium - dashboard.paidAmount, 0))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <RingMetric title="收入达成率" value={64.1} color="var(--primary-500)" amount={money(dashboard.annualPremium)} />
            <RingMetric title="成本赔付率" value={dashboard.costClaimRate} color="var(--warning-500)" amount={money(dashboard.paidAmount)} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>主险责任分类</div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--gray-200)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} />
                <Radar name="本司" dataKey="current" stroke="#2563EB" fill="#2563EB" fillOpacity={0.18} />
                <Radar name="市场" dataKey="market" stroke="#16A34A" fill="#16A34A" fillOpacity={0.08} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>雇主及员工案件量</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {operationVolumeData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--gray-50)', borderRadius: '8px', fontSize: '13px' }}>
                <span style={{ color: 'var(--gray-600)' }}>{item.name}</span>
                <strong style={{ color: 'var(--gray-900)', fontSize: '18px' }}>{item.value}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <MiniStat title="待结案件量" value={`${dashboard.pendingCount}`} trend="件" />
            <MiniStat title="平均结案时效" value="3.7" trend="天" />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>理赔咨询服务</div>
          <RingMetric title="处理及时率" value={dashboard.timelyRate} color="var(--success-500)" amount={`${dashboard.consultationTotal} 件`} large />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px', fontSize: '13px' }}>
            <ServiceLine label="总咨询量" value={`${dashboard.consultationTotal} 件`} />
            <ServiceLine label="完成处理量" value={`${dashboard.consultationDone} 件`} />
            <ServiceLine label="待处理咨询" value={`${dashboard.consultationPending} 件`} warning />
          </div>
        </div>
      </div>
    </>
  );
};

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'left',
  fontWeight: 600,
  borderBottom: '1px solid var(--gray-100)',
};

const tdStyle: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--gray-100)',
  color: 'var(--gray-700)',
};

const MiniStat: React.FC<{ title: string; value: string; trend: string }> = ({ title, value, trend }) => (
  <div style={{ padding: '14px', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
    <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '8px' }}>{title}</div>
    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--gray-900)' }}>{value}</div>
    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '6px' }}>{trend}</div>
  </div>
);

const ProgressRow: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px' }}>
      <span>{label}</span>
      <strong>{value} 件</strong>
    </div>
    <div style={{ height: '10px', borderRadius: '999px', backgroundColor: 'var(--gray-100)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: '100%', backgroundColor: color, borderRadius: '999px' }} />
    </div>
  </div>
);

const LegendLine: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: color }} />
    <span style={{ color: 'var(--gray-600)', flex: 1 }}>{label}</span>
    <strong style={{ color: 'var(--gray-900)' }}>{value}</strong>
  </div>
);

const RingMetric: React.FC<{ title: string; value: number; color: string; amount: string; large?: boolean }> = ({ title, value, color, amount, large }) => {
  const safeValue = Math.max(0, Math.min(value, 100));
  return (
    <div style={{ textAlign: 'center', padding: large ? '6px 0' : '16px 10px', backgroundColor: large ? 'transparent' : 'var(--gray-50)', borderRadius: '8px' }}>
      <div style={{ width: large ? 118 : 84, height: large ? 118 : 84, margin: '0 auto 10px', borderRadius: '50%', background: `conic-gradient(${color} ${safeValue * 3.6}deg, var(--gray-100) 0deg)`, display: 'grid', placeItems: 'center' }}>
        <div style={{ width: large ? 86 : 60, height: large ? 86 : 60, borderRadius: '50%', backgroundColor: 'var(--gray-0)', display: 'grid', placeItems: 'center' }}>
          <strong style={{ color, fontSize: large ? '22px' : '16px' }}>{percent(safeValue)}</strong>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--gray-900)', fontWeight: 700, marginTop: '6px' }}>{amount}</div>
    </div>
  );
};

const ServiceLine: React.FC<{ label: string; value: string; warning?: boolean }> = ({ label, value, warning }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
    <span style={{ color: 'var(--gray-500)' }}>{label}</span>
    <strong style={{ color: warning ? 'var(--warning-600)' : 'var(--gray-900)' }}>{value}</strong>
  </div>
);

export default InsuranceData;
