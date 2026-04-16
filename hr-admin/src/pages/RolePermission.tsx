import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Checkbox } from '../components/basics/Checkbox';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { DEMO_STORAGE_KEYS, seedPermissions, seedRoles } from '../mockApi/demoData';

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

const groupedPermissions = (seedPermissions as Permission[]).reduce((acc, perm) => {
  if (!acc[perm.category]) acc[perm.category] = [];
  acc[perm.category].push(perm);
  return acc;
}, {} as Record<string, Permission[]>);

const RolePermission: React.FC = () => {
  const [roles, setRoles] = useLocalStorageState<Role[]>(DEMO_STORAGE_KEYS.roles, seedRoles as Role[]);
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
    { title: '权限总数', value: seedPermissions.length.toString(), subText: '个' },
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
                        const perm = seedPermissions.find((p) => p.id === permId);
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
