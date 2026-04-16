# HR Admin - AGENTS.md

## 项目命令
```bash
cd hr-admin
npm run dev      # 开发服务器
npm run build    # 构建（含 tsc -b 类型检查，输出单文件 dist/index.html）
npm run lint     # ESLint（有 @babel 依赖问题，不影响构建）
```

## 技术栈
- React 19 + TypeScript ~6.0
- Vite 8 + vite-plugin-singlefile（构建产物为单文件 HTML）
- Tailwind CSS v4（使用 `@tailwindcss/postcss`）
- 无测试框架

## 数据持久化
使用 `useLocalStorageState` Hook：
```typescript
const [data, setData, resetData] = useLocalStorageState<T>('key', defaultValue);
// 支持函数式更新：setData(prev => [...prev, newItem])
// resetData() 重置为默认值
```

localStorage Key 规范：`hr-admin:{entity-name}`

## 新增页面（3步）
1. `src/pages/` 创建组件
2. `NavigationContext.tsx` 添加 `PageKey` 和 `pageNames`
3. `App.tsx` 的 `implementedPages` 注册（undefined = PlaceholderPage）

## 导航参数
```typescript
const { navigate, currentParams } = useNavigation();
navigate('employee-detail', { employeeId: 'EMP001' });
```

## 组件规范

### Icon
- 使用 `src/components/basics/Icon.tsx`
- 图标名通过 `IconName` 类型限制，不可随意添加

### Button
- size prop：`"sm" | "md" | "lg"`（不是 `"small"`）
- `type` 和 `buttonType` prop 等价

### Tag
- 不支持 size prop
- 颜色：`default | success | warning | error | primary | info`

### PageHeader
- 面包屑：`首页` → `一级分类` → `当前页面`
- 二级分类页面需显示一级分类

## 目录结构
```
src/
├── components/basics/    # Button, Input, Select, Tag, Modal, Icon...
├── components/layout/     # AppLayout, Sidebar, Header
├── components/composites/ # PageHeader, ListPageTemplate, DataTable...
├── pages/                 # 业务页面
├── contexts/              # NavigationContext
├── hooks/                 # useLocalStorageState
└── styles/                # variables.css (CSS Variables)
```

## 侧边栏菜单
`src/components/layout/Sidebar.tsx` 的 `menuData`：
- `type: 'group'`：分类标题
- `type: 'item'`：可点击菜单项
