# 模型市场二 (Model Market 2)

## 概述

模型市场二是一个基于订阅模式的 AI 模型服务市场，参考了 AttentionLive 项目中的 Staking 页面设计和订阅支付逻辑。

## 功能特性

### 1. 市场浏览
- 展示可订阅的 AI 模型列表
- 按分类筛选（全部、交易、风险分析、预测）
- 显示模型详情（价格、时长、订阅者数量、评分）

### 2. 订阅管理
- 订阅 AI 模型服务
- 查看我的订阅列表
- 续订和取消订阅
- 显示订阅剩余天数

### 3. 用户界面
- 响应式设计，支持移动端
- 深色主题，橙色主色调
- 平滑动画和过渡效果
- 国际化支持（中文/英文）

## 技术实现

### 参考来源
- **AttentionLive/app/(with-nav)/staking/page.tsx**
  - 订阅状态管理
  - 合约交互模式
  - 卡片组件设计
  - 标签页切换逻辑

### 核心组件

#### ModelMarket2.tsx
主组件，包含：
- 市场浏览页面
- 我的订阅页面
- 余额显示
- 分类筛选

#### ModelCard
模型卡片组件，显示：
- 模型名称和图标
- 提供者地址
- 评分和订阅者数量
- 价格和订阅时长
- 订阅按钮

#### MySubscriptionCard
订阅卡片组件，显示：
- 订阅状态
- 开始和结束日期
- 剩余天数
- 续订和取消按钮

### 样式设计

#### ModelMarket2.css
- 深色渐变背景
- 玻璃态效果（backdrop-filter）
- 橙色主题色（#FFA500）
- 悬停动画效果
- 响应式网格布局

## 订阅流程

1. **浏览模型**
   - 用户在市场页面浏览可用的 AI 模型
   - 可以按分类筛选

2. **订阅模型**
   - 点击订阅按钮
   - 使用 USDT 支付订阅费用
   - 合约记录订阅信息

3. **使用模型**
   - 在订阅期间可以访问模型服务
   - 查看订阅剩余时间

4. **管理订阅**
   - 在"我的订阅"页面查看所有订阅
   - 可以续订或取消订阅

## 合约集成（待实现）

### 需要实现的合约功能

1. **订阅合约**
   ```solidity
   - createSubscription(modelId, duration)
   - cancelSubscription(subscriptionId)
   - renewSubscription(subscriptionId)
   - getSubscription(subscriptionId)
   - getUserSubscriptions(userAddress)
   ```

2. **模型注册合约**
   ```solidity
   - registerModel(name, price, duration)
   - updateModel(modelId, price, duration)
   - getModel(modelId)
   - getAllModels()
   ```

3. **支付处理**
   - USDT 代币授权
   - 订阅费用支付
   - 退款处理

## 国际化

### 支持的语言
- 中文简体 (zh-CN)
- 英文 (en)

### 翻译键
所有文本都使用 `modelMarket2.*` 命名空间，例如：
- `modelMarket2.title`
- `modelMarket2.subscribe`
- `modelMarket2.marketplace`

## 导航集成

在 App.tsx 中添加了新的导航按钮：
```tsx
<button onClick={() => setCurrentPage('model2')}>
  🤖 模型市场二
</button>
```

## 下一步开发

1. **合约集成**
   - 实现订阅合约
   - 连接 wagmi hooks
   - 处理交易状态

2. **数据获取**
   - 从合约读取模型列表
   - 获取用户订阅信息
   - 实时更新余额

3. **功能增强**
   - 添加搜索功能
   - 实现评分系统
   - 添加模型详情页
   - 支持自动续订

4. **用户体验**
   - 添加加载状态
   - 错误处理和提示
   - 交易确认弹窗
   - 成功/失败通知

## 文件结构

```
Hackathon/frontend/src/
├── components/
│   ├── ModelMarket2.tsx      # 主组件
│   └── ModelMarket2.css      # 样式文件
├── locales/
│   ├── zh-CN.json            # 中文翻译
│   └── en.json               # 英文翻译
└── App.tsx                   # 路由配置
```

## 使用方法

1. 连接钱包
2. 点击导航栏的"🤖 模型市场二"
3. 浏览可用的 AI 模型
4. 点击"订阅"按钮订阅模型
5. 在"我的订阅"页面管理订阅

## 注意事项

- 当前使用模拟数据，需要连接实际合约
- 订阅支付需要 USDT 代币授权
- 确保钱包有足够的 USDT 余额
- 订阅状态会在合约中记录
