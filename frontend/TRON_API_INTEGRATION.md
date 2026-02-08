# TRON 链上数据集成指南

## 📡 API 配置

### 使用的网络
- **Nile 测试网**：https://nile.trongrid.io
- **TronScan API**：https://nileapi.tronscan.org
- **区块浏览器**：https://nile.tronscan.org

### 为什么选择 Nile 测试网？
1. 无需 API key
2. QPS 限流 50 单 IP（足够开发使用）
3. 免费水龙头：https://nileex.io/join/getJoinPage
4. 每日可领取 2000 TRX

## 🔧 已实现的功能

### 1. 配置文件（src/config/tron.ts）

```typescript
// 网络配置
export const TRON_CONFIG = {
  nile: {
    fullNode: 'https://nile.trongrid.io',
    solidityNode: 'https://nile.trongrid.io',
    eventServer: 'https://nile.trongrid.io',
    explorer: 'https://nile.tronscan.org',
    faucet: 'https://nileex.io/join/getJoinPage',
  },
};

// TronScan API
export const TRONSCAN_API = {
  base: 'https://nileapi.tronscan.org',
  getAccount: (address) => `${base}/api/account?address=${address}`,
  getTransactions: (address, limit) => `${base}/api/transaction?...`,
  getTRC20Transfers: (address, limit) => `${base}/api/token_trc20/transfers?...`,
};
```

### 2. 服务层（src/services/tronService.ts）

#### 核心方法

**获取账户信息**
```typescript
TronService.getAccount(address: string)
// 返回：账户余额、创建时间、资源等信息
```

**获取交易历史**
```typescript
TronService.getTransactions(address: string, limit: number)
// 返回：交易列表，包含哈希、金额、时间戳、状态等
```

**分析资金流动**
```typescript
TronService.analyzeFundFlow(address: string)
// 返回：
// - total_in: 总流入
// - total_out: 总流出
// - transaction_count: 交易笔数
// - unique_addresses: 关联地址数
```

**检测可疑模式**
```typescript
TronService.detectSuspiciousPatterns(transactions)
// 检测：
// - 高频交易（平均间隔 < 1分钟）
// - 小额高频转账（可能洗钱）
// - 异常交易时间（深夜交易）
// - 大量未确认交易
```

**分析地址关联**
```typescript
TronService.analyzeAddressRelations(address: string)
// 返回：关联地址列表，包含：
// - 关系类型（频繁交易对手、资金中转等）
// - 交互次数
// - 总交易金额
// - 风险等级（低/中/高）
```

## 📊 数据结构

### 交易数据（TronScanTransaction）
```typescript
interface TronScanTransaction {
  hash: string;              // 交易哈希
  block: number;             // 区块高度
  timestamp: number;         // 时间戳
  ownerAddress: string;      // 发送方
  toAddress: string;         // 接收方
  contractType: number;      // 合约类型
  confirmed: boolean;        // 是否确认
  contractData?: {
    amount?: number;         // 金额（Sun）
    asset_name?: string;     // 资产名称
  };
  cost?: {
    net_fee?: number;        // 网络费用
    energy_fee?: number;     // 能量费用
  };
}
```

### 账户数据
```typescript
interface TronAccount {
  address: string;
  balance: number;           // 余额（Sun）
  create_time: number;
  latest_opration_time: number;
  account_resource?: {
    energy_usage: number;
    frozen_balance_for_energy: {
      frozen_balance: number;
    };
  };
}
```

## 🎯 使用示例

### 示例 1：查询地址交易历史

```typescript
import { TronService } from './services/tronService';

// 查询交易
const address = 'TYour...Address';
const transactions = await TronService.getTransactions(address, 20);

// 格式化显示
transactions.forEach(tx => {
  console.log(`
    交易哈希: ${tx.hash}
    从: ${TronService.formatAddress(tx.ownerAddress)}
    到: ${TronService.formatAddress(tx.toAddress)}
    金额: ${TronService.sunToTrx(tx.contractData?.amount || 0)} TRX
    时间: ${TronService.formatTimestamp(tx.timestamp)}
    状态: ${tx.confirmed ? '已确认' : '未确认'}
  `);
});
```

