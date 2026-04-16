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
import { DEMO_STORAGE_KEYS, seedEmployeePoints, seedPointsRecords, type EmployeePoints, type PointsRecord } from '../mockApi/demoData';

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '销售部', value: '销售部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
  { label: '运维部', value: '运维部' },
  { label: '产品部', value: '产品部' },
];

type TabKey = 'employee' | 'records';

const PointsManagement: React.FC = () => {
  const [employees, setEmployees] = useLocalStorageState<EmployeePoints[]>(DEMO_STORAGE_KEYS.employeePoints, seedEmployeePoints);
  const [records, setRecords] = useLocalStorageState<PointsRecord[]>(DEMO_STORAGE_KEYS.pointsRecords, seedPointsRecords);
  const [activeTab, setActiveTab] = useState<TabKey>('employee');
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [empFormModalOpen, setEmpFormModalOpen] = useState(false);
  const [recordFormModalOpen, setRecordFormModalOpen] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [deleteEmpId, setDeleteEmpId] = useState<string | null>(null);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);

  const [grantForm, setGrantForm] = useState({ empId: '', points: '', reason: '' });
  const [batchForm, setBatchForm] = useState({ department: 'all', points: '', reason: '' });
  const [empForm, setEmpForm] = useState({ name: '', empNo: '', department: '', balance: 0, totalIncome: 0, totalExpense: 0, lastGrantDate: '' });
  const [recordForm, setRecordForm] = useState({ name: '', empNo: '', recordType: 'grant' as PointsRecord['recordType'], points: 0, reason: '', operator: '管理员' });

  const openEditEmp = (record: EmployeePoints) => {
    setEditingEmpId(record.id);
    setEmpForm({
      name: record.name,
      empNo: record.empNo,
      department: record.department,
      balance: record.balance,
      totalIncome: record.totalIncome,
      totalExpense: record.totalExpense,
      lastGrantDate: record.lastGrantDate,
    });
    setEmpFormModalOpen(true);
  };

  const saveEmp = () => {
    if (editingEmpId) {
      setEmployees((prev) => prev.map((e) => (e.id === editingEmpId ? { ...e, ...empForm } : e)));
    } else {
      const newEmp: EmployeePoints = { id: Date.now().toString(), ...empForm };
      setEmployees((prev) => [...prev, newEmp]);
    }
    setEmpFormModalOpen(false);
    setEditingEmpId(null);
  };

  const confirmDeleteEmp = (id: string) => {
    setDeleteEmpId(id);
  };

  const doDeleteEmp = () => {
    if (deleteEmpId) {
      setEmployees((prev) => prev.filter((e) => e.id !== deleteEmpId));
      setDeleteEmpId(null);
    }
  };

  const openEditRecord = (record: PointsRecord) => {
    setEditingRecordId(record.id);
    setRecordForm({
      name: record.name,
      empNo: record.empNo,
      recordType: record.recordType,
      points: record.points,
      reason: record.reason,
      operator: record.operator,
    });
    setRecordFormModalOpen(true);
  };

  const saveRecord = () => {
    const now = new Date();
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (editingRecordId) {
      setRecords((prev) => prev.map((r) => (r.id === editingRecordId ? { ...r, ...recordForm, createTime: r.createTime } : r)));
    } else {
      const newRecord: PointsRecord = { id: Date.now().toString(), ...recordForm, createTime };
      setRecords((prev) => [newRecord, ...prev]);
    }
    setRecordFormModalOpen(false);
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

  const handleGrant = () => {
    const pts = Number(grantForm.points);
    if (!grantForm.empId || !pts) return;
    const emp = employees.find((e) => e.id === grantForm.empId);
    if (!emp) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setEmployees((prev) => prev.map((e) => (e.id === grantForm.empId ? { ...e, balance: e.balance + pts, totalIncome: e.totalIncome + pts, lastGrantDate: date } : e)));
    const newRecord: PointsRecord = { id: Date.now().toString(), name: emp.name, empNo: emp.empNo, recordType: 'grant', points: pts, reason: grantForm.reason || '积分发放', operator: '管理员', createTime: time };
    setRecords((prev) => [newRecord, ...prev]);
    setGrantModalOpen(false);
    setGrantForm({ empId: '', points: '', reason: '' });
  };

  const handleBatchGrant = () => {
    const pts = Number(batchForm.points);
    if (!pts) return;
    const targets = batchForm.department === 'all' ? employees : employees.filter((e) => e.department === batchForm.department);
    if (targets.length === 0) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const time = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setEmployees((prev) => prev.map((e) => (targets.find((t) => t.id === e.id) ? { ...e, balance: e.balance + pts, totalIncome: e.totalIncome + pts, lastGrantDate: date } : e)));
    const newRecords: PointsRecord[] = targets.map((t) => ({ id: `${Date.now()}_${t.id}`, name: t.name, empNo: t.empNo, recordType: 'grant' as const, points: pts, reason: batchForm.reason || '批量发放', operator: '管理员', createTime: time }));
    setRecords((prev) => [...newRecords, ...prev]);
    setBatchModalOpen(false);
    setBatchForm({ department: 'all', points: '', reason: '' });
  };

  const stats = useMemo(() => {
    const totalGrant = records.filter((r) => r.recordType === 'grant').reduce((sum, r) => sum + r.points, 0);
    const totalDeduct = Math.abs(records.filter((r) => r.recordType === 'deduct' || r.recordType === 'expire').reduce((sum, r) => sum + r.points, 0));
    const avgBalance = employees.length > 0 ? Math.round(employees.reduce((s, e) => s + e.balance, 0) / employees.length) : 0;
    return [
      { title: '累计发放总额', value: totalGrant.toLocaleString(), subText: '全部记录' },
      { title: '累计兑换/过期', value: totalDeduct.toLocaleString(), subText: '全部记录' },
      { title: '人均积分余额', value: avgBalance.toLocaleString(), subText: `${employees.length} 人` },
      { title: '当前总余额', value: employees.reduce((s, e) => s + e.balance, 0).toLocaleString(), subText: '实时' },
    ];
  }, [employees, records]);

  const employeeColumns: TableColumn<EmployeePoints>[] = [
    { key: 'name', title: '姓名', width: 100, dataIndex: 'name', render: (v) => <span style={{ color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>{v}</span> },
    { key: 'empNo', title: '工号', width: 100, dataIndex: 'empNo' },
    { key: 'department', title: '部门', width: 100, dataIndex: 'department', render: (v) => <Tag>{v}</Tag> },
    { key: 'balance', title: '积分余额', width: 120, dataIndex: 'balance', align: 'right', render: (v) => <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary-600)' }}>{v.toLocaleString()}</span> },
    { key: 'income', title: '累计收入', width: 100, dataIndex: 'totalIncome', align: 'right', render: (v) => <span style={{ color: 'var(--success-600)' }}>+{v.toLocaleString()}</span> },
    { key: 'expense', title: '累计支出', width: 100, dataIndex: 'totalExpense', align: 'right', render: (v) => <span style={{ color: 'var(--error-600)' }}>-{v.toLocaleString()}</span> },
    { key: 'lastGrantDate', title: '上次发放', width: 120, dataIndex: 'lastGrantDate' },
  ];

  const recordColumns: TableColumn<PointsRecord>[] = [
    { key: 'name', title: '员工', width: 120, render: (_, r) => <div><div style={{ fontWeight: 500 }}>{r.name}</div><div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{r.empNo}</div></div> },
    { key: 'type', title: '类型', width: 100, dataIndex: 'recordType', render: (v: PointsRecord['recordType']) => { const c = { grant: { color: 'success' as const, label: '发放' }, deduct: { color: 'error' as const, label: '扣除' }, expire: { color: 'warning' as const, label: '过期' } }; return <Tag color={c[v].color}>{c[v].label}</Tag>; } },
    { key: 'points', title: '积分', width: 100, dataIndex: 'points', align: 'right', render: (v) => <span style={{ fontSize: '14px', fontWeight: 600, color: v > 0 ? 'var(--success-600)' : 'var(--error-600)' }}>{v > 0 ? '+' : ''}{v}</span> },
    { key: 'reason', title: '原因', width: 200, dataIndex: 'reason' },
    { key: 'operator', title: '操作人', width: 100, dataIndex: 'operator' },
    { key: 'createTime', title: '时间', width: 160, dataIndex: 'createTime' },
  ];

  const employeeActions = [
    { key: 'grant', label: '发放', type: 'primary' as const, onClick: (r: EmployeePoints) => { setGrantForm({ empId: r.id, points: '', reason: '' }); setGrantModalOpen(true); } },
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditEmp },
    { key: 'delete', label: '删除', type: 'danger' as const, onClick: (r: EmployeePoints) => confirmDeleteEmp(r.id) },
  ];

  const recordActions = [
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditRecord },
    { key: 'delete', label: '删除', type: 'danger' as const, onClick: (r: PointsRecord) => confirmDeleteRecord(r.id) },
  ];

  return (
    <>
      <PageHeader breadcrumb={[{ label: '首页', path: '/' }, { label: '弹性积分' }, { label: '员工积分' }]} title="员工积分" description="管理员工积分账户，进行积分发放与兑换记录查询" />
      <div style={{ marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>弹性积分</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="secondary" icon="upload" onClick={() => setBatchModalOpen(true)}>批量发放</Button>
              <Button type="primary" icon="plus" onClick={() => { setGrantForm({ empId: '', points: '', reason: '' }); setGrantModalOpen(true); }}>发放积分</Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setActiveTab('employee')} style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'employee' ? '2px solid var(--primary-600)' : '2px solid transparent', color: activeTab === 'employee' ? 'var(--primary-600)' : 'var(--gray-500)', cursor: 'pointer', fontWeight: activeTab === 'employee' ? 500 : 400 }}>员工积分</button>
            <button onClick={() => setActiveTab('records')} style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'records' ? '2px solid var(--primary-600)' : '2px solid transparent', color: activeTab === 'records' ? 'var(--primary-600)' : 'var(--gray-500)', cursor: 'pointer', fontWeight: activeTab === 'records' ? 500 : 400 }}>积分明细</button>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '8px' }}>{stat.title}</div>
            <div style={{ fontSize: '30px', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{stat.subText}</div>
          </div>
        ))}
      </div>
      {activeTab === 'employee' && (
        <ListPageTemplate
          searchPlaceholder="搜索姓名/工号..."
          columns={employeeColumns}
          dataSource={employees}
          rowKey="id"
          rowActions={employeeActions}
          pagination={{ current: 1, pageSize: 10, total: employees.length, onChange: () => {} }}
          pageActions={[{ buttonType: 'primary' as const, label: '新增员工积分', icon: 'plus' as const, onClick: () => { setEditingEmpId(null); setEmpForm({ name: '', empNo: '', department: '', balance: 0, totalIncome: 0, totalExpense: 0, lastGrantDate: '' }); setEmpFormModalOpen(true); } }]}
        />
      )}
      {activeTab === 'records' && (
        <ListPageTemplate
          searchPlaceholder="搜索姓名/工号..."
          columns={recordColumns}
          dataSource={records}
          rowKey="id"
          rowActions={recordActions}
          pagination={{ current: 1, pageSize: 10, total: records.length, onChange: () => {} }}
          pageActions={[{ buttonType: 'primary' as const, label: '新增记录', icon: 'plus' as const, onClick: () => { setEditingRecordId(null); setRecordForm({ name: '', empNo: '', recordType: 'grant', points: 0, reason: '', operator: '管理员' }); setRecordFormModalOpen(true); } }]}
        />
      )}

      <Modal open={grantModalOpen} onClose={() => setGrantModalOpen(false)} title="发放积分" size="md"
        footer={[<Button key="cancel" type="secondary" onClick={() => setGrantModalOpen(false)}>取消</Button>, <Button key="submit" type="primary" onClick={handleGrant}>确认发放</Button>]}>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发放对象 <span style={{ color: 'var(--error-600)' }}>*</span></label>
            <Select options={employees.map((e) => ({ label: `${e.name} (${e.empNo})`, value: e.id }))} placeholder="选择员工" value={grantForm.empId} onChange={(v) => setGrantForm({ ...grantForm, empId: String(v) })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发放数量 <span style={{ color: 'var(--error-600)' }}>*</span></label>
            <Input type="number" placeholder="积分/人" value={grantForm.points} onChange={(e) => setGrantForm({ ...grantForm, points: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发放原因 (员工可见)</label>
            <Input placeholder="员工将在积分明细中看到此原因" value={grantForm.reason} onChange={(e) => setGrantForm({ ...grantForm, reason: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal open={batchModalOpen} onClose={() => setBatchModalOpen(false)} title="批量发放积分" size="md"
        footer={[<Button key="cancel" type="secondary" onClick={() => setBatchModalOpen(false)}>取消</Button>, <Button key="submit" type="primary" onClick={handleBatchGrant}>确认发放</Button>]}>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>选择部门</label>
            <Select options={[{ label: '全部部门', value: 'all' }, ...departmentOptions]} value={batchForm.department} onChange={(v) => setBatchForm({ ...batchForm, department: String(v) })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发放数量</label>
            <Input type="number" placeholder="积分/人" value={batchForm.points} onChange={(e) => setBatchForm({ ...batchForm, points: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发放原因</label>
            <Input placeholder="员工将在积分明细中看到此原因" value={batchForm.reason} onChange={(e) => setBatchForm({ ...batchForm, reason: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal open={empFormModalOpen} onClose={() => setEmpFormModalOpen(false)} title={editingEmpId ? '编辑员工积分' : '新增员工积分'} size="md"
        footer={[<Button key="cancel" type="secondary" onClick={() => setEmpFormModalOpen(false)}>取消</Button>, <Button key="submit" type="primary" onClick={saveEmp}>保存</Button>]}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>姓名</label><Input value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>工号</label><Input value={empForm.empNo} onChange={(e) => setEmpForm({ ...empForm, empNo: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>部门</label><Select options={departmentOptions} value={empForm.department} onChange={(v) => setEmpForm({ ...empForm, department: String(v) })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>余额</label><Input type="number" value={String(empForm.balance)} onChange={(e) => setEmpForm({ ...empForm, balance: Number(e.target.value) })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>累计收入</label><Input type="number" value={String(empForm.totalIncome)} onChange={(e) => setEmpForm({ ...empForm, totalIncome: Number(e.target.value) })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>累计支出</label><Input type="number" value={String(empForm.totalExpense)} onChange={(e) => setEmpForm({ ...empForm, totalExpense: Number(e.target.value) })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>上次发放日期</label><Input type="date" value={empForm.lastGrantDate} onChange={(e) => setEmpForm({ ...empForm, lastGrantDate: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={recordFormModalOpen} onClose={() => setRecordFormModalOpen(false)} title={editingRecordId ? '编辑积分记录' : '新增积分记录'} size="md"
        footer={[<Button key="cancel" type="secondary" onClick={() => setRecordFormModalOpen(false)}>取消</Button>, <Button key="submit" type="primary" onClick={saveRecord}>保存</Button>]}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>姓名</label><Input value={recordForm.name} onChange={(e) => setRecordForm({ ...recordForm, name: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>工号</label><Input value={recordForm.empNo} onChange={(e) => setRecordForm({ ...recordForm, empNo: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>类型</label><Select options={[{ label: '发放', value: 'grant' }, { label: '扣除', value: 'deduct' }, { label: '过期', value: 'expire' }]} value={recordForm.recordType} onChange={(v) => setRecordForm({ ...recordForm, recordType: v as PointsRecord['recordType'] })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>积分变动</label><Input type="number" value={String(recordForm.points)} onChange={(e) => setRecordForm({ ...recordForm, points: Number(e.target.value) })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>原因</label><Input value={recordForm.reason} onChange={(e) => setRecordForm({ ...recordForm, reason: e.target.value })} /></div>
          <div><label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>操作人</label><Input value={recordForm.operator} onChange={(e) => setRecordForm({ ...recordForm, operator: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal open={!!deleteEmpId} onClose={() => setDeleteEmpId(null)} title="确认删除" size="sm"
        footer={[<Button key="cancel" type="secondary" onClick={() => setDeleteEmpId(null)}>取消</Button>, <Button key="submit" type="danger" onClick={doDeleteEmp}>删除</Button>]}>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该员工积分数据吗？删除后不可恢复。</p>
      </Modal>

      <Modal open={!!deleteRecordId} onClose={() => setDeleteRecordId(null)} title="确认删除" size="sm"
        footer={[<Button key="cancel" type="secondary" onClick={() => setDeleteRecordId(null)}>取消</Button>, <Button key="submit" type="danger" onClick={doDeleteRecord}>删除</Button>]}>
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该积分记录吗？删除后不可恢复。</p>
      </Modal>
    </>
  );
};

export default PointsManagement;
