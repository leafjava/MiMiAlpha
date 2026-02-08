# 风险评估系统增强功能

## 新增功能概述

### 1. 链上历史交易查询
- 查询地址的所有历史交易记录
- 显示交易哈希、发送方、接收方、金额、时间戳、状态
- 支持筛选和排序

### 2. 黑名单地址检测
- 检测地址是否在黑名单中
- 显示风险标签（如：诈骗、洗钱、高风险等）
- 显示被举报次数和最后举报时间

### 3. 资金流动分析
- 统计总流入/流出金额
- 分析交易频率和模式
- 识别可疑行为（如：高频小额转账、与风险地址交互）

### 4. 地址关联分析
- 分析地址的关联网络
- 识别频繁交易对手
- 发现可疑的资金中转地址
- 评估关联地址的风险等级

## UI 设计

### 标签页导航
```
[📊 基础评估] [📜 历史交易] [🚫 黑名单检测] [💰 资金流动] [🔗 地址关联]
```

### 各标签页内容

#### 1. 基础评估（原有功能）
- 输入表单
- 风险评分
- 风险原因
- 建议

#### 2. 历史交易
```
交易列表：
┌────────────────────────────────────────────────────┐
│ 交易哈希: 0x1234...5678                            │
│ 从: 0xabcd...ef01  →  到: 0x9876...5432           │
│ 金额: 100 USDD                                     │
│ 时间: 2026-02-08 14:30:25                         │
│ 状态: ✅ 成功                                      │
└────────────────────────────────────────────────────┘
```

#### 3. 黑名单检测
```
检测结果：
┌────────────────────────────────────────────────────┐
│ 地址: 0xabcd...ef01                                │
│ 黑名单状态: ✅ 安全 / ❌ 风险                       │
│ 风险标签: [高频交易] [新地址]                      │
│ 被举报次数: 0                                      │
│ 最后举报: N/A                                      │
└────────────────────────────────────────────────────┘
```

#### 4. 资金流动
```
流动统计：
┌────────────────────────────────────────────────────┐
│ 总流入: 5,000 USDD                                 │
│ 总流出: 3,500 USDD                                 │
│ 交易笔数: 156                                      │
│ 关联地址数: 42                                     │
│                                                    │
│ 可疑模式:                                          │
│ ⚠️ 检测到高频小额转账（可能是洗钱行为）            │
│ ⚠️ 与已知风险地址有交互                            │
└────────────────────────────────────────────────────┘
```

#### 5. 地址关联
```
关联地址列表：
┌────────────────────────────────────────────────────┐
│ 地址: 0xabcd...ef01                                │
│ 关系类型: 频繁交易对手                             │
│ 交互次数: 25                                       │
│ 总金额: 1,200 USDD                                 │
│ 风险等级: 🟢 低风险                                │
└────────────────────────────────────────────────────┘
```

## 技术实现

### API 接口（需要后端支持）

1. **历史交易查询**
```typescript
GET /api/risk/transactions/:address
Response: TransactionHistory[]
```

2. **黑名单检测**
```typescript
GET /api/risk/blacklist/:address
Response: BlacklistCheck
```

3. **资金流动分析**
```typescript
GET /api/risk/fund-flow/:address
Response: FundFlow
```

4. **地址关联分析**
```typescript
GET /api/risk/relations/:address
Response: AddressRelation[]
```

### 前端状态管理

```typescript
const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'blacklist' | 'flow' | 'relation'>('basic');
const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
const [blacklistCheck, setBlacklistCheck] = useState<BlacklistCheck | null>(null);
const [fundFlow, setFundFlow] = useState<FundFlow | null>(null);
const [addressRelations, setAddressRelations] = useState<AddressRelation[]>([]);
```

## CSS 样式

需要添加的新样式：
- `.risk-tabs` - 标签页导航容器
- `.risk-tab` - 单个标签按钮
- `.risk-tab.active` - 激活状态的标签
- `.transaction-list` - 交易列表容器
- `.transaction-item` - 单个交易项
- `.blacklist-result` - 黑名单检测结果
- `.fund-flow-stats` - 资金流动统计
- `.relation-list` - 关联地址列表

## 下一步

1. 完善 RiskAssessment.tsx 组件
2. 添加对应的 CSS 样式
3. 集成 TRON API 获取真实数据
4. 添加数据可视化（图表）
5. 优化加载状态和错误处理
