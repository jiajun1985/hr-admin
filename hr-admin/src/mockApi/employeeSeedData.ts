import type { Employee } from './types';

const baseEmployees: Employee[] = [
  { id: '1', empNo: 'EMP001', name: '张伟', department: '研发部', position: '技术总监', gender: '男', phone: '138****8001', email: 'zhangwei@company.com', idType: '身份证', idCard: '110***********2345', birthday: '1995-08-15', education: '本科', graduateSchool: '北京大学', status: 'active', activationStatus: true, entryDate: '2026-01-05' },
  { id: '2', empNo: 'EMP002', name: '李娜', department: '市场部', position: '市场总监', gender: '女', phone: '139****8002', email: 'lina@company.com', idType: '身份证', idCard: '120***********6789', birthday: '1992-06-20', education: '硕士', graduateSchool: '清华大学', status: 'active', activationStatus: true, entryDate: '2026-01-12' },
  { id: '3', empNo: 'EMP003', name: '王强', department: '销售部', position: '销售总监', gender: '男', phone: '137****8003', email: 'wangqiang@company.com', idType: '身份证', idCard: '130***********3456', birthday: '1990-12-05', education: '本科', graduateSchool: '复旦大学', status: 'active', activationStatus: true, entryDate: '2026-01-20' },
  { id: '4', empNo: 'EMP004', name: '刘芳', department: '人事部', position: '人事总监', gender: '女', phone: '136****8004', email: 'liufang@company.com', idType: '身份证', idCard: '140***********7890', birthday: '1994-03-18', education: '本科', graduateSchool: '中国人民大学', status: 'active', activationStatus: true, entryDate: '2026-02-03' },
  { id: '5', empNo: 'EMP005', name: '陈明', department: '研发部', position: '高级前端工程师', gender: '男', phone: '135****8005', email: 'chenming@company.com', idType: '身份证', idCard: '150***********1234', birthday: '1996-09-10', education: '本科', graduateSchool: '浙江大学', status: 'active', activationStatus: true, entryDate: '2026-02-11' },
  { id: '6', empNo: 'EMP006', name: '赵敏', department: '财务部', position: '财务总监', gender: '女', phone: '134****8006', email: 'zhaomin@company.com', idType: '身份证', idCard: '160***********5678', birthday: '1993-11-25', education: '本科', graduateSchool: '上海交通大学', status: 'active', activationStatus: true, entryDate: '2026-02-18' },
  { id: '7', empNo: 'EMP007', name: '孙浩', department: '研发部', position: '运维主管', gender: '男', phone: '133****8007', email: 'sunhao@company.com', idType: '身份证', idCard: '170***********9012', birthday: '1991-07-30', education: '本科', graduateSchool: '南京大学', status: 'active', activationStatus: true, entryDate: '2026-03-02' },
  { id: '8', empNo: 'EMP008', name: '周婷', department: '研发部', position: '产品总监', gender: '女', phone: '132****8008', email: 'zhouting@company.com', idType: '身份证', idCard: '180***********3456', birthday: '1997-02-14', education: '硕士', graduateSchool: '中国科学技术大学', status: 'active', activationStatus: true, entryDate: '2026-03-09' },
  { id: '9', empNo: 'EMP009', name: '吴昊', department: '研发部', position: 'Java开发工程师', gender: '男', phone: '131****8009', idType: '护照', idCard: 'P1234****890', status: 'active', activationStatus: true, entryDate: '2026-03-16' },
  { id: '10', empNo: 'EMP010', name: '郑丽', department: '市场部', position: '品牌经理', gender: '女', phone: '130****8010', idType: '身份证', idCard: '190***********1122', status: 'active', activationStatus: true, entryDate: '2026-03-23' },
  { id: '11', empNo: 'EMP011', name: '马超', department: '销售部', position: '销售经理', gender: '男', phone: '129****8011', idType: '身份证', idCard: '200***********3344', status: 'active', activationStatus: true, entryDate: '2026-03-30' },
  { id: '12', empNo: 'EMP012', name: '林静', department: '人事部', position: 'HR专员', gender: '女', phone: '128****8012', idType: '身份证', idCard: '210***********5566', status: 'active', activationStatus: true, entryDate: '2026-04-01' },
  { id: '13', empNo: 'EMP013', name: '高峰', department: '财务部', position: '会计主管', gender: '男', phone: '127****8013', idType: '身份证', idCard: '220***********7788', status: 'active', activationStatus: true, entryDate: '2026-04-03' },
  { id: '14', empNo: 'EMP014', name: '杨雪', department: '未分配', position: '运维工程师', gender: '女', phone: '126****8014', idType: '身份证', idCard: '230***********9900', status: 'active', activationStatus: true, entryDate: '2026-04-06' },
  { id: '15', empNo: 'EMP015', name: '黄磊', department: '研发部', position: '产品经理', gender: '男', phone: '125****8015', idType: '身份证', idCard: '240***********1212', status: 'active', activationStatus: true, entryDate: '2026-04-08' },
  { id: '16', empNo: 'EMP016', name: '徐佳', department: '未分配', position: '测试工程师', gender: '女', phone: '124****8016', idType: '身份证', idCard: '250***********3434', status: 'active', activationStatus: true, entryDate: '2026-04-10' },
  { id: '17', empNo: 'EMP017', name: '韩冰', department: '未分配', position: '市场专员', gender: '男', phone: '123****8017', idType: '身份证', idCard: '260***********5656', status: 'active', activationStatus: true, entryDate: '2026-04-13' },
  { id: '18', empNo: 'EMP018', name: '彭涛', department: '未分配', position: '销售代表', gender: '男', phone: '122****8018', idType: '护照', idCard: 'P5678****123', status: 'active', activationStatus: true, entryDate: '2026-04-15' },
  { id: '19', empNo: 'EMP019', name: '蒋琴', department: '未分配', position: '出纳', gender: '女', phone: '121****8019', idType: '身份证', idCard: '270***********7878', status: 'active', activationStatus: true, entryDate: '2026-04-16' },
  { id: '20', empNo: 'EMP020', name: '沈云', department: '研发部', position: 'UI设计师', gender: '女', phone: '120****8020', idType: '身份证', idCard: '280***********9090', status: 'active', activationStatus: true, entryDate: '2026-04-20' },
  { id: '21', empNo: 'EMP021', name: '许刚', department: '研发部', position: '前端工程师', gender: '男', phone: '119****8021', idType: '身份证', idCard: '290***********1010', status: 'inactive', activationStatus: false, entryDate: '2026-02-25', leaveDate: '2026-04-18' },
  { id: '22', empNo: 'EMP022', name: '曹雪', department: '市场部', position: '市场助理', gender: '女', phone: '118****8022', idType: '身份证', idCard: '300***********1212', status: 'inactive', activationStatus: false, entryDate: '2026-03-05', leaveDate: '2026-04-20' },
  { id: '23', empNo: 'EMP023', name: '丁一', department: '销售部', position: '销售代表', gender: '男', phone: '117****8023', idType: '身份证', idCard: '310***********1313', status: 'inactive', activationStatus: false, entryDate: '2026-03-12', leaveDate: '2026-04-21' },
  { id: '24', empNo: 'EMP024', name: '冯媛', department: '人事部', position: '招聘专员', gender: '女', phone: '116****8024', idType: '身份证', idCard: '320***********1414', status: 'active', activationStatus: true, entryDate: '2026-04-22', leaveDate: '' },
];

