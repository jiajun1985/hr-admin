import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { Button } from '../components/basics/Button';
import { Input } from '../components/basics/Input';
import { Modal } from '../components/basics/Modal';
import { Tag } from '../components/basics/Tag';
import { Icon } from '../components/basics/Icon';
import { Pagination } from '../components/basics/Pagination';
import { Select } from '../components/basics/Select';
import { useNavigation } from '../contexts/NavigationContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface Department {
  id: string;
  name: string;
  parentId: string | null;
  manager: string;
  managerPhone: string;
  employeeCount: number;
  createTime: string;
  children?: Department[];
}

interface Employee {
  id: string;
  empNo: string;
  name: string;
  position: string;
  phone: string;
  entryDate: string;
  status: 'active' | 'inactive';
  department: string;
}

const mockDepartments: Department[] = [
  {
    id: '1',
    name: '总公司',
    parentId: null,
    manager: '张伟',
    managerPhone: '138****8001',
    employeeCount: 24,
    createTime: '2018-01-01',
    children: [
      {
        id: '1-1',
        name: '研发部',
        parentId: '1',
        manager: '陈明',
        managerPhone: '135****8005',
        employeeCount: 9,
        createTime: '2018-03-15',
        children: [
          { id: '1-1-1', name: '运维组', parentId: '1-1', manager: '孙浩', managerPhone: '133****8007', employeeCount: 1, createTime: '2019-08-15' },
          { id: '1-1-2', name: '产品组', parentId: '1-1', manager: '黄磊', managerPhone: '125****8015', employeeCount: 1, createTime: '2019-05-28' },
        ],
      },
      { id: '1-2', name: '市场部', parentId: '1', manager: '郑丽', managerPhone: '130****8010', employeeCount: 3, createTime: '2018-05-20' },
      { id: '1-3', name: '销售部', parentId: '1', manager: '马超', managerPhone: '129****8011', employeeCount: 3, createTime: '2018-06-10' },
      { id: '1-4', name: '人事部', parentId: '1', manager: '刘芳', managerPhone: '136****8004', employeeCount: 3, createTime: '2018-07-01' },
      { id: '1-5', name: '财务部', parentId: '1', manager: '赵敏', managerPhone: '134****8006', employeeCount: 2, createTime: '2018-08-15' },
    ],
  },
];

