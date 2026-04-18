import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { DataTable, type TableColumn } from '../components/composites/DataTable';
import { panelPadding, panelSurfaceStyle, panelSubtitleStyle, panelTitleStyle } from '../components/composites/surfaceStyles';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import {
  DEMO_STORAGE_KEYS,
  seedEmployees,
  seedInsuranceMaterials,
  seedInsuranceOperationRecords,
  seedInsuredPersons,
  type Employee,
} from '../mockApi/demoData';

interface InsuredPerson {
  id: string;
  empNo: string;
  name: string;
  department: string;
  joinDate: string;
  type: '员工本人' | '员工+家属';
  status: '保障中' | '核保中' | '待生效' | '即将退保' | '已失效';
  effectiveDate?: string;
  expiryDate?: string;
}

interface OperationRecord {
  id: string;
  empNo: string;
  name: string;
  type: '加员' | '减员' | '替换';
  submitDate: string;
  effectiveDate: string;
  status: '待生效' | '已生效' | '已撤销';
}

interface InsuranceMaterial {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

const schemeInfo = {
  name: '企业补充医疗保险计划A',
  insuranceType: '补充医疗保险',
  policyNo: 'SI-2026-XXXXX',
  company: '平安健康保险股份有限公司',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  premium: 128000,
  perCapitaCoverage: 30000,
  employeeCount: 20,
  childCount: 2,
  spouseCount: 2,
  parentCount: 1,
  benefits: [
    '门急诊医疗：80% 赔付，上限 5000 元/年',
    '住院医疗：100% 赔付，上限 3 万元/年',
    '重大疾病：10 万元一次性给付',
    '意外伤害：5 万元给付',
    '员工可附带子女、配偶及父母投保（费用按对象分摊）',
  ],
  remark: '本方案适用于全体正式员工，含试用期转正人员',
};

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '销售部', value: '销售部' },
  { label: '运维部', value: '运维部' },
  { label: '产品部', value: '产品部' },
  { label: '财务部', value: '财务部' },
  { label: '人事部', value: '人事部' },
];

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={panelSubtitleStyle}>{label}</div>
    <div style={{ fontSize: '13px', color: 'var(--gray-700)', marginTop: '2px' }}>{value}</div>
  </div>
);

