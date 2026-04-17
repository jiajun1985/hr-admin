import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../basics/Icon';

export interface MenuItem {
  key: string;
  label: string;
  icon?: IconName;
  type?: 'group' | 'item';
  children?: MenuItem[];
}

interface SidebarProps {
  activeKey?: string;
}

const menuData: MenuItem[] = [
  {
    key: 'group-dashboard',
    label: '数据总览',
    type: 'group',
    children: [
      { key: 'dashboard-home', label: '数据看板', icon: 'dashboard' },
    ],
  },
  {
    key: 'group-employee',
    label: '员工管理',
    type: 'group',
    children: [
      { key: 'employee-list', label: '员工列表', icon: 'user' },
      { key: 'department', label: '部门管理', icon: 'department' },
    ],
  },
  {
    key: 'group-benefits',
    label: '员工福利',
    type: 'group',
    children: [
      {
        key: 'insurance',
        label: '保险管理',
        icon: 'insurance',
        children: [
          { key: 'insurance-plan', label: '保险方案', icon: 'document' },
          { key: 'insurance-progress', label: '投保进度', icon: 'calendar' },
          { key: 'claim-progress', label: '理赔进度', icon: 'document' },
          { key: 'insurance-data', label: '保险数据', icon: 'bill' },
        ],
      },
      {
        key: 'medical',
        label: '体检管理',
        icon: 'medical',
        children: [
          { key: 'medical-plan', label: '体检方案', icon: 'document' },
          { key: 'medical-list', label: '体检名单', icon: 'calendar' },
          { key: 'medical-data', label: '体检数据', icon: 'bill' },
        ],
      },
      {
        key: 'points',
        label: '弹性积分',
        icon: 'points',
        children: [
          { key: 'employee-points', label: '员工积分', icon: 'user' },
          { key: 'order-data', label: '订单数据', icon: 'bill' },
          { key: 'points-data', label: '积分数据', icon: 'document' },
        ],
      },
      { key: 'festival', label: '年节福利', icon: 'gift' },
    ],
  },
  {
    key: 'group-care',
    label: '员工关怀',
    type: 'group',
    children: [
      { key: 'birthday', label: '生日祝福', icon: 'birthday' },
      { key: 'work-anniversary', label: '司龄祝福', icon: 'medal' },
      { key: 'thanks-card', label: '感谢卡', icon: 'card' },
      {
        key: 'recognition',
        label: '认可激励',
        icon: 'star',
        children: [
          { key: 'incentive-points', label: '激励积分', icon: 'points' },
          { key: 'recognition-data', label: '数据', icon: 'bill' },
          { key: 'recognition-activities', label: '活动', icon: 'gift' },
          { key: 'recognition-approval', label: '审批', icon: 'config' },
          { key: 'recognition-cards', label: '认可卡', icon: 'card' },
          { key: 'recognition-records', label: '记录', icon: 'document' },
        ],
      },
    ],
  },
  {
    key: 'group-finance',
    label: '财务结算',
    type: 'group',
    children: [
      { key: 'bill-management', label: '账单管理', icon: 'bill' },
    ],
  },
  {
    key: 'group-operation',
    label: '运营管理',
    type: 'group',
    children: [
      { key: 'announcement', label: '企业公告', icon: 'announcement' },
      { key: 'interface-config', label: '界面配置', icon: 'config' },
    ],
  },
  {
    key: 'group-message',
    label: '消息中心',
    type: 'group',
    children: [
      { key: 'template-config', label: '模板配置', icon: 'config' },
      { key: 'send-records', label: '发送记录', icon: 'document' },
    ],
  },
  {
    key: 'group-service',
    label: '售后服务',
    type: 'group',
    children: [
      { key: 'dedicated-service', label: '专属售后', icon: 'user' },
      { key: 'service-satisfaction', label: '售后满意度', icon: 'star' },
      { key: 'complaint', label: '投诉建议', icon: 'warning' },
    ],
  },
  {
    key: 'group-system',
    label: '系统管理',
    type: 'group',
    children: [
      { key: 'role-permission', label: '角色权限', icon: 'shield' },
      { key: 'operation-log', label: '操作日志', icon: 'log' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeKey = 'dashboard-home',
}) => {
  const navigate = useNavigate();
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['group-benefits', 'group-care']);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 'var(--header-height)',
    left: 0,
    bottom: 0,
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--gray-0)',
    borderRight: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease',
    zIndex: 99,
    overflow: 'hidden',
  };

  const menuContainerStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 0',
    overflow: 'auto',
  };

  const groupHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    padding: '0 16px',
    margin: '8px 8px 4px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--gray-400)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    cursor: 'default',
    userSelect: 'none',
  };

  const menuItemStyle = (level: number, isActive: boolean, hasChildren: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '36px',
    padding: level === 0 ? '0 16px' : '0 16px 0 32px',
    margin: '1px 8px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
    color: isActive ? 'var(--primary-600)' : 'var(--gray-600)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
    fontSize: level === 0 ? '14px' : '13px',
    fontWeight: isActive ? 500 : 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  const subMenuStyle = (level: number): React.CSSProperties => ({
    marginLeft: level === 0 ? '8px' : '0',
    marginRight: '8px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: level > 1 ? 'var(--gray-50)' : 'transparent',
    overflow: 'hidden',
  });

  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    if (item.type === 'group') {
      return (
        <div key={item.key}>
          <div style={groupHeaderStyle}>{item.label}</div>
          {item.children?.map((child) => renderMenuItem(child, level))}
        </div>
      );
    }

    const isActive = activeKey === item.key;
    const isExpanded = expandedKeys.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;
    const isHovered = hoveredKey === item.key;

    return (
      <div key={item.key}>
        <div
          style={menuItemStyle(level, isActive, hasChildren || false)}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.key);
            } else {
              navigate(`/${item.key}`);
            }
          }}
          onMouseEnter={() => setHoveredKey(item.key)}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, overflow: 'hidden' }}>
            {item.icon && (
              <Icon
                name={item.icon}
                size={level === 0 ? 16 : 14}
                color={isActive ? 'var(--primary-600)' : isHovered ? 'var(--gray-700)' : 'var(--gray-400)'}
              />
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
          </div>
          {hasChildren && (
            <Icon
              name="chevron-right"
              size={14}
              color="var(--gray-400)"
              style={{
                transform: isExpanded ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          )}
        </div>
        {hasChildren && isExpanded && (
          <div style={subMenuStyle(level)}>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside style={sidebarStyle}>
      <div style={menuContainerStyle}>
        {menuData.map((item) => renderMenuItem(item))}
      </div>
    </aside>
  );
};

export default Sidebar;
