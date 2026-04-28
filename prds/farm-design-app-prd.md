# HarvestHub 农场管理应用 PRD

> 版本：v2.0
> 创建日期：2026-04-28

---

## 1. 产品概述

### 1.1 产品定位

HarvestHub 是一款面向农场主的可视化农场管理工具，基于 **Harvest Harmony** 设计系统（"Cozy Productivity"理念）。用户通过实时交互管理作物、畜牧、库存和任务，系统自动计时推进农场动态发展。

### 1.2 核心价值

- **实时农场模拟**：作物自动生长，畜牧自动消耗，产出自动累积
- **可视化区域管理**：预设固定区域，区域内自由添加作物/畜牧
- **积分经济循环**：收获/完成任备获得积分，积分购买种子和解锁栏位
- **即时反馈**：所有操作都有视觉反馈（进度条更新、积分跳动、任务状态变化）

### 1.3 目标用户

小型农场主、农业爱好者、农场体验园区管理者

---

## 2. 功能范围

### 2.1 核心功能（P0）

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 作物实时生长 | 基于时间自动增长，浇水/施肥额外加速，100% 后可收获 | P0 |
| 作物浇水/施肥 | 点击按钮触发，消耗库存，增加生长进度加成 | P0 |
| 作物自动收获 | 作物成熟后可收获，自动入仓库 + 获得积分 | P0 |
| 空地块种植 | 点击空地块，从已有种子中选择品种种植 | P0 |
| 畜牧饥饿计时 | 畜牧饥饿度随时间自动上升，低于阈值报警 | P0 |
| 畜牧喂养 | 消耗库存中的 Animal Feed，降低饥饿度 | P0 |
| 畜牧产出累积 | 产出按时间自动累积，达到阈值可收取 | P0 |
| 产出收取 | 点击收取，产出入仓库 + 获得积分 | P0 |
| 畜牧栏位解锁 | 消耗 500 积分解锁新的畜牧栏位 | P0 |
| 库存管理 | 展示所有物品，分类筛选，使用/出售操作 | P0 |
| 种子购买 | 使用积分购买种子（胡萝卜/西红柿/卷心菜） | P0 |
| 物品出售 | 将农产品出售获得积分 | P0 |
| 任务系统 | 显示待办任务，点击切换完成状态并获得积分 | P0 |
| 数据持久化 | localStorage 自动保存，刷新数据不丢失 | P0 |
| 深色模式 | 跟随操作系统设置自动切换 | P0 |
| 桌面端专用 | 手机访问显示提示"请使用电脑编辑" | P0 |

### 2.2 非功能范围（本期不做）

- 移动端编辑支持
- 多农场切换
- 撤销/重做
- 作物批量操作
- 自定义新品种
- PNG 导出

---

## 3. 数据模型

### 3.1 区域模型（固定预设）

```
农场 = Farmstead Alpha
├── 作物区 × 8 个 Plot
│   ├── Plot A-1 (胡萝卜) - 初始示例数据
│   ├── Plot B-4 (西红柿) - 初始示例数据
│   ├── Plot C-2 (卷心菜) - 初始示例数据
│   ├── Plot D-1 (空)
│   ├── Plot D-2 (空)
│   ├── Plot E-1 (空)
│   ├── Plot E-2 (空)
│   └── Plot F-1 (空)
├── 畜牧区 × 4 个 Pen
│   ├── Highland Meadow (羊×12) - 初始示例数据
│   ├── Sunrise Coop (鸡×24) - 初始示例数据
│   ├── Pen C (锁定)
│   └── Pen D (锁定)
├── 库存 × N 个 Item
└── 任务 × N 个 Task
```

### 3.2 作物配置

```ts
CROP_CONFIG = {
  carrot: {
    name: 'Heritage Carrots', emoji: '🥕',
    baseGrowthTime: 14 * 60 * 1000,  // 14分钟
    waterBonus: 15,  fertilizeBonus: 10,
    harvestYield: 10, yieldItem: 'carrot', color: '#FF9800',
  },
  tomato: {
    name: 'Cherry Tomatoes', emoji: '🍅',
    baseGrowthTime: 20 * 60 * 1000,
    waterBonus: 15, fertilizeBonus: 10,
    harvestYield: 12, yieldItem: 'tomato', color: '#F44336',
  },
  cabbage: {
    name: 'Savoy Cabbage', emoji: '🥬',
    baseGrowthTime: 10 * 60 * 1000,
    waterBonus: 15, fertilizeBonus: 10,
    harvestYield: 8, yieldItem: 'cabbage', color: '#4CAF50',
  },
}
```

### 3.3 畜牧配置

