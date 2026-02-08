# TRON Nile 测试网部署指南

## 概述

本指南将帮助你将 ModelSubscription 合约部署到 TRON Nile 测试网。

## 前置条件

✅ 已完成：
- 私钥配置：`5401ea437737a889cd2771424203a680e298ae60ac70862b98267fc569b62884`
- 测试币余额：2000 TRX (Nile 测试网)
- 网络配置：已添加 Nile 测试网到 hardhat.config.cjs

## 部署步骤

### 1. 确认环境配置

检查 `.env` 文件是否已创建并包含正确的私钥：

```bash
PRIVATE_KEY=5401ea437737a889cd2771424203a680e298ae60ac70862b98267fc569b62884
NILE_RPC_URL=https://nile.trongrid.io
```

### 2. 安装依赖（如果还没有安装）

```bash
npm install
```

### 3. 编译合约

```bash
npx hardhat compile
```

### 4. 部署到 Nile 测试网

**Windows 用户：**
```bash
deploy-nile.bat
```

**或者直接运行：**
```bash
npx hardhat run scripts/deploy-nile.js --network nile
```

### 5. 验证部署

部署成功后，你会看到类似以下的输出：

```
========================================
部署摘要 - TRON Nile 测试网
========================================
网络: Nile Testnet
Chain ID: 3448148188
部署账户: 0x...
账户余额: 1999.xxx TRX

合约地址:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USDT Token: 0x...
ModelSubscription: 0x...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

浏览器链接:
USDT: https://nile.tronscan.org/#/contract/0x...
ModelSubscription: https://nile.tronscan.org/#/contract/0x...

已注册模型数量: 6
========================================
```

## 部署内容

部署脚本会自动完成以下操作：

1. **部署 MockERC20 (USDT) 代币合约**
   - 代币名称：Tether USD
   - 代币符号：USDT
   - 小数位数：18
   - 初始铸造：1,000,000 USDT 到部署账户

2. **部署 ModelSubscription 合约**
   - 使用上面部署的 USDT 作为支付代币
   - 平台费率：3%
   - 取消退款率：50%

3. **注册 6 个示例 AI 模型**
   - AI Trading Bot Pro (100 USDT/30天)
   - Risk Assessment AI (150 USDT/30天)
   - Market Predictor (200 USDT/30天)
   - Portfolio Optimizer (120 USDT/30天)
   - Smart Contract Auditor (180 USDT/30天)
   - Sentiment Analyzer (90 USDT/30天)

4. **保存合约地址**
   - 后端：`contract-addresses-nile.json`
   - 前端：`frontend/src/contracts/contract-addresses-nile.json`

## 前端配置

前端已自动配置为支持 TRON Nile 测试网：

### 网络配置 (wagmi.ts)
- Chain ID: 3448148188
- RPC URL: https://nile.trongrid.io
- 区块浏览器: https://nile.tronscan.org

### 钱包配置

用户需要在钱包（MetaMask/OKX）中添加 TRON Nile 测试网：

**网络参数：**
- 网络名称：TRON Nile Testnet
- RPC URL：https://nile.trongrid.io
- Chain ID：3448148188
- 货币符号：TRX
- 区块浏览器：https://nile.tronscan.org

## 测试流程

### 1. 连接钱包
- 打开前端应用
- 点击 "Connect Wallet"
- 选择 TRON Nile Testnet 网络

### 2. 获取测试 USDT
部署账户已经有 1,000,000 USDT，可以用于测试订阅功能。

### 3. 浏览模型市场
- 访问 Model Market 页面
- 查看 6 个已注册的 AI 模型

### 4. 订阅模型
- 选择一个模型
- 点击 "Subscribe"
- 批准 USDT 授权
- 确认订阅交易

### 5. 管理订阅
- 查看我的订阅
- 续订订阅
- 取消订阅（可获得 50% 退款）

## 合约功能

### ModelSubscription 合约

**主要功能：**
- `registerModel()` - 注册新的 AI 模型
- `createSubscription()` - 创建订阅
- `renewSubscription()` - 续订订阅
- `cancelSubscription()` - 取消订阅（50% 退款）
- `getModel()` - 获取模型信息
- `getSubscription()` - 获取订阅信息
- `getUserSubscriptions()` - 获取用户的所有订阅

**管理员功能：**
- `setPlatformFeeRate()` - 设置平台费率
- `withdrawPlatformFees()` - 提取平台费用

## 区块浏览器

在 Tronscan 上查看合约：
- 访问：https://nile.tronscan.org
- 搜索合约地址
- 查看交易历史、合约代码、事件日志

## 故障排除

### 问题 1：部署失败 - 余额不足
**解决方案：**
- 确认账户有足够的 TRX（至少 100 TRX）
- 访问 https://nileex.io 领取测试币

### 问题 2：RPC 连接超时
**解决方案：**
- 检查网络连接
- 尝试使用 VPN
- 等待几分钟后重试

### 问题 3：前端无法连接合约
**解决方案：**
- 确认钱包已切换到 TRON Nile 测试网
- 检查合约地址是否正确更新
- 清除浏览器缓存并刷新

### 问题 4：交易失败
**解决方案：**
- 检查 gas 费用设置
- 确认账户有足够的 TRX 支付 gas
- 查看 Tronscan 上的错误信息

## 下一步

1. **测试所有功能**
   - 订阅模型
   - 续订订阅
   - 取消订阅
   - 查看订阅历史

2. **准备演示**
   - 准备演示账户
   - 准备演示数据
   - 测试完整流程

3. **文档更新**
   - 更新 README
   - 添加使用说明
   - 准备演示视频

## 相关链接

- TRON Nile 测试网：https://nileex.io
- Tronscan 浏览器：https://nile.tronscan.org
- TRON 文档：https://developers.tron.network
- Hardhat 文档：https://hardhat.org

## 支持

如有问题，请查看：
- 合约部署日志
- Tronscan 交易记录
- Hardhat 错误信息