### 示例 2：分析资金流动

```typescript
const flowData = await TronService.analyzeFundFlow(address);

console.log(`
  总流入: ${flowData.total_in} TRX
  总流出: ${flowData.total_out} TRX
  交易笔数: ${flowData.transaction_count}
  关联地址: ${flowData.unique_addresses.size}
`);

// 检测可疑模式
const patterns = TronService.detectSuspiciousPatterns(transactions);
patterns.forEach(pattern => {
  console.log(`⚠️ ${pattern}`);
});
```

### 示例 3：分析地址关联

```typescript
const relations = await TronService.analyzeAddressRelations(address);

relations.forEach(relation => {
  console.log(`
    地址: ${TronService.formatAddress(relation.address)}
    关系: ${relation.relation_type}
    交互: ${relation.interaction_count} 次
    金额: ${relation.total_value} TRX
    风险: ${relation.risk_level}
  `);
});
```

## 🧪 测试地址

### Nile 测试网地址示例

可以使用以下测试地址进行测试：

1. **活跃地址**（有交易记录）：
   - 从水龙头获取测试币后的地址
   - 或在 https://nile.tronscan.org 上找到活跃地址

2. **获取测试币**：
   - 访问：https://nileex.io/join/getJoinPage
   - 输入你的测试网地址
   - 每天可领取 2000 TRX

## 🔍 API 限制

### TronGrid API
- **QPS 限制**：50 请求/秒/IP（无 API key）
- **每日限制**：无限制
- **响应时间**：通常 < 1秒

### TronScan API
- **QPS 限制**：50 请求/秒/IP
- **每日限制**：无限制
- **数据延迟**：实时（< 3秒）

## ⚠️ 注意事项

### 1. 地址格式
- TRON 地址以 `T` 开头
- 长度为 34 个字符
- 示例：`TYour1234567890Address1234567890`

### 2. 金额单位
- 链上存储单位：Sun
- 显示单位：TRX
- 转换：1 TRX = 1,000,000 Sun

### 3. 错误处理
```typescript
try {
  const data = await TronService.getTransactions(address);
} catch (error) {
  console.error('查询失败:', error);
  // 显示友好的错误提示
}
```

### 4. 跨域问题
如果遇到 CORS 错误，可以：
- 使用代理服务器
- 配置 Vite 代理
- 使用服务端 API

## 🚀 性能优化

### 1. 缓存策略
```typescript
const cache = new Map();

async function getCachedTransactions(address: string) {
  if (cache.has(address)) {
    return cache.get(address);
  }
  
  const data = await TronService.getTransactions(address);
  cache.set(address, data);
  
  // 5分钟后清除缓存
  setTimeout(() => cache.delete(address), 5 * 60 * 1000);
  
  return data;
}
```

### 2. 分页加载
```typescript
// 首次加载 20 条
const firstBatch = await TronService.getTransactions(address, 20);

// 滚动加载更多
const moreBatch = await TronService.getTransactions(address, 40);
```

### 3. 并发请求
```typescript
const [account, transactions, trc20] = await Promise.all([
  TronService.getAccount(address),
  TronService.getTransactions(address),
  TronService.getTRC20Transactions(address),
]);
```

## 📚 参考资源

### 官方文档
- **TronGrid API**：https://developers.tron.network/reference/full-node-api-overview
- **TronScan API**：https://docs.tronscan.org/api-endpoints
- **Nile 测试网**：https://nileex.io

### 社区资源
- **Discord**：#gwdc·hackathon-support
- **GitHub**：TRON 官方仓库
- **论坛**：TRON 开发者论坛

## 🎓 下一步

1. ✅ 配置文件已创建
2. ✅ 服务层已实现
3. ⏳ 集成到 RiskAssessment 组件
4. ⏳ 添加加载状态和错误处理
5. ⏳ 优化用户体验

---

**文档版本**：v1.0  
**更新时间**：2026-02-08  
**网络**：Nile 测试网  
**状态**：可用 ✅