const departmentPlans = [
  { department: '研发部', count: 14, positions: ['前端工程师', '后端工程师', '测试工程师', '产品经理', '架构师', '技术支持'] },
  { department: '运维组', count: 6, positions: ['运维工程师', 'DevOps工程师', '运维主管'] },
  { department: '产品组', count: 5, positions: ['产品经理', '产品运营', '交互设计师'] },
  { department: '市场部', count: 13, positions: ['市场经理', '品牌经理', '市场专员', '活动策划'] },
  { department: '销售部', count: 13, positions: ['销售经理', '销售代表', '客户经理', '大客户销售'] },
  { department: '人事部', count: 8, positions: ['HRBP', '招聘专员', '薪酬专员', '培训专员'] },
  { department: '财务部', count: 7, positions: ['会计主管', '出纳', '税务专员', '财务分析师'] },
  { department: '未分配', count: 10, positions: ['待分配专员', '项目助理', '实习生'] },
] as const;

const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
const givenNames = ['伟杰', '静雯', '嘉怡', '子轩', '思雨', '俊豪', '晨曦', '雅婷', '浩然', '欣怡'];
const existingNames = new Set(baseEmployees.map((employee) => employee.name));

function formatDateFromOffset(offset: number) {
  const date = new Date(Date.UTC(2026, 0, 1 + offset));
  return date.toISOString().slice(0, 10);
}

