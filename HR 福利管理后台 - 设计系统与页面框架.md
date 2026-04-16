# 员工福利平台 HR 管理后台 - 设计系统与组件架构文档 V1.2

**项目性质**：B端管理后台 | **终端**：仅 PC 端 | **用户**：企业 HR 运营人员  
**设计原则**：信息优先、中高信息密度、弱装饰、高效操作  
**技术栈**：React 19 + TypeScript + Tailwind CSS v4 + SVG Icon 系统  

## 修订记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.2 | 2026-04-16 | 更新部门管理页面详细规范、员工列表部门选项、移除过时Mock API章节、添加数据持久化说明 | AI |
| v1.1 | 2026-04-15 | 根据实际代码实现更新组件规范、导航结构、图标系统、页面实现状态 | AI |
| v1.0 | 2026-01-13 | 初始版本 | - |

---

## 一、设计基础系统 (Design Tokens)

### 1.1 色彩体系

**主色 (Primary - 品质橙)**
```
--primary-50: #FFF7ED;    /* 背景高亮 */
--primary-100: #FFEDD5;   /* Hover 浅背景 */
--primary-200: #FED7AA;   /* 边框强调 */
--primary-500: #F97316;   /* 次级按钮、图表 */
--primary-600: #EA580C;   /* 主按钮、链接、选中态 */
--primary-700: #C2410C;   /* 点击态、重要提醒 */
```

**中性色 (Neutral - 冷灰 Slate)**
```
--gray-0:  #FFFFFF;       /* 纯白 */
--gray-50: #F8FAFC;       /* 页面底色、表头背景 */
--gray-100: #F1F5F9;      /* 卡片背景、Hover 态 */
--gray-200: #E2E8F0;      /* 分割线、边框 */
--gray-300: #CBD5E1;      /* 禁用态、Placeholder */
--gray-400: #94A3B8;      /* 辅助文字、图标默认色 */
--gray-500: #64748B;      /* 次要文字 */
--gray-600: #475569;      /* 正文文字 */
--gray-700: #334155;      /* 小标题 */
--gray-800: #1E293B;      /* 大标题、主文字 */
--gray-900: #0F172A;      /* 最深文字 */
```

**语义色 (低饱和)**
```
--success-50: #F0FDF4;    --success-600: #16A34A;  /* 已激活、已完成 */
--warning-50: #FFFBEB;    --warning-600: #D97706;  /* 待处理、未激活 */
--error-50: #FEF2F2;      --error-600: #DC2626;    /* 离职、错误、删除 */
--info-50: #EFF6FF;       --info-600: #2563EB;     /* 信息提示 */
```

**使用规则**：
- 状态标签禁用纯色背景，使用**淡彩底+深彩字**（如成功：绿50底+绿600字）
- 页面层级：背景 `--gray-50` > 卡片 `--gray-0` > Hover `--gray-50`

### 1.2 间距体系 (8px Grid)
```
--space-1: 4px;    /* 图标间隙、紧凑标签 */
--space-2: 8px;    /* 基础单位 */
--space-3: 12px;   /* 行内元素 */
--space-4: 16px;   /* 卡片内边距、表格单元格 */
--space-5: 20px;   /* 模块间距、弹窗内边距 */
--space-6: 24px;   /* 大模块间距、页面边距 */
--space-8: 32px;   /* 区块间距 */
--space-10: 40px;  /* 页面级大间距 */
```

### 1.3 字体系统
```
字体族：Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
        "PingFang SC", "Microsoft YaHei", sans-serif

--text-xs: 12px;   /* 辅助、标签、时间戳 */
--text-sm: 13px;    /* 表格、按钮、导航二级 */
--text-base: 14px;  /* 正文、导航一级 */
--text-lg: 16px;    /* 小标题 */
--text-xl: 18px;    /* 页面副标题 */
--text-2xl: 20px;   /* 页面标题 */
--text-3xl: 24px;   /* 数据看板数字 */
--text-4xl: 30px;   /* 核心指标 */

--font-medium: 500;    /* 按钮、表头 */
--font-semibold: 600;  /* 标题 */
--font-bold: 700;      /* 大数字 */
```

### 1.4 圆角与阴影
```
--radius-sm: 4px;   /* 标签、输入框 */
--radius-md: 8px;   /* 卡片、按钮、弹窗 */
--radius-lg: 12px;  /* 大卡片 */

--shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
```

### 1.5 布局变量
```
--header-height: 56px;              /* 顶部栏高度 */
--sidebar-width: 220px;             /* 侧边栏宽度 */
--sidebar-collapsed-width: 64px;    /* 侧边栏折叠宽度 */
```

---

## 二、全局布局架构

