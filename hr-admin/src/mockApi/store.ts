import type {
  Employee,
  Department,
  InsurancePlan,
  InsuranceProgressRecord,
  MedicalPlan,
  MedicalRecord,
  EmployeePoints,
  PointsRecord,
  BirthdayEmployee,
  AnniversaryEmployee,
  RecognitionCard,
  Bill,
  Announcement,
  BannerItem,
  ModuleOption,
  Message,
  Role,
  Permission,
  OperationLog,
} from './types';
import * as seedData from './seedData';
import { clearAllDemoStorage, DEMO_STORAGE_KEYS, getDemoStorage, setDemoStorage } from '../hooks/demoStorage';

// Deep clone helper
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

interface Store {
  employees: Employee[];
  departments: Department[];
  insurancePlans: InsurancePlan[];
  insuranceProgress: InsuranceProgressRecord[];
  medicalPlans: MedicalPlan[];
  medicalRecords: MedicalRecord[];
  employeePoints: EmployeePoints[];
  pointsRecords: PointsRecord[];
  birthdayEmployees: BirthdayEmployee[];
  anniversaryEmployees: AnniversaryEmployee[];
  recognitionCards: RecognitionCard[];
  bills: Bill[];
  announcements: Announcement[];
  banners: BannerItem[];
  modules: ModuleOption[];
  messages: Message[];
  roles: Role[];
  permissions: Permission[];
  operationLogs: OperationLog[];
}

// Create initial store from seed data
function createInitialStore(): Store {
  return {
    employees: getDemoStorage(DEMO_STORAGE_KEYS.employees, seedData.seedEmployees),
    departments: getDemoStorage(DEMO_STORAGE_KEYS.departments, seedData.seedDepartments),
    insurancePlans: getDemoStorage(DEMO_STORAGE_KEYS.insurancePlans, seedData.seedInsurancePlans),
    insuranceProgress: getDemoStorage(DEMO_STORAGE_KEYS.insuranceProgress, seedData.seedInsuranceProgress),
    medicalPlans: getDemoStorage(DEMO_STORAGE_KEYS.medicalPlans, seedData.seedMedicalPlans),
    medicalRecords: getDemoStorage(DEMO_STORAGE_KEYS.medicalRecords, seedData.seedMedicalRecords),
    employeePoints: getDemoStorage(DEMO_STORAGE_KEYS.employeePoints, seedData.seedEmployeePoints),
    pointsRecords: getDemoStorage(DEMO_STORAGE_KEYS.pointsRecords, seedData.seedPointsRecords),
    birthdayEmployees: getDemoStorage(DEMO_STORAGE_KEYS.birthdayEmployees, seedData.seedBirthdayEmployees),
    anniversaryEmployees: getDemoStorage(DEMO_STORAGE_KEYS.anniversaryEmployees, seedData.seedAnniversaryEmployees),
    recognitionCards: getDemoStorage(DEMO_STORAGE_KEYS.recognitionCards, seedData.seedRecognitionCards),
    bills: getDemoStorage(DEMO_STORAGE_KEYS.bills, seedData.seedBills),
    announcements: getDemoStorage(DEMO_STORAGE_KEYS.announcements, seedData.seedAnnouncements),
    banners: getDemoStorage(DEMO_STORAGE_KEYS.interfaceBanners, seedData.seedBanners),
    modules: getDemoStorage(DEMO_STORAGE_KEYS.interfaceModules, seedData.seedModules),
    messages: getDemoStorage(DEMO_STORAGE_KEYS.messages, seedData.seedMessages),
    roles: getDemoStorage(DEMO_STORAGE_KEYS.roles, seedData.seedRoles),
    permissions: getDemoStorage(DEMO_STORAGE_KEYS.permissions, seedData.seedPermissions),
    operationLogs: getDemoStorage(DEMO_STORAGE_KEYS.operationLogs, seedData.seedOperationLogs),
  };
}

// In-memory store
let store: Store = createInitialStore();

// Reset store to initial seed data
export function resetStore(): void {
  clearAllDemoStorage();
  store = createInitialStore();
  console.log('[MockApi] Store has been reset to initial seed data');
}

// Expose reset function globally for debugging
if (typeof window !== 'undefined') {
  (window as any).resetDemoData = resetStore;
}