```ts
LIVESTOCK_CONFIG = {
  sheep: {
    name: 'Merino Sheep', emoji: '🐑',
    hungerDrainRate: 0.5,  // 每30分钟+0.5%
    feedRestore: 30,
    productionAccumTime: 30 * 60 * 1000,  // 30分钟产1次
    productionYield: 1.5,  // kg/次
    productionItem: 'wool', color: '#E8E0D0',
  },
  chicken: {
    name: 'Leghorn Hens', emoji: '🐔',
    hungerDrainRate: 1.0,  // 每30分钟+1%
    feedRestore: 25,
    productionAccumTime: 10 * 60 * 1000,  // 10分钟产1次
    productionYield: 1,  // 个/次
    productionItem: 'egg', color: '#D4A843',
  },
}
```

### 3.4 数据结构

```ts
interface Plot {
  id: string;
  name: string;
  cropType: string | null;       // 'carrot' | 'tomato' | 'cabbage' | null
  growthPercent: number;         // 0-100
  status: 'empty' | 'growing' | 'ready';
  plantedAt: number | null;
  lastWatered: number | null;
  lastFertilized: number | null;
}

interface Pen {
  id: string;
  name: string;
  livestockType: string | null;  // 'sheep' | 'chicken' | null
  count: number;
  healthPercent: number;
  hungerPercent: number;          // 0-100
  accumulatedProduction: number;
  lastProductionAt: number | null;
  lastFedAt: number | null;
  status: 'empty' | 'active' | 'hungry' | 'locked';
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'seed' | 'produce' | 'tool' | 'resource';
  count: number;
  emoji: string;
  costPoints?: number;          // 种子价格
  sellPoints?: number;          // 农产品售价
}

interface Task {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'completed';
  urgency: 'overdue' | 'scheduled' | 'normal' | 'completed';
  createdAt: number;
  targetTime?: number;
}

interface FarmState {
  name: string;
  points: number;
  plots: Plot[];                // 固定 8 个
  pens: Pen[];                   // 固定 4 个
  inventory: InventoryItem[];
  tasks: Task[];
  unlockedPenCount: number;      // 已解锁畜牧栏位数
  createdAt: number;
  updatedAt: number;
}
```

### 3.5 积分系统

| 获得方式 | 积分 |
|----------|------|
| 收获作物 | +10 |
| 收取畜牧产出 | +5 × 产出数量 |
| 完成任务 | +20 |

| 消耗方式 | 积分 |
|----------|------|
| 购买种子（胡萝卜/西红柿/卷心菜） | 50/60/40 |
| 解锁畜牧栏位 | 500 |

---

## 4. 页面结构

### 4.1 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Overview | 首页总览 |
| `/crops` | Crops | 作物管理 |
| `/livestock` | Livestock | 畜牧监控 |
| `/inventory` | Inventory | 库存管理 |
| `/panorama` | Panorama | 全景地图 |

### 4.2 布局

所有页面共享布局：
- **侧边导航栏**（固定左侧，md+ 显示）：导航链接 + 用户信息 + 快捷操作
- **顶部应用栏**（固定顶部，md+ 左偏移 256px）：Logo + 搜索 + 天气/日历按钮 + 积分显示 + 头像
- **主内容区**：页面具体内容
- **悬浮按钮 FAB**（固定右下角）：快捷操作

### 4.3 Overview 页面 (`/`)

```
[侧边导航栏] [顶部应用栏]
           [左侧：Quick Stats + Pending Tasks] [右侧：等轴测农场地图]
```

- Quick Stats 卡片：Harvest Readiness 进度条、Animal Happiness 进度条、Irrigation Supply 进度条
- Pending Tasks 列表：可点击切换完成状态
- 农场地图区域：等轴测卡片叠加 + 控制按钮 + 天气 Widget

### 4.4 Crops 页面 (`/crops`)

```
[顶部状态栏] [作物 Plot 卡片网格]
```

- 顶部状态栏：Water level + Fertilizer 库存
- Plot 卡片（生长中）：作物图区域 + 状态标签 + 进度条 + Water/Fertilize 按钮
- Plot 卡片（已成熟）：Harvest Now 按钮（绿色）
- 空地块卡片：点击弹出种植选择框

### 4.5 Livestock 页面 (`/livestock`)

```
[过滤/操作按钮] [Pen 卡片网格]
```

- Pen 卡片：畜牧图 + 状态标签 + Health/Hunger 进度条 + 产出状态 + Feed/Collect 按钮
- 锁定栏位卡片：显示解锁费用 + Unlock 按钮

### 4.6 Inventory 页面 (`/inventory`)

```
[分类筛选按钮] [统计卡片行] [物品格子网格]
```

- 分类按钮：All / Seeds / Produce / Tools / Resources
- 统计卡片：Storage Capacity、Irrigation Supply、Farm Energy
- 物品格子：物品图 + 数量徽章 + 进度条 + Use/Sell 按钮

