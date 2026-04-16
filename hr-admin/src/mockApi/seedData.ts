import type {
  Employee,
  Department,
  InsurancePlan,
  InsuranceProgressRecord,
  InsuredPerson,
  InsuranceOperationRecord,
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

export const seedEmployees: Employee[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', position: '高级前端工程师', gender: '男', phone: '138****8001', email: 'zhangwei@company.com', idCard: '110***********2345', status: 'active', activationStatus: true, entryDate: '2021-05-10', birthday: '1995-08-15', education: '本科', graduateSchool: '北京大学' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', position: '市场经理', gender: '女', phone: '139****8002', email: 'lina@company.com', idCard: '120***********6789', status: 'active', activationStatus: true, entryDate: '2022-03-15', birthday: '1992-06-20', education: '硕士', graduateSchool: '清华大学' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', position: '销售主管', gender: '男', phone: '137****8003', email: 'wangqiang@company.com', idCard: '130***********3456', status: 'active', activationStatus: false, entryDate: '2020-08-20', birthday: '1990-12-05', education: '本科', graduateSchool: '复旦大学' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', position: 'HR专员', gender: '女', phone: '136****8004', email: 'liufang@company.com', idCard: '140***********7890', status: 'inactive', activationStatus: false, entryDate: '2019-12-01', birthday: '1994-03-18', education: '本科', graduateSchool: '中国人民大学' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', position: 'Java开发工程师', gender: '男', phone: '135****8005', email: 'chenming@company.com', idCard: '150***********1234', status: 'active', activationStatus: true, entryDate: '2023-01-08', birthday: '1996-09-10', education: '本科', graduateSchool: '浙江大学' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', position: '财务会计', gender: '女', phone: '134****8006', email: 'zhaomin@company.com', idCard: '160***********5678', status: 'active', activationStatus: true, entryDate: '2022-06-20', birthday: '1993-11-25', education: '本科', graduateSchool: '上海交通大学' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '运维部', position: '运维工程师', gender: '男', phone: '133****8007', email: 'sunhao@company.com', idCard: '170***********9012', status: 'inactive', activationStatus: false, entryDate: '2021-11-15', birthday: '1991-07-30', education: '本科', graduateSchool: '南京大学' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '产品部', position: '产品经理', gender: '女', phone: '132****8008', email: 'zhouting@company.com', idCard: '180***********3456', status: 'active', activationStatus: true, entryDate: '2023-02-28', birthday: '1997-02-14', education: '硕士', graduateSchool: '中国科学技术大学' },
];

export const seedDepartments: Department[] = [
  {
    id: '1',
    name: '总公司',
    parentId: null,
    manager: '刘总',
    managerPhone: '138****0001',
    employeeCount: 256,
    createTime: '2018-01-01',
    children: [
      {
        id: '1-1',
        name: '研发部',
        parentId: '1',
        manager: '张伟',
        managerPhone: '138****8001',
        employeeCount: 45,
        createTime: '2018-03-15',
        children: [
          { id: '1-1-1', name: '前端组', parentId: '1-1', manager: '王前端', managerPhone: '138****9001', employeeCount: 15, createTime: '2019-01-15' },
          { id: '1-1-2', name: '后端组', parentId: '1-1', manager: '李后端', managerPhone: '138****9002', employeeCount: 18, createTime: '2019-01-15' },
          { id: '1-1-3', name: '测试组', parentId: '1-1', manager: '赵测试', managerPhone: '138****9003', employeeCount: 8, createTime: '2019-03-20' },
        ],
      },
      {
        id: '1-2',
        name: '市场部',
        parentId: '1',
        manager: '李娜',
        managerPhone: '139****8002',
        employeeCount: 32,
        createTime: '2018-05-20',
        children: [
          { id: '1-2-1', name: '品牌组', parentId: '1-2', manager: '孙品牌', managerPhone: '139****9001', employeeCount: 12, createTime: '2020-02-10' },
          { id: '1-2-2', name: '活动组', parentId: '1-2', manager: '周活动', managerPhone: '139****9002', employeeCount: 10, createTime: '2020-02-10' },
        ],
      },
      { id: '1-3', name: '销售部', parentId: '1', manager: '王强', managerPhone: '137****8003', employeeCount: 58, createTime: '2018-06-10' },
      { id: '1-4', name: '人事部', parentId: '1', manager: '刘芳', managerPhone: '136****8004', employeeCount: 12, createTime: '2018-07-01' },
      { id: '1-5', name: '财务部', parentId: '1', manager: '赵敏', managerPhone: '134****8006', employeeCount: 15, createTime: '2018-08-15' },
    ],
  },
];

