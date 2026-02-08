# 量化模型市场 - 智能合约交互指南

## 概述

量化模型市场现已集成真实的 TRON 智能合约交互功能。用户可以通过 TronLink 钱包直接购买信号或订阅模型。

## 前置要求

### 1. 安装 TronLink 钱包

#### Chrome 扩展
```
https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec
```

#### 移动端
- iOS: App Store 搜索 "TronLink"
- Android: Google Play 搜索 "TronLink"

### 2. 切换到 Nile 测试网

1. 打开 TronLink
2. 点击右上角设置
3. 选择"节点设置"
4. 切换到"Nile Testnet"

### 3. 获取测试币

#### TRX（用于 Gas 费）
```
水龙头: https://nileex.io
每日限额: 2000 TRX
```

#### USDT（用于支付）
```
合约地址: TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj
获取方式: 
1. 访问 https://nileex.io
2. 选择 "TRC20 Tokens"
3. 选择 USDT
4. 输入地址，领取测试 USDT
```

## 功能说明

### 1. 钱包连接

#### 自动检测
页面加载时会自动检测 TronLink 钱包：
- ✅ 已安装且已登录 → 自动连接
- ⚠️ 已安装未登录 → 提示登录
- ❌ 未安装 → 提示安装

#### 显示信息
连接成功后，弹窗底部会显示：
```
钱包地址: TJFJTCg...4rnRL
USDT 余额: $100.00
```

### 2. 购买单次信号

#### 操作流程
```
1. 点击模型卡片"查看详情 & 订阅"
2. 在弹窗中点击"购买信号"按钮
3. TronLink 弹出确认窗口
4. 确认交易详情
5. 输入钱包密码
6. 等待交易确认（约 3 秒）
7. 显示成功提示和交易哈希
```

#### 交易详情
```
接收方: 模型提供者地址
金额: $3-5 USDT
Gas 费: ~5 TRX
确认时间: 3 秒
```

#### 成功提示
```
✅ 购买成功！

交易哈希: 0x1234...5678

查看交易: https://nile.tronscan.org/#/transaction/0x1234...5678
```

### 3. 月度订阅

#### 操作流程
```
1. 点击模型卡片"查看详情 & 订阅"
2. 在弹窗中点击"立即订阅"按钮
3. TronLink 弹出确认窗口
4. 确认交易详情
5. 输入钱包密码
6. 等待交易确认（约 3 秒）
7. 显示成功提示和交易哈希
```

#### 交易详情
```
接收方: 模型提供者地址
金额: $30-50 USDT
Gas 费: ~5 TRX
确认时间: 3 秒
有效期: 30 天
```

#### 成功提示
```
✅ 订阅成功！

交易哈希: 0x1234...5678

查看交易: https://nile.tronscan.org/#/transaction/0x1234...5678

您现在可以接收该模型的所有信号（30 天有效期）
```

## 技术实现

### 合约交互架构

```
┌─────────────────────────────────────┐
│      前端 (React + TypeScript)       │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  ModelMarket 组件               │ │
│  │  - 显示模型列表                 │ │
│  │  - 处理用户交互                 │ │
│  └────────────┬───────────────────┘ │
│               │                      │
│  ┌────────────▼───────────────────┐ │
│  │  modelContractService           │ │
│  │  - 初始化 TronWeb               │ │
│  │  - 获取钱包信息                 │ │
│  │  - 调用合约方法                 │ │
│  └────────────┬───────────────────┘ │
└───────────────┼─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│         TronLink 钱包                │
│  - 管理私钥                          │
│  - 签名交易                          │
│  - 广播交易                          │
└───────────────┬─────────────────────┘
                │
┌───────────────▼─────────────────────┐
│       TRON Nile 测试网               │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  USDT TRC20 合约                │ │
│  │  TXLAQ63Xg1NAzckPwKHvzw7CSEmL... │ │
│  │  - transfer()                   │ │
│  │  - balanceOf()                  │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  模型合约（未来）                │ │
│  │  - purchaseSignal()             │ │
│  │  - subscribe()                  │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 核心代码

#### 1. 初始化 TronWeb
```typescript
async initialize(): Promise<boolean> {
  if (window.tronWeb && window.tronWeb.ready) {
    this.tronWeb = window.tronWeb;
    return true;
  }
  throw new Error('TronLink 未安装或未登录');
}
```

#### 2. 获取 USDT 余额
```typescript
async getUSDTBalance(address: string): Promise<number> {
  const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
  const balance = await contract.balanceOf(address).call();
  return Number(balance) / 1_000_000; // 6 位小数
}
```

#### 3. 购买信号（USDT 转账）
```typescript
async purchaseSignal(
  modelContract: string,
  providerAddress: string,
  amount: number
): Promise<{ success: boolean; txId?: string }> {
  const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
  const amountInSun = Math.floor(amount * 1_000_000);
  
  const tx = await contract.transfer(providerAddress, amountInSun).send({
    feeLimit: 100_000_000, // 100 TRX
  });
  
  return { success: true, txId: tx };
}
```

## 错误处理

### 常见错误及解决方案

#### 1. TronLink 未安装
```
错误: 请先安装并登录 TronLink 钱包

