import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { DataTable, type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Input } from '../components/basics/Input';
import { Modal } from '../components/basics/Modal';
import { Tag } from '../components/basics/Tag';
import { Icon } from '../components/basics/Icon';
import { Select } from '../components/basics/Select';
import { useNavigation } from '../contexts/NavigationContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedDepartments, seedEmployees } from '../mockApi/demoData';

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
  gender: string;
  phone: string;
  email?: string;
  idCard?: string;
  birthday?: string;
  education?: string;
  graduateSchool?: string;
  entryDate: string;
  status: 'active' | 'inactive';
  activationStatus: boolean;
  department: string;
  leaveDate?: string;
}

const today = () => new Date().toISOString().slice(0, 10);

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

function getDepartmentEmployeeCountMap(nodes: Department[], employees: Employee[]) {
  const map: Record<string, number> = {};

  const walk = (node: Department): number => {
    const directCount = employees.filter((emp) => emp.department === node.name).length;
    const childCount = node.children?.reduce((sum, child) => sum + walk(child), 0) ?? 0;
    const total = directCount + childCount;
    map[node.id] = total;
    return total;
  };

  nodes.forEach(walk);
  return map;
}

function getEmploymentStatusMeta(employee: Employee, currentDate: string) {
  if (employee.status === 'inactive' || (employee.leaveDate && employee.leaveDate <= currentDate)) {
    return { label: '已离职', color: 'default' as const };
  }

  if (employee.leaveDate && employee.leaveDate > currentDate) {
    return { label: '待离职', color: 'warning' as const };
  }

  return { label: '在职', color: 'success' as const };
}