export const seedInsurancePlans: InsurancePlan[] = [
  {
    id: '1',
    name: '补充医疗保险',
    policyNo: 'PA2024001234',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    payRule: '年付费',
    scope: '全体正式员工',
    coreBenefits: ['门急诊报销 (免赔额500，赔付比例80%)', '住院医疗 (免赔额0，赔付比例90%)'],
    price: 120000,
    priceUnit: '年',
    employeeCount: 1200,
    dependentCount: 320,
    status: 'active',
  },
  {
    id: '2',
    name: '团体意外险',
    policyNo: 'CP2024005678',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    payRule: '年付费',
    scope: '全体在职员工',
    coreBenefits: ['意外身故/伤残 (保额50万)', '意外医疗 (免赔额100，赔付比例100%)', '住院津贴 (200元/天)'],
    price: 48000,
    priceUnit: '年',
    employeeCount: 1200,
    dependentCount: 0,
    status: 'active',
  },
  {
    id: '3',
    name: '重大疾病险',
    policyNo: 'CL2023009876',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    payRule: '年付费',
    scope: '全体正式员工',
    coreBenefits: ['重大疾病 (保额30万，覆盖120种重疾)', '轻症疾病 (保额9万，覆盖40种轻症)'],
    price: 96000,
    priceUnit: '年',
    employeeCount: 1180,
    dependentCount: 280,
    status: 'expired',
  },
  {
    id: '4',
    name: '门诊补充险',
    policyNo: 'MZ2024009999',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    payRule: '月付费',
    scope: '全体正式员工',
    coreBenefits: ['普通门诊报销 (免赔额0，赔付比例70%)', '急诊报销 (免赔额0，赔付比例80%)'],
    price: 8500,
    priceUnit: '月',
    employeeCount: 560,
    dependentCount: 120,
    status: 'active',
  },
];

export const seedInsuranceProgress: InsuranceProgressRecord[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'insured', submitDate: '2024-01-15', effectiveDate: '2024-02-01', progress: 100, remark: '已生效' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'underwriting', submitDate: '2024-02-20', effectiveDate: '-', progress: 75, remark: '保险公司审核中' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', insurancePlan: '团体意外险', insuranceType: '意外', status: 'submitting', submitDate: '2024-02-25', effectiveDate: '-', progress: 40, remark: '等待员工确认' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'pending', submitDate: '-', effectiveDate: '-', progress: 10, remark: '待提交投保资料' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', insurancePlan: '重大疾病险', insuranceType: '重疾', status: 'rejected', submitDate: '2024-01-20', effectiveDate: '-', progress: 60, remark: '既往病史不符合承保条件' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'insured', submitDate: '2024-01-18', effectiveDate: '2024-02-01', progress: 100, remark: '已生效' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '运维部', insurancePlan: '团体意外险', insuranceType: '意外', status: 'underwriting', submitDate: '2024-02-22', effectiveDate: '-', progress: 80, remark: '等待保单生成' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '产品部', insurancePlan: '补充医疗保险', insuranceType: '医疗', status: 'pending', submitDate: '-', effectiveDate: '-', progress: 5, remark: '待填写投保信息' },
];

export const seedMedicalPlans: MedicalPlan[] = [
  { id: '1', name: '2024年度全面体检', year: 2024, company: '美年大健康', deadline: '2024-06-30', totalCount: 1200, appointedCount: 960, checkedCount: 780, status: 'ongoing' },
  { id: '2', name: '2024年度专项体检', year: 2024, company: '爱康国宾', deadline: '2024-08-15', totalCount: 300, appointedCount: 150, checkedCount: 80, status: 'ongoing' },
];

export const seedMedicalRecords: MedicalRecord[] = [
  { id: '1', name: '张伟', employeeName: 'EMP001', department: '研发部', company: '美年大健康', appointmentDate: '2024-05-20', appointmentTime: '14:00', status: 'appointed' },
  { id: '2', name: '李娜', employeeName: 'EMP002', department: '市场部', company: '美年大健康', appointmentDate: '2024-05-18', appointmentTime: '09:00', status: 'checked' },
  { id: '3', name: '王强', employeeName: 'EMP003', department: '销售部', company: '美年大健康', appointmentDate: '2024-05-25', appointmentTime: '10:00', status: 'pending' },
  { id: '4', name: '刘芳', employeeName: 'EMP004', department: '人事部', company: '美年大健康', appointmentDate: '2024-05-15', appointmentTime: '15:00', status: 'cancelled' },
];

