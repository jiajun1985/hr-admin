const DEMO_STORAGE_PREFIX = 'hr-admin:';
const EMPLOYEE_STORAGE_VERSION = '2026-04-17-101';
const DEPARTMENT_STORAGE_VERSION = '2026-04-17-101';

export const DEMO_STORAGE_KEYS = {
  employees: 'employees',
  departments: 'departments',
  departmentEmployees: 'dept-employees',
  bills: 'bills',
  announcements: 'announcements',
  interfaceBanners: 'interface-banners',
  interfaceTheme: 'interface-theme',
  interfaceModules: 'interface-modules',
  insurancePlans: 'insurance-plans',
  insuranceProgress: 'insurance-progress',
  insuranceClaims: 'insurance-claims',
  insuredPersons: 'insured-persons',
  insuranceOperationRecords: 'operation-records',
  insuranceMaterials: 'insurance-materials',
  medicalPlans: 'medical-plans',
  medicalRecords: 'medical-records',
  employeePoints: 'points-employees',
  pointsRecords: 'points-records',
  birthdayEmployees: 'birthday-employees',
  anniversaryEmployees: 'anniversary-employees',
  recognitionCards: 'recognition-cards',
  messages: 'messages',
  roles: 'roles',
  permissions: 'permissions',
  operationLogs: 'operation-logs',
  mockApiStore: 'mock-api-store',
} as const;

export function normalizeDemoStorageKey(key: string): string {
  return key.startsWith(DEMO_STORAGE_PREFIX) ? key : `${DEMO_STORAGE_PREFIX}${key}`;
}

function cloneFallback<T>(fallback: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(fallback);
  }
  return JSON.parse(JSON.stringify(fallback)) as T;
}

export function getDemoStorage<T>(key: string, fallback: T): T {
  const storageKey = normalizeDemoStorageKey(key);
  try {
    if (key === DEMO_STORAGE_KEYS.employees) {
      const versionKey = `${storageKey}:version`;
      const storedVersion = window.localStorage.getItem(versionKey);
      if (storedVersion !== EMPLOYEE_STORAGE_VERSION) {
        window.localStorage.removeItem(storageKey);
        window.localStorage.setItem(versionKey, EMPLOYEE_STORAGE_VERSION);
        return cloneFallback(fallback);
      }
    }
    if (key === DEMO_STORAGE_KEYS.departments) {
      const versionKey = `${storageKey}:version`;
      const storedVersion = window.localStorage.getItem(versionKey);
      if (storedVersion !== DEPARTMENT_STORAGE_VERSION) {
        window.localStorage.removeItem(storageKey);
        window.localStorage.setItem(versionKey, DEPARTMENT_STORAGE_VERSION);
        return cloneFallback(fallback);
      }
    }
    const item = window.localStorage.getItem(storageKey);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${storageKey}":`, error);
  }
  return cloneFallback(fallback);
}

export function setDemoStorage<T>(key: string, value: T): void {
  const storageKey = normalizeDemoStorageKey(key);
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    if (key === DEMO_STORAGE_KEYS.employees) {
      window.localStorage.setItem(`${storageKey}:version`, EMPLOYEE_STORAGE_VERSION);
    }
    if (key === DEMO_STORAGE_KEYS.departments) {
      window.localStorage.setItem(`${storageKey}:version`, DEPARTMENT_STORAGE_VERSION);
    }
  } catch (error) {
    console.warn(`Error setting localStorage key "${storageKey}":`, error);
  }
}

export function resetDemoStorageKey(key: string): void {
  const storageKey = normalizeDemoStorageKey(key);
  try {
    window.localStorage.removeItem(storageKey);
    if (key === DEMO_STORAGE_KEYS.employees) {
      window.localStorage.removeItem(`${storageKey}:version`);
    }
    if (key === DEMO_STORAGE_KEYS.departments) {
      window.localStorage.removeItem(`${storageKey}:version`);
    }
  } catch (error) {
    console.warn(`Error removing localStorage key "${storageKey}":`, error);
  }
}

export function clearAllDemoStorage(): void {
  try {
    const keys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(DEMO_STORAGE_PREFIX)
    );
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch (error) {
    console.warn('Error clearing HR admin demo localStorage data:', error);
  }
}