interface TreeNodeProps {
  node: Department;
  level: number;
  selectedId: string | null;
  expandedKeys: Set<string>;
  employeeCountMap: Record<string, number>;
  onSelect: (node: Department) => void;
  onToggle: (key: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, selectedId, expandedKeys, employeeCountMap, onSelect, onToggle }) => {
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
        <Tag color="default" style={{ fontSize: '11px', padding: '2px 6px' }}>{employeeCountMap[node.id] ?? 0}</Tag>
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
              employeeCountMap={employeeCountMap}
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
  const [departments, setDepartments, resetDepartments] = useLocalStorageState<Department[]>(DEMO_STORAGE_KEYS.departments, seedDepartments);
  const [employees, setEmployees, resetEmployees] = useLocalStorageState<Employee[]>(DEMO_STORAGE_KEYS.employees, seedEmployees);
  const currentDate = today();
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
    empNo: '', name: '', position: '', gender: '男', phone: '', entryDate: '', status: 'active', activationStatus: true, department: '',
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
  const [assignDeptOpen, setAssignDeptOpen] = useState(false);
  const [assignTargetDeptId, setAssignTargetDeptId] = useState<string>('');
  const [assignEmployeeIds, setAssignEmployeeIds] = useState<string[]>([]);
  const [assignSearch, setAssignSearch] = useState('');
  const departmentCountMap = useMemo(() => getDepartmentEmployeeCountMap(departments, employees), [departments, employees]);

  React.useEffect(() => {
    if (departments.length > 0 && !selectedDepartment) {
      setSelectedDepartment(departments[0]);
      setExpandedKeys(new Set(departments.filter(d => !d.parentId).map(d => d.id)));
    }
  }, [departments, selectedDepartment]);

  const handleResetToDefault = () => {
    resetDepartments();
    resetEmployees();
    setSelectedDepartment(seedDepartments[0]);
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
  const assignDeptOptions = useMemo(() => deptOptions.filter((opt) => opt.value !== '1'), [deptOptions]);
  const unassignedEmployees = useMemo(() => {
    return employees.filter((e) => {
      const deptExists = flatDepartments.some((d) => d.name === e.department);
      return !deptExists || e.department === '未分配';
    });
  }, [employees, flatDepartments]);
  const filteredAssignableEmployees = useMemo(() => {
    if (!assignSearch.trim()) return unassignedEmployees;
    return unassignedEmployees.filter((emp) => (
      emp.name.includes(assignSearch) ||
      emp.empNo.includes(assignSearch) ||
      emp.phone.includes(assignSearch) ||
      emp.position.includes(assignSearch)
    ));
  }, [assignSearch, unassignedEmployees]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleSelect = (node: Department) => {
    setSelectedDepartment(node);
    setMemberCurrent(1);
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
    const pendingStatus = getEmploymentStatusMeta(pendingManager, currentDate);
    if (pendingManager.department === '未分配' || pendingStatus.label !== '在职') {
      showToast('已离职员工不能设为负责人');
      setManagerConfirmOpen(false);
      setPendingManager(null);
      return;
    }
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

    if (unassignedEmployees.length === 0) {
      showToast('没有需要分配的员工');
      setBatchAssignOpen(false);
      return;
    }

    setEmployees((prev) => prev.map((e) => {
      const shouldAssign = unassignedEmployees.some((emp) => emp.id === e.id);
      if (shouldAssign) {
        return { ...e, department: targetDept.name };
      }
      return e;
    }));

    setBatchAssignOpen(false);
    showToast(`已将 ${unassignedEmployees.length} 名员工分配至「${targetDept.name}」`);
    setBatchAssignDept('');
  };

  const unassignedCount = unassignedEmployees.length;

  const openAssignDept = () => {
    setAssignTargetDeptId(selectedDepartment && selectedDepartment.id !== '1' ? selectedDepartment.id : '');
    setAssignEmployeeIds([]);
    setAssignSearch('');
    setAssignDeptOpen(true);
  };

  const closeAssignDept = () => {
    setAssignDeptOpen(false);
    setAssignTargetDeptId('');
    setAssignEmployeeIds([]);
    setAssignSearch('');
  };

  const handleAssignDept = () => {
    const targetId = selectedDepartment && selectedDepartment.id !== '1' ? selectedDepartment.id : assignTargetDeptId;
    const targetDept = flatDepartments.find((d) => d.id === targetId);
    if (!targetDept || assignEmployeeIds.length === 0) return;

    const selectedAssignableIds = new Set(assignEmployeeIds);
    const assignedCount = unassignedEmployees.filter((emp) => {
      const statusMeta = getEmploymentStatusMeta(emp, currentDate);
      return selectedAssignableIds.has(emp.id) && statusMeta.label === '在职';
    }).length;
    if (assignedCount === 0) return;

    setEmployees((prev) => prev.map((emp) => (
      selectedAssignableIds.has(emp.id) && getEmploymentStatusMeta(emp, currentDate).label === '在职'
        ? { ...emp, department: targetDept.name }
        : emp
    )));
    closeAssignDept();
    showToast(`已将 ${assignedCount} 名员工分配至「${targetDept.name}」`);
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
        emp.department.includes(memberSearch)
      );
    });
  }, [deptEmployees, memberSearch]);

  const employeeColumns = useMemo<TableColumn<Employee>[]>(() => [
    {
      key: 'empNo',
      title: '工号',
      align: 'center',
      minWidth: 96,
      dataIndex: 'empNo',
      render: (value) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace', fontVariantNumeric: 'tabular-nums lining-nums', letterSpacing: 0 }}>{value}</span>,
    },
    {
      key: 'name',
      title: '姓名',
      minWidth: 72,
      dataIndex: 'name',
      render: (value) => <span style={{ color: 'var(--primary-600)' }}>{value}</span>,
    },
    {
      key: 'department',
      title: '部门',
      align: 'center',
      minWidth: 96,
      dataIndex: 'department',
      render: (value) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {value === '未分配' ? (
            <Tag color="error" style={{ backgroundColor: 'var(--error-50)', borderColor: 'var(--error-600)', color: 'var(--error-600)', fontWeight: 700, boxShadow: '0 0 0 1px rgba(220, 38, 38, 0.12)' }}>
              未分配
            </Tag>
          ) : (
            <Tag color="default" style={{ backgroundColor: 'var(--gray-50)', borderColor: 'var(--gray-200)', color: 'var(--gray-700)' }}>
              {value}
            </Tag>
          )}
        </div>
      ),
    },
    {
      key: 'entryDate',
      title: '入职时间',
      align: 'center',
      minWidth: 100,
      dataIndex: 'entryDate',
      render: (value) => (
        <span style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontVariantNumeric: 'tabular-nums lining-nums',
          letterSpacing: 0,
        }}>{value || '—'}</span>
      ),
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
  ], [currentDate]);

  const totalMembers = filteredEmployees.length;
  const employeeRowActions = useMemo(() => {
    if (!selectedDepartment) return [];
    return [
      {
        key: 'manager',
        label: '设为负责人',
        type: 'primary' as const,
        onClick: handleSetManager,
        hidden: (record: Employee) => {
          const statusMeta = getEmploymentStatusMeta(record, currentDate);
          return record.department === '未分配' || statusMeta.label !== '在职' || record.name === selectedDepartment.manager;
        },
      },
    ];
  }, [currentDate, selectedDepartment]);

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
        actions={[]}
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
                employeeCountMap={departmentCountMap}
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
                    <Button size="sm" type="secondary" icon="plus" onClick={openAssignDept}>分配部门</Button>
                    <Button size="sm" type="secondary" icon="upload" onClick={() => setBatchAssignOpen(true)}>批量分配部门</Button>
                  </div>
                </div>
                <DataTable
                  columns={employeeColumns}
                  dataSource={filteredEmployees}
                  rowKey="id"
                  layoutMode="content"
                  rowActions={selectedDepartment ? employeeRowActions : undefined}
                  pagination={{
                    current: memberCurrent,
                    pageSize: memberPageSize,
                    total: totalMembers,
                    onChange: (page) => setMemberCurrent(page),
                    onPageSizeChange: (size) => { setMemberPageSize(size); setMemberCurrent(1); },
                  }}
                  emptyText={selectedDepartment?.id === '1' ? '暂无员工' : '该部门暂无成员'}
                />
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
        open={assignDeptOpen}
        onClose={closeAssignDept}
        title="分配部门"
        size="lg"
        footer={[
          <Button key="cancel" type="secondary" onClick={closeAssignDept}>取消</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAssignDept}
            disabled={assignEmployeeIds.length === 0 || (!assignTargetDeptId && (!selectedDepartment || selectedDepartment.id === '1'))}
          >
            确认分配
          </Button>,
        ]}
      >
        <div style={{ display: 'grid', gridTemplateColumns: selectedDepartment?.id === '1' ? '1fr 1.2fr' : '1fr', gap: '16px' }}>
          <div>
            <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'var(--info-50)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--info-600)' }}>
              当前可分配员工：<strong>{unassignedCount}</strong> 人
            </div>
            {selectedDepartment?.id === '1' ? (
              <div>
                <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>目标部门</label>
                <Select
                  options={assignDeptOptions}
                  placeholder="请选择目标部门"
                  value={assignTargetDeptId}
                  onChange={(v) => setAssignTargetDeptId(String(v))}
                />
              </div>
            ) : (
              <div style={{ padding: '12px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '4px' }}>目标部门</div>
                <div style={{ fontSize: '14px', color: 'var(--gray-800)', fontWeight: 500 }}>{selectedDepartment?.name || ''}</div>
              </div>
            )}
          </div>

          <div>
            <div style={{ marginBottom: '12px' }}>
              <Input
                placeholder="搜索员工姓名 / 工号 / 手机号"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
              />
            </div>
            <div style={{ maxHeight: '360px', overflow: 'auto', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)' }}>
              {filteredAssignableEmployees.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '13px' }}>
                  暂无可分配员工
                </div>
              ) : (
                filteredAssignableEmployees.map((emp) => (
                  <label
                    key={emp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--gray-100)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--gray-50)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={assignEmployeeIds.includes(emp.id)}
                        onChange={(e) => {
                          setAssignEmployeeIds((prev) => (
                            e.target.checked
                              ? [...prev, emp.id]
                              : prev.filter((id) => id !== emp.id)
                          ));
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: 'var(--gray-800)', fontWeight: 500 }}>{emp.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{emp.empNo} · {emp.position} · {emp.department || '未分配'}</div>
                      </div>
                    </div>
                    <Tag color="warning" style={{ whiteSpace: 'nowrap' }}>待分配</Tag>
                  </label>
                ))
              )}
            </div>
          </div>
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
