import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { type TableColumn } from '../components/composites/DataTable';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Input } from '../components/basics/Input';
import { Select } from '../components/basics/Select';
import { Icon } from '../components/basics/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { DEMO_STORAGE_KEYS } from '../hooks/demoStorage';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface Message {
  id: string;
  type: 'system' | 'welfare' | 'activity' | 'reminder';
  title: string;
  content: string;
  createTime: string;
  isRead: boolean;
  relatedLink?: string;
}

const mockMessages: Message[] = [
  { id: '1', type: 'system', title: '系统升级通知', content: '福利平台将于4月20日凌晨2:00-6:00进行系统升级，届时部分功能将暂停使用。', createTime: '2024-04-15 10:00', isRead: false, relatedLink: '/system/notice/1' },
  { id: '2', type: 'welfare', title: '您的积分已到账', content: '恭喜！您获得了1000积分，来源：春节福利发放。积分有效期至2024年12月31日。', createTime: '2024-04-14 09:30', isRead: false, relatedLink: '/points/detail' },
  { id: '3', type: 'activity', title: '员工健康讲座邀请', content: '公司将于4月25日14:00举办"职场健康"主题讲座，报名截止4月22日，点击查看详情。', createTime: '2024-04-13 16:00', isRead: true, relatedLink: '/activity/123' },
  { id: '4', type: 'reminder', title: '保险理赔待处理', content: '您有一笔保险理赔申请（单号：CL-2024-0412-001）待补充材料，请尽快处理。', createTime: '2024-04-12 11:00', isRead: true, relatedLink: '/claim/123' },
  { id: '5', type: 'system', title: '账号安全提醒', content: '检测到您的账号在异地登录，如非本人操作，请及时修改密码。', createTime: '2024-04-11 20:00', isRead: true },
  { id: '6', type: 'welfare', title: '端午节礼品领取提醒', content: '您的端午礼品已准备就绪，请于6月5日前到HR部门领取。', createTime: '2024-04-10 10:00', isRead: true, relatedLink: '/gift/ DragonBoat' },
  { id: '7', type: 'activity', title: '生日祝福', content: '祝您生日快乐！本月寿星们将于周五下午参加集体生日会，期待您的参与！', createTime: '2024-04-08 08:00', isRead: true },
  { id: '8', type: 'reminder', title: '体检报告可查询', content: '您的2024年度体检报告已生成，可点击查看详细报告内容。', createTime: '2024-04-05 14:00', isRead: true, relatedLink: '/medical/report/2024' },
];

type TabKey = 'all' | 'unread' | 'system' | 'welfare' | 'activity';

