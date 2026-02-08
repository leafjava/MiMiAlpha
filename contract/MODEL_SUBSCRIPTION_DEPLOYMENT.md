# 模型订阅合约部署指南

## 概述

ModelSubscription 合约实现了基于订阅的 AI 模型服务市场，用户可以使用 USDT 订阅模型服务。

## 合约功能

### 核心功能
1. **模型注册** - 提供者可以注册 AI 模型
2. **创建订阅** - 用户支付 USDT 订阅模型
3. **续订订阅** - 延长订阅期限
4. **取消订阅** - 取消订阅并获得部分退款（50%）

### 订阅状态
- `Active` (0) - 活跃订阅
- `Expired` (1) - 已过期
- `Cancelled` (2) - 已取消
- `Refunded` (3) - 已退款

## 部署步骤

### 1. 确保已部署基础合约

首先确保 MockERC20 (USDT) 合约已部署：

```bash
cd Hackathon/contract
node scripts/deploy-all.js
```

### 2. 部署 ModelSubscription 合约

```bash
node scripts/deploy-model-subscription.js
```

部署脚本会自动：
- 部署 ModelSubscription 合约
- 注册 6 个示例模型
- 更新合约地址到配置文件
- 同步地址到前端

### 3. 验证部署

检查 `contract-addresses.json` 文件，应该包含：

```json
{
  "contracts": {
    "MockERC20": "0x...",
    "ModelSubscription": "0x..."
  }
}
```

## 示例模型

部署脚本会自动注册以下模型：

1. **AI Trading Bot Pro** - 100 USDT/30天
2. **Risk Assessment AI** - 150 USDT/30天
3. **Market Predictor** - 200 USDT/30天
4. **Portfolio Optimizer** - 120 USDT/30天
5. **Smart Contract Auditor** - 180 USDT/30天
6. **Sentiment Analyzer** - 90 USDT/30天

## 前端集成

### 1. 合约地址自动同步

部署脚本会自动将合约地址同步到：
```
Hackathon/frontend/src/contracts/contract-addresses.json
```

### 2. 使用方法

前端组件 `ModelMarket2.tsx` 已经集成了合约交互：

```typescript
import contractAddresses from '../contracts/contract-addresses.json';
import ModelSubscriptionABI from '../contracts/ModelSubscription.json';

const MODEL_SUBSCRIPTION_ADDRESS = contractAddresses.contracts?.ModelSubscription;
```

## 用户操作流程

### 订阅模型

1. **授权 USDT**
   ```solidity
   USDT.approve(ModelSubscription, amount)
   ```

2. **创建订阅**
   ```solidity
   ModelSubscription.createSubscription(modelId, duration)
   ```

### 续订订阅

```solidity
ModelSubscription.renewSubscription(subscriptionId)
```

### 取消订阅

```solidity
ModelSubscription.cancelSubscription(subscriptionId)
```

## 合约参数

### 平台费率
- 默认：3% (300 basis points)
- 可通过 `setPlatformFeeRate()` 修改（仅管理员）

### 退款政策
- 取消订阅可获得 50% 剩余时间的退款
- 计算公式：`refund = price * remainingTime * 50 / (totalDuration * 100)`

## 测试

### 1. 获取测试 USDT

```bash
# 在 Hardhat console 中
const MockERC20 = await ethers.getContractAt("MockERC20", USDT_ADDRESS);
await MockERC20.mint(userAddress, ethers.parseUnits("10000", 18));
```

### 2. 测试订阅流程

```javascript
// 1. 授权
await usdt.approve(subscriptionAddress, ethers.parseUnits("1000", 18));

// 2. 订阅模型 1，30天
await subscription.createSubscription(1, 30);

// 3. 查看订阅
const subs = await subscription.getUserSubscriptions(userAddress);
console.log("User subscriptions:", subs);

// 4. 续订
await subscription.renewSubscription(1);

// 5. 取消
await subscription.cancelSubscription(1);
```

## 管理员功能

### 提取平台费用

```solidity
ModelSubscription.withdrawPlatformFees()
```

### 修改费率

```solidity
ModelSubscription.setPlatformFeeRate(newRate) // 最大 1000 (10%)
```

## 注意事项

1. **USDT 授权**
   - 用户必须先授权 USDT 才能订阅
   - 建议授权较大额度以避免频繁授权

2. **订阅时长**
   - 以天为单位
   - 最小 1 天，最大 365 天

3. **退款机制**
   - 只有活跃订阅可以取消
   - 退款金额基于剩余时间计算
   - 退款比例固定为 50%

4. **Gas 优化**
   - 批量操作时注意 gas 消耗
   - 建议使用事件监听而非频繁查询

## 故障排除

### 问题：交易失败 "USDT transfer failed"
**解决**：确保用户已授权足够的 USDT

### 问题：无法读取模型信息
**解决**：检查 modelId 是否有效，范围应该是 1 到 modelCount

### 问题：无法取消订阅
**解决**：确保订阅状态为 Active，且是订阅所有者

## 相关文件

- 合约：`Hackathon/contract/contracts/ModelSubscription.sol`
- 部署脚本：`Hackathon/contract/scripts/deploy-model-subscription.js`
- 前端组件：`Hackathon/frontend/src/components/ModelMarket2.tsx`
- ABI：`Hackathon/frontend/src/contracts/ModelSubscription.json`