### 4.7 Panorama 页面 (`/panorama`)

```
[左侧：图例 + Daily Goal] [中心：农场地图] [右侧：Zone 详情卡片]
```

- 农场地图：背景网格 + 区域块 + 悬停图钉
- 图钉悬停显示详情弹层
- Zone 详情卡片：状态 + 进度条

---

## 5. 视觉规范

### 5.1 设计系统

基于 **Harvest Harmony**（Cozy Productivity 理念）：温暖自然色系 + Tactile Skeuomorphic 质感。

### 5.2 配色方案

| 用途 | 色值 | Tailwind 类 |
|------|------|------------|
| Primary（森林绿） | `#336421` | `primary` |
| Primary Container | `#4b7e37` | `primary-container` |
| On Primary | `#ffffff` | `on-primary` |
| On Primary Container | `#e8ffd8` | `on-primary-container` |
| Secondary（赤陶色） | `#954924` | `secondary` |
| Secondary Container | `#ff9e72` | `secondary-container` |
| On Secondary | `#ffffff` | `on-secondary` |
| Tertiary（天蓝色） | `#00617a` | `tertiary` |
| Tertiary Container | `#2d7a94` | `tertiary-container` |
| Surface | `#fef9f0` | `surface` |
| Surface Container Low | `#f8f3ea` | `surface-container-low` |
| Surface Container High | `#ece8df` | `surface-container-high` |
| Background | `#fef9f0` | `background` |
| On Background | `#1d1c16` | `on-background` |
| On Surface | `#1d1c16` | `on-surface` |
| On Surface Variant | `#42493d` | `on-surface-variant` |
| Outline | `#72796c` | `outline` |
| Outline Variant | `#c2c9b9` | `outline-variant` |
| Error | `#ba1a1a` | `error` |

### 5.3 字体

- **Plus Jakarta Sans**（Google Fonts）
- 权重：400 / 500 / 600 / 700 / 800
- 字号层级：h1 (32px/700) / h2 (24px/700) / body-lg (18px/500) / body-md (16px/400) / label-sm (12px/600)

### 5.4 圆角

| 元素 | 圆角 |
|------|------|
| 默认元素 | `rounded` (4px) |
| 按钮/卡片 | `rounded-lg` (8px) |
| 区块容器 | `rounded-xl` (12px) |
| 大卡片 | `rounded-2xl` (16px) |
| 超大卡片 | `rounded-[2rem]` (32px) |

### 5.5 阴影与质感

- **内高光**（卡片顶部边缘）：`box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4)`
- **Tactile 按钮**：`box-shadow: 0 2px 0 0 rgba(0,0,0,0.1)`，按下后 `translateY(2px)` 阴影消失
- **大 Tactile 按钮**：`box-shadow: 0 4px 0 0 #77330f`
- **Plot Card**：`box-shadow: 0 4px 12px -2px rgba(75,126,55,0.15)`

### 5.6 图标

Material Symbols Outlined（Google Fonts），通过 `material-symbols-outlined` 类使用。

### 5.7 深色模式

跟随操作系统设置（`darkMode: 'class'`），Tailwind `dark:` 前缀控制所有颜色变量。

---

## 6. 技术方案

### 6.1 技术栈

| 类别 | 技术选型 |
|------|---------|
| 框架 | React 18 + Vite |
| 样式 | Tailwind CSS + 自定义 CSS 变量 |
| 路由 | React Router DOM v6 (HashRouter) |
| 状态管理 | React Context + useState |
| 数据持久化 | localStorage |
| 深色模式 | Tailwind `darkMode: 'class'` + OS 跟随 |
| 图标 | Material Symbols Outlined (Google Fonts CDN) |
| 字体 | Plus Jakarta Sans (Google Fonts CDN) |
| 部署 | GitHub Pages (`/farmer/` base path) |

### 6.2 项目结构

```
src/
├── App.jsx                          # 路由 + FarmProvider
├── main.jsx                          # 入口
├── index.css                         # Tailwind + 全局样式
├── hooks/
│   └── useFarm.jsx                  # FarmContext + 所有 state + actions + tick 计时器
├── components/
│   └── layout/
│       ├── MainLayout.jsx           # 布局容器
│       ├── SideNavBar.jsx           # 侧边导航
│       ├── TopAppBar.jsx            # 顶部应用栏
│       └── FAB.jsx                  # 悬浮操作按钮
└── pages/harvesthub/
    ├── OverviewPage.jsx              # 总览页
    ├── CropsPage.jsx                # 作物管理页
    ├── LivestockPage.jsx            # 畜牧监控页
    ├── InventoryPage.jsx            # 库存管理页
    └── PanoramaPage.jsx             # 全景地图页
```

### 6.3 计时器（Tick）机制