const MessageCenter: React.FC = () => {
  const [messages, setMessages] = useLocalStorageState<Message[]>(
    DEMO_STORAGE_KEYS.messages,
    mockMessages
  );
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const { currentPage } = useNavigation();

  const getBreadcrumbTitle = () => {
    if (currentPage === 'send-records') return '发送记录';
    return '模板配置';
  };

  const getFilteredMessages = () => {
    let filtered = messages;
    
    if (activeTab === 'unread') {
      filtered = filtered.filter(m => !m.isRead);
    } else if (activeTab === 'system') {
      filtered = filtered.filter(m => m.type === 'system');
    } else if (activeTab === 'welfare') {
      filtered = filtered.filter(m => m.type === 'welfare');
    } else if (activeTab === 'activity') {
      filtered = filtered.filter(m => m.type === 'activity');
    }

    if (searchValue) {
      filtered = filtered.filter(m => 
        m.title.includes(searchValue) || m.content.includes(searchValue)
      );
    }

    return filtered;
  };

  const handleOpenMessage = (message: Message) => {
    const readMessage = { ...message, isRead: true };
    setSelectedMessage(readMessage);
    setDetailModalOpen(true);

    if (!message.isRead) {
      setMessages((prev) =>
        prev.map((item) => (item.id === message.id ? readMessage : item))
      );
    }
  };

  const handleMarkAllRead = () => {
    setMessages((prev) => prev.map((message) => ({ ...message, isRead: true })));
  };

  const columns: TableColumn<Message>[] = [
    {
      key: 'type',
      title: '类型',
      width: 80,
      render: (_, record) => {
        const config = {
          system: { icon: 'settings', color: 'var(--gray-500)', label: '系统' },
          welfare: { icon: 'gift', color: 'var(--primary-600)', label: '福利' },
          activity: { icon: 'calendar', color: 'var(--success-600)', label: '活动' },
          reminder: { icon: 'bell', color: 'var(--warning-600)', label: '提醒' },
        };
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <Icon name={config[record.type].icon as any} size={18} color={config[record.type].color} />
            <span style={{ fontSize: '10px', color: config[record.type].color }}>{config[record.type].label}</span>
          </div>
        );
      },
    },
    {
      key: 'title',
      title: '标题',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!record.isRead && (
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--error-500)' }} />
          )}
          <span style={{ fontWeight: record.isRead ? 400 : 500 }}>{record.title}</span>
        </div>
      ),
    },
    {
      key: 'content',
      title: '内容',
      render: (_, record) => (
        <span style={{ color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.content}
        </span>
      ),
    },
    {
      key: 'createTime',
      title: '时间',
      width: 160,
      dataIndex: 'createTime',
    },
    {
      key: 'actions',
      title: '操作',
      width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="tertiary" size="sm" onClick={() => {
            handleOpenMessage(record);
          }}>
            查看
          </Button>
        </div>
      ),
    },
  ];

  const unreadCount = messages.filter(m => !m.isRead).length;

  const tabs = [
    { key: 'all' as TabKey, label: '全部消息', count: messages.length },
    { key: 'unread' as TabKey, label: '未读消息', count: unreadCount },
    { key: 'system' as TabKey, label: '系统通知', count: messages.filter(m => m.type === 'system').length },
    { key: 'welfare' as TabKey, label: '福利通知', count: messages.filter(m => m.type === 'welfare').length },
    { key: 'activity' as TabKey, label: '活动通知', count: messages.filter(m => m.type === 'activity').length },
  ];

  const filteredData = getFilteredMessages();

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '消息中心' },
          { label: getBreadcrumbTitle() },
        ]}
        title={getBreadcrumbTitle()}
        description="集中管理所有系统通知、福利消息和活动提醒"
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>消息中心</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="secondary" icon="check" onClick={handleMarkAllRead}>
                全部已读
              </Button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--gray-200)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary-600)' : '2px solid transparent',
                  color: activeTab === tab.key ? 'var(--primary-600)' : 'var(--gray-500)',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                  position: 'relative',
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    marginLeft: '6px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    borderRadius: '10px',
                    backgroundColor: tab.key === 'unread' && tab.count > 0 ? 'var(--error-500)' : 'var(--gray-200)',
                    color: tab.key === 'unread' && tab.count > 0 ? 'white' : 'var(--gray-500)',
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)' }}>
            <Input 
              placeholder="搜索消息标题或内容..." 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
          </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--gray-50)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--gray-500)',
                    borderBottom: '1px solid var(--gray-100)',
                    width: col.width,
                  }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((message) => (
              <tr
                key={message.id}
                style={{
                  borderBottom: '1px solid var(--gray-100)',
                  backgroundColor: message.isRead ? 'white' : 'var(--primary-50)',
                }}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: 'var(--gray-700)',
                    }}
                  >
                    {col.render ? col.render((message as any)[col.dataIndex as string] || '', message, colIndex) : (message as any)[col.dataIndex as string]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Icon name="document" size={48} color="var(--gray-300)" />
            <p style={{ marginTop: '16px', color: 'var(--gray-400)', fontSize: '14px' }}>暂无消息</p>
          </div>
        )}
      </div>

      <Modal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="消息详情"
        size="md"
        footer={[
          <Button key="close" type="secondary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
          selectedMessage?.relatedLink && (
            <Button key="link" type="primary" onClick={() => {
              console.log('跳转', selectedMessage.relatedLink);
              setDetailModalOpen(false);
            }}>
              查看详情
            </Button>
          ),
        ]}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '8px' }}>
                {selectedMessage.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--gray-400)' }}>
                <span>
                  <Tag color={selectedMessage.type === 'system' ? 'default' : selectedMessage.type === 'welfare' ? 'primary' : selectedMessage.type === 'activity' ? 'success' : 'warning'}>
                    {selectedMessage.type === 'system' ? '系统通知' : selectedMessage.type === 'welfare' ? '福利通知' : selectedMessage.type === 'activity' ? '活动通知' : '提醒'}
                  </Tag>
                </span>
                <span>{selectedMessage.createTime}</span>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)', fontSize: '14px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
              {selectedMessage.content}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MessageCenter;