### 2.1 页面框架
```
┌─────────────────────────────────────────────────────────────────────┐
│ Header (56px) - 极简，仅全局功能                                     │
│ Logo(200px)            [可选：全局搜索]            通知 | 帮助 | 头像 │
├───────────────┬─────────────────────────────────────────────────────┤
│ Sidebar       │  Main Content (背景 --gray-50)                      │
│ (220px 固定)   │                                                     │
│ 白底+右边框    │  ┌─────────────────────────────────────────────┐     │
│               │  │  Page Header (面包屑+标题+操作) - 白底卡片      │     │
│ 导航菜单        │  ├─────────────────────────────────────────────┤     │
│ (三级可折叠)    │  │                                             │     │
│               │  │  Content (筛选/表格/表单)                      │     │
│               │  │                                             │     │
│               │  └─────────────────────────────────────────────┘     │
└───────────────┴─────────────────────────────────────────────────────┘
```

### 2.2 导航结构（实际实现）

侧边栏菜单定义在 `src/components/layout/Sidebar.tsx` 的 `menuData` 数组中：

```
数据总览
├── 数据看板 ✓

员工管理
├── 员工列表 ✓
└── 部门管理 ✓

员工福利
├── 保险管理
│   ├── 保险方案 ✓
│   ├── 投保进度 ✓
│   ├── 理赔进度 ○
│   └── 保险数据 ○
├── 体检管理
│   ├── 体检方案 ✓
│   ├── 体检名单 ○
│   └── 体检数据 ○
├── 弹性积分
│   ├── 员工积分 ✓
│   ├── 订单数据 ○
│   └── 积分数据 ○
└── 年节福利 ○

员工关怀
├── 生日祝福 ✓
├── 司龄祝福 ✓
├── 感谢卡 ○
└── 认可激励
    ├── 激励积分 ○
    ├── 数据 ○
    ├── 活动 ○
    ├── 审批 ○
    ├── 认可卡 ○
    └── 记录 ○

财务结算
└── 账单管理 ✓

运营管理
├── 企业公告 ✓
└── 界面配置 ✓

消息中心
├── 模板配置 ✓
└── 发送记录 ✓

售后服务
├── 专属售后 ○
├── 售后满意度 ○
└── 投诉建议 ○

系统管理
├── 角色权限 ✓
└── 操作日志 ✓
```

**图例**：✓ 已实现  ○ 未实现（显示占位页面）

**页面键值（PageKey）**：定义在 `src/contexts/NavigationContext.tsx`
- 所有页面键值需同时在 `pageNames` 对象中注册
- 在 `App.tsx` 的 `implementedPages` 中映射到实际组件
- 未映射的页面自动渲染 `PlaceholderPage`

### 2.3 Page Header 规范 (核心布局)
位于内容区顶部，**白底卡片**，与页面背景形成层级。

**结构**：
```
┌─────────────────────────────────────────────────────────┐
│ 首页 / 员工档案 / 员工列表           (面包屑，12px --gray-400) │
├─────────────────────────────────────────────────────────┤
│ 左侧                          右侧                       │
│ 员工列表                      [?帮助] [导入] [+新增员工]  │
│ 管理企业员工信息...                                       │
│ (标题 20px 粗体)              (按钮组，gap-8px)         │
└─────────────────────────────────────────────────────────┘
```
- 背景：`--gray-0`，圆角 8px，padding 20px
- 下边距：16px (与内容区间隔)

**Props 接口**：
```typescript
interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  onBack?: () => void;           // 详情页返回按钮
  title?: React.ReactNode;       // 标题
  description?: string;          // 描述文字
  titleExtra?: React.ReactNode;  // 标题右侧额外内容（如帮助图标）
  actions?: Action[];            // 操作按钮组
}

interface Action {
  type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text'; // 与 type 等价
  label: string;
  icon?: IconName;
  onClick: () => void;
  loading?: boolean;
}
```

---

## 三、组件化架构 (分层设计)

### 3.1 组件分层
```
页面层 (Pages)          EmployeeList, Dashboard, Settings
    ↓ 使用
模板层 (Templates)      ListPageTemplate, DetailPageTemplate
    ↓ 使用
复合层 (Composites)     PageHeader, FilterBar, DataTable, BatchActionBar, StatCard
    ↓ 使用
基础层 (Basics)         Button, Input, Select, Tag, Modal, Breadcrumb, Pagination, Icon(SVG)
    ↓ 使用
布局层 (Layout)         AppLayout, Sidebar, Header
```

### 3.2 布局组件 (Layout)

**`AppLayout`**：管理 Header + Sidebar + Content 栅格
- Props: `userName?: string` - 显示在 Header 右上角
- 使用 `NavigationProvider` 提供导航上下文

**`Sidebar`**：递归渲染三级导航
- Props: 
  - `collapsed?: boolean` - 是否折叠 (默认 220px，折叠后 64px)
  - `onCollapse?: (collapsed: boolean) => void` - 折叠状态变化回调
  - `activeKey?: string` - 当前激活的菜单项
- 选中态样式：左侧 3px 橙线 + `--primary-50` 背景
- 菜单数据：`menuData` 数组定义在组件内

**`Header`**：极简顶部栏
- 固定高度：`--header-height: 56px`
- 包含：Logo、通知图标、帮助图标、用户头像下拉
- 注意：全局搜索为可选功能，当前实现中未显示

