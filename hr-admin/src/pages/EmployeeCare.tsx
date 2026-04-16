import React, { useState } from 'react';
import { PageHeader } from '../components/composites/PageHeader';
import { Button } from '../components/basics/Button';
import { Tag } from '../components/basics/Tag';
import { Modal } from '../components/basics/Modal';
import { Icon } from '../components/basics/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import {
  DEMO_STORAGE_KEYS,
  seedAnniversaryEmployees,
  seedBirthdayEmployees,
  seedRecognitionCards,
} from '../mockApi/demoData';

interface BirthdayEmployee {
  id: string;
  name: string;
  department: string;
  birthday: string;
  daysLeft: number;
  sendStatus: 'pending' | 'sent' | 'not_sent';
}

interface AnniversaryEmployee {
  id: string;
  name: string;
  department: string;
  entryDate: string;
  years: number;
  sendStatus: 'pending' | 'sent' | 'not_sent';
}

interface RecognitionCard {
  id: string;
  from: string;
  to: string;
  content: string;
  type: string;
  createTime: string;
}

type TabKey = 'birthday' | 'anniversary' | 'recognition';
type PersistedSetter<T> = (value: T | ((prev: T) => T)) => void;

const EmployeeCare: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('birthday');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [birthdayEmployees, setBirthdayEmployees] = useLocalStorageState<BirthdayEmployee[]>(
    DEMO_STORAGE_KEYS.birthdayEmployees,
    seedBirthdayEmployees
  );
  const [anniversaryEmployees, setAnniversaryEmployees] = useLocalStorageState<AnniversaryEmployee[]>(
    DEMO_STORAGE_KEYS.anniversaryEmployees,
    seedAnniversaryEmployees
  );
  const [recognitionCards] = useLocalStorageState<RecognitionCard[]>(
    DEMO_STORAGE_KEYS.recognitionCards,
    seedRecognitionCards
  );
  const { currentPage } = useNavigation();

  const getBreadcrumbTitle = () => {
    if (currentPage === 'work-anniversary') return '司龄祝福';
    return '生日祝福';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'birthday':
        return (
          <BirthdayTab
            employees={birthdayEmployees}
            setEmployees={setBirthdayEmployees}
            onConfigTemplate={() => setTemplateModalOpen(true)}
          />
        );
      case 'anniversary':
        return (
          <AnniversaryTab
            employees={anniversaryEmployees}
            setEmployees={setAnniversaryEmployees}
          />
        );
      case 'recognition':
        return <RecognitionTab cards={recognitionCards} />;
    }
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: '首页', path: '/' },
          { label: '员工关怀' },
          { label: getBreadcrumbTitle() },
        ]}
        title={getBreadcrumbTitle()}
        description="管理生日祝福、司龄庆祝及员工认可激励"
      />

      <div style={{ marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '4px' }}>员工关怀</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'birthday', label: '生日祝福', icon: 'birthday' },
              { key: 'anniversary', label: '司龄祝福', icon: 'medal' },
              { key: 'recognition', label: '认可激励', icon: 'star' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid var(--primary-600)' : '2px solid transparent',
                  color: activeTab === tab.key ? 'var(--primary-600)' : 'var(--gray-500)',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                }}
              >
                <Icon name={tab.icon as any} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderContent()}

      <Modal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title="祝福模板配置"
        size="md"
        footer={[
          <Button key="cancel" type="secondary" onClick={() => setTemplateModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => setTemplateModalOpen(false)}>保存</Button>,
        ]}
      >
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '6px', display: 'block' }}>
              生日祝福模板
            </label>
            <textarea
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                resize: 'vertical',
                outline: 'none',
              }}
              placeholder="亲爱的 {name}，祝你生日快乐！..."
            />
            <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '4px' }}>
              支持变量: {'{'}name{'}'} 员工姓名, {'{'}department{'}'} 部门, {'{'}date{'}'} 日期
            </div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--info-50)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--info-600)' }}>
            <Icon name="info" size={14} /> 祝福将在员工生日当天 09:00 自动发送
          </div>
        </div>
      </Modal>
    </>
  );
};

