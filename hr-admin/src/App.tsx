import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavigationProvider } from './contexts/NavigationContext';
import { AppLayout } from './components/layout';
import { PlaceholderPage } from './components/composites/PlaceholderPage';
import { pageNames } from './contexts/NavigationContext';
import type { PageKey } from './contexts/NavigationContext';

import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetail from './pages/EmployeeDetail';
import Department from './pages/Department';
import InsurancePlan from './pages/InsurancePlan';
import InsuranceSchemeDetail from './pages/InsuranceSchemeDetail';
import InsuranceProgress from './pages/InsuranceProgress';
import MedicalManagement from './pages/MedicalManagement';
import PointsManagement from './pages/PointsManagement';
import EmployeeCare from './pages/EmployeeCare';
import BillManagement from './pages/BillManagement';
import Announcement from './pages/Announcement';
import InterfaceConfig from './pages/InterfaceConfig';
import MessageCenter from './pages/MessageCenter';
import RolePermission from './pages/RolePermission';
import OperationLog from './pages/OperationLog';

const implementedPages: Record<PageKey, React.ComponentType | undefined> = {
  'dashboard-home': Dashboard,
  'employee-list': EmployeeList,
  'employee-detail': EmployeeDetail,
  'department': Department,
  'insurance-plan': InsurancePlan,
  'insurance-scheme-detail': InsuranceSchemeDetail,
  'insurance-progress': InsuranceProgress,
  'claim-progress': undefined,
  'insurance-data': undefined,
  'medical-plan': MedicalManagement,
  'medical-list': undefined,
  'medical-data': undefined,
  'employee-points': PointsManagement,
  'order-data': undefined,
  'points-data': undefined,
  'festival': undefined,
  'birthday': EmployeeCare,
  'work-anniversary': EmployeeCare,
  'thanks-card': undefined,
  'incentive-points': undefined,
  'recognition-data': undefined,
  'recognition-activities': undefined,
  'recognition-approval': undefined,
  'recognition-cards': undefined,
  'recognition-records': undefined,
  'bill-management': BillManagement,
  'announcement': Announcement,
  'interface-config': InterfaceConfig,
  'template-config': MessageCenter,
  'send-records': MessageCenter,
  'dedicated-service': undefined,
  'service-satisfaction': undefined,
  'complaint': undefined,
  'role-permission': RolePermission,
  'operation-log': OperationLog,
};

function AppRoutes() {
  return (
    <Routes>
      {(Object.keys(pageNames) as PageKey[]).map((key) => {
        const Component = implementedPages[key];
        return (
          <Route
            key={key}
            path={key}
            element={
              Component ? <Component /> : <PlaceholderPage title={pageNames[key]} />
            }
          />
        );
      })}
      <Route path="*" element={<Navigate to="/dashboard-home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppLayout userName="管理员">
        <AppRoutes />
      </AppLayout>
    </NavigationProvider>
  );
}

export default App;
