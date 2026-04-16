import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Checkbox } from '../components/basics/Checkbox';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createTime: string;
  status?: 'active' | 'disabled';
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const mockRoles: Role[] = [
  { id: '1', name: '超级管理员', description: '拥有系统所有权限，可进行系统配置和管理', userCount: 2, permissions: ['*'], createTime: '2023-01-01', status: 'active' },
  { id: '2', name: 'HR管理员', description: '负责人事档案管理、员工福利管理等核心业务操作', userCount: 5, permissions: ['p1', 'p2', 'p3', 'p4', 'p7', 'p9'], createTime: '2023-03-15', status: 'active' },
  { id: '3', name: '财务管理员', description: '负责账单管理、发票处理、财务报表查看', userCount: 3, permissions: ['p7', 'p8'], createTime: '2023-04-20', status: 'active' },
  { id: '4', name: '运营专员', description: '负责福利方案配置、活动发布、积分管理等日常运营工作', userCount: 8, permissions: ['p3', 'p4', 'p5', 'p6', 'p9', 'p10'], createTime: '2023-06-01', status: 'active' },
  { id: '5', name: '部门主管', description: '查看本部门员工信息、审批员工申请、查看部门报表', userCount: 25, permissions: ['p2', 'p11'], createTime: '2023-08-10', status: 'active' },
  { id: '6', name: '普通员工', description: '查看个人福利信息、使用积分商城、参与活动报名', userCount: 1162, permissions: ['p2', 'p6', 'p10'], createTime: '2023-09-01', status: 'active' },
];

const mockPermissions: Permission[] = [
  { id: 'p1', name: '员工档案管理', category: '员工管理', description: '查看、编辑、添加、删除员工档案' },
  { id: 'p2', name: '员工信息查看', category: '员工管理', description: '仅查看员工基本信息' },
  { id: 'p3', name: '福利方案配置', category: '福利管理', description: '配置和管理企业福利方案' },
  { id: 'p4', name: '福利方案查看', category: '福利管理', description: '仅查看福利方案配置' },
  { id: 'p5', name: '积分管理', category: '积分管理', description: '进行积分发放、扣除、查询等操作' },
  { id: 'p6', name: '积分查看', category: '积分管理', description: '仅查看积分余额和明细' },
  { id: 'p7', name: '账单管理', category: '财务管理', description: '查看账单、发起支付、下载发票' },
  { id: 'p8', name: '账单查看', category: '财务管理', description: '仅查看账单信息' },
  { id: 'p9', name: '公告发布', category: '运营管理', description: '创建、编辑、发布企业公告' },
  { id: 'p10', name: '公告查看', category: '运营管理', description: '仅查看公告列表' },
  { id: 'p11', name: '审批管理', category: '审批流程', description: '处理各类审批申请' },
  { id: 'p12', name: '系统设置', category: '系统管理', description: '修改系统配置、管理接口设置' },
];

const groupedPermissions = mockPermissions.reduce((acc, perm) => {
  if (!acc[perm.category]) acc[perm.category] = [];
  acc[perm.category].push(perm);
  return acc;
}, {} as Record<string, Permission[]>);

