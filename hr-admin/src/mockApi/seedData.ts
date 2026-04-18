import type {
  Department,
  InsuranceClaimRecord,
  InsurancePlan,
  InsuranceProgressRecord,
  InsuredPerson,
  InsuranceOperationRecord,
  InsuranceMaterial,
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
export { seedEmployees } from './employeeSeedData';

export const seedDepartments: Department[] = [
  {
    id: '1',
    name: '总公司',
    parentId: null,
    manager: '张伟',
    managerPhone: '13800008001',
    employeeCount: 24,
    createTime: '2026-01-01',
    children: [
      {
        id: '1-1',
        name: '研发部',
        parentId: '1',
        manager: '陈明',
        managerPhone: '13500008005',
        employeeCount: 8,
        createTime: '2026-01-05',
        children: [
          { id: '1-1-1', name: '运维组', parentId: '1-1', manager: '孙浩', managerPhone: '13300008007', employeeCount: 1, createTime: '2026-03-02' },
          { id: '1-1-2', name: '产品组', parentId: '1-1', manager: '黄磊', managerPhone: '12500008015', employeeCount: 0, createTime: '2026-03-09' },
        ],
      },
      { id: '1-2', name: '市场部', parentId: '1', manager: '郑丽', managerPhone: '13000008010', employeeCount: 3, createTime: '2026-01-12' },
      { id: '1-3', name: '销售部', parentId: '1', manager: '马超', managerPhone: '12900008011', employeeCount: 3, createTime: '2026-01-20' },
      { id: '1-4', name: '人事部', parentId: '1', manager: '刘芳', managerPhone: '13600008004', employeeCount: 3, createTime: '2026-02-03' },
      { id: '1-5', name: '财务部', parentId: '1', manager: '赵敏', managerPhone: '13400008006', employeeCount: 2, createTime: '2026-02-18' },
    ],
  },
];

export const seedInsurancePlans: InsurancePlan[] = [
  {
    id: '1',
    name: '补充医疗保险',
    insuranceType: '补充医疗保险',
    policyNo: 'PA2026001234',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    payRule: '年付费',
    scope: '全体正式员工',
    coreBenefits: ['门急诊报销 (免赔额500，赔付比例80%)', '住院医疗 (免赔额0，赔付比例90%)'],
    price: 120000,
    priceUnit: '年',
    employeeCount: 24,
    childCount: 2,
    spouseCount: 2,
    parentCount: 1,
    status: 'active',
  },
  {
    id: '2',
    name: '团体意外险',
    insuranceType: '团体意外险',
    policyNo: 'CP2026005678',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    payRule: '年付费',
    scope: '全体在职员工',
    coreBenefits: ['意外身故/伤残 (保额50万)', '意外医疗 (免赔额100，赔付比例100%)', '住院津贴 (200元/天)'],
    price: 48000,
    priceUnit: '年',
    employeeCount: 24,
    childCount: 0,
    spouseCount: 0,
    parentCount: 0,
    status: 'active',
  },
  {
    id: '3',
    name: '重大疾病险',
    insuranceType: '重大疾病险',
    policyNo: 'CL2026009876',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    payRule: '年付费',
    scope: '全体正式员工',
    coreBenefits: ['重大疾病 (保额30万，覆盖120种重疾)', '轻症疾病 (保额9万，覆盖40种轻症)'],
    price: 96000,
    priceUnit: '年',
    employeeCount: 10,
    childCount: 1,
    spouseCount: 0,
    parentCount: 1,
    status: 'expired',
  },
  {
    id: '4',
    name: '门诊补充险',
    insuranceType: '门急诊补充医疗',
    policyNo: 'MZ2026009999',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    payRule: '月付费',
    scope: '全体正式员工',
    coreBenefits: ['普通门诊报销 (免赔额0，赔付比例70%)', '急诊报销 (免赔额0，赔付比例80%)'],
    price: 8500,
    priceUnit: '月',
    employeeCount: 18,
    childCount: 1,
    spouseCount: 1,
    parentCount: 1,
    status: 'active',
  },
];

export const seedInsuranceProgress: InsuranceProgressRecord[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'insured', submitDate: '2026-01-15', effectiveDate: '2026-02-01', progress: 100, remark: '已生效' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'underwriting', submitDate: '2026-03-20', effectiveDate: '-', progress: 75, remark: '保险公司审核中' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', insurancePlan: '团体意外险', insuranceType: '意外', status: 'submitting', submitDate: '2026-03-25', effectiveDate: '-', progress: 40, remark: '等待员工确认' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'pending', submitDate: '-', effectiveDate: '-', progress: 10, remark: '待提交投保资料' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', insurancePlan: '重大疾病险', insuranceType: '重疾', status: 'rejected', submitDate: '2026-01-20', effectiveDate: '-', progress: 60, remark: '既往病史不符合承保条件' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'insured', submitDate: '2026-01-18', effectiveDate: '2026-02-01', progress: 100, remark: '已生效' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '研发部', insurancePlan: '团体意外险', insuranceType: '意外', status: 'underwriting', submitDate: '2026-04-01', effectiveDate: '-', progress: 80, remark: '等待保单生成' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '研发部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'pending', submitDate: '-', effectiveDate: '-', progress: 5, remark: '待填写投保信息' },
];

export const seedInsuranceClaims: InsuranceClaimRecord[] = [
  { id: '1', claimNo: 'CL-2026-0412-001', empNo: 'EMP001', name: '张伟', department: '研发部', insurancePlan: '补充医疗保险', claimType: '门诊', applyAmount: 1280, paidAmount: 960, submitDate: '2026-04-12', status: 'paid', progress: 100, materials: ['门诊发票', '费用清单', '病历记录'], currentNode: '赔付完成', remark: '门诊费用按80%比例赔付，扣除免赔额后已打款。' },
  { id: '2', claimNo: 'CL-2026-0415-002', empNo: 'EMP002', name: '李娜', department: '市场部', insurancePlan: '补充医疗保险', claimType: '住院', applyAmount: 18600, paidAmount: 0, submitDate: '2026-04-15', status: 'reviewing', progress: 62, materials: ['住院发票', '出院小结', '费用明细'], currentNode: '保险公司审核', remark: '等待保险公司核定医保分割单。' },
  { id: '3', claimNo: 'CL-2026-0417-003', empNo: 'EMP007', name: '孙浩', department: '研发部', insurancePlan: '团体意外险', claimType: '意外', applyAmount: 3200, paidAmount: 0, submitDate: '2026-04-17', status: 'submitted', progress: 35, materials: ['事故说明', '门诊发票'], currentNode: 'HR初审', remark: '需补充意外事故现场说明。' },
  { id: '4', claimNo: 'CL-2026-0408-004', empNo: 'EMP006', name: '赵敏', department: '财务部', insurancePlan: '补充医疗保险', claimType: '门诊', applyAmount: 680, paidAmount: 510, submitDate: '2026-04-08', status: 'paying', progress: 88, materials: ['门诊发票', '处方单'], currentNode: '财务打款', remark: '赔付金额已确认，预计1个工作日到账。' },
  { id: '5', claimNo: 'CL-2026-0328-005', empNo: 'EMP005', name: '陈明', department: '研发部', insurancePlan: '重大疾病险', claimType: '重疾', applyAmount: 100000, paidAmount: 0, submitDate: '2026-03-28', status: 'rejected', progress: 70, materials: ['诊断证明', '住院病历'], currentNode: '已驳回', remark: '既往病史不符合本方案承保及理赔条件。' },
  { id: '6', claimNo: 'CL-2026-0419-006', empNo: 'EMP010', name: '郑丽', department: '市场部', insurancePlan: '门诊补充险', claimType: '门诊', applyAmount: 430, paidAmount: 0, submitDate: '2026-04-19', status: 'draft', progress: 15, materials: ['门诊发票'], currentNode: '员工补充材料', remark: '缺少费用明细，暂未提交保险公司。' },
];

export const seedInsuredPersons: InsuredPerson[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', joinDate: '2026-01', type: '员工本人', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', joinDate: '2026-01', type: '员工+家属', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', joinDate: '2026-01', type: '员工本人', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', joinDate: '2026-01', type: '员工+家属', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', joinDate: '2026-01', type: '员工本人', status: '核保中', effectiveDate: '2026-04-01' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', joinDate: '2026-01', type: '员工本人', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '研发部', joinDate: '2026-01', type: '员工本人', status: '待生效', effectiveDate: '2026-04-15' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '研发部', joinDate: '2026-01', type: '员工本人', status: '即将退保', effectiveDate: '2026-01-01', expiryDate: '2026-04-30' },
  { id: '9', empNo: 'EMP009', name: '吴昊', department: '研发部', joinDate: '2026-01', type: '员工+家属', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '10', empNo: 'EMP010', name: '郑丽', department: '市场部', joinDate: '2026-01', type: '员工本人', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
  { id: '11', empNo: 'EMP011', name: '马超', department: '销售部', joinDate: '2026-01', type: '员工本人', status: '已失效', effectiveDate: '2026-01-01', expiryDate: '2026-03-31' },
  { id: '12', empNo: 'EMP012', name: '林静', department: '人事部', joinDate: '2026-01', type: '员工本人', status: '保障中', effectiveDate: '2026-01-01', expiryDate: '2026-12-31' },
];

export const seedInsuranceOperationRecords: InsuranceOperationRecord[] = [
  { id: '1', empNo: 'EMP005', name: '陈明', type: '加员', submitDate: '2026-03-20', effectiveDate: '2026-04-01', status: '待生效' },
  { id: '2', empNo: 'EMP007', name: '孙浩', type: '加员', submitDate: '2026-04-01', effectiveDate: '2026-04-15', status: '待生效' },
  { id: '3', empNo: 'EMP008', name: '周婷', type: '减员', submitDate: '2026-03-25', effectiveDate: '2026-04-01', status: '已生效' },
  { id: '4', empNo: 'EMP011', name: '马超', type: '减员', submitDate: '2026-01-05', effectiveDate: '2026-01-01', status: '已生效' },
  { id: '5', empNo: 'EMP009', name: '吴昊', type: '加员', submitDate: '2026-02-15', effectiveDate: '2026-03-01', status: '已生效' },
  { id: '6', empNo: 'EMP010', name: '郑丽', type: '替换', submitDate: '2026-03-10', effectiveDate: '2026-04-01', status: '已生效' },
  { id: '7', empNo: 'EMP012', name: '林静', type: '加员', submitDate: '2026-01-10', effectiveDate: '2026-02-01', status: '已生效' },
];

export const seedInsuranceMaterials: InsuranceMaterial[] = [
  { id: '1', name: '2026年度保险合同.pdf', type: '保险合同', uploadDate: '2026-01-01' },
  { id: '2', name: '保险条款说明.pdf', type: '保险条款', uploadDate: '2026-01-01' },
  { id: '3', name: '理赔流程指引.pdf', type: '理赔指引', uploadDate: '2026-01-15' },
  { id: '4', name: '定点医院名单.xlsx', type: '医院名单', uploadDate: '2026-02-01' },
  { id: '5', name: '保险卡样卡.png', type: '其他', uploadDate: '2026-01-01' },
];

export const seedMedicalPlans: MedicalPlan[] = [
  { id: '1', name: '2026年度全面健康体检', year: 2026, company: '美年大健康', deadline: '2026-06-30', totalCount: 1200, appointedCount: 856, checkedCount: 420, status: 'ongoing' },
  { id: '2', name: '2026年度高管专项体检', year: 2026, company: '瑞慈体检', deadline: '2026-05-31', totalCount: 50, appointedCount: 50, checkedCount: 35, status: 'ongoing' },
  { id: '3', name: '2026年度入职专项体检', year: 2026, company: '爱康国宾', deadline: '2026-03-31', totalCount: 180, appointedCount: 180, checkedCount: 176, status: 'completed' },
  { id: '4', name: '2026年度女性健康专项', year: 2026, company: '瑞慈体检', deadline: '2026-04-10', totalCount: 120, appointedCount: 118, checkedCount: 110, status: 'completed' },
  { id: '5', name: '2026年度肿瘤筛查专项', year: 2026, company: '和睦家医院', deadline: '2026-09-30', totalCount: 300, appointedCount: 0, checkedCount: 0, status: 'upcoming' },
];

export const seedMedicalRecords: MedicalRecord[] = [
  { id: '1', name: '张伟', employeeName: 'EMP001', department: '研发部', company: '美年大健康', appointmentDate: '2026-04-15', appointmentTime: '14:00', status: 'checked' },
  { id: '2', name: '李娜', employeeName: 'EMP002', department: '市场部', company: '美年大健康', appointmentDate: '2026-04-18', appointmentTime: '09:00', status: 'checked' },
  { id: '3', name: '王强', employeeName: 'EMP003', department: '销售部', company: '美年大健康', appointmentDate: '2026-04-20', appointmentTime: '10:00', status: 'appointed' },
  { id: '4', name: '刘芳', employeeName: 'EMP004', department: '人事部', company: '美年大健康', appointmentDate: '2026-04-25', appointmentTime: '15:00', status: 'appointed' },
  { id: '5', name: '陈明', employeeName: 'EMP005', department: '研发部', company: '美年大健康', appointmentDate: '2026-04-22', appointmentTime: '11:00', status: 'checked' },
  { id: '6', name: '赵敏', employeeName: 'EMP006', department: '财务部', company: '美年大健康', appointmentDate: '2026-04-28', appointmentTime: '09:30', status: 'pending' },
  { id: '7', name: '孙浩', employeeName: 'EMP007', department: '研发部', company: '美年大健康', appointmentDate: '2026-04-30', appointmentTime: '14:30', status: 'pending' },
  { id: '8', name: '周婷', employeeName: 'EMP008', department: '研发部', company: '美年大健康', appointmentDate: '2026-04-16', appointmentTime: '10:30', status: 'cancelled' },
  { id: '9', name: '吴昊', employeeName: 'EMP009', department: '研发部', company: '美年大健康', appointmentDate: '2026-05-05', appointmentTime: '09:00', status: 'pending' },
  { id: '10', name: '郑丽', employeeName: 'EMP010', department: '市场部', company: '美年大健康', appointmentDate: '2026-05-08', appointmentTime: '11:00', status: 'pending' },
  { id: '11', name: '马超', employeeName: 'EMP011', department: '销售部', company: '瑞慈体检', appointmentDate: '2026-04-10', appointmentTime: '09:00', status: 'checked' },
  { id: '12', name: '高峰', employeeName: 'EMP013', department: '财务部', company: '瑞慈体检', appointmentDate: '2026-04-12', appointmentTime: '10:00', status: 'checked' },
];

export const seedEmployeePoints: EmployeePoints[] = [
  { id: '1', name: '张伟', empNo: 'EMP001', department: '研发部', balance: 3560, totalIncome: 8200, totalExpense: 4640, lastGrantDate: '2026-04-01' },
  { id: '2', name: '李娜', empNo: 'EMP002', department: '市场部', balance: 4800, totalIncome: 9000, totalExpense: 4200, lastGrantDate: '2026-04-01' },
  { id: '3', name: '王强', empNo: 'EMP003', department: '销售部', balance: 2200, totalIncome: 6500, totalExpense: 4300, lastGrantDate: '2026-03-01' },
  { id: '4', name: '刘芳', empNo: 'EMP004', department: '人事部', balance: 5500, totalIncome: 10200, totalExpense: 4700, lastGrantDate: '2026-04-01' },
  { id: '5', name: '陈明', empNo: 'EMP005', department: '研发部', balance: 2800, totalIncome: 5600, totalExpense: 2800, lastGrantDate: '2026-02-01' },
  { id: '6', name: '赵敏', empNo: 'EMP006', department: '财务部', balance: 4100, totalIncome: 7800, totalExpense: 3700, lastGrantDate: '2026-04-01' },
  { id: '7', name: '孙浩', empNo: 'EMP007', department: '研发部', balance: 1900, totalIncome: 4200, totalExpense: 2300, lastGrantDate: '2026-03-15' },
  { id: '8', name: '周婷', empNo: 'EMP008', department: '研发部', balance: 3300, totalIncome: 6800, totalExpense: 3500, lastGrantDate: '2026-04-01' },
  { id: '9', name: '吴昊', empNo: 'EMP009', department: '研发部', balance: 1500, totalIncome: 3000, totalExpense: 1500, lastGrantDate: '2026-01-15' },
  { id: '10', name: '郑丽', empNo: 'EMP010', department: '市场部', balance: 2600, totalIncome: 4800, totalExpense: 2200, lastGrantDate: '2026-04-01' },
];

export const seedPointsRecords: PointsRecord[] = [
  { id: '1', name: '张伟', empNo: 'EMP001', recordType: 'grant', points: 1000, reason: '春节福利发放-2026', operator: '系统', createTime: '2026-01-28 10:00' },
  { id: '2', name: '张伟', empNo: 'EMP001', recordType: 'grant', points: 500, reason: '元宵节福利', operator: '系统', createTime: '2026-02-12 10:00' },
  { id: '3', name: '李娜', empNo: 'EMP002', recordType: 'grant', points: 1000, reason: '春节福利发放-2026', operator: '系统', createTime: '2026-01-28 10:00' },
  { id: '4', name: '李娜', empNo: 'EMP002', recordType: 'deduct', points: -800, reason: '积分商城兑换-小米手环8', operator: '系统', createTime: '2026-03-15 14:30' },
  { id: '5', name: '李娜', empNo: 'EMP002', recordType: 'deduct', points: -400, reason: '积分商城兑换-颈椎按摩仪', operator: '系统', createTime: '2026-04-05 16:20' },
  { id: '6', name: '王强', empNo: 'EMP003', recordType: 'grant', points: 300, reason: '月度绩效奖励', operator: '管理员', createTime: '2026-04-01 09:00' },
  { id: '7', name: '王强', empNo: 'EMP003', recordType: 'grant', points: 500, reason: 'Q1季度奖', operator: '管理员', createTime: '2026-03-31 18:00' },
  { id: '8', name: '刘芳', empNo: 'EMP004', recordType: 'expire', points: -300, reason: '2026年一季度活动积分到期', operator: '系统', createTime: '2026-04-01 00:00' },
  { id: '9', name: '刘芳', empNo: 'EMP004', recordType: 'grant', points: 1000, reason: '春节福利发放-2026', operator: '系统', createTime: '2026-01-28 10:00' },
  { id: '10', name: '陈明', empNo: 'EMP005', recordType: 'grant', points: 800, reason: '元宵节福利', operator: '系统', createTime: '2026-02-12 10:00' },
  { id: '11', name: '陈明', empNo: 'EMP005', recordType: 'deduct', points: -600, reason: '积分商城兑换-空气净化器', operator: '系统', createTime: '2026-03-20 11:00' },
  { id: '12', name: '赵敏', empNo: 'EMP006', recordType: 'grant', points: 1000, reason: '春节福利发放-2026', operator: '系统', createTime: '2026-01-28 10:00' },
  { id: '13', name: '孙浩', empNo: 'EMP007', recordType: 'grant', points: 200, reason: '节日活动参与奖励', operator: '管理员', createTime: '2026-04-10 14:00' },
  { id: '14', name: '周婷', empNo: 'EMP008', recordType: 'grant', points: 500, reason: '端午节预发福利', operator: '系统', createTime: '2026-04-15 10:00' },
  { id: '15', name: '吴昊', empNo: 'EMP009', recordType: 'grant', points: 500, reason: '新员工入职福利', operator: '管理员', createTime: '2026-01-15 09:00' },
  { id: '16', name: '郑丽', empNo: 'EMP010', recordType: 'deduct', points: -300, reason: '积分商城兑换-健康体检套餐', operator: '系统', createTime: '2026-04-18 15:30' },
];

export const seedBirthdayEmployees: BirthdayEmployee[] = [
  { id: '1', name: '张伟', department: '研发部', birthday: '05-15', daysLeft: 2, sendStatus: 'pending' },
  { id: '2', name: '李娜', department: '市场部', birthday: '05-18', daysLeft: 5, sendStatus: 'pending' },
  { id: '3', name: '王强', department: '销售部', birthday: '05-20', daysLeft: 7, sendStatus: 'sent' },
  { id: '4', name: '刘芳', department: '人事部', birthday: '05-22', daysLeft: 9, sendStatus: 'not_sent' },
];

export const seedAnniversaryEmployees: AnniversaryEmployee[] = [
  { id: '1', name: '陈明', department: '研发部', entryDate: '2026-02-11', years: 0, sendStatus: 'pending' },
  { id: '2', name: '赵敏', department: '财务部', entryDate: '2026-02-18', years: 0, sendStatus: 'pending' },
  { id: '3', name: '孙浩', department: '研发部', entryDate: '2026-03-02', years: 0, sendStatus: 'sent' },
];

export const seedRecognitionCards: RecognitionCard[] = [
  { id: '1', from: '张伟', to: '李娜', content: '感谢你在项目中的出色表现！', type: '感谢', createTime: '2026-04-10 14:30' },
  { id: '2', from: '王强', to: '陈明', content: '技术能力强，帮助团队解决了很多问题', type: '认可', createTime: '2026-04-09 10:00' },
  { id: '3', from: '刘芳', to: '赵敏', content: '财务工作认真负责，值得学习', type: '感谢', createTime: '2026-04-08 16:20' },
];

export const seedBills: Bill[] = [
  { id: '1', billNo: 'BILL-2026-04-001', period: '2026年4月', companyName: '示例科技公司', insurancePlan: '补充医疗保险', employeeCount: 24, totalAmount: 48600, paidAmount: 0, status: 'pending', dueDate: '2026-04-30' },
  { id: '2', billNo: 'BILL-2026-03-002', period: '2026年3月', companyName: '示例科技公司', insurancePlan: '团体意外险', employeeCount: 24, totalAmount: 25600, paidAmount: 25600, status: 'paid', dueDate: '2026-03-31', paidDate: '2026-03-28' },
  { id: '3', billNo: 'BILL-2026-03-003', period: '2026年3月', companyName: '示例科技公司', insurancePlan: '补充医疗保险', employeeCount: 24, totalAmount: 47480, paidAmount: 47480, status: 'paid', dueDate: '2026-03-31', paidDate: '2026-03-29' },
  { id: '4', billNo: 'BILL-2026-02-004', period: '2026年2月', companyName: '示例科技公司', insurancePlan: '补充医疗保险', employeeCount: 18, totalAmount: 36000, paidAmount: 36000, status: 'paid', dueDate: '2026-02-28', paidDate: '2026-02-26' },
  { id: '5', billNo: 'BILL-2026-01-005', period: '2026年1月', companyName: '示例科技公司', insurancePlan: '补充医疗保险', employeeCount: 12, totalAmount: 24000, paidAmount: 24000, status: 'paid', dueDate: '2026-01-31', paidDate: '2026-01-25' },
];

export const seedAnnouncements: Announcement[] = [
  { id: '1', title: '2026年度员工健康体检预约通知', content: '公司将于4-6月份组织年度员工体检，本次体检新增肿瘤筛查项目，请各部门同事提前在系统内预约体检时间，预约截止日期为4月30日。体检当天请携带身份证空腹前往。', type: 'notice', targetScope: '全体员工', publishTime: '2026-04-01 09:00', publisher: '人事部-刘芳', status: 'published', readCount: 1156, viewCount: 1240 },
  { id: '2', title: '端午节福利礼包领取公告', content: '端午佳节将至，公司为全体员工准备了节日礼品大礼包，包含粽子礼盒、坚果礼盒和水果礼券。请各部门于6月5日前到前台领取，领取时需签字确认。', type: 'activity', targetScope: '全体员工', publishTime: '2026-04-08 14:30', publisher: '福利运营-张三', status: 'published', readCount: 1180, viewCount: 1205 },
  { id: '3', title: '商业补充医疗保险升级说明', content: '为更好地保障员工健康，公司决定自6月1日起升级商业补充医疗保险计划。新计划增加了门诊报销比例（从60%提升至80%），同时新增牙科保健福利。详情请见附件。', type: 'policy', targetScope: '全体员工', publishTime: '2026-04-05 10:00', publisher: '福利运营-李四', status: 'published', readCount: 892, viewCount: 980 },
  { id: '4', title: '积分商城春季新品上架', content: '积分商城春季新品已上架！本次新品包括：华为智能手环、小米空气净化器、颈椎按摩仪、健康体检套餐等。会员积分可抵用部分金额，优惠多多，先到先得！', type: 'activity', targetScope: '全体员工', publishTime: '2026-04-10 16:00', publisher: '福利运营-张三', status: 'published', readCount: 756, viewCount: 820 },
  { id: '5', title: '员工生日会活动通知（4月场）', content: '本月员工生日会将于4月25日下午3点在多功能厅举行，届时将为4月生日的同事送上祝福和精美礼品。邀请各部门同事积极参与，共同庆祝！', type: 'activity', targetScope: '全体员工', publishTime: '2026-04-12 11:00', publisher: '企业文化部-王五', status: 'published', readCount: 645, viewCount: 720 },
  { id: '6', title: '2026年高温补贴发放标准', content: '根据政府相关规定，公司将于6-9月为员工发放高温补贴。室外作业人员补贴标准为每月300元，室内人员为每月150元。补贴将与当月工资一并发放。', type: 'policy', targetScope: '全体员工', publishTime: '2026-04-15 09:00', publisher: '人事部-刘芳', status: 'published', readCount: 520, viewCount: 580 },
  { id: '7', title: '员工下午茶福利升级公告', content: '为提升员工福利体验，自下周起公司下午茶福利升级，由原来每周两次增加为每周三次。周一、周三、周五下午3点准时供应，欢迎大家享用！', type: 'activity', targetScope: '全体员工', publishTime: '2026-04-18 14:00', publisher: '行政部-赵六', status: 'published', readCount: 890, viewCount: 960 },
  { id: '8', title: '五一小长假安全须知', content: '五一假期将至，请各部门做好安全检查。假期期间公司将对办公区域进行断电处理。如有紧急事务需要处理，请提前与行政部联系。祝你假期愉快！', type: 'notice', targetScope: '全体员工', publishTime: '2026-04-20 11:00', publisher: '行政部-赵六', status: 'scheduled', readCount: 0, viewCount: 0 },
  { id: '9', title: '中秋节福利方案征集', content: '为更好地了解员工需求，现征集中秋节福利方案建议。欢迎大家踊跃投票，选择您心仪的福利组合。投票截止日期为5月15日。', type: 'activity', targetScope: '全体员工', publishTime: '2026-04-22 10:00', publisher: '福利运营-张三', status: 'draft', readCount: 0, viewCount: 0 },
  { id: '10', title: '年中奖金发放时间预告', content: '根据公司2026年度奖金制度，年中奖金将于7月15日随当月工资一同发放。请各位同事注意查收，如有疑问可咨询财务部。', type: 'notice', targetScope: '全体员工', publishTime: '2026-04-25 09:00', publisher: '财务部-赵敏', status: 'draft', readCount: 0, viewCount: 0 },
];

export const seedBanners: BannerItem[] = [
  { id: '1', imageUrl: 'https://picsum.photos/750/320?random=1', linkUrl: 'https://example.com/1' },
  { id: '2', imageUrl: 'https://picsum.photos/750/320?random=2', linkUrl: 'https://example.com/2' },
];

export const seedModules: ModuleOption[] = [
  { key: 'insurance', label: '保险模块', enabled: true },
  { key: 'medical', label: '体检模块', enabled: true },
  { key: 'points', label: '积分模块', enabled: true },
  { key: 'birthday', label: '生日祝福', enabled: true },
  { key: 'anniversary', label: '司龄祝福', enabled: false },
  { key: 'gift', label: '年节福利', enabled: true },
];

export const seedMessages: Message[] = [
  { id: '1', type: 'system', title: '系统升级通知', content: '福利平台将于4月20日凌晨2:00-6:00进行系统升级，届时部分功能将暂停使用。', createTime: '2026-04-15 10:00', isRead: false, relatedLink: '/system/notice/1' },
  { id: '2', type: 'welfare', title: '您的积分已到账', content: '恭喜！您获得了1000积分，来源：春节福利发放。积分有效期至2026年12月31日。', createTime: '2026-04-14 09:30', isRead: false, relatedLink: '/points/detail' },
  { id: '3', type: 'activity', title: '员工健康讲座邀请', content: '公司将于4月25日14:00举办"职场健康"主题讲座，报名截止4月22日，点击查看详情。', createTime: '2026-04-13 16:00', isRead: true, relatedLink: '/activity/123' },
  { id: '4', type: 'reminder', title: '保险理赔待处理', content: '您有一笔保险理赔申请（单号：CL-2026-0412-001）待补充材料，请尽快处理。', createTime: '2026-04-12 11:00', isRead: true, relatedLink: '/claim/123' },
  { id: '5', type: 'system', title: '账号安全提醒', content: '检测到您的账号在异地登录，如非本人操作，请及时修改密码。', createTime: '2026-04-11 20:00', isRead: true },
  { id: '6', type: 'welfare', title: '端午节礼品领取提醒', content: '您的端午礼品已准备就绪，请于6月5日前到HR部门领取。', createTime: '2026-04-10 10:00', isRead: true, relatedLink: '/gift/dragon-boat' },
  { id: '7', type: 'activity', title: '生日祝福', content: '祝您生日快乐！本月寿星们将于周五下午参加集体生日会，期待您的参与！', createTime: '2026-04-08 08:00', isRead: true },
  { id: '8', type: 'reminder', title: '体检报告可查询', content: '您的2026年度体检报告已生成，可点击查看详细报告内容。', createTime: '2026-04-05 14:00', isRead: true, relatedLink: '/medical/report/2026' },
];

export const seedRoles: Role[] = [
  { id: '1', name: '超级管理员', description: '拥有系统所有权限，可进行系统配置和管理', userCount: 2, permissions: ['*'], createTime: '2026-01-01', status: 'active' },
  { id: '2', name: 'HR管理员', description: '负责人事档案管理、员工福利管理等核心业务操作', userCount: 5, permissions: ['p1', 'p2', 'p3', 'p4', 'p7', 'p9'], createTime: '2026-01-08', status: 'active' },
  { id: '3', name: '财务管理员', description: '负责账单管理、发票处理、财务报表查看', userCount: 3, permissions: ['p7', 'p8'], createTime: '2026-01-15', status: 'active' },
  { id: '4', name: '运营专员', description: '负责福利方案配置、活动发布、积分管理等日常运营工作', userCount: 8, permissions: ['p3', 'p4', 'p5', 'p6', 'p9', 'p10'], createTime: '2026-02-01', status: 'active' },
  { id: '5', name: '部门主管', description: '查看本部门员工信息、审批员工申请、查看部门报表', userCount: 20, permissions: ['p2', 'p11'], createTime: '2026-02-10', status: 'active' },
  { id: '6', name: '普通员工', description: '查看个人福利信息、使用积分商城、参与活动报名', userCount: 22, permissions: ['p2', 'p6', 'p10'], createTime: '2026-02-15', status: 'active' },
];

export const seedPermissions: Permission[] = [
  { id: 'p1', name: '员工档案管理', category: '员工管理', description: '查看、编辑、添加、删除员工档案' },
  { id: 'p2', name: '员工信息查看', category: '员工管理', description: '仅查看员工基本信息' },
  { id: 'p3', name: '福利方案配置', category: '福利管理', description: '配置和管理企业福利方案' },
  { id: 'p4', name: '福利方案查看', category: '福利管理', description: '仅查看福利方案配置' },
  { id: 'p5', name: '积分管理', category: '积分管理', description: '进行积分发放、扣除、查询等操作' },
  { id: 'p6', name: '积分查看', category: '积分管理', description: '仅查看积分余额和明细' },
  { id: 'p7', name: '账单管理', category: '财务管理', description: '查看账单、发起支付、下载发票' },
  { id: 'p8', name: '账单查看', category: '财务管理', description: '仅查看账单信息' },
  { id: 'p9', name: '公告发布', category: '运营管理', description: '创建、编辑、发布企业公告' },
  { id: 'p10', name: '公告查看', category: '运营管理', description: '仅查看公告列表' },
  { id: 'p11', name: '审批管理', category: '审批流程', description: '处理各类审批申请' },
  { id: 'p12', name: '系统设置', category: '系统管理', description: '修改系统配置、管理接口设置' },
];

export const seedOperationLogs: OperationLog[] = [
  { id: '1', action: '登录系统', module: '系统', operator: 'admin', operatorRole: '超级管理员', ip: '192.168.1.100', status: 'success', detail: '用户成功登录系统', createTime: '2026-04-15 09:30:25', duration: 0 },
  { id: '2', action: '发放积分', module: '积分管理', operator: 'hr_001', operatorRole: 'HR管理员', ip: '192.168.1.101', status: 'success', detail: '为研发部8名员工发放春节福利积分，人均1000分', createTime: '2026-04-15 10:15:30', duration: 1250 },
  { id: '3', action: '编辑员工档案', module: '员工管理', operator: 'hr_002', operatorRole: 'HR管理员', ip: '192.168.1.102', status: 'success', detail: '修改员工 EMP001 的部门信息：研发部 → 市场部', createTime: '2026-04-15 11:20:10', duration: 580 },
  { id: '4', action: '配置保险方案', module: '福利管理', operator: 'hr_001', operatorRole: 'HR管理员', ip: '192.168.1.101', status: 'success', detail: '修改企业版套餐的赔付比例，从80%调整至85%', createTime: '2026-04-15 14:05:45', duration: 3200 },
  { id: '5', action: '批量导入员工', module: '员工管理', operator: 'hr_003', operatorRole: '运营专员', ip: '192.168.1.103', status: 'failed', detail: '导入失败：第15行数据格式错误，手机号格式不正确', createTime: '2026-04-15 15:30:00', duration: 5600 },
  { id: '6', action: '发布公告', module: '运营管理', operator: 'hr_004', operatorRole: '运营专员', ip: '192.168.1.104', status: 'success', detail: '发布公告"端午节福利礼包领取公告"，目标：全体员工', createTime: '2026-04-14 09:00:15', duration: 890 },
  { id: '7', action: '账单支付', module: '财务管理', operator: 'finance_001', operatorRole: '财务管理员', ip: '192.168.1.105', status: 'success', detail: '支付2026年3月账单，金额 ¥47,480', createTime: '2026-04-14 16:30:00', duration: 12000 },
  { id: '8', action: '删除角色', module: '权限管理', operator: 'admin', operatorRole: '超级管理员', ip: '192.168.1.100', status: 'failed', detail: '删除失败：无法删除系统内置角色"超级管理员"', createTime: '2026-04-13 11:15:00', duration: 150 },
  { id: '9', action: '修改密码', module: '系统', operator: 'emp_123', operatorRole: '普通员工', ip: '192.168.1.120', status: 'success', detail: '用户自主修改登录密码', createTime: '2026-04-13 14:20:30', duration: 320 },
  { id: '10', action: '积分兑换', module: '积分管理', operator: 'emp_456', operatorRole: '普通员工', ip: '192.168.1.125', status: 'success', detail: '兑换商品：颈椎按摩仪，消耗积分 500分', createTime: '2026-04-12 18:45:00', duration: 2100 },
];