### 3.3 基础组件 (Basics - 无业务逻辑)

| 组件 | 关键 Props | 规格 |
|------|-----------|------|
| **Button** | `type/buttonType: primary/secondary/tertiary/danger/text`, `size: sm/md/lg`, `icon?: IconName`, `iconPosition?: left/right`, `loading?: boolean`, `block?: boolean` | 默认 md(32px)，圆角 4px，支持 loading 状态 |
| **Input** | `prefix?: ReactNode`, `suffix?: ReactNode`, `status?: default/error/warning`, `size?: sm/md/lg`, `errorMessage?: string` | 默认 md(32px)，focus 时 `--primary-500` 边框 + 外发光 |
| **Select** | `options: SelectOption[]`, `value`, `onChange`, `placeholder?: string`, `disabled?: boolean` | 单选下拉，支持字符串或对象选项 |
| **Tag** | `color?: default/success/warning/error/primary/info`, `removable?: boolean`, `onRemove?: () => void` | 固定高度 22px，圆角 4px，字号 12px |
| **Modal** | `visible`, `title`, `width?: sm/md/lg/number`, `footer?: ReactNode`, `onCancel`, `onOk` | 圆角 8px，阴影 `--shadow-lg`，点击遮罩可关闭 |
| **Breadcrumb** | `items: BreadcrumbItem[]`, `onBack?: () => void` | 分隔符 `/`，当前项 `--gray-600` 不可点 |
| **Pagination** | `current`, `pageSize`, `total`, `onChange`, `onPageSizeChange`, `pageSizeOptions` | 默认每页 20 条，支持快速跳转 |
| **Icon** | `name: IconName`, `size?: number`, `color?: string`, `className?: string` | SVG 图标系统，IconName 为强类型 |
| **Checkbox** | `checked?: boolean`, `indeterminate?: boolean`, `onChange?: (checked) => void`, `children?: ReactNode` | 支持半选状态 |

**Button 详细规格**：
```typescript
type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  type?: ButtonType;
  buttonType?: ButtonType;  // 与 type 等价，兼容两种写法
  htmlType?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;        // 默认 'md'
  loading?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  block?: boolean;          // 是否块级宽度
  disabled?: boolean;
  onClick?: () => void;
}
```
- `sm`: 28px 高，padding 0 12px，字号 12px
- `md`: 32px 高，padding 0 16px，字号 13px（默认）
- `lg`: 36px 高，padding 0 20px，字号 14px

**Input 详细规格**：
```typescript
type InputStatus = 'default' | 'error' | 'warning';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
  prefix?: React.ReactNode;    // 前缀图标/文字
  suffix?: React.ReactNode;    // 后缀图标/文字
  status?: InputStatus;        // 默认 'default'
  errorMessage?: string;       // status='error' 时显示
  size?: InputSize;            // 默认 'md'
}
```

**Tag 详细规格**：
```typescript
type TagColor = 'default' | 'success' | 'warning' | 'error' | 'primary' | 'info';

interface TagProps {
  color?: TagColor;            // 默认 'default'
  removable?: boolean;         // 是否显示删除按钮
  onRemove?: () => void;
}
```
- 高度固定 22px，padding 0 8px
- 颜色方案：淡彩底 + 深彩字（如 success: 绿50底 + 绿600字）

### 3.4 复合组件 (Composites - 可跨页面复用)

#### `PageHeader` (页面标题区)
```typescript
interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  onBack?: () => void;           // 详情页返回按钮
  title?: React.ReactNode;       // 标题
  description?: string;          // 描述文字
  titleExtra?: React.ReactNode;  // 标题右侧额外内容（如帮助图标）
  actions?: Action[];            // 操作按钮组
}

interface Action {
  type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text';
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'text'; // 与 type 等价
  label: string;
  icon?: IconName;
  onClick: () => void;
  loading?: boolean;
}
```

#### `StatCard` (统计指标)
- 白底卡片，圆角 8px，padding 20px
- 数值：`--text-4xl` (30px) 粗体
- 趋势：上升 `--primary-600`，下降 `--gray-400`，12px

#### `FilterBar` (筛选与批量操作)
```typescript
interface FilterBarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;              // 受控搜索值
  filters?: Filter[];
  filterValues?: Record<string, any>; // 筛选值对象
  onFilterChange?: (key: string, value: any) => void;
  onReset?: () => void;
  // 批量操作栏 (与表格联动)
  batchBar?: {
    selectedCount: number;
    actions: BatchAction[];
    onClear: () => void;
  };
}

interface Filter {
  key: string;
  label: string;
  type?: 'select' | 'input';
  options?: SelectOption[];  // type='select' 时必需
  placeholder?: string;
}

interface BatchAction {
  key: string;
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  danger?: boolean;
  onClick: () => void;
}
```
- 容器：白底，圆角 8px，padding 16px 20px
- 搜索框宽度：240px，筛选项宽度：120px
- 批量栏浮现时：背景 `--primary-50`，边框 `--primary-200`，圆角 6px