const BirthdayTab: React.FC<{
  employees: BirthdayEmployee[];
  setEmployees: PersistedSetter<BirthdayEmployee[]>;
  onConfigTemplate: () => void;
}> = ({ employees, setEmployees, onConfigTemplate }) => {
  const sentCount = employees.filter((employee) => employee.sendStatus === 'sent').length;
  const pendingCount = employees.filter((employee) => employee.sendStatus === 'pending').length;

  const handleBatchSend = () => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.sendStatus === 'pending' ? { ...employee, sendStatus: 'sent' } : employee
      )
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1, marginRight: '16px' }}>
          <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>本周生日</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>{employees.length}</div>
          </div>
          <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>本月生日</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>{employees.length}</div>
          </div>
          <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>已发送</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success-600)' }}>{sentCount}</div>
          </div>
          <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>待发送</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning-600)' }}>{pendingCount}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="secondary" onClick={onConfigTemplate}>配置模板</Button>
          <Button type="primary" onClick={handleBatchSend}>批量发送</Button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>本周生日员工</h3>
          <Tag color="warning">剩余 {pendingCount} 人待发送</Tag>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {employees.map((emp) => (
            <div
              key={emp.id}
              style={{
                padding: '16px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--gray-200)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{emp.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{emp.department}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                  生日: {emp.birthday}
                </div>
                <Tag
                  color={
                    emp.sendStatus === 'sent' ? 'success' :
                    emp.sendStatus === 'pending' ? 'warning' : 'default'
                  }
                >
                  {emp.sendStatus === 'sent' ? '已发送' : emp.sendStatus === 'pending' ? '待发送' : '未配置'}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnniversaryTab: React.FC<{
  employees: AnniversaryEmployee[];
  setEmployees: PersistedSetter<AnniversaryEmployee[]>;
}> = ({ employees, setEmployees }) => {
  const sentCount = employees.filter((employee) => employee.sendStatus === 'sent').length;
  const pendingCount = employees.filter((employee) => employee.sendStatus === 'pending').length;

  const handleBatchSend = () => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.sendStatus === 'pending' ? { ...employee, sendStatus: 'sent' } : employee
      )
    );
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>本周司龄</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>{employees.length}</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>本月司龄</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>{employees.length}</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>已发送</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success-600)' }}>{sentCount}</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>待发送</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--warning-600)' }}>{pendingCount}</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>司龄庆祝</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="secondary">配置模板</Button>
            <Button type="primary" onClick={handleBatchSend}>批量发送</Button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {employees.map((emp) => (
            <div
              key={emp.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 600,
                }}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{emp.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>{emp.department}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>入职日期</div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-600)' }}>{emp.entryDate}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>司龄</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary-600)' }}>{emp.years}年</div>
                </div>
                <Tag color={emp.sendStatus === 'sent' ? 'success' : 'warning'}>
                  {emp.sendStatus === 'sent' ? '已发送' : '待发送'}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecognitionTab: React.FC<{ cards: RecognitionCard[] }> = ({ cards }) => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>本月认可</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>48</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>活跃成员</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>35</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>发放积分</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-600)' }}>2,400</div>
        </div>
        <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--gray-500)' }}>认可卡片</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gray-800)' }}>12</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--gray-0)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>认可记录</h3>
          <Button type="primary">发送认可</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                padding: '16px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '16px',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {card.from.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>{card.from}</span>
                  <Icon name="arrow-right" size={14} color="var(--gray-400)" />
                  <span style={{ fontWeight: 500, color: 'var(--primary-600)' }}>{card.to}</span>
                  <Tag color="primary">{card.type}</Tag>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginBottom: '8px' }}>
                  "{card.content}"
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                  {card.createTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCare;
