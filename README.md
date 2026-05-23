# ChengXiang V4 — 城乡体验平台

城乡社交体验平台前端应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 6
- **样式**: Tailwind CSS v4 (CSS-based 主题配置)
- **图标**: Lucide React

## 快速开始

```bash
npm install
npm run dev
npm run build
```

## 设计系统

项目使用统一的设计变量（Design Tokens），定义在 `src/styles/theme.css` 中。

### 全局色板

| Token | 值 | Tailwind 类名 |
|---|---|---|
| 页面背景 | `#fafaf7` | `bg-ds-bg` |
| 卡片/面板 | `#ffffff` | `bg-ds-surface` |
| 输入框/软底色 | `#f7f7f5` | `bg-ds-surface-soft` |
| 品牌色 | `#7C72FF` | `bg-ds-brand` |
| 品牌浅色 | `#A79FFF` | `text-ds-brand-dark` |
| 主文本 | `#111111` | `text-ds-text` |
| 次要文本 | `#666666` | `text-ds-text-muted` |
| 辅助文本 | `#999999` | `text-ds-text-subtle` |
| 边框 | `#EAEAEA` | `border-ds-border` |
| 标签底 | `#f3f4f6` | `bg-ds-chip` |

### 圆角规范

| Token | 值 | Tailwind 类名 | 用途 |
|---|---|---|---|
| `ds-radius-xl` | 28px | `rounded-ds-xl` | 大卡片、底部弹窗 |
| `ds-radius-lg` | 20px | `rounded-ds-lg` | 中卡片、按钮、弹窗 |
| `ds-radius-md` | 14px | `rounded-ds-md` | 小卡片、标签 |
| `ds-radius-full` | 9999px | `rounded-ds-full` | 胶囊、圆形 |

### 阴影规范

| Token | 值 | Tailwind 类名 |
|---|---|---|
| 软阴影 | `0 10px 30px rgba(0,0,0,0.06)` | `shadow-ds-soft` |
| 浮动阴影 | `0 16px 40px rgba(124,114,255,0.35)` | `shadow-ds-floating` |

## 页面结构

```
App.tsx                       — 根组件，路由与底部导航
├── store/AppContext.tsx      — 全局状态（当前用户、社区、登录/登出）
├── data/users.ts             — 30个演示用户数据（头像/标签/状态/社区）
├── BottomNav.tsx             — 底部导航栏（横向胶囊+号按钮）
│   ├── 主页（发现）            — DiscoverPage
│   ├── 探索                  — MapPage + 列表模式
│   ├── [+] 发布               — PublishPage（弹窗）
│   ├── 社区                  — CommunityPage
│   ├── 聊天                  — ChatPage
│   └── 我的                  — MyPage
├── DiscoverPage.tsx          — 主页（社区社交视图）
│   ├── 未加入社区：用户大头像居中 + 标签信息
│   └── 已加入社区：同社区成员头像随机分布 + 打招呼/查看主页
├── MapPage.tsx               — 探索页（地图 + 浮动列表按钮切换内容流）
├── CommunityPage.tsx         — 社区页（社区列表/标签网络）
├── ChatPage.tsx              — 聊天页（会话列表/AI分身/聊天）
├── PublishPage.tsx           — 发布页（图文/视频/外链/活动/打卡）弹窗
├── MyPage.tsx                — 我的页（渐变头部/统计/标签/数字分身入口/退出登录）
├── LoginPage.tsx             — 登录页（演示用户快速选择 / 手机邮箱登录）
├── RegisterPage.tsx          — 注册页（多步骤）
├── TagsPage.tsx              — 标签管理页（子页面）
├── DigitalAvatarPage.tsx     — 数字分身配置页（子页面）
└── AdminPage.tsx             — 管理后台（子页面）
```

## 演示用户数据

- **30个用户**，头像文件位于 `public/avatars/Frame 14~43.jpg`
- 统一密码：`123`
- 随机分配身份标签、个性标签、个人状态
- 约75%用户随机分配到4个社区（竹林数字村/漓江民宿联盟/山野探索队/有机农夫市集），25%无社区
- 登录页可以展开演示用户网格，点击头像一键登录

## 开发约定

- 所有颜色从设计变量中引用，避免硬编码色值
- 圆角统一使用 `rounded-ds-*` 系列类名
- 阴影统一使用 `shadow-ds-soft` 或 `shadow-ds-floating`
- Tailwind CSS v4 使用 `@theme inline` 进行 CSS 层配置（无 `tailwind.config.js`）
- 全局状态通过 React Context (`store/AppContext.tsx`) 管理，使用 `useApp()` hook 访问