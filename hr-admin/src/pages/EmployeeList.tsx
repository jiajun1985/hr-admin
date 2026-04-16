import React, { useState, useMemo } from 'react';
import { ListPageTemplate } from '../components/composites/ListPageTemplate';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface Employee {
  id: string;
  empNo: string;
  name: string;
  department: string;
  position: string;
  gender: string;
  phone: string;
  status: 'active' | 'inactive';
  activationStatus: boolean;
  entryDate: string;
}

const mockEmployees: Employee[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', position: '技术总监', gender: '男', phone: '138****8001', status: 'active', activationStatus: true, entryDate: '2018-03-15' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', position: '市场总监', gender: '女', phone: '139****8002', status: 'active', activationStatus: true, entryDate: '2019-01-20' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', position: '销售总监', gender: '男', phone: '137****8003', status: 'active', activationStatus: true, entryDate: '2018-06-10' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', position: '人事总监', gender: '女', phone: '136****8004', status: 'active', activationStatus: true, entryDate: '2018-02-01' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', position: '高级前端工程师', gender: '男', phone: '135****8005', status: 'active', activationStatus: true, entryDate: '2020-07-08' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', position: '财务总监', gender: '女', phone: '134****8006', status: 'active', activationStatus: true, entryDate: '2018-04-20' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '研发部', position: '运维主管', gender: '男', phone: '133****8007', status: 'active', activationStatus: true, entryDate: '2019-08-15' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '研发部', position: '产品总监', gender: '女', phone: '132****8008', status: 'active', activationStatus: true, entryDate: '2019-05-28' },
  { id: '9', empNo: 'EMP009', name: '吴昊', department: '研发部', position: 'Java开发工程师', gender: '男', phone: '131****8009', status: 'active', activationStatus: true, entryDate: '2021-03-10' },
  { id: '10', empNo: 'EMP010', name: '郑丽', department: '市场部', position: '品牌经理', gender: '女', phone: '130****8010', status: 'active', activationStatus: true, entryDate: '2020-11-15' },
  { id: '11', empNo: 'EMP011', name: '马超', department: '销售部', position: '销售经理', gender: '男', phone: '129****8011', status: 'active', activationStatus: true, entryDate: '2020-09-20' },
  { id: '12', empNo: 'EMP012', name: '林静', department: '人事部', position: 'HR专员', gender: '女', phone: '128****8012', status: 'active', activationStatus: true, entryDate: '2021-06-01' },
  { id: '13', empNo: 'EMP013', name: '高峰', department: '财务部', position: '会计主管', gender: '男', phone: '127****8013', status: 'active', activationStatus: true, entryDate: '2020-04-18' },
  { id: '14', empNo: 'EMP014', name: '杨雪', department: '未分配', position: '运维工程师', gender: '女', phone: '126****8014', status: 'active', activationStatus: true, entryDate: '2022-01-10' },
  { id: '15', empNo: 'EMP015', name: '黄磊', department: '研发部', position: '产品经理', gender: '男', phone: '125****8015', status: 'active', activationStatus: true, entryDate: '2021-09-25' },
  { id: '16', empNo: 'EMP016', name: '徐佳', department: '未分配', position: '测试工程师', gender: '女', phone: '124****8016', status: 'active', activationStatus: true, entryDate: '2022-05-12' },
  { id: '17', empNo: 'EMP017', name: '韩冰', department: '未分配', position: '市场专员', gender: '男', phone: '123****8017', status: 'active', activationStatus: true, entryDate: '2023-02-08' },
  { id: '18', empNo: 'EMP018', name: '彭涛', department: '未分配', position: '销售代表', gender: '男', phone: '122****8018', status: 'active', activationStatus: true, entryDate: '2023-04-20' },
  { id: '19', empNo: 'EMP019', name: '蒋琴', department: '未分配', position: '出纳', gender: '女', phone: '121****8019', status: 'active', activationStatus: true, entryDate: '2022-08-30' },
  { id: '20', empNo: 'EMP020', name: '沈云', department: '研发部', position: 'UI设计师', gender: '女', phone: '120****8020', status: 'active', activationStatus: true, entryDate: '2022-10-15' },
  { id: '21', empNo: 'EMP021', name: '许刚', department: '研发部', position: '前端工程师', gender: '男', phone: '119****8021', status: 'inactive', activationStatus: false, entryDate: '2021-01-15' },
  { id: '22', empNo: 'EMP022', name: '曹雪', department: '市场部', position: '市场助理', gender: '女', phone: '118****8022', status: 'inactive', activationStatus: false, entryDate: '2020-12-01' },
  { id: '23', empNo: 'EMP023', name: '丁一', department: '销售部', position: '销售代表', gender: '男', phone: '117****8023', status: 'inactive', activationStatus: false, entryDate: '2021-07-20' },
  { id: '24', empNo: 'EMP024', name: '冯媛', department: '人事部', position: '招聘专员', gender: '女', phone: '116****8024', status: 'active', activationStatus: true, entryDate: '2023-06-01' },
];

