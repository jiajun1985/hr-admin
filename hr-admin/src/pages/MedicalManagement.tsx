import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedMedicalPlans, seedMedicalRecords, type MedicalPlan, type MedicalRecord } from '../mockApi/demoData';

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '销售部', value: '销售部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
  { label: '运维部', value: '运维部' },
  { label: '产品部', value: '产品部' },
];

type TabKey = 'plan' | 'list';

const MedicalManagement: React.FC = () => {
  const [plans, setPlans] = useLocalStorageState<MedicalPlan[]>(DEMO_STORAGE_KEYS.medicalPlans, seedMedicalPlans);
  const [records, setRecords] = useLocalStorageState<MedicalRecord[]>(DEMO_STORAGE_KEYS.medicalRecords, seedMedicalRecords);
  const [activeTab, setActiveTab] = useState<TabKey>('plan');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [planFormOpen, setPlanFormOpen] = useState(false);
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  const [planForm, setPlanForm] = useState({
    name: '',
    year: new Date().getFullYear(),
    company: '',
    deadline: '',
    totalCount: 0,
    appointedCount: 0,
    checkedCount: 0,
    status: 'upcoming' as MedicalPlan['status'],
  });

  const [recordForm, setRecordForm] = useState({
    name: '',
    employeeName: '',
    department: '',
    company: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'pending' as MedicalRecord['status'],
  });

  const openAddPlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      name: '',
      year: new Date().getFullYear(),
      company: '',
      deadline: '',
      totalCount: 0,
      appointedCount: 0,
      checkedCount: 0,
      status: 'upcoming',
    });
    setPlanFormOpen(true);
  };

  const openEditPlan = (record: MedicalPlan) => {
    setEditingPlanId(record.id);
    setPlanForm({
      name: record.name,
      year: record.year,
      company: record.company,
      deadline: record.deadline,
      totalCount: record.totalCount,
      appointedCount: record.appointedCount,
      checkedCount: record.checkedCount,
      status: record.status,
    });
    setPlanFormOpen(true);
  };

  const savePlan = () => {
    if (!planForm.name) return;
    if (editingPlanId) {
      setPlans((prev) => prev.map((p) => (p.id === editingPlanId ? { ...p, ...planForm } : p)));
    } else {
      setPlans((prev) => [...prev, { id: Date.now().toString(), ...planForm }]);
    }
    setPlanFormOpen(false);
    setEditingPlanId(null);
  };

  const confirmDeletePlan = (id: string) => {
    setDeletePlanId(id);
  };

  const doDeletePlan = () => {
    if (deletePlanId) {
      setPlans((prev) => prev.filter((p) => p.id !== deletePlanId));
      setDeletePlanId(null);
    }
  };

  const openAddRecord = () => {
    setEditingRecordId(null);
    setRecordForm({
      name: '',
      employeeName: '',
      department: '',
      company: '',
      appointmentDate: '',
      appointmentTime: '',
      status: 'pending',
    });
    setRecordFormOpen(true);
  };

  const openEditRecord = (record: MedicalRecord) => {
    setEditingRecordId(record.id);
    setRecordForm({
      name: record.name,
      employeeName: record.employeeName,
      department: record.department,
      company: record.company,
      appointmentDate: record.appointmentDate,
      appointmentTime: record.appointmentTime,
      status: record.status,
    });
    setRecordFormOpen(true);
  };

  const saveRecord = () => {
    if (!recordForm.name) return;
    if (editingRecordId) {
      setRecords((prev) => prev.map((r) => (r.id === editingRecordId ? { ...r, ...recordForm } : r)));
    } else {
      setRecords((prev) => [...prev, { id: Date.now().toString(), ...recordForm }]);
    }
    setRecordFormOpen(false);
    setEditingRecordId(null);
  };

  const confirmDeleteRecord = (id: string) => {
    setDeleteRecordId(id);
  };

  const doDeleteRecord = () => {
    if (deleteRecordId) {
      setRecords((prev) => prev.filter((r) => r.id !== deleteRecordId));
      setDeleteRecordId(null);
    }
  };

  const cancelAppointment = (record: MedicalRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, status: 'cancelled' as const } : r)));
  };

  const stats = useMemo(() => {
    const ongoing = plans.filter((p) => p.status === 'ongoing').length;
    const pendingCheck = plans.reduce((sum, p) => sum + (p.totalCount - p.checkedCount), 0);
    const checkRate = plans.length > 0
      ? Math.round(plans.reduce((sum, p) => sum + (p.checkedCount / Math.max(p.totalCount, 1)), 0) / plans.length * 100)
      : 0;
    const expiringSoon = plans.filter((p) => {
      const days = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 7;
    }).length;
    return [
      { title: '进行中方案', value: String(ongoing), subText: '个' },
      { title: '总待检人数', value: String(pendingCheck), subText: '人' },
      { title: '平均到检率', value: `${checkRate}%`, subText: '全部方案' },
      { title: '7天内到期', value: String(expiringSoon), subText: '个方案' },
    ];
  }, [plans]);

  const planColumns: TableColumn<MedicalPlan>[] = [
    {
      key: 'name',
      title: '方案名称',
      width: 200,
      dataIndex: 'name',
      render: (value, record) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{value}</div>
          <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{record.year}年</div>
        </div>
      ),
    },
    { key: 'company', title: '体检机构', width: 120, dataIndex: 'company' },
    {
      key: 'progress',
      title: '进度',
      width: 200,
      render: (_, record) => {
        const rate = Math.round((record.checkedCount / Math.max(record.totalCount, 1)) * 100);
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${rate}%`, height: '100%', backgroundColor: 'var(--primary-500)', borderRadius: '3px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--primary-600)' }}>{rate}%</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
              已预约 {record.appointedCount} / 已到检 {record.checkedCount} / 共 {record.totalCount}
            </div>
          </div>
        );
      },
    },
    {
      key: 'deadline',
      title: '截止日期',
      width: 120,
      dataIndex: 'deadline',
      render: (value) => (
        <span style={{ color: new Date(value) < new Date() ? 'var(--error-600)' : 'var(--gray-600)' }}>{value}</span>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value: MedicalPlan['status']) => {
        const config = {
          ongoing: { color: 'primary' as const, label: '进行中' },
          completed: { color: 'success' as const, label: '已完成' },
          upcoming: { color: 'warning' as const, label: '待开始' },
        };
        return <Tag color={config[value].color}>{config[value].label}</Tag>;
      },
    },
  ];

  const recordColumns: TableColumn<MedicalRecord>[] = [
    { key: 'name', title: '姓名', width: 80, dataIndex: 'name' },
    { key: 'employeeName', title: '工号', width: 90, dataIndex: 'employeeName' },
    { key: 'department', title: '部门', width: 100, dataIndex: 'department', render: (v) => <Tag>{v}</Tag> },
    { key: 'company', title: '体检机构', width: 120, dataIndex: 'company' },
    {
      key: 'appointment',
      title: '预约时间',
      width: 160,
      render: (_, record) => <span>{record.appointmentDate} {record.appointmentTime}</span>,
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value: MedicalRecord['status']) => {
        const config = {
          appointed: { color: 'primary' as const, label: '已预约' },
          checked: { color: 'success' as const, label: '已到检' },
          cancelled: { color: 'default' as const, label: '已取消' },
          pending: { color: 'warning' as const, label: '待预约' },
        };
        return <Tag color={config[value].color}>{config[value].label}</Tag>;
      },
    },
  ];

  const planActions = [
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditPlan },
    { key: 'delete', label: '删除', type: 'danger' as const, onClick: (record: MedicalPlan) => confirmDeletePlan(record.id) },
    { key: 'detail', label: '查看名单', type: 'primary' as const, onClick: () => setActiveTab('list') },
  ];

  const recordActions = [
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditRecord },
    { key: 'delete', label: '删除', type: 'danger' as const, onClick: (record: MedicalRecord) => confirmDeleteRecord(record.id) },
    { key: 'cancel', label: '取消预约', type: 'danger' as const, onClick: cancelAppointment },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: '首页', path: '/' }, { label: '体检管理' }, { label: '体检方案' }]}
        title="体检方案"
        description="管理年度体检方案，导入体检名单，查看预约及到检状态"
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>体检方案</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="secondary" icon="import" onClick={() => setImportModalOpen(true)}>导入名单</Button>
              <Button type="primary" icon="plus" onClick={openAddPlan}>新增方案</Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0' }}>
            <button
              onClick={() => setActiveTab('plan')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'plan' ? '2px solid var(--primary-600)' : '2px solid transparent',
                color: activeTab === 'plan' ? 'var(--primary-600)' : 'var(--gray-500)',
                cursor: 'pointer',
                fontWeight: activeTab === 'plan' ? 500 : 400,
              }}
            >体检方案</button>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'list' ? '2px solid var(--primary-600)' : '2px solid transparent',
                color: activeTab === 'list' ? 'var(--primary-600)' : 'var(--gray-500)',
                cursor: 'pointer',
                fontWeight: activeTab === 'list' ? 500 : 400,
              }}
            >体检名单</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>{stat.title}</div>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{stat.subText}</div>
          </div>
        ))}
      </div>

      {activeTab === 'plan' && (
        <ListPageTemplate
          searchPlaceholder="搜索方案名称..."
          columns={planColumns}
          dataSource={plans}
          rowKey="id"
          rowActions={planActions}
          pagination={{ current: 1, pageSize: 10, total: plans.length, onChange: () => {} }}
        />
      )}

      {activeTab === 'list' && (
        <ListPageTemplate
          searchPlaceholder="搜索姓名/工号..."
          columns={recordColumns}
          dataSource={records}
          rowKey="id"
          rowActions={recordActions}
          pagination={{ current: 1, pageSize: 10, total: records.length, onChange: () => {} }}
          pageActions={[{ buttonType: 'primary' as const, label: '新增记录', icon: 'plus' as const, onClick: openAddRecord }]}
        />
      )}

      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="导入体检名单"
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setImportModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => setImportModalOpen(false)}>开始导入</Button>,
        ]}
      >
        <div>
          <div style={{ border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
            <Icon name="upload" size={48} color="var(--gray-300)" />
            <div style={{ marginTop: '12px' }}>
              <Button type="primary">选择文件</Button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '12px' }}>支持 xlsx、xls 格式文件</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px' }}>导入说明</h4>
            <ul style={{ fontSize: '12px', color: 'var(--gray-500)', paddingLeft: '16px', lineHeight: '1.8' }}>
              <li>请先下载导入模板，按模板格式填写数据</li>
              <li>姓名、手机号为必填项</li>
              <li>体检方案需先在系统中创建</li>
              <li>单次导入最多支持 500 条数据</li>
            </ul>
          </div>
          <Button type="tertiary" icon="download">下载导入模板</Button>
        </div>
      </Modal>

      <Modal
        open={planFormOpen}
        onClose={() => setPlanFormOpen(false)}
        title={editingPlanId ? '编辑方案' : '新增方案'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setPlanFormOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={savePlan}>保存</Button>,
        ]}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>方案名称</label>
            <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>年份</label>
            <Input type="number" value={String(planForm.year)} onChange={(e) => setPlanForm({ ...planForm, year: Number(e.target.value) })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>体检机构</label>
            <Input value={planForm.company} onChange={(e) => setPlanForm({ ...planForm, company: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>截止日期</label>
            <Input type="date" value={planForm.deadline} onChange={(e) => setPlanForm({ ...planForm, deadline: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>状态</label>
            <Select
              options={[
                { label: '进行中', value: 'ongoing' },
                { label: '已完成', value: 'completed' },
                { label: '待开始', value: 'upcoming' },
              ]}
              value={planForm.status}
              onChange={(v) => setPlanForm({ ...planForm, status: v as MedicalPlan['status'] })}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>总人数</label>
            <Input type="number" value={String(planForm.totalCount)} onChange={(e) => setPlanForm({ ...planForm, totalCount: Number(e.target.value) })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>已预约</label>
            <Input type="number" value={String(planForm.appointedCount)} onChange={(e) => setPlanForm({ ...planForm, appointedCount: Number(e.target.value) })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>已到检</label>
            <Input type="number" value={String(planForm.checkedCount)} onChange={(e) => setPlanForm({ ...planForm, checkedCount: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>

      <Modal
        open={recordFormOpen}
        onClose={() => setRecordFormOpen(false)}
        title={editingRecordId ? '编辑记录' : '新增记录'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setRecordFormOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={saveRecord}>保存</Button>,
        ]}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>姓名</label>
            <Input value={recordForm.name} onChange={(e) => setRecordForm({ ...recordForm, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>工号</label>
            <Input value={recordForm.employeeName} onChange={(e) => setRecordForm({ ...recordForm, employeeName: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>部门</label>
            <Select options={departmentOptions} value={recordForm.department} onChange={(v) => setRecordForm({ ...recordForm, department: String(v) })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>体检机构</label>
            <Input value={recordForm.company} onChange={(e) => setRecordForm({ ...recordForm, company: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>预约日期</label>
            <Input type="date" value={recordForm.appointmentDate} onChange={(e) => setRecordForm({ ...recordForm, appointmentDate: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>预约时间</label>
            <Input type="time" value={recordForm.appointmentTime} onChange={(e) => setRecordForm({ ...recordForm, appointmentTime: e.target.value })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>状态</label>
            <Select
              options={[
                { label: '已预约', value: 'appointed' },
                { label: '已到检', value: 'checked' },
                { label: '已取消', value: 'cancelled' },
                { label: '待预约', value: 'pending' },
              ]}
              value={recordForm.status}
              onChange={(v) => setRecordForm({ ...recordForm, status: v as MedicalRecord['status'] })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deletePlanId}
        onClose={() => setDeletePlanId(null)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeletePlanId(null)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeletePlan}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该体检方案吗？删除后不可恢复。</p>
      </Modal>

      <Modal
        open={!!deleteRecordId}
        onClose={() => setDeleteRecordId(null)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeleteRecordId(null)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeleteRecord}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该体检记录吗？删除后不可恢复。</p>
      </Modal>
    </>
  );
};

export default MedicalManagement;
