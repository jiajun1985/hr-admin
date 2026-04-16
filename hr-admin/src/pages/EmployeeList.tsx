import React, { useState, useMemo } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { seedEmployees } from '../mockApi/employeeSeedData';
import type { Employee } from '../mockApi/types';

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '销售部', value: '销售部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
  { label: '未分配', value: '未分配' },
];

const idTypeOptions = [
  { label: '身份证', value: '身份证' },
  { label: '护照', value: '护照' },
  { label: '港澳通行证', value: '港澳通行证' },
  { label: '台湾通行证', value: '台湾通行证' },
  { label: '其他', value: '其他' },
];

const today = () => new Date().toISOString().slice(0, 10);

const formatEmptyDate = (value?: string) => value || '—';

const getEmploymentStatusMeta = (employee: Employee, currentDate: string) => {
  if (employee.status === 'inactive' || (employee.leaveDate && employee.leaveDate <= currentDate)) {
    return { label: '已离职', color: 'default' as const };
  }

  if (employee.leaveDate && employee.leaveDate > currentDate) {
    return { label: '待离职', color: 'warning' as const };
  }

  return { label: '在职', color: 'success' as const };
};

const tableCellContentStyle: React.CSSProperties = {
  minHeight: '22px',
  display: 'flex',
  alignItems: 'center',
};

const centeredCellContentStyle: React.CSSProperties = {
  ...tableCellContentStyle,
  justifyContent: 'center',
};

const latinCellStyle: React.CSSProperties = {
  ...tableCellContentStyle,
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  fontVariantNumeric: 'tabular-nums lining-nums',
  letterSpacing: 0,
};

const centeredLatinCellStyle: React.CSSProperties = {
  ...latinCellStyle,
  justifyContent: 'center',
};

const renderDepartmentTag = (value: string) => {
  if (value === '未分配') {
    return (
      <Tag
        color="error"
        style={{
          backgroundColor: 'var(--error-50)',
          borderColor: 'var(--error-600)',
          color: 'var(--error-600)',
          fontWeight: 700,
          boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.12)',
        }}
      >
        未分配
      </Tag>
    );
  }

  return (
    <Tag color="default" style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-200)', color: 'var(--gray-700)' }}>
      {value}
    </Tag>
  );
};

const emptyForm: Omit<Employee, 'id' | 'empNo'> & { empNo?: string } = {
  empNo: '',
  name: '',
  department: '',
  position: '',
  gender: '男',
  idType: '身份证',
  idCard: '',
  phone: '',
  status: 'active',
  activationStatus: false,
  entryDate: '',
  leaveDate: '',
};

