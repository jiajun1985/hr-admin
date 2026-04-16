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
import { DEMO_STORAGE_KEYS, seedAnnouncements, type Announcement as AnnouncementItem } from '../mockApi/demoData';

const emptyForm = {
  title: '',
  content: '',
  type: 'notice' as AnnouncementItem['type'],
  targetScope: '全体员工',
  status: 'draft' as AnnouncementItem['status'],
};

const Announcement: React.FC = () => {
  const [data, setData] = useLocalStorageState<AnnouncementItem[]>(DEMO_STORAGE_KEYS.announcements, seedAnnouncements);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormModalOpen(true);
  };

  const openEditModal = (record: AnnouncementItem) => {
    setEditingId(record.id);
    setFormData({
      title: record.title,
      content: record.content,
      type: record.type,
      targetScope: record.targetScope,
      status: record.status,
    });
    setFormModalOpen(true);
  };

  const handleSave = (publishNow = false) => {
    if (!formData.title || !formData.content) return;
    const now = new Date();
    const publishTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (editingId) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: formData.title,
                content: formData.content,
                type: formData.type,
                targetScope: formData.targetScope,
                status: publishNow ? 'published' : (formData.status as AnnouncementItem['status']),
                publishTime: publishNow ? publishTime : item.publishTime,
                publisher: '管理员',
              }
            : item
        )
      );
    } else {
      const newItem: AnnouncementItem = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        type: formData.type,
        targetScope: formData.targetScope,
        status: publishNow ? 'published' : 'draft',
        publishTime: publishNow ? publishTime : '',
        publisher: '管理员',
        readCount: 0,
        viewCount: 0,
      };
      setData((prev) => [...prev, newItem]);
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
      setData((prev) => prev.filter((item) => item.id !== deletingId));
      setDeletingId(null);
      setDeleteModalOpen(false);
    }
  };

  const handlePublish = (id: string) => {
    const now = new Date();
    const publishTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'published' as const, publishTime } : item))
    );
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !searchValue || item.title.includes(searchValue) || item.content.includes(searchValue);
      const matchesType = !filterValues.type || item.type === filterValues.type;
      const matchesStatus = !filterValues.status || item.status === filterValues.status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, searchValue, filterValues]);

  const stats = useMemo(() => {
    const published = data.filter((d) => d.status === 'published').length;
    const draft = data.filter((d) => d.status === 'draft').length;
    const scheduled = data.filter((d) => d.status === 'scheduled').length;
    const avgReadRate = published > 0
      ? ((data.filter((d) => d.status === 'published').reduce((sum, d) => sum + (d.readCount / Math.max(d.viewCount, 1)), 0) / published) * 100).toFixed(1)
      : '0.0';
    return [
      { title: '已发布', value: String(published), subText: '本月' },
      { title: '草稿', value: String(draft), subText: '待发布' },
      { title: '定时发布', value: String(scheduled), subText: '待生效' },
      { title: '平均阅读率', value: avgReadRate, suffix: '%', subText: '本月' },
    ];
  }, [data]);

  const columns: TableColumn<AnnouncementItem>[] = [
    {
      key: 'title',
      title: '标题',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--gray-800)', marginBottom: '2px' }}>{record.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.content}</div>
        </div>
      ),
    },
    {
      key: 'type',
      title: '类型',
      width: 100,
      dataIndex: 'type',
      render: (value: AnnouncementItem['type']) => {
        const config = {
          notice: { color: 'default' as const, label: '通知' },
          activity: { color: 'primary' as const, label: '活动' },
          policy: { color: 'warning' as const, label: '政策' },
        };
        return <Tag color={config[value].color}>{config[value].label}</Tag>;
      },
    },
    {
      key: 'targetScope',
      title: '发布范围',
      width: 120,
      dataIndex: 'targetScope',
      render: (value) => <Tag>{value}</Tag>,
    },
    { key: 'publisher', title: '发布人', width: 100, dataIndex: 'publisher' },
    {
      key: 'status',
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render: (value: AnnouncementItem['status']) => {
        const config = {
          published: { color: 'success' as const, label: '已发布' },
          draft: { color: 'default' as const, label: '草稿' },
          scheduled: { color: 'primary' as const, label: '定时发布' },
        };
        return <Tag color={config[value].color}>{config[value].label}</Tag>;
      },
    },
    { key: 'publishTime', title: '发布时间', width: 160, dataIndex: 'publishTime' },
    {
      key: 'stats',
      title: '阅读/浏览',
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: 500 }}>{record.readCount}</span> / {record.viewCount}
        </div>
      ),
    },
    {
      key: 'actions',
      title: '操作',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="tertiary" size="sm" onClick={() => openEditModal(record)}>编辑</Button>
          {record.status === 'draft' && (
            <Button type="primary" size="sm" onClick={() => handlePublish(record.id)}>发布</Button>
          )}
          <Button type="tertiary" size="sm" onClick={() => confirmDelete(record.id)}>删除</Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'type',
      label: '类型',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '通知', value: 'notice' },
        { label: '活动', value: 'activity' },
        { label: '政策', value: 'policy' },
      ],
    },
    {
      key: 'status',
      label: '状态',
      buttonType: 'select' as const,
      options: [
        { label: '全部', value: '' },
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' },
        { label: '定时发布', value: 'scheduled' },
      ],
    },
  ];

  const pageActions = [
    { buttonType: 'primary' as const, label: '发布公告', icon: 'plus' as const, onClick: openAddModal },
  ];

  return (
    <>
      <ListPageTemplate
        title="企业公告"
        description="发布和管理企业内部公告，通知员工各类福利政策和活动信息"
        breadcrumb={[{ label: '首页', path: '/' }, { label: '运营管理' }, { label: '企业公告' }]}
        stats={stats}
        searchPlaceholder="搜索公告标题/内容..."
        filters={filters}
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pageActions={pageActions}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData.length,
          onChange: () => {},
        }}
        onSearch={setSearchValue}
        onFilterChange={(key, value) => setFilterValues({ ...filterValues, [key]: value })}
        onReset={() => {
          setFilterValues({});
          setSearchValue('');
        }}
      />

      <Modal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingId ? '编辑公告' : '发布公告'}
        size="lg"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => handleSave(false)}>{editingId ? '保存' : '保存草稿'}</Button>,
          <Button key="submit" type="primary" onClick={() => handleSave(true)}>立即发布</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              公告标题 <span style={{ color: 'var(--error-600)' }}>*</span>
            </label>
            <Input
              placeholder="请输入公告标题"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>公告类型</label>
              <Select
                options={[
                  { label: '通知', value: 'notice' },
                  { label: '活动', value: 'activity' },
                  { label: '政策', value: 'policy' },
                ]}
                placeholder="请选择"
                value={formData.type}
                onChange={(v) => setFormData({ ...formData, type: v as AnnouncementItem['type'] })}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>发布范围</label>
              <Select
                options={[
                  { label: '全体员工', value: '全体员工' },
                  { label: '管理层', value: '管理层' },
                  { label: '指定部门', value: '指定部门' },
                ]}
                placeholder="请选择"
                value={formData.targetScope}
                onChange={(v) => setFormData({ ...formData, targetScope: String(v) })}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              公告内容 <span style={{ color: 'var(--error-600)' }}>*</span>
            </label>
            <textarea
              placeholder="请输入公告内容..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--info-50)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--info-600)' }}>
            <Icon name="info" size={14} /> 发布后，系统将通过消息中心通知所有目标员工
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
        <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>确定要删除该公告吗？删除后不可恢复。</p>
      </Modal>
    </>
  );
};

export default Announcement;
