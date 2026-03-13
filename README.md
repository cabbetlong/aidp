# AIDP AI Q&A System

## 项目简介

AIDP AI智能问答系统是一个基于 Vue3 + TypeScript + Element Plus 的生产级前端应用,提供AI知识问答和管理后台功能。

## 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript 5.x
- **构建工具**: Vite 7.x
- **UI库**: Element Plus 2.11+
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 5.x
- **国际化**: vue-i18n 11.x
- **测试**: Vitest + Vue Test Utils + Playwright
- **包管理器**: Bun

## 项目结构

```
aidp-ai-qa/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 通用组件
│   │   ├── common/      # 公共组件
│   │   └── business/    # 业务组件
│   ├── composables/     # 组合式函数
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia stores
│   ├── views/           # 页面组件
│   │   ├── auth/        # 登录页面
│   │   ├── chat/        # AI问答页面
│   │   └── admin/       # 管理后台
│   ├── i18n/            # 国际化配置
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型定义
│   ├── App.vue
│   └── main.ts
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   └── e2e/             # E2E测试
├── public/              # 公共静态文件
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

## 功能模块

### 1. 登录页面
- 用户名/密码/验证码输入
- 登录验证
- 初始化按钮
- 响应式设计

### 2. AI知识问答页面
- 左侧侧边栏: 快捷导航和历史对话
- 中间对话区域: 用户消息 + AI回复
- 支持多会话管理
- 消息发送和接收
- Markdown渲染(待实现)

### 3. 管理后台框架
- Dashboard: 数据统计和快速操作
- 知识库管理: 框架已搭建,具体功能待实现
- 智能问数: 框架已搭建,具体功能待实现
- 用户管理: 用户列表展示
- 模型配置: 框架已搭建,具体功能待实现

### 4. 认证与权限
- 基于Pinia的状态管理
- 路由守卫保护
- 角色权限控制

### 5. 国际化
- 中文(简体) - 默认
- 英文
- 语言切换功能

## 安装依赖

```bash
cd aidp-ai-qa
bun install
```

## 开发

```bash
bun run dev
```

访问 http://localhost:3000

## 测试

### 单元测试

```bash
bun run test
```

### 测试覆盖率

```bash
bun run test:coverage
```

### E2E测试

```bash
bun run test:e2e
```

## 构建

```bash
bun run build
```

## 登录凭证

- 用户名: `admin`
- 密码: `admin123`
- 验证码: 自动生成的5位数字

## 路由

- `/login` - 登录页面
- `/` - AI问答页面
- `/admin/dashboard` - 管理后台Dashboard
- `/admin/knowledge-base` - 知识库管理
- `/admin/intelligent-qa` - 智能问数
- `/admin/users` - 用户管理
- `/admin/models` - 模型配置

## 特性

- ✅ TypeScript 严格模式
- ✅ Vue 3 Composition API
- ✅ Pinia 状态管理
- ✅ Vue Router 路由守卫
- ✅ Element Plus 按需导入
- ✅ vue-i18n 国际化
- ✅ Vitest 单元测试
- ✅ Playwright E2E测试
- ✅ 响应式设计
- ✅ 生产级工程架构

## License

MIT