// Unified business entity types for the HR Admin Demo
// Extracted from existing pages to eliminate duplication

export interface Employee {
  id: string;
  empNo: string;
  name: string;
  department: string;
  position: string;
  gender: string;
  phone: string;
  email?: string;
  idType?: string;
  idCard?: string;
  birthday?: string;
  education?: string;
  graduateSchool?: string;
  status: 'active' | 'inactive';
  activationStatus: boolean;
  entryDate: string;
  leaveDate?: string;
}

export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  manager: string;
  managerPhone: string;
  employeeCount: number;
  createTime: string;
  children?: Department[];
}

export interface InsurancePlan {
  id: string;
  name: string;
  policyNo: string;
  startDate: string;
  endDate: string;
  payRule: string;
  scope: string;
  coreBenefits: string[];
  price: number;
  priceUnit: string;
  employeeCount: number;
  dependentCount: number;
  status: 'active' | 'pending' | 'expired';
}

export interface InsuranceProgressRecord {
  id: string;
  empNo: string;
  name: string;
  department: string;
  insurancePlan: string;
  insuranceType: string;
  status: 'pending' | 'submitting' | 'underwriting' | 'insured' | 'rejected';
  submitDate: string;
  effectiveDate: string;
  progress: number;
  remark: string;
}

export interface InsuredPerson {
  id: string;
  empNo: string;
  name: string;
  department: string;
  joinDate: string;
  type: '员工本人' | '员工+家属';
  status: '保障中' | '核保中' | '待生效' | '即将退保' | '已失效';
  effectiveDate?: string;
  expiryDate?: string;
}

export interface InsuranceOperationRecord {
  id: string;
  empNo: string;
  name: string;
  type: '加员' | '减员' | '替换';
  submitDate: string;
  effectiveDate: string;
  status: '待生效' | '已生效' | '已撤销';
}

export interface MedicalPlan {
  id: string;
  name: string;
  year: number;
  company: string;
  deadline: string;
  totalCount: number;
  appointedCount: number;
  checkedCount: number;
  status: 'ongoing' | 'completed' | 'upcoming';
}

export interface MedicalRecord {
  id: string;
  name: string;
  employeeName: string;
  department: string;
  company: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'appointed' | 'checked' | 'cancelled' | 'pending';
}

export interface EmployeePoints {
  id: string;
  name: string;
  empNo: string;
  department: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  lastGrantDate: string;
}

export interface PointsRecord {
  id: string;
  name: string;
  empNo: string;
  recordType: 'grant' | 'deduct' | 'expire';
  points: number;
  reason: string;
  operator: string;
  createTime: string;
}

export interface InsuranceMaterial {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

export interface BirthdayEmployee {
  id: string;
  name: string;
  department: string;
  birthday: string;
  daysLeft: number;
  sendStatus: 'pending' | 'sent' | 'not_sent';
}

export interface AnniversaryEmployee {
  id: string;
  name: string;
  department: string;
  entryDate: string;
  years: number;
  sendStatus: 'pending' | 'sent' | 'not_sent';
}

export interface RecognitionCard {
  id: string;
  from: string;
  to: string;
  content: string;
  type: string;
  createTime: string;
}

export interface Bill {
  id: string;
  billNo: string;
  period: string;
  companyName: string;
  insurancePlan: string;
  employeeCount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'activity' | 'policy';
  targetScope: string;
  publishTime: string;
  publisher: string;
  status: 'published' | 'draft' | 'scheduled';
  readCount: number;
  viewCount: number;
}

export interface BannerItem {
  id: string;
  imageUrl: string;
  linkUrl: string;
}

export interface ModuleOption {
  key: string;
  label: string;
  enabled: boolean;
}

export interface Message {
  id: string;
  type: 'system' | 'welfare' | 'activity' | 'reminder';
  title: string;
  content: string;
  createTime: string;
  isRead: boolean;
  relatedLink?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  createTime: string;
  status?: 'active' | 'inactive';
}

export interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface OperationLog {
  id: string;
  action: string;
  module: string;
  operator: string;
  operatorRole: string;
  ip: string;
  status: 'success' | 'failed';
  detail: string;
  createTime: string;
  duration: number;
}

// API Response types
export interface MockResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
