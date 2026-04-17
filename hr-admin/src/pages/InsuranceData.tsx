import React, { useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { StatCard } from '../components/composites/StatCard';
import { ChartCard, DonutChart, HorizontalBarChart, LineTrendChart } from '../components/charts';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedEmployees, seedInsuranceClaims, seedInsurancePlans, seedInsuranceProgress } from '../mockApi/demoData';
import type { Employee, InsuranceClaimRecord, InsurancePlan, InsuranceProgressRecord } from '../mockApi/types';

const InsuranceData: React.FC = () => {
  const [employees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedEmployees);
  const [plans] = useLocalStorageState<InsurancePlan[]>(DEMO_STORAGE_KEYS.insurancePlans, seedInsurancePlans);
  const [progress] = useLocalStorageState<InsuranceProgressRecord[]>(DEMO_STORAGE_KEYS.insuranceProgress, seedInsuranceProgress);
  const [claims] = useLocalStorageState<InsuranceClaimRecord[]>(DEMO_STORAGE_KEYS.insuranceClaims, seedInsuranceClaims);

  const dashboard = useMemo(() => {
    const activeEmployees = employees.filter((employee) => employee.status === 'active').length;
    const insured = progress.filter((item) => item.status === 'insured').length;
    const inProgress = progress.filter((item) => ['pending', 'submitting', 'underwriting'].includes(item.status)).length;
    const claimApplyTotal = claims.reduce((sum, claim) => sum + claim.applyAmount, 0);
    const claimPaidTotal = claims.reduce((sum, claim) => sum + claim.paidAmount, 0);
    return {
      coverageRate: activeEmployees ? Math.round((insured / activeEmployees) * 100) : 0,
      insuredRate: progress.length ? Math.round((insured / progress.length) * 100) : 0,
      inProgress,
      claimApplyTotal,
      claimPaidTotal,
      claimPayRate: claimApplyTotal ? Math.round((claimPaidTotal / claimApplyTotal) * 100) : 0,
    };
  }, [claims, employees, progress]);

  const planDistribution = useMemo(() => plans.map((plan) => ({ name: plan.name, value: plan.employeeCount + plan.dependentCount })), [plans]);
  const statusDistribution = useMemo(() => {
    const labels: Record<InsuranceProgressRecord['status'], string> = { pending: '待提交', submitting: '待确认', underwriting: '承保中', insured: '已承保', rejected: '已拒绝' };
    return Object.entries(labels).map(([status, label]) => ({ name: label, value: progress.filter((item) => item.status === status).length }));
  }, [progress]);
  const claimTypeRank = useMemo(() => ['门诊', '住院', '意外', '重疾'].map((type) => {
    const total = claims.filter((claim) => claim.claimType === type).reduce((sum, claim) => sum + claim.applyAmount, 0);
    return { name: type, value: total };
  }).filter((item) => item.value > 0), [claims]);

  const trendData = [
    { month: '1月', insured: 12, claims: 2 },
    { month: '2月', insured: 18, claims: 3 },
    { month: '3月', insured: 24, claims: 4 },
    { month: '4月', insured: progress.filter((item) => item.status === 'insured').length, claims: claims.length },
  ];

  return (
    <>
      <PageHeader
        title="保险数据"
        description="聚合保险方案、投保进度与理赔数据，辅助福利运营决策"
        breadcrumb={[{ label: '首页', path: '/' }, { label: '保险管理' }, { label: '保险数据' }]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <StatCard title="投保覆盖率" value={`${dashboard.coverageRate}%`} subText="已承保 / 在职员工" />
        <StatCard title="承保完成率" value={`${dashboard.insuredRate}%`} subText="已承保 / 投保记录" />
        <StatCard title="待处理人数" value={dashboard.inProgress} subText="待提交/确认/承保中" />
        <StatCard title="理赔赔付率" value={`${dashboard.claimPayRate}%`} subText={`已赔付 ¥${dashboard.claimPaidTotal.toLocaleString()}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <ChartCard title="方案人数分布" description="按员工与家属合计人数统计">
          <DonutChart data={planDistribution} nameKey="name" valueKey="value" height={260} />
        </ChartCard>
        <ChartCard title="投保状态分布" description="当前投保记录状态拆分">
          <DonutChart data={statusDistribution} nameKey="name" valueKey="value" height={260} />
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <ChartCard title="理赔类型金额" description="按申请金额统计主要理赔类型">
          <HorizontalBarChart data={claimTypeRank} nameKey="name" valueKey="value" maxValue={Math.max(...claimTypeRank.map((item) => item.value), 1)} valueFormatter={(value) => `¥${Number(value).toLocaleString()}`} height={260} />
        </ChartCard>
        <ChartCard title="保险运营趋势" description="展示承保与理赔处理量变化">
          <LineTrendChart data={trendData} xKey="month" series={[{ dataKey: 'insured', name: '已承保', color: 'success' }, { dataKey: 'claims', name: '理赔单', color: 'primary' }]} height={260} />
        </ChartCard>
      </div>
    </>
  );
};

export default InsuranceData;