// Getters
export function getStore(): Store {
  return store;
}

// Individual entity getters
export const getEmployees = () => store.employees;
export const getDepartments = () => store.departments;
export const getInsurancePlans = () => store.insurancePlans;
export const getInsuranceProgress = () => store.insuranceProgress;
export const getMedicalPlans = () => store.medicalPlans;
export const getMedicalRecords = () => store.medicalRecords;
export const getEmployeePoints = () => store.employeePoints;
export const getPointsRecords = () => store.pointsRecords;
export const getBirthdayEmployees = () => store.birthdayEmployees;
export const getAnniversaryEmployees = () => store.anniversaryEmployees;
export const getRecognitionCards = () => store.recognitionCards;
export const getBills = () => store.bills;
export const getAnnouncements = () => store.announcements;
export const getBanners = () => store.banners;
export const getModules = () => store.modules;
export const getMessages = () => store.messages;
export const getRoles = () => store.roles;
export const getPermissions = () => store.permissions;
export const getOperationLogs = () => store.operationLogs;

// Individual entity setters (for CRUD operations)
export const setEmployees = (data: Employee[]) => { store.employees = data; setDemoStorage(DEMO_STORAGE_KEYS.employees, data); };
export const setDepartments = (data: Department[]) => { store.departments = data; setDemoStorage(DEMO_STORAGE_KEYS.departments, data); };
export const setInsurancePlans = (data: InsurancePlan[]) => { store.insurancePlans = data; setDemoStorage(DEMO_STORAGE_KEYS.insurancePlans, data); };
export const setInsuranceProgress = (data: InsuranceProgressRecord[]) => { store.insuranceProgress = data; setDemoStorage(DEMO_STORAGE_KEYS.insuranceProgress, data); };
export const setMedicalPlans = (data: MedicalPlan[]) => { store.medicalPlans = data; setDemoStorage(DEMO_STORAGE_KEYS.medicalPlans, data); };
export const setMedicalRecords = (data: MedicalRecord[]) => { store.medicalRecords = data; setDemoStorage(DEMO_STORAGE_KEYS.medicalRecords, data); };
export const setEmployeePoints = (data: EmployeePoints[]) => { store.employeePoints = data; setDemoStorage(DEMO_STORAGE_KEYS.employeePoints, data); };
export const setPointsRecords = (data: PointsRecord[]) => { store.pointsRecords = data; setDemoStorage(DEMO_STORAGE_KEYS.pointsRecords, data); };
export const setBirthdayEmployees = (data: BirthdayEmployee[]) => { store.birthdayEmployees = data; setDemoStorage(DEMO_STORAGE_KEYS.birthdayEmployees, data); };
export const setAnniversaryEmployees = (data: AnniversaryEmployee[]) => { store.anniversaryEmployees = data; setDemoStorage(DEMO_STORAGE_KEYS.anniversaryEmployees, data); };
export const setRecognitionCards = (data: RecognitionCard[]) => { store.recognitionCards = data; setDemoStorage(DEMO_STORAGE_KEYS.recognitionCards, data); };
export const setBills = (data: Bill[]) => { store.bills = data; setDemoStorage(DEMO_STORAGE_KEYS.bills, data); };
export const setAnnouncements = (data: Announcement[]) => { store.announcements = data; setDemoStorage(DEMO_STORAGE_KEYS.announcements, data); };
export const setBanners = (data: BannerItem[]) => { store.banners = data; setDemoStorage(DEMO_STORAGE_KEYS.interfaceBanners, data); };
export const setModules = (data: ModuleOption[]) => { store.modules = data; setDemoStorage(DEMO_STORAGE_KEYS.interfaceModules, data); };
export const setMessages = (data: Message[]) => { store.messages = data; setDemoStorage(DEMO_STORAGE_KEYS.messages, data); };
export const setRoles = (data: Role[]) => { store.roles = data; setDemoStorage(DEMO_STORAGE_KEYS.roles, data); };
export const setPermissions = (data: Permission[]) => { store.permissions = data; setDemoStorage(DEMO_STORAGE_KEYS.permissions, data); };
export const setOperationLogs = (data: OperationLog[]) => { store.operationLogs = data; setDemoStorage(DEMO_STORAGE_KEYS.operationLogs, data); };