#### `DataTable` (数据表格)
```typescript
interface DataTableProps<T> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);  // 默认 'id'
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (keys: (string | number)[], rows: T[]) => void;
  };
  rowActions?: RowAction[];  // 行内操作按钮
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  loading?: boolean;
  emptyText?: string;         // 默认 '暂无数据'
  emptyDescription?: string;  // 空状态描述
}

interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sorter?: boolean;           // 是否支持排序（预留）
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface RowAction {
  key: string;
  label: string;
  type?: 'primary' | 'danger' | 'default';
  onClick: (record: T) => void;
}
```
- 容器：白底，圆角 8px
- 表头：padding 12px 16px，`--gray-50` 背景，13px 粗体
- 单元格：padding 14px 16px，13px 常规字重，底部边框 `--gray-100`
- 行高：自适应（内容 + padding）
- Hover 效果：背景色 `--gray-50`，过渡动画 0.15s
- 边框：仅水平线，无竖线
- 选择列：宽度 48px，居中
- 操作列：根据按钮数量自动计算宽度
- 分页器：底部右对齐，padding 12px 16px

**使用示例**：
```tsx
<DataTable
  columns={[
    { key: 'name', title: '姓名', dataIndex: 'name', width: 100 },
    { key: 'status', title: '状态', render: (_, record) => <Tag>{record.status}</Tag> },
  ]}
  dataSource={data}
  rowSelection={{
    selectedRowKeys: selected,
    onChange: (keys, rows) => setSelected(keys),
  }}
  rowActions={[
    { key: 'view', label: '查看', onClick: (r) => navigate('detail', { id: r.id }) },
    { key: 'delete', label: '删除', type: 'danger', onClick: (r) => handleDelete(r) },
  ]}
  pagination={{ current: 1, pageSize: 20, total: 100, onChange: setPage }}
/>
```

### 3.5 模板组件 (Templates)

#### `ListPageTemplate` (列表页通用模板)
组合：`PageHeader` → `StatCard[]` (可选) → `FilterBar` → `DataTable` → `Pagination`

#### `DetailPageTemplate` (详情页通用模板)
组合：`PageHeader` (含返回) → 左侧信息栏 (280px) + 右侧 Tabs (内容业务填充)

---

## 四、Icon 规范 (SVG 强制)

### 4.1 使用原则
- **必须使用 SVG 格式**，所有图标内联在 `Icon.tsx` 组件中
- **禁止使用 Emoji**，避免跨平台显示差异
- 图标尺寸规范：12px / 14px / 16px (默认) / 20px / 24px
- 图标颜色：通过 `color` prop 指定，支持 CSS 变量

### 4.2 图标类型定义（IconName）

所有可用图标定义在 `src/components/basics/Icon.tsx`：

```typescript
export type IconName = 
  // 导航/通用
  | 'home' | 'dashboard' | 'user' | 'users' | 'department' 
  | 'settings' | 'search' | 'bell' | 'question-circle' | 'menu'
  // 业务模块
  | 'insurance' | 'medical' | 'points' | 'gift' | 'heart'
  | 'birthday' | 'medal' | 'card' | 'bill' | 'announcement'
  | 'config' | 'message' | 'service' | 'log' | 'shield' | 'star' | 'tag' | 'document'
  // 操作
  | 'plus' | 'import' | 'export' | 'download' | 'upload'
  | 'edit' | 'delete' | 'eye' | 'filter' | 'refresh' | 'copy' | 'external-link'
  // 箭头
  | 'arrow-down' | 'arrow-up' | 'arrow-right' | 'arrow-left'
  | 'chevron-down' | 'chevron-up' | 'chevron-right' | 'chevron-left'
  // 状态
  | 'check' | 'close' | 'warning' | 'info' | 'error' | 'success' | 'loading'
  // 其他
  | 'calendar' | 'mail' | 'phone';
```

### 4.3 使用方式
```tsx
import { Icon } from '@/components/basics/Icon';

// 基础用法
<Icon name="user" size={16} color="var(--gray-400)" />

// 按钮内图标
<Button icon="plus" iconPosition="left">新增</Button>

// 加载状态
<Icon name="loading" size={16} className="animate-spin" />
```

### 4.4 添加新图标
如需添加新图标，需：
1. 在 `IconName` 类型中添加新名称
2. 在 `icons` 对象中添加对应的 SVG path
3. 确保图标为 24x24 视图框的 outline 风格

---

## 五、导航参数传递

页面间导航使用 `NavigationContext` 提供的 `navigate` 方法：

```typescript
import { useNavigation } from '@/contexts/NavigationContext';

// 在组件中使用
const { navigate, currentParams } = useNavigation();

// 跳转到员工详情页并传递参数
navigate('employee-detail', { employeeId: 'EMP001' });

// 在目标页面获取参数
const employeeId = currentParams.employeeId;
```