export const seedEmployeePoints: EmployeePoints[] = [
  { id: '1', name: '张伟', empNo: 'EMP001', department: '研发部', balance: 2560, totalIncome: 5200, totalExpense: 2640, lastGrantDate: '2024-04-01' },
  { id: '2', name: '李娜', empNo: 'EMP002', department: '市场部', balance: 3800, totalIncome: 6000, totalExpense: 2200, lastGrantDate: '2024-04-01' },
  { id: '3', name: '王强', empNo: 'EMP003', department: '销售部', balance: 1200, totalIncome: 4000, totalExpense: 2800, lastGrantDate: '2024-03-01' },
  { id: '4', name: '刘芳', empNo: 'EMP004', department: '人事部', balance: 4500, totalIncome: 7200, totalExpense: 2700, lastGrantDate: '2024-04-01' },
  { id: '5', name: '陈明', empNo: 'EMP005', department: '研发部', balance: 1800, totalIncome: 3600, totalExpense: 1800, lastGrantDate: '2024-02-01' },
];

export const seedPointsRecords: PointsRecord[] = [
  { id: '1', name: '张伟', empNo: 'EMP001', buttonType: 'grant', points: 1000, reason: '春节福利-2024', operator: '系统', createTime: '2024-02-10 10:00' },
  { id: '2', name: '李娜', empNo: 'EMP002', buttonType: 'deduct', points: -500, reason: '积分商城-颈椎按摩仪', operator: '系统', createTime: '2024-03-15 14:30' },
  { id: '3', name: '王强', empNo: 'EMP003', buttonType: 'grant', points: 200, reason: '月度绩效奖励', operator: '管理员', createTime: '2024-04-01 09:00' },
  { id: '4', name: '刘芳', empNo: 'EMP004', buttonType: 'expire', points: -200, reason: '2023年积分到期清零', operator: '系统', createTime: '2024-01-01 00:00' },
  { id: '5', name: '陈明', empNo: 'EMP005', buttonType: 'grant', points: 800, reason: '中秋福利-2023', operator: '系统', createTime: '2023-09-28 10:00' },
];

export const seedBirthdayEmployees: BirthdayEmployee[] = [
  { id: '1', name: '张伟', department: '研发部', birthday: '05-15', daysLeft: 2, sendStatus: 'pending' },
  { id: '2', name: '李娜', department: '市场部', birthday: '05-18', daysLeft: 5, sendStatus: 'pending' },
  { id: '3', name: '王强', department: '销售部', birthday: '05-20', daysLeft: 7, sendStatus: 'sent' },
  { id: '4', name: '刘芳', department: '人事部', birthday: '05-22', daysLeft: 9, sendStatus: 'not_sent' },
];

export const seedAnniversaryEmployees: AnniversaryEmployee[] = [
  { id: '1', name: '陈明', department: '研发部', entryDate: '2020-05-10', years: 4, sendStatus: 'pending' },
  { id: '2', name: '赵敏', department: '财务部', entryDate: '2021-05-15', years: 3, sendStatus: 'pending' },
  { id: '3', name: '孙浩', department: '运维部', entryDate: '2019-05-20', years: 5, sendStatus: 'sent' },
];

export const seedRecognitionCards: RecognitionCard[] = [
  { id: '1', from: '张伟', to: '李娜', content: '感谢你在项目中的出色表现！', type: '感谢', createTime: '2024-05-10 14:30' },
  { id: '2', from: '王强', to: '陈明', content: '技术能力强，帮助团队解决了很多问题', type: '认可', createTime: '2024-05-09 10:00' },
  { id: '3', from: '刘芳', to: '赵敏', content: '财务工作认真负责，值得学习', type: '感谢', createTime: '2024-05-08 16:20' },
];

