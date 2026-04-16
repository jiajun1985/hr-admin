import React, { useState } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Select } from '../components/basics/Select';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedInsuranceProgress } from '../mockApi/demoData';

interface InsuranceProgressRecord {
  id: string;
  empNo: string;
  name: string;
  department: string;
  insurancePlan: string;
  insuranceType: string;
  status: 'pending' | 'submitting' | 'underwriting' | 'insured' | 'rejected';
  submitDate: string;
  effectiveDate: string;
  progress: number;
  remark: string;
}

const InsuranceProgress: React.FC = () => {
  const [progressData] = useLocalStorageState<InsuranceProgressRecord[]>(
    DEMO_STORAGE_KEYS.insuranceProgress,
    seedInsuranceProgress
  );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<InsuranceProgressRecord | null>(null);
  const [planFilter, setPlanFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handlePlanFilterChange = (value: string | number | (string | number)[]) => {
    setPlanFilter(value as string);
  };

  const handleStatusFilterChange = (value: string | number | (string | number)[]) => {
    setStatusFilter(value as string);
  };

  const filteredData = progressData.filter((item) => {
    if (planFilter && item.insurancePlan !== planFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const columns: TableColumn<InsuranceProgressRecord>[] = [
    {
      key: 'empNo',
      title: '工号',
      width: 100,
      dataIndex: 'empNo',
    },
    {
      key: 'name',
      title: '员工姓名',
      width: 120,
      dataIndex: 'name',
      render: (value, record) => (
        <span
          style={{ color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => {
            setSelectedRecord(record);
            setDetailModalOpen(true);
          }}
        >
          {value}
        </span>
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
      key: 'insurancePlan',
      title: '保险方案',
      width: 150,
      dataIndex: 'insurancePlan',
    },
    {
      key: 'insuranceType',
      title: '险种',
      width: 80,
      dataIndex: 'insuranceType',
      align: 'center',
    },
    {
      key: 'progress',
      title: '投保进度',
      width: 180,
      dataIndex: 'progress',
      render: (value, record) => {
        const colorMap = {
          insured: 'var(--success-500)',
          rejected: 'var(--error-500)',
          pending: 'var(--warning-500)',
          submitting: 'var(--info-500)',
          underwriting: 'var(--primary-500)',
        };
        const color = colorMap[record.status];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                height: '6px',
                backgroundColor: 'var(--gray-200)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${value}%`,
                  height: '100%',
                  backgroundColor: color,
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--gray-500)', minWidth: '32px' }}>
              {value}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value) => {
        const config = {
          pending: { color: 'warning', label: '待提交' },
          submitting: { color: 'info', label: '待确认' },
          underwriting: { color: 'primary', label: '承保中' },
          insured: { color: 'success', label: '已承保' },
          rejected: { color: 'error', label: '已拒绝' },
        };
        return <Tag color={config[value].color as any}>{config[value].label}</Tag>;
      },
    },
    {
      key: 'remark',
      title: '备注',
      width: 150,
      dataIndex: 'remark',
      render: (value) => (
        <span style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{value}</span>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      width: 100,
      render: (_, record) => (
        <Button
          size="sm"
          buttonType="primary"
          onClick={() => {
            setSelectedRecord(record);
            setDetailModalOpen(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  const filters = [
    {
      key: 'insurancePlan',
      label: '保险方案',
      component: (
        <Select
          placeholder="全部方案"
          value={planFilter}
          onChange={handlePlanFilterChange}
          options={[
            { label: '补充医疗保险', value: '补充医疗保险' },
            { label: '团体意外险', value: '团体意外险' },
            { label: '重大疾病险', value: '重大疾病险' },
          ]}
        />
      ),
    },
    {
      key: 'status',
      label: '投保状态',
      component: (
        <Select
          placeholder="全部状态"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={[
            { label: '待提交', value: 'pending' },
            { label: '待确认', value: 'submitting' },
            { label: '承保中', value: 'underwriting' },
            { label: '已承保', value: 'insured' },
            { label: '已拒绝', value: 'rejected' },
          ]}
        />
      ),
    },
  ];

  const stats = [
    {
      title: '投保中',
      value: '156',
      subText: '正在进行',
      trend: { value: '较上周', direction: 'up' as const, percentage: '+12' },
    },
    {
      title: '已承保',
      value: '1,044',
      subText: '累计生效',
    },
    {
      title: '待处理',
      value: '23',
      subText: '需要跟进',
      trend: { value: '较上周', direction: 'down' as const, percentage: '-5' },
    },
    {
      title: '已拒绝',
      value: '8',
      subText: '本季度',
    },
  ];

  return (
    <>
      <ListPageTemplate
        title="投保进度"
        description="管理员工投保进度，跟踪承保状态"
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '保险管理' },
          { label: '投保进度' },
        ]}
        stats={stats}
        searchPlaceholder="搜索员工姓名或工号..."
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        filters={filters}
        pagination={{
          current: 1,
          pageSize: 20,
          total: filteredData.length,
          onChange: () => {},
        }}
      />

      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="投保进度详情"
        size="lg"
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <InfoCard label="工号" value={selectedRecord.empNo} />
              <InfoCard label="姓名" value={selectedRecord.name} />
              <InfoCard label="部门" value={selectedRecord.department} />
              <InfoCard label="保险方案" value={selectedRecord.insurancePlan} />
              <InfoCard label="险种" value={selectedRecord.insuranceType} />
              <InfoCard
                label="状态"
                value={
                  {
                    pending: '待提交',
                    submitting: '待确认',
                    underwriting: '承保中',
                    insured: '已承保',
                    rejected: '已拒绝',
                  }[selectedRecord.status]
                }
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <InfoCard label="提交日期" value={selectedRecord.submitDate} />
              <InfoCard label="生效日期" value={selectedRecord.effectiveDate} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px' }}>
                投保进度
              </div>
              {(() => {
                const colorMap = {
                  insured: 'var(--success-500)',
                  rejected: 'var(--error-500)',
                  pending: 'var(--warning-500)',
                  submitting: 'var(--info-500)',
                  underwriting: 'var(--primary-500)',
                };
                const color = colorMap[selectedRecord.status];
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: 'var(--gray-200)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${selectedRecord.progress}%`,
                          height: '100%',
                          backgroundColor: color,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-700)' }}>
                      {selectedRecord.progress}%
                    </span>
                  </div>
                );
              })()}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px' }}>
                备注说明
              </div>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--gray-50)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  color: 'var(--gray-700)',
                }}
              >
                {selectedRecord.remark}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      padding: '12px',
      backgroundColor: 'var(--gray-50)',
      borderRadius: 'var(--radius-sm)',
    }}
  >
    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-700)' }}>
      {value}
    </div>
  </div>
);

export default InsuranceProgress;