**参数传递规则**：
- 参数类型：`Record<string, any>`，可传递任意键值对
- 参数生命周期：仅在导航时有效，刷新页面后丢失
- 适用场景：详情页 ID、编辑模式标记、筛选状态保留等

**示例：员工列表跳转到详情页**
```tsx
// EmployeeList.tsx
const handleViewDetail = (employee: Employee) => {
  navigate('employee-detail', { 
    employeeId: employee.id,
    from: 'employee-list'  // 可选：标记来源页面
  });
};

// EmployeeDetail.tsx
const EmployeeDetail = () => {
  const { currentParams, navigate } = useNavigation();
  const employeeId = currentParams.employeeId;
  
  // 返回时携带参数
  const handleBack = () => {
    navigate(currentParams.from || 'employee-list');
  };
  
  // 根据 employeeId 加载数据
  useEffect(() => {
    if (employeeId) {
      loadEmployeeDetail(employeeId);
    }
  }, [employeeId]);
};
```

---

## 六、页面实现详情

### 6.1 页面实现状态表

| 页面键值 | 页面名称 | 实现状态 | 组件文件 | 备注 |
|---------|---------|---------|---------|------|
| `dashboard-home` | 数据看板 | ✓ | `Dashboard.tsx` | 包含统计卡片、快捷操作 |
| `employee-list` | 员工列表 | ✓ | `EmployeeList.tsx` | 核心管理页面，含批量操作 |
| `employee-detail` | 员工详情 | ✓ | `EmployeeDetail.tsx` | 聚合页，含保险/体检/积分 Tab |
| `department` | 部门管理 | ✓ | `Department.tsx` | 部门树形管理 |
| `insurance-plan` | 保险方案 | ✓ | `InsurancePlan.tsx` | 方案列表及加减员 |
| `insurance-scheme-detail` | 方案详情 | ✓ | `InsuranceSchemeDetail.tsx` | 单个方案详情 |
| `insurance-progress` | 投保进度 | ✓ | `InsuranceProgress.tsx` | 投保进度跟踪 |
| `claim-progress` | 理赔进度 | ○ | - | 显示 PlaceholderPage |
| `insurance-data` | 保险数据 | ○ | - | 显示 PlaceholderPage |
| `medical-plan` | 体检方案 | ✓ | `MedicalManagement.tsx` | 体检方案管理 |
| `medical-list` | 体检名单 | ○ | - | 显示 PlaceholderPage |
| `medical-data` | 体检数据 | ○ | - | 显示 PlaceholderPage |
| `employee-points` | 员工积分 | ✓ | `PointsManagement.tsx` | 积分批量分配 |
| `order-data` | 订单数据 | ○ | - | 显示 PlaceholderPage |
| `points-data` | 积分数据 | ○ | - | 显示 PlaceholderPage |
| `festival` | 年节福利 | ○ | - | 显示 PlaceholderPage |
| `birthday` | 生日祝福 | ✓ | `EmployeeCare.tsx` | 复用 EmployeeCare 组件 |
| `work-anniversary` | 司龄祝福 | ✓ | `EmployeeCare.tsx` | 复用 EmployeeCare 组件 |
| `thanks-card` | 感谢卡 | ○ | - | 显示 PlaceholderPage |
| `incentive-points` | 激励积分 | ○ | - | 显示 PlaceholderPage |
| `recognition-data` | 认可激励-数据 | ○ | - | 显示 PlaceholderPage |
| `recognition-activities` | 认可激励-活动 | ○ | - | 显示 PlaceholderPage |
| `recognition-approval` | 认可激励-审批 | ○ | - | 显示 PlaceholderPage |
| `recognition-cards` | 认可激励-认可卡 | ○ | - | 显示 PlaceholderPage |
| `recognition-records` | 认可激励-记录 | ○ | - | 显示 PlaceholderPage |
| `bill-management` | 账单管理 | ✓ | `BillManagement.tsx` | 财务结算 |
| `announcement` | 企业公告 | ✓ | `Announcement.tsx` | 公告管理 |
| `interface-config` | 界面配置 | ✓ | `InterfaceConfig.tsx` | C端配置 |
| `template-config` | 模板配置 | ✓ | `MessageCenter.tsx` | 复用 MessageCenter 组件 |
| `send-records` | 发送记录 | ✓ | `MessageCenter.tsx` | 复用 MessageCenter 组件 |
| `dedicated-service` | 专属售后 | ○ | - | 显示 PlaceholderPage |
| `service-satisfaction` | 售后满意度 | ○ | - | 显示 PlaceholderPage |
| `complaint` | 投诉建议 | ○ | - | 显示 PlaceholderPage |
| `role-permission` | 角色权限 | ✓ | `RolePermission.tsx` | 权限管理 |
| `operation-log` | 操作日志 | ✓ | `OperationLog.tsx` | 系统日志 |

**图例**：✓ 已实现  ○ 未实现（显示 PlaceholderPage）

### 6.2 新增页面步骤

如需新增页面，按以下步骤操作：