const mockEmployees: Employee[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', position: '技术总监', phone: '138****8001', entryDate: '2018-03-15', status: 'active', department: '研发部' },
  { id: '2', empNo: 'EMP002', name: '李娜', position: '市场总监', phone: '139****8002', entryDate: '2019-01-20', status: 'active', department: '市场部' },
  { id: '3', empNo: 'EMP003', name: '王强', position: '销售总监', phone: '137****8003', entryDate: '2018-06-10', status: 'active', department: '销售部' },
  { id: '4', empNo: 'EMP004', name: '刘芳', position: '人事总监', phone: '136****8004', entryDate: '2018-02-01', status: 'active', department: '人事部' },
  { id: '5', empNo: 'EMP005', name: '陈明', position: '高级前端工程师', phone: '135****8005', entryDate: '2020-07-08', status: 'active', department: '研发部' },
  { id: '6', empNo: 'EMP006', name: '赵敏', position: '财务总监', phone: '134****8006', entryDate: '2018-04-20', status: 'active', department: '财务部' },
  { id: '7', empNo: 'EMP007', name: '孙浩', position: '运维主管', phone: '133****8007', entryDate: '2019-08-15', status: 'active', department: '研发部' },
  { id: '8', empNo: 'EMP008', name: '周婷', position: '产品总监', phone: '132****8008', entryDate: '2019-05-28', status: 'active', department: '研发部' },
  { id: '9', empNo: 'EMP009', name: '吴昊', position: 'Java开发工程师', phone: '131****8009', entryDate: '2021-03-10', status: 'active', department: '研发部' },
  { id: '10', empNo: 'EMP010', name: '郑丽', position: '品牌经理', phone: '130****8010', entryDate: '2020-11-15', status: 'active', department: '市场部' },
  { id: '11', empNo: 'EMP011', name: '马超', position: '销售经理', phone: '129****8011', entryDate: '2020-09-20', status: 'active', department: '销售部' },
  { id: '12', empNo: 'EMP012', name: '林静', position: 'HR专员', phone: '128****8012', entryDate: '2021-06-01', status: 'active', department: '人事部' },
  { id: '13', empNo: 'EMP013', name: '高峰', position: '会计主管', phone: '127****8013', entryDate: '2020-04-18', status: 'active', department: '财务部' },
  { id: '14', empNo: 'EMP014', name: '杨雪', position: '运维工程师', phone: '126****8014', entryDate: '2022-01-10', status: 'active', department: '未分配' },
  { id: '15', empNo: 'EMP015', name: '黄磊', position: '产品经理', phone: '125****8015', entryDate: '2021-09-25', status: 'active', department: '研发部' },
  { id: '16', empNo: 'EMP016', name: '徐佳', position: '测试工程师', phone: '124****8016', entryDate: '2022-05-12', status: 'active', department: '未分配' },
  { id: '17', empNo: 'EMP017', name: '韩冰', position: '市场专员', phone: '123****8017', entryDate: '2023-02-08', status: 'active', department: '未分配' },
  { id: '18', empNo: 'EMP018', name: '彭涛', position: '销售代表', phone: '122****8018', entryDate: '2023-04-20', status: 'active', department: '未分配' },
  { id: '19', empNo: 'EMP019', name: '蒋琴', position: '出纳', phone: '121****8019', entryDate: '2022-08-30', status: 'active', department: '未分配' },
  { id: '20', empNo: 'EMP020', name: '沈云', position: 'UI设计师', phone: '120****8020', entryDate: '2022-10-15', status: 'active', department: '产品部' },
  { id: '21', empNo: 'EMP021', name: '许刚', position: '前端工程师', phone: '119****8021', entryDate: '2021-01-15', status: 'inactive', department: '研发部' },
  { id: '22', empNo: 'EMP022', name: '曹雪', position: '市场助理', phone: '118****8022', entryDate: '2020-12-01', status: 'inactive', department: '市场部' },
  { id: '23', empNo: 'EMP023', name: '丁一', position: '销售代表', phone: '117****8023', entryDate: '2021-07-20', status: 'inactive', department: '销售部' },
  { id: '24', empNo: 'EMP024', name: '冯媛', position: '招聘专员', phone: '116****8024', entryDate: '2023-06-01', status: 'active', department: '人事部' },
];

function flattenDepartments(nodes: Department[]): Department[] {
  let result: Department[] = [];
  nodes.forEach((node) => {
    result.push(node);
    if (node.children) result = result.concat(flattenDepartments(node.children));
  });
  return result;
}

function findNode(nodes: Department[], id: string): Department | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParent(nodes: Department[], id: string): Department | null {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((c) => c.id === id)) return node;
      const found = findParent(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getChildIds(nodes: Department[], parentId: string): string[] {
  const parent = findNode(nodes, parentId);
  if (!parent) return [];
  const ids: string[] = [];
  const collectIds = (dept: Department) => {
    ids.push(dept.id);
    dept.children?.forEach(collectIds);
  };
  parent.children?.forEach(collectIds);
  return ids;
}

function addNode(nodes: Department[], parentId: string, newNode: Department): Department[] {
  return nodes.map((node) => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: addNode(node.children, parentId, newNode) };
    }
    return node;
  });
}

function updateNode(nodes: Department[], id: string, updater: Partial<Department>): Department[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updater };
    }
    if (node.children) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
}

function deleteNode(nodes: Department[], id: string): Department[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => (node.children ? { ...node, children: deleteNode(node.children, id) } : node));
}

function updateNodeEmployeeCount(nodes: Department[], deptName: string, delta: number): Department[] {
  return nodes.map((node) => {
    if (node.name === deptName) {
      return { ...node, employeeCount: Math.max(0, (node.employeeCount || 0) + delta) };
    }
    if (node.children) {
      return { ...node, children: updateNodeEmployeeCount(node.children, deptName, delta) };
    }
    return node;
  });
}

function getAllNodeOptions(nodes: Department[], prefix = '', excludeIds: string[] = []): { label: string; value: string }[] {
  let result: { label: string; value: string }[] = [];
  nodes.forEach((node) => {
    if (!excludeIds.includes(node.id)) {
      result.push({ label: `${prefix}${node.name}`, value: node.id });
    }
    if (node.children) {
      result = result.concat(getAllNodeOptions(node.children, `${prefix}└ `, excludeIds));
    }
  });
  return result;
}

