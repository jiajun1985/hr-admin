import React, { useMemo } from 'react';
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
  const [insurancePlans] = useLocalStorageState<InsurancePlan[]>(
    DEMO_STORAGE_KEYS.insurancePlans,
    seedInsurancePlans
  );

  const stats = useMemo(() => {
    const activePlans = insurancePlans.filter((plan) => plan.status === 'active');
    const insuredEmployees = activePlans.reduce((sum, plan) => sum + plan.employeeCount, 0);
    const dependents = activePlans.reduce((sum, plan) => sum + plan.dependentCount, 0);
    const premium = insurancePlans.reduce((sum, plan) => sum + plan.price, 0);
    return [
      { title: '生效方案', value: String(activePlans.length), subText: '当前有效' },
      { title: '投保人数', value: String(insuredEmployees + dependents), subText: `员工 ${insuredEmployees} + 家属 ${dependents}` },
      { title: '本月理赔', value: '¥12,560', subText: '2026年4月共 8 笔', trend: { value: '较上月', direction: 'down' as const, percentage: '-15.2%' } },
      { title: '本年保费', value: `¥${premium.toLocaleString()}`, subText: '2026年度累计' },
    ];
  }, [insurancePlans]);

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

      <div style={cardGridStyle}>
        {insurancePlans.map((plan) => {
          const statusConfig = getStatusConfig(plan.status);
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
                    <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary-600)' }}>{plan.employeeCount.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: 'var(--primary-500)', marginTop: '4px' }}>员工人数</div>
                  </div>
                  {plan.dependentCount > 0 ? (
                    <div style={{ textAlign: 'center', padding: '14px', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--gray-700)' }}>{plan.dependentCount.toLocaleString()}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>家属人数</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '14px', backgroundColor: 'var(--gray-50)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--gray-400)' }}>0</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '4px' }}>家属人数</div>
                    </div>
                  )}
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