1. **创建页面组件**：在 `src/pages/` 下创建新的 `.tsx` 文件
2. **注册页面键值**：在 `src/contexts/NavigationContext.tsx` 中：
   - 在 `PageKey` 类型中添加新键值
   - 在 `pageNames` 对象中添加名称映射
3. **映射组件**：在 `src/App.tsx` 的 `implementedPages` 对象中添加组件映射
4. **添加菜单项**（如需）：在 `src/components/layout/Sidebar.tsx` 的 `menuData` 中添加菜单

**示例**：添加"福利商城"页面
```typescript
// 1. NavigationContext.tsx
export type PageKey = 
  | 'dashboard-home'
  | ...
  | 'welfare-mall';  // 新增

export const pageNames: Record<PageKey, string> = {
  ...
  'welfare-mall': '福利商城',  // 新增
};

// 2. App.tsx
import WelfareMall from './pages/WelfareMall';  // 新增导入

const implementedPages: Record<PageKey, React.ComponentType | undefined> = {
  ...
  'welfare-mall': WelfareMall,  // 新增映射
};

// 3. Sidebar.tsx
const menuData: MenuItem[] = [
  ...
  {
    key: 'group-benefits',
    label: '员工福利',
    type: 'group',
    children: [
      ...
      { key: 'welfare-mall', label: '福利商城', icon: 'gift' },  // 新增
    ],
  },
];
```

---

## 七、页面详细规范 (关键页面设计)

### 7.1 数据看板 (Dashboard) - 运营首页

**Page Header**：
- 面包屑：首页 / 数据看板 (或隐藏面包屑仅显示标题)
- 标题：数据看板
- 描述：欢迎回来，XX科技有限公司 | 上次更新：刚刚
- 操作：[导出报表] (Secondary) [设置看板] (Tertiary)