const RolePermission: React.FC = () => {
  const [roles, setRoles] = useLocalStorageState<Role[]>('hr-admin:roles', mockRoles);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState<{ name: string; description: string; status: 'active' | 'disabled'; userCount: number }>({
    name: '',
    description: '',
    status: 'active',
    userCount: 0,
  });

  const openAddModal = () => {
    setSelectedRole(null);
    setFormData({ name: '', description: '', status: 'active', userCount: 0 });
    setFormModalOpen(true);
  };

  const openEditBaseModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      status: role.status || 'active',
      userCount: role.userCount,
    });
    setFormModalOpen(true);
  };

  const openPermissionModal = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions.includes('*') ? [] : role.permissions);
    setPermissionModalOpen(true);
  };

  const handleSaveBase = () => {
    if (!formData.name) return;
    if (selectedRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === selectedRole.id
            ? { ...r, name: formData.name, description: formData.description, status: formData.status, userCount: formData.userCount }
            : r
        )
      );
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        userCount: formData.userCount,
        permissions: [],
        createTime: new Date().toISOString().slice(0, 10),
      };
      setRoles((prev) => [...prev, newRole]);
    }
    setFormModalOpen(false);
    setSelectedRole(null);
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? { ...r, permissions: selectedPermissions } : r))
      );
    }
    setPermissionModalOpen(false);
    setSelectedRole(null);
  };

  const confirmDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedRole) {
      setRoles((prev) => prev.filter((r) => r.id !== selectedRole.id));
      setDeleteModalOpen(false);
      setSelectedRole(null);
    }
  };

  const stats = [
    { title: '角色总数', value: roles.length.toString(), subText: '个' },
    { title: '权限总数', value: mockPermissions.length.toString(), subText: '个' },
    { title: '用户总数', value: roles.reduce((sum, r) => sum + (r.userCount || 0), 0).toLocaleString(), subText: '人' },
    { title: '启用角色', value: roles.filter((r) => r.status !== 'disabled').length.toString(), subText: '个' },
  ];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: '首页', path: '/' }, { label: '系统管理' }, { label: '角色权限' }]}
        title="角色权限"
        description="管理系统角色和权限配置，控制不同用户的功能访问范围"
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>角色权限</h1>
            </div>
            <Button type="primary" icon="plus" onClick={openAddModal}>新增角色</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gray-800)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginTop: '4px' }}>{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-700)' }}>角色列表</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {roles.map((role) => (
              <div
                key={role.id}
                style={{
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  transition: 'all 0.2s',
                  opacity: role.status === 'disabled' ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>{role.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{role.userCount} 人使用此角色</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {role.permissions.includes('*') && <Tag color="error">全部权限</Tag>}
                    {role.status === 'disabled' && <Tag>已禁用</Tag>}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '12px', lineHeight: 1.5 }}>{role.description}</p>
                {!role.permissions.includes('*') && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '6px' }}>权限标签</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {role.permissions.slice(0, 4).map((permId, i) => {
                        const perm = mockPermissions.find((p) => p.id === permId);
                        return <Tag key={i}>{perm ? perm.name : permId}</Tag>;
                      })}
                      {role.permissions.length > 4 && <Tag>+{role.permissions.length - 4}</Tag>}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button type="tertiary" size="sm" onClick={() => openPermissionModal(role)}>编辑权限</Button>
                  <Button type="tertiary" size="sm" onClick={() => openEditBaseModal(role)}>编辑</Button>
                  {role.id !== '1' && (
                    <Button type="tertiary" size="sm" onClick={() => confirmDelete(role)}>删除</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        title={`编辑角色权限 - ${selectedRole?.name}`}
        size="lg"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setPermissionModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSavePermissions}>保存</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)', marginBottom: '12px' }}>选择权限</h4>
            {Object.entries(groupedPermissions).map(([category, permissions]) => {
              const allChecked = permissions.every((p) => selectedPermissions.includes(p.id));
              const someChecked = permissions.some((p) => selectedPermissions.includes(p.id)) && !allChecked;
              return (
                <div key={category} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-600)', marginBottom: '8px', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox
                      checked={allChecked}
                      indeterminate={someChecked}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedPermissions(Array.from(new Set([...selectedPermissions, ...permissions.map((p) => p.id)])));
                        } else {
                          setSelectedPermissions(selectedPermissions.filter((id) => !permissions.find((p) => p.id === id)));
                        }
                      }}
                    />
                    <span>{category}</span>
                  </div>
                  <div style={{ paddingLeft: '28px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {permissions.map((perm) => (
                      <div key={perm.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <Checkbox
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedPermissions((prev) => [...prev, perm.id]);
                            } else {
                              setSelectedPermissions((prev) => prev.filter((id) => id !== perm.id));
                            }
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', color: 'var(--gray-700)' }}>{perm.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{perm.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>

      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedRole ? '编辑角色' : '新增角色'}
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setFormModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSaveBase}>{selectedRole ? '保存' : '创建'}</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              角色名称 <span style={{ color: 'var(--error-600)' }}>*</span>
            </label>
            <Input
              placeholder="请输入角色名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>角色描述</label>
            <textarea
              placeholder="请输入角色描述..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>状态</label>
              <Select
                options={[
                  { label: '启用', value: 'active' },
                  { label: '禁用', value: 'disabled' },
                ]}
                placeholder="请选择"
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: v as 'active' | 'disabled' })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>用户数</label>
              <Input
                type="number"
                value={String(formData.userCount)}
                onChange={(e) => setFormData({ ...formData, userCount: Number(e.target.value) })}
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
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除角色 "{selectedRole?.name}" 吗？删除后不可恢复。</p>
      </Modal>
    </>
  );
};

export default RolePermission;
