import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate as useRouterNavigate } from 'react-router-dom';

export type PageKey = 
  | 'dashboard-home'
  | 'employee-list'
  | 'employee-detail'
  | 'department'
  | 'insurance-plan'
  | 'insurance-scheme-detail'
  | 'insurance-progress'
  | 'claim-progress'
  | 'insurance-data'
  | 'medical-plan'
  | 'medical-list'
  | 'medical-data'
  | 'employee-points'
  | 'order-data'
  | 'points-data'
  | 'festival'
  | 'birthday'
  | 'work-anniversary'
  | 'thanks-card'
  | 'incentive-points'
  | 'recognition-data'
  | 'recognition-activities'
  | 'recognition-approval'
  | 'recognition-cards'
  | 'recognition-records'
  | 'bill-management'
  | 'announcement'
  | 'interface-config'
  | 'template-config'
  | 'send-records'
  | 'dedicated-service'
  | 'service-satisfaction'
  | 'complaint'
  | 'role-permission'
  | 'operation-log';

export const pageNames: Record<PageKey, string> = {
  'dashboard-home': '数据看板',
  'employee-list': '员工列表',
  'employee-detail': '员工详情',
  'department': '部门管理',
  'insurance-plan': '保险方案',
  'insurance-scheme-detail': '方案详情',
  'insurance-progress': '投保进度',
  'claim-progress': '理赔进度',
  'insurance-data': '保险数据',
  'medical-plan': '体检方案',
  'medical-list': '体检名单',
  'medical-data': '体检数据',
  'employee-points': '员工积分',
  'order-data': '订单数据',
  'points-data': '积分数据',
  'festival': '年节福利',
  'birthday': '生日祝福',
  'work-anniversary': '司龄祝福',
  'thanks-card': '感谢卡',
  'incentive-points': '激励积分',
  'recognition-data': '数据',
  'recognition-activities': '活动',
  'recognition-approval': '审批',
  'recognition-cards': '认可卡',
  'recognition-records': '记录',
  'bill-management': '账单管理',
  'announcement': '企业公告',
  'interface-config': '界面配置',
  'template-config': '模板配置',
  'send-records': '发送记录',
  'dedicated-service': '专属售后',
  'service-satisfaction': '售后满意度',
  'complaint': '投诉建议',
  'role-permission': '角色权限',
  'operation-log': '操作日志',
};

const VALID_PAGE_KEYS = new Set(Object.keys(pageNames));

function pathToPageKey(path: string): PageKey {
  const normalized = path.replace(/^\//, '') || 'dashboard-home';
  if (VALID_PAGE_KEYS.has(normalized)) {
    return normalized as PageKey;
  }
  return 'dashboard-home';
}

interface PageParams {
  employeeId?: string;
  planId?: string;
  [key: string]: any;
}

interface NavigationContextValue {
  currentPage: PageKey;
  currentParams: PageParams;
  navigate: (page: PageKey, params?: PageParams) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const routerNavigate = useRouterNavigate();
  const [currentParams, setCurrentParams] = useState<PageParams>({});

  const currentPage = useMemo(() => pathToPageKey(location.pathname), [location.pathname]);

  const navigate = useCallback((page: PageKey, params?: PageParams) => {
    setCurrentParams(params || {});
    routerNavigate(`/${page}`);
  }, [routerNavigate]);

  const value = useMemo(() => ({
    currentPage,
    currentParams,
    navigate,
  }), [currentPage, currentParams, navigate]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
