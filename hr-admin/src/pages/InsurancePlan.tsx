import React, { useMemo, useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { StatCard } from '../components/composites/StatCard';
import { Tag } from '../components/basics/Tag';
import { Icon, type IconName } from '../components/basics/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedInsurancePlans } from '../mockApi/demoData';

interface InsurancePlan {
  id: string;
  name: string;
  policyNo: string;
  startDate: string;
  endDate: string;
  payRule: string;
  scope: string;
  coreBenefits: string[];
  price: number;
  priceUnit: string;
  employeeCount: number;
  dependentCount: number;
  status: 'active' | 'pending' | 'expired';
}

const InsurancePlanPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [statusFilter, setStatusFilter] = useState<InsurancePlan['status'] | 'all'>('all');
  const [insurancePlans] = useLocalStorageState<InsurancePlan[]>(
    DEMO_STORAGE_KEYS.insurancePlans,
    seedInsurancePlans
  );

  const stats = useMemo(() => {
    const activePlans = insurancePlans.filter((plan) => plan.status === 'active');
    const pendingPlans = insurancePlans.filter((plan) => plan.status === 'pending');
    const expiredPlans = insurancePlans.filter((plan) => plan.status === 'expired');
    const insuredEmployees = activePlans.reduce((sum, plan) => sum + plan.employeeCount, 0);
    const dependents = activePlans.reduce((sum, plan) => sum + plan.dependentCount, 0);
    const premium = insurancePlans.reduce((sum, plan) => sum + plan.price, 0);
    return [
      { title: '生效方案', value: String(activePlans.length), subText: '当前有效' },
      { title: '投保人数', value: String(insuredEmployees + dependents), subText: `员工 ${insuredEmployees} + 家属 ${dependents}` },
      { title: '待生效/到期', value: `${pendingPlans.length}/${expiredPlans.length}`, subText: '待生效 / 已到期' },
      { title: '年度保费', value: `¥${premium.toLocaleString()}`, subText: '按方案报价汇总' },
    ];
  }, [insurancePlans]);

  const filteredPlans = useMemo(() => {
    if (statusFilter === 'all') return insurancePlans;
    return insurancePlans.filter((plan) => plan.status === statusFilter);
  }, [insurancePlans, statusFilter]);

  const getStatusConfig = (status: InsurancePlan['status']) => {
    const config = {
      active: { color: 'success' as const, label: '保障中' },
      pending: { color: 'warning' as const, label: '待生效' },
      expired: { color: 'default' as const, label: '已到期' },
    };
    return config[status];
  };

  const handleCardClick = (plan: InsurancePlan) => {
    navigate('insurance-scheme-detail', { planId: plan.id });
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  };

  const cardGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  };

  const statusTabs = [
    { key: 'all' as const, label: '全部方案', count: insurancePlans.length },
    { key: 'active' as const, label: '保障中', count: insurancePlans.filter((plan) => plan.status === 'active').length },
    { key: 'pending' as const, label: '待生效', count: insurancePlans.filter((plan) => plan.status === 'pending').length },
    { key: 'expired' as const, label: '已到期', count: insurancePlans.filter((plan) => plan.status === 'expired').length },
  ];

  return (
    <>
      <PageHeader
        title="保险方案"
        description="管理企业已购保险方案，查看保障详情及被保人名单"
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '保险管理' },
          { label: '保险方案' },
        ]}
      />

      <div style={statsGridStyle}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {statusTabs.map((tab) => {
          const active = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                border: `1px solid ${active ? 'var(--primary-500)' : 'var(--gray-200)'}`,
                backgroundColor: active ? 'var(--primary-50)' : 'var(--gray-0)',
                color: active ? 'var(--primary-700)' : 'var(--gray-600)',
                borderRadius: '999px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label} <span style={{ color: active ? 'var(--primary-600)' : 'var(--gray-400)' }}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      <div style={cardGridStyle}>
        {filteredPlans.map((plan) => {
          const statusConfig = getStatusConfig(plan.status);
          const insuredTotal = plan.employeeCount + plan.dependentCount;
          return (
            <div
              key={plan.id}
              style={{
                backgroundColor: 'var(--gray-0)',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--gray-200)',
              }}
              onClick={() => handleCardClick(plan)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)' }}>{plan.name}</div>
                <Tag color={statusConfig.color}>{statusConfig.label}</Tag>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '6px' }}>核心保障</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {plan.coreBenefits.slice(0, 2).map((benefit) => (
                        <Tag key={benefit} color="info">{benefit.split(' ')[0]}</Tag>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '2px' }}>付费规则</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>{plan.payRule}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '2px' }}>适用范围</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>{plan.scope}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '2px' }}>售价</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>
                      ¥{plan.price.toLocaleString()} 元/{plan.priceUnit}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '110px' }}>
                  <div style={{ textAlign: 'center', padding: '14px', backgroundColor: 'var(--primary-50)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-600)' }}>{insuredTotal.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--primary-500)', marginTop: '4px' }}>保障人数</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '14px', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>员工 {plan.employeeCount}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-500)', marginTop: '4px' }}>家属 {plan.dependentCount}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                  保障期限：{plan.startDate} 至 {plan.endDate}
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--primary-600)', 
                  fontWeight: 500,
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}
                >
                  查看详情 <Icon name='chevron-right' size={14} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InsurancePlanPage;