**关键指标卡片区** (4 列栅格，gap 16px)：
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 在职员工      │ │ 本月新入职   │ │ 本月离职     │ │ 福利激活率   │
│  1,205      │ │   18        │ │   12        │ │  97.9%      │
│ ↑ 1.2%      │ │ ↑ 5.0%      │ │ ↓ 2.5%      │ │ ↑ 0.5%      │
│ 较上月       │ │ 待完善:3人   │ │ 已结算:12人  │ │ 未激活:25人  │
│ [查看全部]   │ │             │ │             │ │ [一键提醒]   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```
- 卡片：白底，圆角 8px，padding 20px
- 数字：30px 粗体 `--gray-800`
- 趋势：上升 `--primary-600` ↓ 下降 `--gray-400`
- 副信息：12px `--gray-400`，位于底部

**快捷操作栏**：
- 按钮组：[新增员工] [批量导入] [发放积分] [体检导入] [发布福利]
- 样式：Secondary 按钮 (橙边框)，gap 12px

**内容分栏区** (24 栅格，左 14 列 + 右 10 列)：

**左侧：最近投保进度 (Top 5)**：
```
┌─────────────────────────────────────────┐
│ 最近投保进度                    [查看全部]│
├─────────────────────────────────────────┤
│ • 补充医疗保险    已生效    128人   [详情]│
│   保险公司: XX保险                        │
│ • 意外险          处理中    12人    [催促]│
│   预计 3 个工作日内生效                    │
│ • 重疾险          待确认    5人     [确认]│
└─────────────────────────────────────────┘
```
- 行高 60px，Hover 背景 `--gray-50`
- 状态标签：已生效(绿)、处理中(橙)、待确认(灰)

**右侧：体检到检率图表**：
```
┌─────────────────────────────────────────┐
│ 本季度体检到检率              [查看详情]  │
├─────────────────────────────────────────┤
│                                         │
│     [环形图/进度环 占位]                  │
│        已预约 80%                        │
│        已到检 65%                        │
│        未预约 20%                        │
│                                         │
│ 最新体检: 2024年度全面体检                │
│ 截止日期: 2024-06-30 (剩余 45 天)        │
└─────────────────────────────────────────┘
```

**底部通栏：待办提醒**：
- 背景 `--warning-50`，边框 `--warning-200`，圆角 8px
- 内容：
  - ⚠️ 体检截止提醒：XX体检还有 3 天到期，目前到检率 65%，建议催促未完成员工
  - ⚠️ 生日祝福：本周有 8 位员工生日，祝福模板未配置
  - ⚠️ 保单到期：补充医疗保险即将到期，请联系续保

---

### 7.2 员工列表页 - 核心管理页面

**实际实现组件**：`src/pages/EmployeeList.tsx`

**Page Header**：
- 面包屑：首页 / 员工管理 / 员工列表
- 标题：员工列表
- 描述：管理企业员工信息，支持批量导入、部门调整、离职办理
- 操作：
  - `[导入]` (Secondary，带 import 图标)
  - `[新增员工]` (Primary，带 plus 图标)

**统计卡片区**（4 列栅格）：
- 在职员工 | 本月新入职 | 本月离职 | 福利账号激活率
- 使用 `StatCard` 组件

**筛选与操作区**：
- 搜索框：placeholder "搜索姓名、工号、部门..."
- 筛选项：部门(Select)、状态(Select)
- 操作按钮：重置、查询
- 批量操作栏（选中行后浮现）：
  - 显示：已选 X 人 | 清空
  - 操作：发放积分、调整部门、批量离职

**数据表格**：
| 列 | 宽度 | 对齐 | 说明 |
|--|------|------|------|
| 选择框 | 48px | 居中 | Checkbox |
| 工号 | 100px | 左 | EMP001 |
| 姓名 | 100px | 左 | 可点击跳转详情，橙色链接 |
| 部门 | 120px | 左 | Tag 样式，选项包括：研发部、市场部、销售部、人事部、财务部、**未分配** |
| 职位 | 140px | 左 | - |
| 手机号 | 120px | 左 | 脱敏显示 138****8001 |
| 入职日期 | 110px | 左 | YYYY-MM-DD |
| 状态 | 120px | 左 | Tag：在职+已激活 或 离职+未激活 |
| 操作 | 120px | 右 | 编辑、离职 |

**部门筛选选项**：
- 全部
- 研发部（含运维组、产品组成员）
- 市场部
- 销售部
- 人事部
- 财务部
- **未分配**（新增成员默认所属）

**分页器**：
- 默认每页 20 条
- 支持页码跳转和每页条数切换

---

### 7.3 部门管理页 - 树形组织架构

**实际实现组件**：`src/pages/Department.tsx`

**核心功能**：
- 部门树形结构展示，支持展开/折叠
- 部门 CRUD 操作（新增、编辑、删除）
- 部门负责人设置（带确认弹窗）
- 部门成员管理（查看、添加、编辑、删除）
- 批量分配部门功能
- 员工调转部门
- 数据持久化（localStorage）

**Page Header**：
- 面包屑：首页 / 组织架构 / 部门管理
- 标题：部门管理
- 描述：管理企业组织架构，包括部门创建、编辑、删除及部门成员管理
- 操作：[恢复默认] (Secondary)

**布局**：左侧部门树 (25%) + 右侧部门详情 (75%)

**部门树**：
- 显示部门名称和成员数量
- 支持搜索定位
- 点击选中，高亮显示
- 总公司为根节点，下属部门可展开

**部门架构**：
```
总公司
├── 研发部（含运维组、产品组）
├── 市场部
├── 销售部
├── 人事部
└── 财务部
```

**部门详情区**：
- 顶部信息栏：部门名称、负责人、联系电话、创建时间
- 总公司视图隐藏编辑/删除按钮
- 其他部门显示：[编辑] [删除] 按钮

**成员表格**：
| 列 | 说明 |
|---|---|
| 选择框 | 多选操作 |
| 工号 | EMP001 格式 |
| 姓名 | 可点击跳转员工详情 |
| 职位 | - |
| 手机号 | 脱敏显示 |
| 入职日期 | YYYY-MM-DD |
| 状态 | Tag：在职/离职 |
| 操作 | 负责人标签 或 设为负责人按钮 |

**负责人设置**：
- 已是负责人：显示绿色「负责人」标签
- 非负责人：显示「设为负责人」按钮
- 点击按钮弹出确认弹窗
- 替换负责人时提示：原负责人将被替换

**批量操作**：
- 总公司视图：
  - [新增成员] - 新成员默认"未分配"部门
  - [批量分配部门] - 将未分配员工分配到目标部门
  - 选中后：[调转部门]
- 其他部门视图：
  - [新增成员]
  - 选中后：[调转部门] [移除部门]

**未分配员工概念**：
- 新增成员默认属于"未分配"部门
- 总公司视图显示"待分配"标签和人数
- 可通过批量分配功能统一分配
- 员工列表部门筛选包含"未分配"选项

**数据一致性**：
- 部门树中的负责人必须是员工列表中实际存在的员工
- 部门树中的部门名称与员工部门字段保持一致
- 删除部门时，该部门员工一并移除

**localStorage Key**：
- `hr-admin:departments` - 部门数据
- `hr-admin:dept-employees` - 员工数据（部门管理页面专用）

---

### 7.4 员工详情页 - 聚合信息页

**实际实现组件**：`src/pages/EmployeeDetail.tsx`

**Page Header**：
- 面包屑：`< 返回员工列表` / 张三 (EMP001)
- 标题：员工姓名 + 工号
- 操作：
  - `[编辑信息]` (Secondary)
  - `[更多操作▼]` (Tertiary，下拉含离职、删除)

**布局**：左侧信息栏 (280px) + 右侧内容区 (自适应)

**左侧信息栏**：
```
┌─────────────────┐
│    [头像占位]    │
│     张三         │
│  研发部 · 高级工程师│
├─────────────────┤
│ 基础信息         │
│ 工号: EMP001     │
│ 入职: 2021-05-10 │
│ 手机: 138****8001│
│ 邮箱: zhang@company.com │
├─────────────────┤
│ 快捷操作         │
│ [编辑信息]       │
│ [调整部门]       │
│ [办理离职] (danger)│
└─────────────────┘
```

**右侧 Tabs**：
1. **基本信息**：个人信息表单（只读/编辑模式）
2. **保险**：
   - 当前生效方案卡片
   - 历史方案表格
   - 理赔记录
3. **体检**：
   - 当前年度方案
   - 预约状态时间轴
   - 到检情况
4. **积分**：
   - 余额大数字展示
   - 收支明细表格

**导航参数**：
- 接收 `employeeId` 参数加载对应员工数据
- 返回时保留来源页面信息

---

### 7.5 其他已实现页面简介

| 页面 | 主要功能 | 关键组件 |
|------|---------|---------|
| **Department** | 部门树形管理 | 详见 7.3 节 |
| **InsurancePlan** | 保险方案列表 | 方案卡片 + 加减员操作 |
| **InsuranceSchemeDetail** | 方案详情 | 方案信息 + 参保员工表格 |
| **InsuranceProgress** | 投保进度 | 进度时间轴 + 状态标签 |
| **MedicalManagement** | 体检方案 | 方案列表 + 到检统计 |
| **PointsManagement** | 员工积分 | 积分分配 + 明细表格 |
| **EmployeeCare** | 生日/司龄祝福 | 祝福列表 + 模板配置 |
| **BillManagement** | 账单管理 | 账单列表 + 结算状态 |
| **Announcement** | 企业公告 | 公告列表 + 富文本编辑 |
| **InterfaceConfig** | 界面配置 | 配置表单 + 预览 |
| **MessageCenter** | 消息中心 | 模板列表 + 发送记录 |
| **RolePermission** | 角色权限 | 角色列表 + 权限树 |
| **OperationLog** | 操作日志 | 日志表格 + 筛选 |

---

## 八、数据持久化

项目使用 `localStorage` 进行数据持久化，通过自定义 Hook `useLocalStorageState` 实现。

### 8.1 Hook 使用方式

```typescript
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