解决:
1. 访问 https://www.tronlink.org/
2. 下载并安装 TronLink
3. 创建或导入钱包
4. 刷新页面
```

#### 2. 余额不足
```
错误: USDT 余额不足
当前余额: 0.00 USDT
需要: 5.00 USDT

解决:
1. 访问 https://nileex.io
2. 输入钱包地址
3. 领取测试 USDT
4. 等待到账（约 1 分钟）
```

#### 3. Gas 费不足
```
错误: TRX 余额不足，无法支付 Gas 费

解决:
1. 访问 https://nileex.io
2. 领取测试 TRX
3. 重试交易
```

#### 4. 用户拒绝交易
```
错误: 用户拒绝了交易

解决:
1. 重新点击购买/订阅按钮
2. 在 TronLink 弹窗中点击"确认"
```

#### 5. 网络错误
```
错误: 网络请求失败

解决:
1. 检查网络连接
2. 确认 TronLink 已切换到 Nile 测试网
3. 刷新页面重试
```

## 测试流程

### 完整测试步骤

#### 1. 准备工作
```bash
# 1. 安装 TronLink
# 2. 创建钱包
# 3. 切换到 Nile 测试网
# 4. 记录钱包地址
```

#### 2. 获取测试币
```bash
# 访问 https://nileex.io
# 输入钱包地址
# 领取 TRX（用于 Gas）
# 领取 USDT（用于支付）
```

#### 3. 测试购买信号
```bash
# 1. 打开模型市场页面
# 2. 选择任意模型
# 3. 点击"查看详情 & 订阅"
# 4. 确认钱包地址和余额显示正确
# 5. 点击"购买信号"
# 6. 在 TronLink 中确认交易
# 7. 等待成功提示
# 8. 点击交易链接查看详情
```

#### 4. 测试月度订阅
```bash
# 1. 在同一个弹窗中
# 2. 点击"立即订阅"
# 3. 在 TronLink 中确认交易
# 4. 等待成功提示
# 5. 验证余额已扣除
```

#### 5. 验证交易
```bash
# 1. 复制交易哈希
# 2. 访问 https://nile.tronscan.org
# 3. 粘贴交易哈希搜索
# 4. 确认交易状态为 "Success"
# 5. 确认金额和接收方正确
```

## 安全注意事项

### 1. 测试网 vs 主网
```
⚠️ 当前使用 Nile 测试网
- 测试币无实际价值
- 仅用于开发和演示
- 切勿在主网使用测试合约
```

### 2. 私钥安全
```
🔒 永远不要分享私钥
- TronLink 会安全保管私钥
- 网站无法访问私钥
- 所有交易需要钱包确认
```

### 3. 交易确认
```
✅ 交易前务必确认
- 接收方地址
- 转账金额
- Gas 费用
- 合约调用详情
```

### 4. 钓鱼防范
```
🎣 警惕钓鱼网站
- 确认网站域名
- 检查 HTTPS 证书
- 不要点击可疑链接
- 使用官方 TronLink
```

## 未来扩展

### 短期（1-2 周）
- [ ] 部署实际的模型合约到 Nile 测试网
- [ ] 实现合约的 purchaseSignal() 方法
- [ ] 实现合约的 subscribe() 方法
- [ ] 添加订阅状态查询

### 中期（1-2 月）
- [ ] 集成 x402 Smart Facilitator 合约
- [ ] 实现支付限额检查
- [ ] 实现微支付聚合
- [ ] 添加审计日志记录

### 长期（3-6 月）
- [ ] 主网部署
- [ ] 多签钱包支持
- [ ] 自动续费功能
- [ ] 退款机制

## 总结

量化模型市场现已支持真实的 TRON 智能合约交互：

✅ **TronLink 集成** - 自动检测和连接钱包
✅ **余额查询** - 实时显示 USDT 余额
✅ **购买信号** - 通过 USDT TRC20 转账
✅ **月度订阅** - 支持长期订阅服务
✅ **交易验证** - 提供 TronScan 链接查看详情
✅ **错误处理** - 完善的错误提示和解决方案

这是一个完整的 Web3 应用，展示了如何在 TRON 链上构建去中心化的量化信号市场！