const departmentOptions = [
  { label: '研发部', value: '研发部' },
  { label: '市场部', value: '市场部' },
  { label: '销售部', value: '销售部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
  { label: '未分配', value: '未分配' },
];

const emptyForm: Omit<Employee, 'id' | 'empNo'> & { empNo?: string } = {
  empNo: '',
  name: '',
  department: '',
  position: '',
  gender: '男',
  phone: '',
  status: 'active',
  activationStatus: false,
  entryDate: '',
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useLocalStorageState<Employee[]>('hr-admin:employees', mockEmployees);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      phone: record.phone,
      status: record.status,
      activationStatus: record.activationStatus,
      entryDate: record.entryDate,
    });
    setFormModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.empNo) return;
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
                phone: formData.phone,
                status: formData.status as 'active' | 'inactive',
                activationStatus: formData.activationStatus,
                entryDate: formData.entryDate,
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
        phone: formData.phone,
        status: (formData.status as 'active' | 'inactive') || 'active',
        activationStatus: formData.activationStatus,
        entryDate: formData.entryDate || new Date().toISOString().slice(0, 10),
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    setFormModalOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (deletingId) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== deletingId));
      setSelectedRowKeys((prev) => prev.filter((k) => k !== deletingId));
      setDeletingId(null);
      setDeleteModalOpen(false);
    }
  };

  const handleLeave = (record: Employee) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === record.id ? { ...emp, status: 'inactive' as const } : emp))
    );
  };

  const handleBatchLeave = () => {
    setEmployees((prev) =>
      prev.map((emp) => (selectedRowKeys.includes(emp.id) ? { ...emp, status: 'inactive' as const } : emp))
    );
    setSelectedRowKeys([]);
  };

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

  const paginatedData = useMemo(() => {
    const start = (current - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, current, pageSize]);

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
    { key: 'empNo', title: '工号', width: 100, dataIndex: 'empNo' },
    {
      key: 'name',
      title: '姓名',
      width: 100,
      dataIndex: 'name',
      render: (value) => (
        <span style={{ color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }}>{value}</span>
      ),
    },
    {
      key: 'department',
      title: '部门',
      width: 120,
      dataIndex: 'department',
      render: (value) => <Tag>{value}</Tag>,
    },
    { key: 'position', title: '职位', width: 140, dataIndex: 'position' },
    { key: 'gender', title: '性别', width: 60, align: 'center', dataIndex: 'gender' },
    { key: 'phone', title: '手机号', width: 120, dataIndex: 'phone' },
    {
      key: 'status',
      title: '状态',
      width: 120,
      dataIndex: 'status',
      render: (value, record) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Tag color={value === 'active' ? 'success' : 'default'}>{value === 'active' ? '在职' : '离职'}</Tag>
          <Tag color={record.activationStatus ? 'primary' : 'warning'}>{record.activationStatus ? '已激活' : '未激活'}</Tag>
        </div>
      ),
    },
    { key: 'entryDate', title: '入职时间', width: 110, dataIndex: 'entryDate' },
  ];

  const rowActions = [
    { key: 'edit', label: '编辑', type: 'primary' as const, onClick: openEditModal },
    { key: 'leave', label: '离职', type: 'danger' as const, onClick: handleLeave },
    { key: 'delete', label: '删除', type: 'danger' as const, onClick: (record: Employee) => confirmDelete(record.id) },
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
      label: '状态',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' },
      ],
    },
  ];

  const batchActions = [
    { key: 'points', label: '发放积分', onClick: () => console.log('发放积分') },
    { key: 'department', label: '调整部门', onClick: () => console.log('调整部门') },
    { key: 'leave', label: '批量离职', buttonType: 'danger' as const, onClick: handleBatchLeave },
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
        dataSource={paginatedData}
        rowKey="id"
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
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
                工号 <span style={{ color: 'var(--error-600)' }}>*</span>
              </label>
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
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>在职状态</label>
              <Select
                options={[{ label: '在职', value: 'active' }, { label: '离职', value: 'inactive' }]}
                placeholder="请选择状态"
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: String(v) as 'active' | 'inactive' })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>激活状态</label>
              <Select
                options={[{ label: '已激活', value: 'true' }, { label: '未激活', value: 'false' }]}
                placeholder="请选择"
                value={String(formData.activationStatus)}
                onChange={(v) => setFormData({ ...formData, activationStatus: v === 'true' })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeleteModalOpen(false)}>取消</Button>,
          <Button key="submit" type="danger" onClick={handleDelete}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该员工吗？删除后不可恢复。</p>
      </Modal>
    </>
  );
};

export default EmployeeList;