const InsuranceSchemeDetail: React.FC = () => {
  const { navigate } = useNavigation();
  const [persons, setPersons] = useLocalStorageState<InsuredPerson[]>(DEMO_STORAGE_KEYS.insuredPersons, seedInsuredPersons);
  const [records, setRecords] = useLocalStorageState<OperationRecord[]>(DEMO_STORAGE_KEYS.insuranceOperationRecords, seedInsuranceOperationRecords);
  const [materials, setMaterials] = useLocalStorageState<InsuranceMaterial[]>(DEMO_STORAGE_KEYS.insuranceMaterials, seedInsuranceMaterials);
  const [employees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedEmployees);

  const [activeTab, setActiveTab] = useState<'list' | 'records' | 'materials'>('list');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [reduceModalOpen, setReduceModalOpen] = useState(false);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [materialFormOpen, setMaterialFormOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({ name: '', type: '' });
  const [deletePersonId, setDeletePersonId] = useState<string | null>(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);

  const filteredPersons = useMemo(() => {
    return persons.filter((p) => {
      const matchSearch = !searchText || p.name.includes(searchText) || p.empNo.includes(searchText);
      const matchDept = !deptFilter || p.department === deptFilter;
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [persons, searchText, deptFilter, statusFilter]);

  const handleAddMembers = (selectedEmps: Employee[]) => {
    const now = new Date();
    const newPersons: InsuredPerson[] = selectedEmps.map((emp) => ({
      id: Date.now().toString() + Math.random(),
      empNo: emp.empNo,
      name: emp.name,
      department: emp.department,
      joinDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      type: '员工本人' as const,
      status: '待生效' as const,
      effectiveDate: `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}-01`,
    }));
    setPersons((prev) => [...prev, ...newPersons]);

    const newRecords: OperationRecord[] = selectedEmps.map((emp) => ({
      id: Date.now().toString() + Math.random(),
      empNo: emp.empNo,
      name: emp.name,
      type: '加员' as const,
      submitDate: now.toISOString().slice(0, 10),
      effectiveDate: `${now.getFullYear()}-${String(now.getMonth() + 2).padStart(2, '0')}-01`,
      status: '待生效' as const,
    }));
    setRecords((prev) => [...newRecords, ...prev]);
    setAddModalOpen(false);
  };

  const handleReduceMembers = (empNos: string[]) => {
    const now = new Date();
    empNos.forEach((empNo) => {
      const person = persons.find((p) => p.empNo === empNo);
      if (person) {
        setPersons((prev) =>
          prev.map((p) =>
            p.empNo === empNo ? { ...p, status: '已失效' as const, expiryDate: now.toISOString().slice(0, 10) } : p
          )
        );
        setRecords((prev) => [
          ...prev,
          {
            id: Date.now().toString() + Math.random(),
            empNo: person.empNo,
            name: person.name,
            type: '减员' as const,
            submitDate: now.toISOString().slice(0, 10),
            effectiveDate: now.toISOString().slice(0, 10),
            status: '已生效' as const,
          },
        ]);
      }
    });
    setSelectedRowKeys([]);
    setReduceModalOpen(false);
  };

  const confirmDeletePerson = (id: string) => {
    setDeletePersonId(id);
  };

  const doDeletePerson = () => {
    if (deletePersonId) {
      setPersons((prev) => prev.filter((p) => p.id !== deletePersonId));
      setDeletePersonId(null);
    }
  };

  const handleAddMaterial = () => {
    if (!materialForm.name) return;
    const newMaterial: InsuranceMaterial = {
      id: Date.now().toString(),
      name: materialForm.name,
      type: materialForm.type,
      uploadDate: new Date().toISOString().slice(0, 10),
    };
    setMaterials((prev) => [...prev, newMaterial]);
    setMaterialForm({ name: '', type: '' });
    setMaterialFormOpen(false);
  };

  const confirmDeleteMaterial = (id: string) => {
    setDeleteMaterialId(id);
  };

  const doDeleteMaterial = () => {
    if (deleteMaterialId) {
      setMaterials((prev) => prev.filter((m) => m.id !== deleteMaterialId));
      setDeleteMaterialId(null);
    }
  };

  const stats = useMemo(() => {
    const addCount = records.filter((r) => r.type === '加员').length;
    const reduceCount = records.filter((r) => r.type === '减员').length;
    const pendingCount = records.filter((r) => r.status === '待生效').length;
    const pendingDate = records.find((r) => r.status === '待生效')?.effectiveDate || '无';
    return { addCount, reduceCount, pendingCount, pendingDate };
  }, [records]);

  const getStatusTag = (status: InsuredPerson['status']) => {
    const config: Record<string, { color: any; label: string }> = {
      保障中: { color: 'success', label: '保障中' },
      核保中: { color: 'primary', label: '核保中' },
      待生效: { color: 'warning', label: '待生效' },
      即将退保: { color: 'warning', label: '即将退保' },
      已失效: { color: 'default', label: '已失效' },
    };
    return <Tag color={config[status]?.color}>{config[status]?.label}</Tag>;
  };

  const getRecordStatusTag = (status: OperationRecord['status']) => {
    const config: Record<string, { color: any; label: string }> = {
      待生效: { color: 'warning', label: '待生效' },
      已生效: { color: 'success', label: '已生效' },
      已撤销: { color: 'default', label: '已撤销' },
    };
    return <Tag color={config[status]?.color}>{config[status]?.label}</Tag>;
  };

  const handleBack = () => navigate('insurance-plan');

  const columns: TableColumn<InsuredPerson>[] = [
    { key: 'empNo', title: '工号', width: 100, dataIndex: 'empNo' },
    { key: 'name', title: '姓名', width: 100, dataIndex: 'name' },
    { key: 'department', title: '部门', width: 120, dataIndex: 'department' },
    { key: 'joinDate', title: '加入日期', width: 100, dataIndex: 'joinDate', align: 'center' },
    { key: 'type', title: '投保类型', width: 120, dataIndex: 'type', align: 'center' },
    { key: 'status', title: '保障状态', width: 100, dataIndex: 'status', align: 'center', render: (v) => getStatusTag(v) },
  ];

  const recordColumns: TableColumn<OperationRecord>[] = [
    { key: 'empNo', title: '工号', width: 100, dataIndex: 'empNo' },
    { key: 'name', title: '姓名', width: 100, dataIndex: 'name' },
    { key: 'type', title: '操作类型', width: 100, dataIndex: 'type', align: 'center' },
    { key: 'submitDate', title: '提交时间', width: 120, dataIndex: 'submitDate', align: 'center' },
    { key: 'effectiveDate', title: '生效时间', width: 120, dataIndex: 'effectiveDate', align: 'center' },
    { key: 'status', title: '状态', width: 100, dataIndex: 'status', align: 'center', render: (v) => getRecordStatusTag(v) },
  ];

  const materialColumns: TableColumn<InsuranceMaterial>[] = [
    { key: 'name', title: '材料名称', dataIndex: 'name' },
    { key: 'type', title: '类型', width: 120, dataIndex: 'type', align: 'center' },
    { key: 'uploadDate', title: '上传时间', width: 120, dataIndex: 'uploadDate', align: 'center' },
  ];

  return (
    <>
      <PageHeader
        title={`${schemeInfo.name} (${schemeInfo.policyNo})`}
        description={`保单号：${schemeInfo.policyNo} | 保险公司：${schemeInfo.company} | 生效中`}
        breadcrumb={[{ label: '首页', path: '/' }, { label: '保险管理' }, { label: '保险方案' }, { label: `${schemeInfo.name}详情` }]}
        onBack={handleBack}
        actions={[
          { type: 'secondary', label: '导出名单', icon: 'export', onClick: () => {} },
          { type: 'primary', label: '批量减员', onClick: () => setReduceModalOpen(true) },
          { type: 'primary', label: '批量加员', onClick: () => setAddModalOpen(true) },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{ ...panelSurfaceStyle, padding: `${panelPadding + 4}px` }}>
          <div style={panelTitleStyle}>方案概览</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px', marginBottom: '16px' }}>
            <InfoRow label="保险方案" value={`${schemeInfo.name} (基础版)`} />
            <InfoRow label="保险类型" value={schemeInfo.insuranceType} />
            <InfoRow label="保单号码" value={schemeInfo.policyNo} />
            <InfoRow label="保险公司" value={schemeInfo.company} />
            <InfoRow label="生效日期" value={schemeInfo.startDate} />
            <InfoRow label="终止日期" value={schemeInfo.endDate} />
            <InfoRow label="人均保额" value={`${schemeInfo.perCapitaCoverage.toLocaleString()} 元/年`} />
            <InfoRow label="企业保费" value={`¥${schemeInfo.premium.toLocaleString()}/年`} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: '员工', value: schemeInfo.employeeCount, color: 'var(--primary-600)', bg: 'var(--primary-50)' },
              { label: '子女', value: schemeInfo.childCount, color: 'var(--gray-700)', bg: 'var(--gray-50)' },
              { label: '配偶', value: schemeInfo.spouseCount, color: 'var(--info-600)', bg: 'var(--info-50)' },
              { label: '父母', value: schemeInfo.parentCount, color: 'var(--warning-600)', bg: 'var(--warning-50)' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '12px 14px', backgroundColor: item.bg, borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: item.color, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px' }}>保障内容</div>
            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--gray-600)', fontSize: '13px', lineHeight: '1.8' }}>
              {schemeInfo.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-700)', marginBottom: '4px' }}>备注</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{schemeInfo.remark}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ ...panelSurfaceStyle, padding: `${panelPadding}px` }}>
            <div style={panelTitleStyle}>快捷操作</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button type="primary" onClick={() => setAddModalOpen(true)}>加员</Button>
              <Button type="primary" onClick={() => setReduceModalOpen(true)}>减员</Button>
              <Button type="primary" onClick={() => setReplaceModalOpen(true)}>替换人员</Button>
            </div>
          </div>
          <div style={{ ...panelSurfaceStyle, padding: `${panelPadding}px` }}>
            <div style={panelTitleStyle}>本月变更统计</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--gray-600)' }}>
              <div>已加员：<span style={{ color: 'var(--success-600)' }}>+{stats.addCount} 人</span></div>
              <div>已减员：<span style={{ color: 'var(--error-600)' }}>-{stats.reduceCount} 人</span></div>
              <div>待生效：<span style={{ color: 'var(--warning-600)' }}>{stats.pendingCount} 人 ({stats.pendingDate} 生效)</span></div>
            </div>
          </div>
          <div style={{ ...panelSurfaceStyle, padding: `${panelPadding}px` }}>
            <div style={panelTitleStyle}>生效规则提醒</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-600)', marginBottom: '4px' }}>
                <Icon name="check" size={14} /> 当前可操作
              </div>
              <div>每月 1-10 号可操作次月生效的加减员</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)' }}>
          {[{ key: 'list', label: '被保人名单' }, { key: 'records', label: '加减员记录' }, { key: 'materials', label: '投保材料' }].map((tab) => (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: activeTab === tab.key ? 500 : 400,
                color: activeTab === tab.key ? 'var(--primary-600)' : 'var(--gray-600)',
                borderBottom: activeTab === tab.key ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div style={{ padding: '20px' }}>
          {activeTab === 'list' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Input placeholder="搜索姓名/工号" value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: '200px' }} />
                  <Select
                    placeholder="部门"
                    value={deptFilter}
                    onChange={(v) => setDeptFilter(v as string)}
                    options={[{ label: '全部部门', value: '' }, ...departmentOptions]}
                    style={{ width: '140px' }}
                  />
                  <Select
                    placeholder="状态"
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as string)}
                    options={[{ label: '全部状态', value: '' }, { label: '保障中', value: '保障中' }, { label: '待生效', value: '待生效' }, { label: '已失效', value: '已失效' }]}
                    style={{ width: '140px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button type="secondary" icon="export">导出名单</Button>
                  <Button type="secondary" icon="document">下载投保表</Button>
                </div>
              </div>
              <DataTable
                columns={columns}
                dataSource={filteredPersons}
                rowKey="id"
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                rowActions={[
                  { key: 'delete', label: '删除', type: 'danger', onClick: (r: InsuredPerson) => confirmDeletePerson(r.id) },
                ]}
                pagination={{ current: 1, pageSize: 20, total: filteredPersons.length, onChange: () => {} }}
              />
            </div>
          )}

          {activeTab === 'records' && (
            <DataTable
              columns={recordColumns}
              dataSource={records}
              rowKey="id"
              pagination={{ current: 1, pageSize: 10, total: records.length, onChange: () => {} }}
            />
          )}

          {activeTab === 'materials' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <Button type="primary" icon="plus" onClick={() => setMaterialFormOpen(true)}>上传材料</Button>
              </div>
              <DataTable
                columns={materialColumns}
                dataSource={materials}
                rowKey="id"
                rowActions={[
                  { key: 'download', label: '下载', type: 'primary', onClick: () => {} },
                  { key: 'delete', label: '删除', type: 'danger', onClick: (r: InsuranceMaterial) => confirmDeleteMaterial(r.id) },
                ]}
                pagination={{ current: 1, pageSize: 10, total: materials.length, onChange: () => {} }}
              />
            </div>
          )}
        </div>
      </div>

      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleAddMembers}
        persons={persons}
        employees={employees}
      />

      <ReduceMemberModal
        open={reduceModalOpen}
        onClose={() => setReduceModalOpen(false)}
        selectedRowKeys={selectedRowKeys}
        selectedPersons={persons.filter((p) => selectedRowKeys.includes(p.id))}
        onConfirm={handleReduceMembers}
      />

      <ReplaceMemberModal open={replaceModalOpen} onClose={() => setReplaceModalOpen(false)} />

      <Modal
        open={materialFormOpen}
        onClose={() => setMaterialFormOpen(false)}
        title="上传材料"
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setMaterialFormOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAddMaterial}>保存</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>材料名称</label>
            <Input value={materialForm.name} onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })} placeholder="如：保险条款.pdf" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>材料类型</label>
            <Select
              options={[
                { label: '保险条款', value: '保险条款' },
                { label: '保单', value: '保单' },
                { label: '发票', value: '发票' },
                { label: '理赔文件', value: '理赔文件' },
                { label: '其他', value: '其他' },
              ]}
              value={materialForm.type}
              onChange={(v) => setMaterialForm({ ...materialForm, type: String(v) })}
              placeholder="请选择"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deletePersonId}
        onClose={() => setDeletePersonId(null)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeletePersonId(null)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeletePerson}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该被保人记录吗？</p>
      </Modal>

      <Modal
        open={!!deleteMaterialId}
        onClose={() => setDeleteMaterialId(null)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeleteMaterialId(null)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeleteMaterial}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该投保材料吗？</p>
      </Modal>
    </>
  );
};

const AddMemberModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: Employee[]) => void;
  persons: InsuredPerson[];
  employees: Employee[];
}> = ({ open, onClose, onConfirm, persons, employees }) => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const availableEmployees = employees.filter(
    (emp) => emp.status === 'active' && !persons.some((p) => p.empNo === emp.empNo && p.status !== '已失效')
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="加员操作"
      size="md"
      footer={[
        <Button key="cancel" type="secondary" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={() => {
          const selected = employees.filter((emp) => selectedEmployees.includes(emp.empNo));
          onConfirm(selected);
          setSelectedEmployees([]);
        }}>确认加员</Button>,
      ]}
    >
      <div>
        <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px' }}>
          方案：<strong>补充医疗保险</strong>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-600)', display: 'block', marginBottom: '6px' }}>生效日期</label>
          <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-600)', display: 'block', marginBottom: '6px' }}>选择员工</label>
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '12px', maxHeight: '200px', overflow: 'auto' }}>
            {availableEmployees.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '20px' }}>暂无可添加的员工</div>
            )}
            {availableEmployees.map((emp) => {
              const isSelected = selectedEmployees.includes(emp.empNo);
              return (
                <div
                  key={emp.empNo}
                  onClick={() => {
                    setSelectedEmployees(prev =>
                      isSelected ? prev.filter(id => id !== emp.empNo) : [...prev, emp.empNo]
                    );
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid var(--gray-100)' }}
                >
                  <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: '1px solid var(--gray-300)', backgroundColor: isSelected ? 'var(--primary-600)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSelected && <Icon name="check" size={12} color="#fff" />}
                  </div>
                  <span style={{ fontWeight: 500 }}>{emp.name}</span>
                  <span style={{ color: 'var(--gray-400)' }}>({emp.empNo})</span>
                  <span style={{ color: 'var(--gray-500)' }}>{emp.department}</span>
                  <Tag color={emp.activationStatus ? 'success' : 'default'}>{emp.activationStatus ? '已激活' : '未激活'}</Tag>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>已选 <strong>{selectedEmployees.length}</strong> 人</div>
      </div>
    </Modal>
  );
};

const ReduceMemberModal: React.FC<{
  open: boolean;
  onClose: () => void;
  selectedRowKeys: (string | number)[];
  selectedPersons: InsuredPerson[];
  onConfirm: (empNos: string[]) => void;
}> = ({ open, onClose, selectedRowKeys, selectedPersons, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="减员操作"
      size="md"
      footer={[
        <Button key="cancel" type="secondary" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={() => {
          onConfirm(selectedPersons.map((p) => p.empNo));
        }}>确认减员</Button>,
      ]}
    >
      <div>
        <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px' }}>
          方案：<strong>补充医疗保险</strong>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px' }}>
          已选择 <strong>{selectedPersons.length}</strong> 人（可从被保人名单中勾选，或直接在下方输入工号减员）
        </div>
        {selectedPersons.length > 0 && (
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
            {selectedPersons.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid var(--gray-100)' }}>
                <span>{p.name} ({p.empNo}) - {p.department}</span>
                <span style={{ color: 'var(--error-600)' }}>将减员</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize: '13px', color: 'var(--gray-600)', padding: '12px', backgroundColor: 'var(--info-50)', borderRadius: '6px' }}>
          减员后，该员工的保障状态将变更为"已失效"
        </div>
      </div>
    </Modal>
  );
};

const ReplaceMemberModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="替换人员"
      size="md"
      footer={[
        <Button key="cancel" type="secondary" onClick={onClose}>取消</Button>,
        <Button key="submit" type="primary" onClick={onClose}>确认替换</Button>,
      ]}
    >
      <div>
        <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px' }}>
          方案：<strong>补充医疗保险</strong>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-600)', display: 'block', marginBottom: '6px' }}>生效日期</label>
          <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-600)', display: 'block', marginBottom: '6px' }}>被减员工</label>
          <Select
            placeholder="从当前被保人中选择"
            options={[
              { label: '张三 (EMP001) 研发部', value: 'EMP001' },
              { label: '李四 (EMP002) 市场部', value: 'EMP002' },
            ]}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', color: 'var(--gray-600)', display: 'block', marginBottom: '6px' }}>被加员工</label>
          <Select
            placeholder="从未投保员工中选择"
            options={[
              { label: '孙浩 (EMP101) 产品部', value: 'EMP101' },
              { label: '周婷 (EMP102) 人事部', value: 'EMP102' },
            ]}
          />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--gray-500)', padding: '12px', backgroundColor: 'var(--gray-50)', borderRadius: '6px' }}>
          替换不改变总人数，保费不变
        </div>
      </div>
    </Modal>
  );
};

export default InsuranceSchemeDetail;
