import React, { useMemo, useState } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import type { Filter } from '../components/composites/FilterBar';
import type { TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Modal } from '../components/basics/Modal';
import { Tag } from '../components/basics/Tag';
import { panelPadding, panelSurfaceStyle, panelSubtitleStyle, panelTitleStyle } from '../components/composites/surfaceStyles';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedInsuranceClaims } from '../mockApi/demoData';
import type { InsuranceClaimRecord } from '../mockApi/types';

const statusConfig: Record<InsuranceClaimRecord['status'], { label: string; color: 'default' | 'success' | 'warning' | 'error' | 'primary' | 'info' }> = {
  draft: { label: '待补材料', color: 'warning' },
  submitted: { label: '已提交', color: 'info' },
  reviewing: { label: '审核中', color: 'primary' },
  paying: { label: '打款中', color: 'warning' },
  paid: { label: '已赔付', color: 'success' },
  rejected: { label: '已驳回', color: 'error' },
};

const ClaimProgress: React.FC = () => {
  const [claims] = useLocalStorageState<InsuranceClaimRecord[]>(DEMO_STORAGE_KEYS.insuranceClaims, seedInsuranceClaims);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaimRecord | null>(null);

  const filteredClaims = useMemo(() => {
    const keyword = searchText.trim();
    return claims.filter((claim) => {
      if (keyword && ![claim.claimNo, claim.empNo, claim.name, claim.department, claim.insurancePlan].some((field) => field.includes(keyword))) return false;
      if (statusFilter && claim.status !== statusFilter) return false;
      if (typeFilter && claim.claimType !== typeFilter) return false;
      return true;
    });
  }, [claims, searchText, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const pending = claims.filter((claim) => ['draft', 'submitted', 'reviewing', 'paying'].includes(claim.status)).length;
    const paidCount = claims.filter((claim) => claim.status === 'paid').length;
    const applyTotal = claims.reduce((sum, claim) => sum + claim.applyAmount, 0);
    const paidTotal = claims.reduce((sum, claim) => sum + claim.paidAmount, 0);
    return [
      { title: '待处理理赔', value: pending, subText: '含补材料/审核/打款' },
      { title: '已赔付', value: paidCount, subText: `完成率 ${claims.length ? Math.round((paidCount / claims.length) * 100) : 0}%` },
      { title: '申请金额', value: `¥${applyTotal.toLocaleString()}`, subText: '当前样本合计' },
      { title: '赔付金额', value: `¥${paidTotal.toLocaleString()}`, subText: `赔付率 ${applyTotal ? Math.round((paidTotal / applyTotal) * 100) : 0}%` },
    ];
  }, [claims]);

  const columns: TableColumn<InsuranceClaimRecord>[] = [
    { key: 'claimNo', title: '理赔单号', width: 170, dataIndex: 'claimNo' },
    { key: 'name', title: '员工', width: 110, dataIndex: 'name', render: (value, record) => <span style={{ color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setSelectedClaim(record)}>{value}</span> },
    { key: 'department', title: '部门', width: 100, dataIndex: 'department', render: (value) => <Tag>{value}</Tag> },
    { key: 'insurancePlan', title: '保险方案', width: 140, dataIndex: 'insurancePlan' },
    { key: 'claimType', title: '理赔类型', width: 90, dataIndex: 'claimType', align: 'center' },
    { key: 'applyAmount', title: '申请金额', width: 110, dataIndex: 'applyAmount', align: 'right', render: (value) => `¥${Number(value).toLocaleString()}` },
    { key: 'paidAmount', title: '赔付金额', width: 110, dataIndex: 'paidAmount', align: 'right', render: (value) => `¥${Number(value).toLocaleString()}` },
    { key: 'submitDate', title: '提交时间', width: 110, dataIndex: 'submitDate', align: 'center' },
    { key: 'status', title: '状态', width: 100, dataIndex: 'status', align: 'center', render: (value) => <Tag color={statusConfig[value].color}>{statusConfig[value].label}</Tag> },
    { key: 'actions', title: '操作', width: 90, align: 'center', render: (_, record) => <Button size="sm" type="primary" onClick={() => setSelectedClaim(record)}>详情</Button> },
  ];

  const filters: Filter[] = [
    {
      key: 'status',
      label: '理赔状态',
      type: 'select',
      placeholder: '全部状态',
      options: Object.entries(statusConfig).map(([value, config]) => ({ value, label: config.label })),
    },
    {
      key: 'claimType',
      label: '理赔类型',
      type: 'select',
      placeholder: '全部类型',
      options: ['门诊', '住院', '意外', '重疾'].map((type) => ({ value: type, label: type })),
    },
  ];

  return (
    <>
      <ListPageTemplate
        title="理赔进度"
        description="跟踪员工理赔申请、审核节点和赔付状态"
        breadcrumb={[{ label: '首页', path: '/' }, { label: '保险管理' }, { label: '理赔进度' }]}
        stats={stats}
        searchPlaceholder="搜索理赔单号、姓名、工号、方案..."
        columns={columns}
        dataSource={filteredClaims}
        rowKey="id"
        filters={filters}
        tableLayoutMode="content"
        onSearch={setSearchText}
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(String(value));
          if (key === 'claimType') setTypeFilter(String(value));
        }}
        onReset={() => {
          setSearchText('');
          setStatusFilter('');
          setTypeFilter('');
        }}
        pagination={{ current: 1, pageSize: 20, total: filteredClaims.length, onChange: () => {} }}
      />

      <Modal open={!!selectedClaim} onClose={() => setSelectedClaim(null)} title="理赔详情" size="lg" footer={[<Button key="close" type="primary" onClick={() => setSelectedClaim(null)}>关闭</Button>]}>
        {selectedClaim && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <InfoCard label="理赔单号" value={selectedClaim.claimNo} />
              <InfoCard label="员工" value={`${selectedClaim.name} (${selectedClaim.empNo})`} />
              <InfoCard label="当前节点" value={selectedClaim.currentNode} />
              <InfoCard label="申请金额" value={`¥${selectedClaim.applyAmount.toLocaleString()}`} />
              <InfoCard label="赔付金额" value={`¥${selectedClaim.paidAmount.toLocaleString()}`} />
              <InfoCard label="提交时间" value={selectedClaim.submitDate} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={panelSubtitleStyle}>处理进度</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--gray-100)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${selectedClaim.progress}%`, height: '100%', backgroundColor: selectedClaim.status === 'rejected' ? 'var(--error-500)' : 'var(--primary-500)' }} />
                </div>
                <strong style={{ color: 'var(--gray-700)' }}>{selectedClaim.progress}%</strong>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ ...panelSurfaceStyle, padding: `${panelPadding}px` }}>
                <div style={panelTitleStyle}>已收材料</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{selectedClaim.materials.map((item) => <Tag key={item} color="info">{item}</Tag>)}</div>
              </div>
              <div style={{ ...panelSurfaceStyle, padding: `${panelPadding}px`, backgroundColor: selectedClaim.status === 'rejected' ? 'var(--error-50)' : 'var(--info-50)' }}>
                <div style={panelTitleStyle}>处理建议</div>
                <div style={{ fontSize: '13px', color: selectedClaim.status === 'rejected' ? 'var(--error-700)' : 'var(--info-700)', lineHeight: 1.6 }}>{selectedClaim.remark}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

const InfoCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ ...panelSurfaceStyle, padding: '12px' }}>
    <div style={panelSubtitleStyle}>{label}</div>
    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginTop: '4px' }}>{value}</div>
  </div>
);

export default ClaimProgress;