// 定义数据类型和初始值
const [data, setData] = useLocalStorageState<Employee[]>('hr-admin:employees', mockEmployees);

// 支持函数式更新
setData((prev) => [...prev, newEmployee]);

// 重置为默认值
const [_data, _setData, resetData] = useLocalStorageState('key', defaultValue);
resetData(); // 一键重置
```

### 8.2 localStorage Key 规范

| Key | 用途 | 页面 |
|-----|-----|------|
| `hr-admin:employees` | 员工列表数据 | EmployeeList.tsx |
| `hr-admin:departments` | 部门数据 | Department.tsx |
| `hr-admin:dept-employees` | 部门管理页员工数据 | Department.tsx |

### 8.3 数据流程
- 页面首次加载时从 localStorage 读取数据
- 数据变更时自动同步到 localStorage
- 支持"恢复默认"功能，一键重置为初始 mock 数据
- 同一数据源可能被多个页面共享（如员工数据）

---

## 九、开发规范

### 9.1 代码规范
- **TypeScript**：严格类型检查，避免使用 `any`
- **组件命名**：PascalCase，如 `EmployeeList`
- **文件命名**：与组件名一致，如 `EmployeeList.tsx`
- **样式**：使用 CSS 变量，避免硬编码颜色值

### 9.2 组件开发原则
1. **基础组件** (`basics/`)：纯展示，无业务逻辑
2. **复合组件** (`composites/`)：可复用业务组件
3. **页面组件** (`pages/`)：业务逻辑，使用复合组件组装
4. **布局组件** (`layout/`)：页面框架结构

### 9.3 常用工具
```bash
# 启动开发服务器
cd hr-admin
npm run dev

# 构建（含类型检查）
npm run build

# 代码检查
npm run lint
```

### 9.4 构建输出
- 使用 `vite-plugin-singlefile` 插件
- 输出单文件 `dist/index.html`
- 包含所有 JS/CSS 内联

---

## 附录：CSS 变量速查表

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--primary-600` | #EA580C | 主按钮、链接 |
| `--primary-50` | #FFF7ED | 选中背景、批量栏背景 |
| `--gray-800` | #1E293B | 标题文字 |
| `--gray-600` | #475569 | 正文文字 |
| `--gray-400` | #94A3B8 | 辅助文字 |
| `--gray-200` | #E2E8F0 | 边框、分割线 |
| `--gray-100` | #F1F5F9 | 表头背景、Hover态 |
| `--gray-50` | #F8FAFC | 页面背景 |
| `--gray-0` | #FFFFFF | 卡片背景 |
| `--success-600` | #16A34A | 成功状态 |
| `--warning-600` | #D97706 | 警告状态 |
| `--error-600` | #DC2626 | 错误状态 |
| `--header-height` | 56px | 顶部栏高度 |
| `--sidebar-width` | 220px | 侧边栏宽度 |
| `--sidebar-collapsed-width` | 64px | 侧边栏折叠宽度 |

---

**文档结束**
