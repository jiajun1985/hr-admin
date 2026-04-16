// Mock API Layer for HR Admin Demo
// Provides unified data access with async simulation

export * from './types';
export * from './client';
export * from './store';
export * from './seedData';

// Services
export { employeeService } from './services/employeeService';
export { departmentService } from './services/departmentService';
export { insuranceService } from './services/insuranceService';
export { medicalService } from './services/medicalService';
export { pointsService } from './services/pointsService';
export { billService } from './services/billService';
export { announcementService } from './services/announcementService';
export { messageService } from './services/messageService';
export { roleService } from './services/roleService';
export { logService } from './services/logService';
export { configService } from './services/configService';