const EmployeeList: React.FC = () => {
  const currentDate = today();
  const [employees, setEmployees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedEmployees);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [leaveDateInput, setLeaveDateInput] = useState('');
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormModalOpen(true);
  };

  const openEditModal = (record: Employee) => {
    setEditingId(record.id);
    setFormData({
      empNo: record.empNo,
      name: record.name,
      department: record.department,
      position: record.position,
      gender: record.gender,
      idType: record.idType ?? '身份证',
      idCard: record.idCard ?? '',
      phone: record.phone,
      status: record.status,
      activationStatus: record.activationStatus,
      entryDate: record.entryDate,
      leaveDate: record.leaveDate ?? '',
    });
    setFormModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.idType || !formData.idCard) return;
    const normalizedLeaveDate = formData.status === 'inactive' ? formData.leaveDate || currentDate : '';
    const normalizedStatus = normalizedLeaveDate && normalizedLeaveDate > currentDate
      ? 'active'
      : formData.status === 'inactive'
        ? 'inactive'
        : 'active';
    const normalizedActivation = formData.activationStatus;

    if (editingId) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingId
            ? ({
                ...emp,
                empNo: formData.empNo || emp.empNo,
                name: formData.name,
                department: formData.department,
                position: formData.position,
                gender: formData.gender,
                idType: formData.idType,
                idCard: formData.idCard,
                phone: formData.phone,
                status: normalizedStatus,
                activationStatus: normalizedActivation,
                entryDate: formData.entryDate,
                leaveDate: normalizedLeaveDate,
              } as Employee)
            : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        empNo: formData.empNo || `EMP${String(employees.length + 1).padStart(3, '0')}`,
        name: formData.name,
        department: formData.department,
        position: formData.position,
        gender: formData.gender,
        idType: formData.idType,
        idCard: formData.idCard,
        phone: formData.phone,
        status: normalizedStatus,
        activationStatus: normalizedActivation,
        entryDate: formData.entryDate || new Date().toISOString().slice(0, 10),
        leaveDate: normalizedLeaveDate,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    setFormModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const confirmLeave = (id: string) => {
    setLeavingId(id);
    setLeaveDateInput('');
    setLeaveConfirmOpen(true);
  };

  const handleLeaveConfirm = () => {
    if (leavingId && leaveDateInput) {
      const normalizedStatus = leaveDateInput > currentDate ? 'active' : 'inactive';
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === leavingId
            ? { ...emp, status: normalizedStatus, leaveDate: leaveDateInput }
            : emp
        )
      );
      setSelectedRowKeys((prev) => prev.filter((k) => k !== leavingId));
      setLeavingId(null);
      setLeaveDateInput('');
      setLeaveConfirmOpen(false);
    }
  };

  const handleBatchLeave = () => {
    setEmployees((prev) =>
      prev.map((emp) =>
        selectedRowKeys.includes(emp.id)
          ? { ...emp, status: 'inactive' as const, leaveDate: currentDate }
          : emp
      )
    );
    setSelectedRowKeys([]);
  };

  React.useEffect(() => {
    setEmployees((prev) => {
      let changed = false;
      const next = prev.map((emp) => {
        if (emp.leaveDate && emp.leaveDate <= currentDate && emp.status !== 'inactive') {
          changed = true;
          return { ...emp, status: 'inactive' as const };
        }

        if (emp.leaveDate && emp.leaveDate > currentDate && emp.status !== 'active') {
          changed = true;
          return { ...emp, status: 'active' as const };
        }

        return emp;
      });
      return changed ? next : prev;
    });
  }, [currentDate, setEmployees]);

  const filteredData = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchValue ||
        emp.name.includes(searchValue) ||
        emp.empNo.includes(searchValue) ||
        emp.department.includes(searchValue);
      const matchesDepartment = !filterValues.department || emp.department === filterValues.department;
      const matchesStatus = !filterValues.status || emp.status === filterValues.status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchValue, filterValues]);

  const selectedEmployees = useMemo(
    () => employees.filter((emp) => selectedRowKeys.includes(emp.id)),
    [employees, selectedRowKeys]
  );

  const hasInactiveSelected = selectedEmployees.some((emp) => emp.status === 'inactive');

  const handlePageChange = (page: number) => {
    setCurrent(page);
    setSelectedRowKeys([]);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrent(1);
    setSelectedRowKeys([]);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrent(1);
  };

  const handleFilterChange = (key: string, value: string | number | (string | number)[]) => {
    setFilterValues((prev: Record<string, any>) => ({ ...prev, [key]: value }));
    setCurrent(1);
  };

  const handleReset = () => {
    setFilterValues({});
    setSearchValue('');
    setCurrent(1);
  };

  const columns: TableColumn<Employee>[] = [
    {
      key: 'empNo',
      title: '工号',
      align: 'center',
      minWidth: 92,
      dataIndex: 'empNo',
      render: (value) => <span style={centeredLatinCellStyle}>{value}</span>,
    },
    {
      key: 'name',
      title: '姓名',
      minWidth: 72,
      dataIndex: 'name',
      render: (value) => (
        <span style={{ color: 'var(--primary-600)', cursor: 'pointer' }}>{value}</span>
      ),
    },
    {
      key: 'department',
      title: '部门',
      align: 'center',
      minWidth: 96,
      dataIndex: 'department',
      render: (value) => <div style={centeredCellContentStyle}>{renderDepartmentTag(String(value))}</div>,
    },
    { key: 'gender', title: '性别', align: 'center', minWidth: 56, dataIndex: 'gender' },
    {
      key: 'idType',
      title: '证件类型',
      align: 'center',
      minWidth: 100,
      dataIndex: 'idType',
      render: (value) => <div style={centeredCellContentStyle}>{value || '—'}</div>,
    },
    {
      key: 'idCard',
      title: '证件号',
      align: 'center',
      minWidth: 168,
      dataIndex: 'idCard',
      render: (value) => <div style={centeredLatinCellStyle}>{value || '—'}</div>,
    },
    {
      key: 'phone',
      title: '手机号',
      align: 'center',
      minWidth: 120,
      dataIndex: 'phone',
      render: (value) => <span style={centeredLatinCellStyle}>{value}</span>,
    },
    {
      key: 'employmentStatus',
      title: '在职状态',
      align: 'center',
      minWidth: 88,
      dataIndex: 'status',
      render: (_, record) => {
        const statusMeta = getEmploymentStatusMeta(record, currentDate);
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      key: 'activationStatus',
      title: '激活状态',
      align: 'center',
      minWidth: 88,
      dataIndex: 'activationStatus',
      render: (value) =>
        value ? (
          <Tag
            color="success"
            style={{
              backgroundColor: 'var(--success-50)',
              color: 'var(--success-600)',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            已激活
          </Tag>
        ) : (
          <Tag
            color="error"
            style={{
              backgroundColor: 'var(--error-50)',
              color: 'var(--error-600)',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            未激活
          </Tag>
        ),
    },
    {
      key: 'entryDate',
      title: '入职时间',
      align: 'center',
      minWidth: 96,
      dataIndex: 'entryDate',
      render: (value) => <span style={centeredLatinCellStyle}>{value}</span>,
    },
    {
      key: 'leaveDate',
      title: '离职日期',
      align: 'center',
      minWidth: 88,
      dataIndex: 'leaveDate',
      render: (value) => (
        <span style={{ ...centeredLatinCellStyle, color: value ? 'var(--gray-600)' : 'var(--gray-400)' }}>
          {formatEmptyDate(value as string)}
        </span>
      ),
    },
  ];

  const rowActions = [
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditModal },
    {
      key: 'leave',
      label: '离职',
      type: 'danger' as const,
      onClick: (record: Employee) => confirmLeave(record.id),
      hidden: (record: Employee) => record.status === 'inactive',
    },
  ];

  const filters = [
    {
      key: 'department',
      label: '部门',
      buttonType: 'select' as const,
      options: [{ label: '全部', value: '' }, ...departmentOptions],
    },
    {
      key: 'status',
      label: '在职状态',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
      ],
    },
  ];

  const batchActions = [
    { key: 'points', label: '发放积分', disabled: hasInactiveSelected, onClick: () => console.log('发放积分') },
    { key: 'department', label: '调整部门', disabled: hasInactiveSelected, onClick: () => console.log('调整部门') },
    { key: 'leave', label: '批量离职', buttonType: 'danger' as const, disabled: hasInactiveSelected, onClick: handleBatchLeave },
  ];

  const pageActions = [
    { buttonType: 'secondary' as const, label: '批量导入', icon: 'import' as const, onClick: () => setImportModalOpen(true) },
    { buttonType: 'primary' as const, label: '新增员工', icon: 'plus' as const, onClick: openAddModal },
  ];

  const stats = [
    { title: '在职员工', value: String(employees.filter((e) => e.status === 'active').length), trend: { value: '较上月', direction: 'up' as const, percentage: '+1.2%' }, subText: '总人数' },
    { title: '本月新入职', value: '18', trend: { value: '较上月', direction: 'up' as const, percentage: '+5.0%' }, subText: '待完善: 3人' },
    { title: '本月离职', value: String(employees.filter((e) => e.status === 'inactive').length), trend: { value: '较上月', direction: 'down' as const, percentage: '-2.5%' }, subText: '已结算' },
    { title: '福利激活率', value: '97.9', suffix: '%', trend: { value: '较上月', direction: 'up' as const, percentage: '+0.5%' }, subText: '未激活: 25人' },
  ];

  const getSelectedItems = (keys: (string | number)[]) => {
    return employees.filter((emp) => keys.includes(emp.id)).map((emp) => ({ key: emp.id, label: `${emp.name} (${emp.department})` }));
  };

  return (
    <>
      <ListPageTemplate
        title="员工列表"
        description="管理企业员工信息，包括入职、离职、部门调动及福利账号状态维护"
        breadcrumb={[{ label: '首页', path: '/' }, { label: '员工列表' }]}
        stats={stats}
        searchPlaceholder="输入姓名/工号/部门..."
        filters={filters}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        tableLayoutMode="content"
        hideFilterLabels
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        rowActions={rowActions}
        batchActions={batchActions}
        pageActions={pageActions}
        pagination={{ current, pageSize, total: filteredData.length, onChange: handlePageChange, onPageSizeChange: handlePageSizeChange }}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        getSelectedItems={getSelectedItems}
      />

      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="批量导入员工"
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
              <Button type="primary" onClick={() => {}}>选择文件</Button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '12px' }}>支持 xlsx、xls 格式文件</p>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '8px' }}>导入说明</h4>
            <ul style={{ fontSize: '12px', color: 'var(--gray-500)', paddingLeft: '16px', lineHeight: '1.8' }}>
              <li>请先下载导入模板，按模板格式填写数据</li>
              <li>工号、手机号为必填项</li>
              <li>部门信息请与系统内保持一致</li>
              <li>单次导入最多支持 500 条数据</li>
            </ul>
          </div>
          <Button type="tertiary" icon="download" onClick={() => {}}>下载导入模板</Button>
        </div>
      </Modal>

      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingId ? '编辑员工' : '新增员工'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setFormModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSave}>保存</Button>,
        ]}
      >
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
                姓名 <span style={{ color: 'var(--error-600)' }}>*</span>
              </label>
              <Input
                placeholder="请输入员工姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>工号</label>
              <Input
                placeholder="请输入工号"
                value={formData.empNo}
                onChange={(e) => setFormData({ ...formData, empNo: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>手机号</label>
              <Input
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
                证件类型 <span style={{ color: 'var(--error-600)' }}>*</span>
              </label>
              <Select
                options={idTypeOptions}
                placeholder="请选择证件类型"
                value={formData.idType}
                onChange={(v) => setFormData({ ...formData, idType: String(v) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
                证件号 <span style={{ color: 'var(--error-600)' }}>*</span>
              </label>
              <Input
                placeholder="请输入证件号"
                value={formData.idCard}
                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>部门</label>
              <Select
                options={departmentOptions}
                placeholder="请选择部门"
                value={formData.department}
                onChange={(v) => setFormData({ ...formData, department: String(v) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>职位</label>
              <Input
                placeholder="请输入职位"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>入职日期</label>
              <Input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>性别</label>
              <Select
                options={[{ label: '男', value: '男' }, { label: '女', value: '女' }]}
                placeholder="请选择性别"
                value={formData.gender}
                onChange={(v) => setFormData({ ...formData, gender: String(v) })}
              />
            </div>
            {editingId ? (
              <div>
                <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>在职状态</label>
                <Select
                  options={[{ label: '在职', value: 'active' }, { label: '离职', value: 'inactive' }]}
                  placeholder="请选择状态"
                  value={formData.status}
                  onChange={(v) => setFormData({ ...formData, status: String(v) as 'active' | 'inactive' })}
                />
              </div>
            ) : null}
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>离职日期</label>
              <Input
                type="date"
                value={formData.leaveDate}
                disabled={formData.status === 'active'}
                placeholder={formData.status === 'active' ? '在职员工可为空' : '请选择离职日期'}
                onChange={(e) => setFormData({ ...formData, leaveDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={leaveConfirmOpen}
        onClose={() => {
          setLeaveConfirmOpen(false);
          setLeavingId(null);
          setLeaveDateInput('');
        }}
        title="确认离职"
        size="sm"
        footer={[
          <Button
            key="cancel"
            type="secondary"
            onClick={() => {
              setLeaveConfirmOpen(false);
              setLeavingId(null);
              setLeaveDateInput('');
            }}
          >
            取消
          </Button>,
          <Button key="submit" type="danger" onClick={handleLeaveConfirm} disabled={!leaveDateInput}>
            确认离职
          </Button>,
        ]}
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
            确定要将该员工标记为离职吗？请先填写离职日期。
          </p>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              离职日期
            </label>
            <Input
              type="date"
              value={leaveDateInput}
              onChange={(e) => setLeaveDateInput(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmployeeList;