export const seedBills: Bill[] = [
  { id: '1', billNo: 'BILL-2024-04-001', period: '2024年4月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1205, totalAmount: 486000, paidAmount: 486000, status: 'paid', dueDate: '2024-04-30', paidDate: '2024-04-25' },
  { id: '2', billNo: 'BILL-2024-04-002', period: '2024年4月', companyName: '示例科技公司', insurancePlan: '企业版套餐', employeeCount: 320, totalAmount: 256000, paidAmount: 256000, status: 'paid', dueDate: '2024-04-30', paidDate: '2024-04-28' },
  { id: '3', billNo: 'BILL-2024-03-003', period: '2024年3月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1187, totalAmount: 474800, paidAmount: 474800, status: 'paid', dueDate: '2024-03-31', paidDate: '2024-03-28' },
  { id: '4', billNo: 'BILL-2024-02-004', period: '2024年2月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1150, totalAmount: 460000, paidAmount: 0, status: 'overdue', dueDate: '2024-02-29' },
  { id: '5', billNo: 'BILL-2024-01-005', period: '2024年1月', companyName: '示例科技公司', insurancePlan: '基础版套餐', employeeCount: 1100, totalAmount: 440000, paidAmount: 440000, status: 'paid', dueDate: '2024-01-31', paidDate: '2024-01-25' },
];

export const seedAnnouncements: Announcement[] = [
  { id: '1', title: '2024年度员工体检通知', content: '公司将于5月份组织年度员工体检，请各部门同事提前安排好工作...', type: 'notice', targetScope: '全体员工', publishTime: '2024-04-15 09:00', publisher: '人事部', status: 'published', readCount: 1156, viewCount: 1205 },
  { id: '2', title: '端午节福利发放公告', content: '端午佳节将至，公司为全体员工准备了节日礼品，请各部门于6月10日前领取...', type: 'activity', targetScope: '全体员工', publishTime: '2024-04-10 14:30', publisher: '福利运营', status: 'published', readCount: 1203, viewCount: 1205 },
  { id: '3', title: '商业保险理赔流程优化说明', content: '为提升员工体验，公司对商业保险理赔流程进行了优化调整...', type: 'policy', targetScope: '全体员工', publishTime: '2024-04-08 10:00', publisher: '福利运营', status: 'published', readCount: 892, viewCount: 980 },
  { id: '4', title: '积分商城新品上架通知', content: '积分商城新增多款健康类产品，包括智能手环、按摩仪等...', type: 'activity', targetScope: '全体员工', publishTime: '2024-04-05 16:00', publisher: '福利运营', status: 'draft', readCount: 0, viewCount: 0 },
  { id: '5', title: '五一小长假值班安排', content: '五一假期期间，公司将安排人员值班以处理紧急事务...', type: 'notice', targetScope: '管理层', publishTime: '2024-04-20 11:00', publisher: '行政部', status: 'scheduled', readCount: 0, viewCount: 0 },
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
  { id: '1', type: 'system', title: '系统升级通知', content: '福利平台将于4月20日凌晨2:00-6:00进行系统升级，届时部分功能将暂停使用。', createTime: '2024-04-15 10:00', isRead: false, relatedLink: '/system/notice/1' },
  { id: '2', type: 'welfare', title: '您的积分已到账', content: '恭喜！您获得了1000积分，来源：春节福利发放。积分有效期至2024年12月31日。', createTime: '2024-04-14 09:30', isRead: false, relatedLink: '/points/detail' },
  { id: '3', type: 'activity', title: '员工健康讲座邀请', content: '公司将于4月25日14:00举办"职场健康"主题讲座，报名截止4月22日，点击查看详情。', createTime: '2024-04-13 16:00', isRead: true, relatedLink: '/activity/123' },
  { id: '4', type: 'reminder', title: '保险理赔待处理', content: '您有一笔保险理赔申请（单号：CL-2024-0412-001）待补充材料，请尽快处理。', createTime: '2024-04-12 11:00', isRead: true, relatedLink: '/claim/123' },
  { id: '5', type: 'system', title: '账号安全提醒', content: '检测到您的账号在异地登录，如非本人操作，请及时修改密码。', createTime: '2024-04-11 20:00', isRead: true },
  { id: '6', type: 'welfare', title: '端午节礼品领取提醒', content: '您的端午礼品已准备就绪，请于6月5日前到HR部门领取。', createTime: '2024-04-10 10:00', isRead: true, relatedLink: '/gift/ DragonBoat' },
  { id: '7', type: 'activity', title: '生日祝福', content: '祝您生日快乐！本月寿星们将于周五下午参加集体生日会，期待您的参与！', createTime: '2024-04-08 08:00', isRead: true },
  { id: '8', type: 'reminder', title: '体检报告可查询', content: '您的2024年度体检报告已生成，可点击查看详细报告内容。', createTime: '2024-04-05 14:00', isRead: true, relatedLink: '/medical/report/2024' },
];

export const seedRoles: Role[] = [
  { id: '1', name: '超级管理员', description: '拥有系统所有权限，可进行系统配置和管理', userCount: 2, permissions: ['*'], createTime: '2023-01-01' },
  { id: '2', name: 'HR管理员', description: '负责人事档案管理、员工福利管理等核心业务操作', userCount: 5, permissions: ['employee:*', 'welfare:*', 'bill:view', 'announcement:*'], createTime: '2023-03-15' },
  { id: '3', name: '财务管理员', description: '负责账单管理、发票处理、财务报表查看', userCount: 3, permissions: ['bill:*', 'report:financial'], createTime: '2023-04-20' },
  { id: '4', name: '运营专员', description: '负责福利方案配置、活动发布、积分管理等日常运营工作', userCount: 8, permissions: ['welfare:view', 'welfare:edit', 'points:*', 'announcement:*'], createTime: '2023-06-01' },
  { id: '5', name: '部门主管', description: '查看本部门员工信息、审批员工申请、查看部门报表', userCount: 25, permissions: ['employee:view:dept', 'approval:*', 'report:dept'], createTime: '2023-08-10' },
  { id: '6', name: '普通员工', description: '查看个人福利信息、使用积分商城、参与活动报名', userCount: 1162, permissions: ['profile:view', 'profile:edit', 'points:view', 'activity:join'], createTime: '2023-09-01' },
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
  { id: '1', action: '登录系统', module: '系统', operator: 'admin', operatorRole: '超级管理员', ip: '192.168.1.100', status: 'success', detail: '用户成功登录系统', createTime: '2024-04-15 09:30:25', duration: 0 },
  { id: '2', action: '发放积分', module: '积分管理', operator: 'hr_001', operatorRole: 'HR管理员', ip: '192.168.1.101', status: 'success', detail: '为研发部50名员工发放春节福利积分，人均1000分', createTime: '2024-04-15 10:15:30', duration: 1250 },
  { id: '3', action: '编辑员工档案', module: '员工管理', operator: 'hr_002', operatorRole: 'HR管理员', ip: '192.168.1.102', status: 'success', detail: '修改员工 EMP001 的部门信息：研发部 → 市场部', createTime: '2024-04-15 11:20:10', duration: 580 },
  { id: '4', action: '配置保险方案', module: '福利管理', operator: 'hr_001', operatorRole: 'HR管理员', ip: '192.168.1.101', status: 'success', detail: '修改企业版套餐的赔付比例，从80%调整至85%', createTime: '2024-04-15 14:05:45', duration: 3200 },
  { id: '5', action: '批量导入员工', module: '员工管理', operator: 'hr_003', operatorRole: '运营专员', ip: '192.168.1.103', status: 'failed', detail: '导入失败：第15行数据格式错误，手机号格式不正确', createTime: '2024-04-15 15:30:00', duration: 5600 },
  { id: '6', action: '发布公告', module: '运营管理', operator: 'hr_004', operatorRole: '运营专员', ip: '192.168.1.104', status: 'success', detail: '发布公告"端午节福利发放公告"，目标：全体员工', createTime: '2024-04-14 09:00:15', duration: 890 },
  { id: '7', action: '账单支付', module: '财务管理', operator: 'finance_001', operatorRole: '财务管理员', ip: '192.168.1.105', status: 'success', detail: '支付2024年3月账单，金额 ¥486,000', createTime: '2024-04-14 16:30:00', duration: 12000 },
  { id: '8', action: '删除角色', module: '权限管理', operator: 'admin', operatorRole: '超级管理员', ip: '192.168.1.100', status: 'failed', detail: '删除失败：无法删除系统内置角色"超级管理员"', createTime: '2024-04-13 11:15:00', duration: 150 },
  { id: '9', action: '修改密码', module: '系统', operator: 'emp_123', operatorRole: '普通员工', ip: '192.168.1.120', status: 'success', detail: '用户自主修改登录密码', createTime: '2024-04-13 14:20:30', duration: 320 },
  { id: '10', action: '积分兑换', module: '积分管理', operator: 'emp_456', operatorRole: '普通员工', ip: '192.168.1.125', status: 'success', detail: '兑换商品：颈椎按摩仪，消耗积分 500分', createTime: '2024-04-12 18:45:00', duration: 2100 },
];