function buildNamePool() {
  const pool = surnames.flatMap((surname) => givenNames.map((given) => `${surname}${given}`));
  return pool.filter((name) => !existingNames.has(name));
}

function createGeneratedEmployee(index: number, department: string, position: string, name: string): Employee {
  const phoneTail = String(8100 + index).padStart(4, '0');
  const phonePrefixes = ['138', '139', '137', '136', '135', '134', '133', '132', '131', '130'];
  const phone = `${phonePrefixes[index % phonePrefixes.length]}****${phoneTail}`;
  const idType = index % 7 === 0 ? '护照' : '身份证';
  const idCard = idType === '护照'
    ? `P${String(700000 + index).slice(-6)}****${String(index).padStart(3, '0')}`
    : `110***********${String(1000 + index).padStart(4, '0')}`;
  const entryDate = formatDateFromOffset(index + 1);

  if (index % 11 === 0) {
    return {
      id: String(index),
      empNo: `EMP${String(index).padStart(3, '0')}`,
      name,
      department,
      position,
      gender: index % 2 === 0 ? '女' : '男',
      phone,
      email: `${name}-${index}@company.com`,
      idType,
      idCard,
      birthday: `${1990 + (index % 10)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
      education: index % 3 === 0 ? '硕士' : '本科',
      graduateSchool: index % 4 === 0 ? '浙江大学' : '上海交通大学',
      status: 'inactive',
      activationStatus: false,
      entryDate,
      leaveDate: formatDateFromOffset(index - 3),
    };
  }

  if (index % 6 === 0) {
    return {
      id: String(index),
      empNo: `EMP${String(index).padStart(3, '0')}`,
      name,
      department,
      position,
      gender: index % 2 === 0 ? '女' : '男',
      phone,
      email: `${name}-${index}@company.com`,
      idType,
      idCard,
      birthday: `${1990 + (index % 10)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
      education: index % 2 === 0 ? '本科' : '大专',
      graduateSchool: index % 5 === 0 ? '中山大学' : '南京大学',
      status: 'active',
      activationStatus: true,
      entryDate,
      leaveDate: formatDateFromOffset(120 + index),
    };
  }

  return {
    id: String(index),
    empNo: `EMP${String(index).padStart(3, '0')}`,
    name,
    department,
    position,
    gender: index % 2 === 0 ? '女' : '男',
    phone,
    email: `${name}-${index}@company.com`,
    idType,
    idCard,
    birthday: `${1990 + (index % 10)}-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    education: index % 4 === 0 ? '硕士' : index % 3 === 0 ? '本科' : '大专',
    graduateSchool: index % 5 === 0 ? '北京大学' : index % 2 === 0 ? '复旦大学' : '武汉大学',
    status: 'active',
    activationStatus: true,
    entryDate,
  };
}

function generateEmployees(): Employee[] {
  const namePool = buildNamePool();
  let poolIndex = 0;
  let employeeIndex = 25;
  const generated: Employee[] = [];

  departmentPlans.forEach((plan) => {
    for (let i = 0; i < plan.count; i += 1) {
      const name = namePool[poolIndex] || `员工${employeeIndex}`;
      const position = plan.positions[i % plan.positions.length];
      generated.push(createGeneratedEmployee(employeeIndex, plan.department, position, name));
      poolIndex += 1;
      employeeIndex += 1;
    }
  });

  return generated;
}

export const seedEmployees: Employee[] = [
  ...baseEmployees,
  ...generateEmployees(),
];