每 1 秒（`TICK_INTERVAL = 1000`）触发一次 tick：
- 所有作物：`growthPercent` 按已种植时间实时计算（含浇水/施肥加成）
- 所有畜牧：`hungerPercent` 按上次喂食时间实时增加
- 所有畜牧：`accumulatedProduction` 按上次产出时间实时累积

### 6.4 localStorage 策略

- Key：`harvesthub_farm`
- 值：JSON 序列化的 `FarmState` 对象
- 写入：任何状态变更后 debounce 500ms 自动保存

---

## 7. 初始数据

### 7.1 预设作物

| ID | 名称 | 初始进度 | 状态 |
|----|------|---------|------|
| p1 | Plot A-1: Heritage Carrots | 65% | growing |
| p2 | Plot B-4: Cherry Tomatoes | 92% | growing |
| p3 | Plot C-2: Savoy Cabbage | 30% | growing |
| p4-p8 | 空地块 | 0% | empty |

### 7.2 预设畜牧

| ID | 名称 | 类型 | 健康 | 饥饿 | 产出 | 状态 |
|----|------|------|------|------|------|------|
| pen1 | Highland Meadow | Merino Sheep ×12 | 94% | 20% | 18.5kg | active |
| pen2 | Sunrise Coop | Leghorn Hens ×24 | 88% | 72% | 42个 | hungry |
| pen3 | Pen C | — | — | — | — | locked |
| pen4 | Pen D | — | — | — | — | locked |

### 7.3 初始库存

| ID | 名称 | 类别 | 数量 | 积分价格 | 售价 |
|----|------|------|------|---------|------|
| seed-carrot | Carrot Seeds | seed | 20 | 50 | — |
| seed-tomato | Tomato Seeds | seed | 15 | 60 | — |
| seed-cabbage | Cabbage Seeds | seed | 10 | 40 | — |
| carrot | Harvested Carrots | produce | 0 | — | 10 |
| tomato | Harvested Tomatoes | produce | 0 | — | 12 |
| cabbage | Harvested Cabbage | produce | 0 | — | 8 |
| wool | Wool | produce | 0 | — | 30 |
| egg | Egg | produce | 0 | — | 5 |
| trowel | Iron Trowel | tool | 1 | — | 0 |
| fertilizer | Mineral Fertilizer | resource | 5 | — | 15 |
| feed | Animal Feed | resource | 10 | — | 5 |

### 7.4 初始任务

| ID | 标签 | 图标 | 状态 | 紧急度 |
|----|------|------|------|--------|
| t1 | Water Sector B | water_drop | pending | overdue |
| t2 | Feed Chickens | grain | pending | scheduled |
| t3 | Restock Fertilizer | science | completed | completed |
| t4 | Harvest Tomatoes | eco | pending | normal |

### 7.5 初始积分

`points: 4250`

---

## 8. 验收标准

### 8.1 功能验收

- [ ] 作物进度条实时增长，刷新页面后保持正确进度
- [ ] 浇水/施肥按钮点击后有加成效果
- [ ] 作物达到 100% 后状态变为 "Harvest Ready"，可点击收获
- [ ] 收获后产出自动进入库存，积分增加
- [ ] 点击空地块可选择品种种植，消耗种子
- [ ] 畜牧饥饿度随时间上升，显示 "Hungry" 状态
- [ ] 喂食后饥饿度下降，产出持续累积
- [ ] 产出达到阈值后可收取，积分增加
- [ ] 积分不足时无法购买种子或解锁栏位
- [ ] 任务点击后切换完成状态，积分增加
- [ ] 所有数据刷新页面后不丢失
- [ ] 深色模式跟随系统自动切换

### 8.2 视觉验收

- [ ] HarvestHub 视觉风格一致（暖色 parchment 背景 + 森林绿主色）
- [ ] 按钮有 tactile 按压效果（下沉 + 阴影消失）
- [ ] 卡片有 inner-highlight 质感
- [ ] Material Symbols Outlined 图标正常显示
- [ ] Plus Jakarta Sans 字体正常加载
- [ ] 所有进度条实时更新

### 8.3 边界情况

- [ ] 库存中肥料为 0 时 Fertilize 按钮仍可点击（提示库存不足）
- [ ] 库存中饲料为 0 时 Feed 按钮仍可点击（提示库存不足）
- [ ] 积分不足时 Unlock 按钮仍可点击（提示积分不足）
- [ ] 空农场（所有 Plot 空）时 Crops 页面正常显示

---

## 9. 后续迭代方向（本期不做）

- 移动端编辑支持
- 多农场切换
- 撤销/重做
- 作物批量操作
- 自定义新品种
- PNG 导出
- 畜牧购买（从市场购买新品种）
- 作物品种扩展（小麦、草莓等）
- 天气系统影响（雨天自动浇水）
- 成就系统