interface TreeNodeProps {
  node: Department;
  level: number;
  selectedId: string | null;
  expandedKeys: Set<string>;
  onSelect: (node: Department) => void;
  onToggle: (key: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, selectedId, expandedKeys, onSelect, onToggle }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedKeys.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        onClick={() => onSelect(node)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          paddingLeft: `${level * 20 + 12}px`,
          cursor: 'pointer',
          backgroundColor: isSelected ? 'var(--primary-50)' : 'transparent',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '2px',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--gray-50)';
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {hasChildren ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            style={{ marginRight: '4px', display: 'flex', alignItems: 'center', color: 'var(--gray-400)' }}
          >
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} />
          </span>
        ) : (
          <span style={{ width: '18px' }} />
        )}
        <Icon name="department" size={16} color={isSelected ? 'var(--primary-600)' : 'var(--gray-400)'} />
        <span
          style={{
            marginLeft: '8px',
            fontSize: '13px',
            color: isSelected ? 'var(--primary-600)' : 'var(--gray-700)',
            fontWeight: isSelected ? 500 : 400,
            flex: 1,
          }}
        >
          {node.name}
        </span>
        <Tag color="default" style={{ fontSize: '11px', padding: '2px 6px' }}>{node.employeeCount}</Tag>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedKeys={expandedKeys}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [departments, setDepartments, resetDepartments] = useLocalStorageState<Department[]>('hr-admin:departments', mockDepartments);
  const [employees, setEmployees, resetEmployees] = useLocalStorageState<Employee[]>('hr-admin:dept-employees', mockEmployees);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['1']));
  const [searchValue, setSearchValue] = useState('');
  const [deptFormOpen, setDeptFormOpen] = useState(false);
  const [deptFormEditing, setDeptFormEditing] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptFormData, setDeptFormData] = useState({ name: '', parentId: '' });
  const [parentError, setParentError] = useState('');
  const [deleteDeptOpen, setDeleteDeptOpen] = useState(false);
  const [empFormOpen, setEmpFormOpen] = useState(false);
  const [empFormEditing, setEmpFormEditing] = useState(false);
  const [empFormData, setEmpFormData] = useState<Employee & { isNew?: boolean }>({
    id: '',
    empNo: '', name: '', position: '', phone: '', entryDate: '', status: 'active', department: '',
  });
  const [deleteEmpId, setDeleteEmpId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<(string | number)[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberCurrent, setMemberCurrent] = useState(1);
  const [memberPageSize, setMemberPageSize] = useState(10);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [managerConfirmOpen, setManagerConfirmOpen] = useState(false);
  const [pendingManager, setPendingManager] = useState<Employee | null>(null);
  const [batchAssignOpen, setBatchAssignOpen] = useState(false);
  const [batchAssignDept, setBatchAssignDept] = useState<string>('');

  React.useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0]);
      setExpandedKeys(new Set(departments.filter(d => !d.parentId).map(d => d.id)));
    }
  }, [departments, selectedDepartment]);

  const handleResetToDefault = () => {
    resetDepartments();
    resetEmployees();
    setSelectedDepartment(mockDepartments[0]);
    setExpandedKeys(new Set(['1']));
    showToast('已恢复默认数据');
  };

  const flatDepartments = useMemo(() => flattenDepartments(departments), [departments]);
  const deptOptions = useMemo(() => {
    if (deptFormEditing && editingDeptId) {
      const childIds = getChildIds(departments, editingDeptId);
      return getAllNodeOptions(departments, '', [editingDeptId, ...childIds]);
    }
    return getAllNodeOptions(departments);
  }, [departments, deptFormEditing, editingDeptId]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSelect = (node: Department) => {
    setSelectedDepartment(node);
    setSelectedMembers([]);
  };

  const handleToggle = (key: string) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) newExpanded.delete(key);
    else newExpanded.add(key);
    setExpandedKeys(newExpanded);
  };

  const handleAddDept = () => {
    setDeptFormEditing(false);
    setEditingDeptId(null);
    setParentError('');
    setDeptFormData({ name: '', parentId: selectedDepartment?.id || '' });
    setDeptFormOpen(true);
  };

  const handleEditDept = () => {
    if (!selectedDepartment) return;
    setDeptFormEditing(true);
    setEditingDeptId(selectedDepartment.id);
    setParentError('');
    setDeptFormData({
      name: selectedDepartment.name,
      parentId: selectedDepartment.parentId || '',
    });
    setDeptFormOpen(true);
  };

  const validateParent = (parentId: string): boolean => {
    if (!parentId) return true;
    if (deptFormEditing && editingDeptId) {
      const childIds = getChildIds(departments, editingDeptId);
      if (parentId === editingDeptId) {
        setParentError('不能选择自身作为上级部门');
        return false;
      }
      if (childIds.includes(parentId)) {
        setParentError('不能选择子部门作为上级部门');
        return false;
      }
    }
    setParentError('');
    return true;
  };

  const saveDept = () => {
    if (!deptFormData.name.trim()) {
      setParentError('部门名称不能为空');
      return;
    }
    if (!validateParent(deptFormData.parentId)) return;

    if (deptFormEditing && editingDeptId) {
      setDepartments((prev) => updateNode(prev, editingDeptId, {
        name: deptFormData.name,
        parentId: deptFormData.parentId || null,
      }));
      showToast('部门已更新');
      setSelectedDepartment((prev) => prev ? {
        ...prev,
        name: deptFormData.name,
        parentId: deptFormData.parentId || null,
      } : prev);
    } else {
      const parent = deptFormData.parentId ? findNode(departments, deptFormData.parentId) : null;
      const newDept: Department = {
        id: Date.now().toString(),
        name: deptFormData.name,
        parentId: deptFormData.parentId || null,
        manager: '-',
        managerPhone: '-',
        employeeCount: 0,
        createTime: new Date().toISOString().slice(0, 10),
      };
      if (parent) {
        setDepartments((prev) => addNode(prev, parent.id, newDept));
      } else {
        setDepartments((prev) => [...prev, newDept]);
      }
      showToast('部门已创建');
    }
    setDeptFormOpen(false);
  };

  const confirmDeleteDept = () => {
    if (selectedDepartment) setDeleteDeptOpen(true);
  };

  const doDeleteDept = () => {
    if (!selectedDepartment) return;
    const deptName = selectedDepartment.name;
    setDepartments((prev) => deleteNode(prev, selectedDepartment.id));
    setEmployees((prev) => prev.filter((e) => e.department !== deptName));
    setDeleteDeptOpen(false);
    setDepartments((currentDepts) => {
      const parent = findParent(currentDepts, selectedDepartment.id);
      setSelectedDepartment(parent || currentDepts[0] || null);
      return currentDepts;
    });
    showToast('部门已删除');
  };

  const handleSetManager = (emp: Employee) => {
    if (!selectedDepartment) return;
    setPendingManager(emp);
    setManagerConfirmOpen(true);
  };

  const confirmSetManager = () => {
    if (!selectedDepartment || !pendingManager) return;
    setDepartments((prev) => updateNode(prev, selectedDepartment.id, {
      manager: pendingManager.name,
      managerPhone: pendingManager.phone,
    }));
    setSelectedDepartment((prev) => (prev ? { ...prev, manager: pendingManager.name, managerPhone: pendingManager.phone } : prev));
    setManagerConfirmOpen(false);
    showToast(`已设置「${pendingManager.name}」为负责人`);
    setPendingManager(null);
  };

  const handleBatchAssign = () => {
    if (!batchAssignDept) return;
    const targetDept = flatDepartments.find((d) => d.id === batchAssignDept);
    if (!targetDept) return;

    const unassignedEmps = employees.filter((e) => {
      const deptExists = flatDepartments.some((d) => d.name === e.department);
      return !deptExists || e.department === '未分配';
    });

    if (unassignedEmps.length === 0) {
      showToast('没有需要分配的员工');
      setBatchAssignOpen(false);
      return;
    }

    setEmployees((prev) => prev.map((e) => {
      const shouldAssign = flatDepartments.some((d) => d.name === e.department) === false || e.department === '未分配';
      if (shouldAssign) {
        return { ...e, department: targetDept.name };
      }
      return e;
    }));

    setDepartments((prev) => updateNodeEmployeeCount(prev, targetDept.name, unassignedEmps.length));
    setBatchAssignOpen(false);
    showToast(`已将 ${unassignedEmps.length} 名员工分配至「${targetDept.name}」`);
    setBatchAssignDept('');
  };

  const unassignedCount = useMemo(() => {
    return employees.filter((e) => {
      return !flatDepartments.some((d) => d.name === e.department) || e.department === '未分配';
    }).length;
  }, [employees, flatDepartments]);

  const openAddEmp = () => {
    setEmpFormEditing(false);
    const deptName = selectedDepartment?.id === '1' ? '未分配' : (selectedDepartment?.name || '');
    setEmpFormData({
      id: '',
      empNo: '',
      name: '',
      position: '',
      phone: '',
      entryDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      department: deptName,
    });
    setEmpFormOpen(true);
  };

  const openEditEmp = (emp: Employee) => {
    setEmpFormEditing(true);
    setEmpFormData({ ...emp });
    setEmpFormOpen(true);
  };

  const saveEmp = () => {
    if (!empFormData.name.trim() || !empFormData.empNo.trim()) return;

    if (empFormEditing && empFormData.id) {
      const oldEmp = employees.find((e) => e.id === empFormData.id);
      const oldDept = oldEmp?.department;
      const newDept = empFormData.department;

      setEmployees((prev) => prev.map((e) => (e.id === empFormData.id ? (empFormData as Employee) : e)));

      if (oldDept && oldDept !== newDept) {
        setDepartments((prev) => updateNodeEmployeeCount(prev, oldDept, -1));
        setDepartments((prev) => updateNodeEmployeeCount(prev, newDept, 1));
      }
      showToast('成员信息已更新');
    } else {
      const { isNew, id: _removed, ...empData } = empFormData;
      const newEmp: Employee = {
        id: Date.now().toString(),
        empNo: empData.empNo,
        name: empData.name,
        position: empData.position,
        phone: empData.phone,
        entryDate: empData.entryDate,
        status: empData.status,
        department: empData.department,
      };
      setEmployees((prev) => [...prev, newEmp]);
      setDepartments((prev) => updateNodeEmployeeCount(prev, empData.department, 1));
      showToast('成员已添加');
    }
    setEmpFormOpen(false);
  };

  const confirmDeleteEmp = (id: string) => {
    setDeleteEmpId(id);
  };

  const doDeleteEmp = () => {
    if (deleteEmpId) {
      const emp = employees.find((e) => e.id === deleteEmpId);
      if (emp) {
        setDepartments((prev) => updateNodeEmployeeCount(prev, emp.department, -1));
      }
      setEmployees((prev) => prev.filter((e) => e.id !== deleteEmpId));
      setSelectedMembers((prev) => prev.filter((k) => k !== deleteEmpId));
      setDeleteEmpId(null);
      showToast('成员已删除');
    }
  };

  const handleBatchRemove = () => {
    if (selectedMembers.length === 0) return;
    const empsToRemove = employees.filter((e) => selectedMembers.includes(e.id));
    const deptCounts: Record<string, number> = {};
    empsToRemove.forEach((emp) => {
      deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
    });

    setEmployees((prev) => prev.filter((e) => !selectedMembers.includes(e.id)));
    Object.entries(deptCounts).forEach(([dept, count]) => {
      setDepartments((prev) => updateNodeEmployeeCount(prev, dept, -count));
    });
    setSelectedMembers([]);
    showToast(`已移除 ${selectedMembers.length} 名成员`);
  };

  const handleViewEmployee = (empNo: string) => {
    navigate('employee-detail', { employeeId: empNo });
  };

  const openTransferModal = () => {
    if (selectedMembers.length === 0) return;
    setTransferTargetId('');
    setTransferModalOpen(true);
  };

  const doTransfer = () => {
    if (!transferTargetId) return;
    const targetDept = flatDepartments.find((d) => d.id === transferTargetId);
    if (!targetDept) return;

    const empsToTransfer = employees.filter((e) => selectedMembers.includes(e.id));
    const sourceDeptCounts: Record<string, number> = {};

    setEmployees((prev) => prev.map((e) => {
      if (selectedMembers.includes(e.id)) {
        sourceDeptCounts[e.department] = (sourceDeptCounts[e.department] || 0) + 1;
        return { ...e, department: targetDept.name };
      }
      return e;
    }));

    Object.entries(sourceDeptCounts).forEach(([dept, count]) => {
      setDepartments((prev) => updateNodeEmployeeCount(prev, dept, -count));
    });
    setDepartments((prev) => updateNodeEmployeeCount(prev, targetDept.name, selectedMembers.length));

    setTransferModalOpen(false);
    setSelectedMembers([]);
    showToast(`已将 ${selectedMembers.length} 名成员调转至「${targetDept.name}」`);
  };

  const deptEmployees = useMemo(() => {
    if (!selectedDepartment) return [];
    if (selectedDepartment.id === '1') {
      return employees;
    }
    return employees.filter((e) => e.department === selectedDepartment.name);
  }, [employees, selectedDepartment]);

  const filteredEmployees = useMemo(() => {
    return deptEmployees.filter((emp) => {
      if (!memberSearch) return true;
      return (
        emp.name.includes(memberSearch) ||
        emp.empNo.includes(memberSearch) ||
        emp.position.includes(memberSearch)
      );
    });
  }, [deptEmployees, memberSearch]);

  const totalMembers = filteredEmployees.length;
  const paginatedEmployees = filteredEmployees.slice((memberCurrent - 1) * memberPageSize, memberCurrent * memberPageSize);

  const searchResults = searchValue
    ? flatDepartments.filter((d) => d.name.includes(searchValue))
    : [];

  const transferOptions = useMemo(() => {
    if (!selectedDepartment) return deptOptions;
    return deptOptions.filter((opt) => opt.value !== selectedDepartment.id);
  }, [deptOptions, selectedDepartment]);

  return (
    <div>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: 'var(--gray-800)',
          color: '#fff',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          {toastMessage}
        </div>
      )}

      <PageHeader
        breadcrumb={[{ label: '首页', path: '/' }, { label: '组织架构' }, { label: '部门管理' }]}
        title="部门管理"
        description="管理企业组织架构，包括部门创建、编辑、删除及部门成员管理"
        actions={[
          { label: '恢复默认', buttonType: 'secondary' as const, onClick: handleResetToDefault },
        ]}
      />

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ width: '25%', flexShrink: 0, backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <Input
              placeholder="搜索部门..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            {searchValue && searchResults.length > 0 && (
              <div style={{ backgroundColor: 'var(--gray-0)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', maxHeight: '200px', overflow: 'auto' }}>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSelectedDepartment(result);
                      setSearchValue('');
                    }}
                    style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', color: 'var(--gray-700)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {result.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <Button size="sm" type="primary" icon="plus" onClick={handleAddDept}>新增部门</Button>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
            {departments.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                selectedId={selectedDepartment?.id || null}
                expandedKeys={expandedKeys}
                onSelect={handleSelect}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        <div style={{ width: '75%' }}>
          {selectedDepartment ? (
            <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '12px' }}>{selectedDepartment.name}</h3>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--gray-500)' }}>
                    <span>
                      <Icon name="user" size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      负责人：{selectedDepartment.manager}
                    </span>
                    <span>
                      <Icon name="phone" size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {selectedDepartment.managerPhone}
                    </span>
                    <span>
                      <Icon name="calendar" size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      创建时间：{selectedDepartment.createTime}
                    </span>
                  </div>
                </div>
                {selectedDepartment.id !== '1' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="sm" type="secondary" icon="edit" onClick={handleEditDept}>编辑</Button>
                    <Button size="sm" type="danger" icon="delete" onClick={confirmDeleteDept}>删除</Button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--gray-700)' }}>
                    {selectedDepartment?.id === '1' ? '全部员工' : '部门成员'}（{totalMembers} 人）
                    {selectedDepartment?.id === '1' && unassignedCount > 0 && (
                      <Tag color="warning" style={{ marginLeft: '8px' }}>待分配：{unassignedCount}人</Tag>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                      placeholder="搜索成员..."
                      value={memberSearch}
                      onChange={(e) => { setMemberSearch(e.target.value); setMemberCurrent(1); }}
                      style={{ width: '180px' }}
                    />
                    {selectedDepartment?.id === '1' ? (
                      <>
                        <Button size="sm" type="secondary" icon="plus" onClick={openAddEmp}>新增成员</Button>
                        <Button size="sm" type="secondary" icon="upload" onClick={() => setBatchAssignOpen(true)}>批量分配部门</Button>
                      </>
                    ) : (
                      <Button size="sm" type="secondary" icon="plus" onClick={openAddEmp}>新增成员</Button>
                    )}
                  </div>
                </div>

                {selectedMembers.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--primary-600)' }}>已选择 {selectedMembers.length} 项</span>
                    <Button size="sm" type="tertiary" onClick={() => setSelectedMembers([])}>清除</Button>
                    {selectedDepartment?.id === '1' ? (
                      <Button size="sm" type="secondary" onClick={openTransferModal} disabled={selectedMembers.length === 0}>调转部门</Button>
                    ) : (
                      <>
                        <Button size="sm" type="secondary" onClick={openTransferModal}>调转部门</Button>
                        <Button size="sm" type="danger" onClick={handleBatchRemove}>移除部门</Button>
                      </>
                    )}
                  </div>
                )}

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--gray-50)' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)', width: '48px' }}>
                        <input
                          type="checkbox"
                          checked={paginatedEmployees.length > 0 && paginatedEmployees.every((emp) => selectedMembers.includes(emp.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMembers((prev) => Array.from(new Set([...prev, ...paginatedEmployees.map((emp) => emp.id)])));
                            } else {
                              setSelectedMembers((prev) => prev.filter((id) => !paginatedEmployees.find((emp) => emp.id === id)));
                            }
                          }}
                        />
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>工号</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>姓名</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>职位</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>手机号</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>入职日期</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)' }}>状态</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', borderBottom: '1px solid var(--gray-200)', width: '100px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((emp) => (
                      <tr key={emp.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(emp.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedMembers((prev) => [...prev, emp.id]);
                              else setSelectedMembers((prev) => prev.filter((id) => id !== emp.id));
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>{emp.empNo}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--primary-600)', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleViewEmployee(emp.empNo)}>{emp.name}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>{emp.position}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>{emp.phone}</td>
                        <td style={{ padding: '12px', fontSize: '13px', color: 'var(--gray-600)' }}>{emp.entryDate}</td>
                        <td style={{ padding: '12px' }}>
                          <Tag color={emp.status === 'active' ? 'success' : 'default'}>{emp.status === 'active' ? '在职' : '离职'}</Tag>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {selectedDepartment ? (
                            emp.name === selectedDepartment.manager ? (
                              <Tag color="success" style={{ cursor: 'default' }}>负责人</Tag>
                            ) : (
                              <Button size="sm" type="primary" onClick={() => handleSetManager(emp)}>设为负责人</Button>
                            )
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                    {paginatedEmployees.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '13px' }}>
                          {selectedDepartment?.id === '1' ? '暂无员工' : '该部门暂无成员'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 0' }}>
                  <Pagination
                    current={memberCurrent}
                    pageSize={memberPageSize}
                    total={totalMembers}
                    onChange={(page) => { setMemberCurrent(page); setSelectedMembers([]); }}
                    onPageSizeChange={(size) => { setMemberPageSize(size); setMemberCurrent(1); setSelectedMembers([]); }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '60px', textAlign: 'center', color: 'var(--gray-400)' }}>
              <Icon name="department" size={48} color="var(--gray-300)" />
              <div style={{ marginTop: '12px', fontSize: '14px' }}>请从左侧选择一个部门</div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={deptFormOpen}
        onClose={() => setDeptFormOpen(false)}
        title={deptFormEditing ? '编辑部门' : '新增部门'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeptFormOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={saveDept}>保存</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>上级部门</label>
            <Select
              options={[{ label: '无（顶级部门）', value: '' }, ...deptOptions]}
              placeholder="请选择"
              value={deptFormData.parentId}
              onChange={(v) => { setDeptFormData({ ...deptFormData, parentId: String(v) }); validateParent(String(v)); }}
            />
            {parentError && <div style={{ fontSize: '12px', color: 'var(--error-500)', marginTop: '4px' }}>{parentError}</div>}
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              部门名称 <span style={{ color: 'var(--error-600)' }}>*</span>
            </label>
            <Input
              placeholder="请输入部门名称"
              value={deptFormData.name}
              onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteDeptOpen}
        onClose={() => setDeleteDeptOpen(false)}
        title="删除确认"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeleteDeptOpen(false)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeleteDept}>删除</Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Icon name="warning" size={48} color="var(--warning-600)" />
          <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--gray-700)' }}>确定要删除部门「{selectedDepartment?.name}」吗？</div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gray-500)' }}>删除后，该部门及子部门下的员工将被移除</div>
        </div>
      </Modal>

      <Modal
        open={empFormOpen}
        onClose={() => setEmpFormOpen(false)}
        title={empFormEditing ? '编辑成员' : '新增成员'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setEmpFormOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={saveEmp}>保存</Button>,
        ]}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>姓名</label>
            <Input value={empFormData.name} onChange={(e) => setEmpFormData({ ...empFormData, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>工号</label>
            <Input value={empFormData.empNo} onChange={(e) => setEmpFormData({ ...empFormData, empNo: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>职位</label>
            <Input value={empFormData.position} onChange={(e) => setEmpFormData({ ...empFormData, position: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>手机号</label>
            <Input value={empFormData.phone} onChange={(e) => setEmpFormData({ ...empFormData, phone: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>入职日期</label>
            <Input type="date" value={empFormData.entryDate} onChange={(e) => setEmpFormData({ ...empFormData, entryDate: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>状态</label>
            <Select
              options={[{ label: '在职', value: 'active' }, { label: '离职', value: 'inactive' }]}
              value={empFormData.status}
              onChange={(v) => setEmpFormData({ ...empFormData, status: v as 'active' | 'inactive' })}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>所属部门</label>
            <Select
              options={empFormEditing ? deptOptions : [{ label: '未分配', value: '未分配' }, ...deptOptions.filter((d) => d.value !== '1')]}
              value={empFormData.department}
              onChange={(v) => setEmpFormData({ ...empFormData, department: String(v) })}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteEmpId}
        onClose={() => setDeleteEmpId(null)}
        title="确认删除"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setDeleteEmpId(null)}>取消</Button>,
          <Button key="submit" type="danger" onClick={doDeleteEmp}>删除</Button>,
        ]}
      >
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该成员吗？删除后不可恢复。</p>
      </Modal>

      <Modal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="调转部门"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setTransferModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={doTransfer} disabled={!transferTargetId}>确认调转</Button>,
        ]}
      >
        <div>
          <div style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '16px' }}>
            已选择 <strong>{selectedMembers.length}</strong> 名成员，调转至：
          </div>
          <Select
            options={transferOptions}
            placeholder="请选择目标部门"
            value={transferTargetId}
            onChange={(v) => setTransferTargetId(String(v))}
          />
        </div>
      </Modal>

      <Modal
        open={managerConfirmOpen}
        onClose={() => { setManagerConfirmOpen(false); setPendingManager(null); }}
        title="确认设置负责人"
        size="sm"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => { setManagerConfirmOpen(false); setPendingManager(null); }}>取消</Button>,
          <Button key="submit" type="primary" onClick={confirmSetManager}>确认</Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Icon name="user" size={48} color="var(--primary-600)" />
          <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--gray-700)' }}>
            确定将「{pendingManager?.name}」设为「{selectedDepartment?.name}」的负责人吗？
          </div>
          {selectedDepartment && selectedDepartment.manager && selectedDepartment.manager !== '-' && (
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--warning-50)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--warning-600)' }}>
              原负责人「{selectedDepartment.manager}」将被替换
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={batchAssignOpen}
        onClose={() => { setBatchAssignOpen(false); setBatchAssignDept(''); }}
        title="批量分配部门"
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => { setBatchAssignOpen(false); setBatchAssignDept(''); }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleBatchAssign} disabled={!batchAssignDept}>确认分配</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--info-50)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--info-600)' }}>
            当前有 <strong>{unassignedCount}</strong> 名员工尚未分配部门，可通过上传Excel文件批量分配，或直接选择目标部门进行分配。
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>上传Excel文件</label>
            <div style={{ border: '2px dashed var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: '24px', textAlign: 'center' }}>
              <Icon name="upload" size={32} color="var(--gray-300)" />
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--gray-500)' }}>
                点击选择文件或拖拽文件到此处
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--gray-400)' }}>
                支持 .xlsx, .xls 格式
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--gray-400)' }}>
              Excel模板：工号、姓名、目标部门（必填）
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>或直接选择目标部门</label>
            <Select
              options={deptOptions.filter((opt) => opt.value !== '1')}
              placeholder="请选择目标部门"
              value={batchAssignDept}
              onChange={(v) => setBatchAssignDept(String(v))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentPage;
