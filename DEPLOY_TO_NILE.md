# 🚀 部署到 TRON Nile 测试网 - 快速指南

## ✅ 已完成配置

1. **私钥配置**：已设置到 `.env` 文件
2. **测试币余额**：2000 TRX (Nile 测试网)
3. **网络配置**：已添加 Nile 测试网支持
4. **前端配置**：已更新支持 TRON Nile

## 📋 部署步骤

### ✅ 已完成部署！

合约已成功部署到 TRON Nile 测试网：

**USDT 代币**: `TRoxJjfP6UvX7j3fwzqsHG1xrRb3Jc4uQA`  
**ModelSubscription**: `TARZF9BYKhFqcJGryLRLLwMnyqyaGESpi1`

查看详细信息: [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md)

---

### 如需重新部署

### 1️⃣ 进入合约目录

```bash
cd Hackathon/contract
```

### 2️⃣ 安装依赖（如果还没有）

```bash
npm install
```

### 3️⃣ 编译合约

```bash
npx hardhat compile
```

### 4️⃣ 部署到 Nile 测试网

**Windows 用户（推荐）：**
```bash
deploy-nile.bat
```

**或者直接运行：**
```bash
npx hardhat run scripts/deploy-nile.js --network nile
```

## 📦 部署内容

部署脚本会自动：

1. ✅ 部署 USDT 代币合约（MockERC20）
2. ✅ 铸造 1,000,000 USDT 到你的账户
3. ✅ 部署 ModelSubscription 合约
4. ✅ 注册 6 个示例 AI 模型
5. ✅ 保存合约地址到配置文件
6. ✅ 同步地址到前端

## 🎯 部署后的模型

| 模型名称 | 价格 | 订阅期限 |
|---------|------|---------|
| AI Trading Bot Pro | 100 USDT | 30天 |
| Risk Assessment AI | 150 USDT | 30天 |
| Market Predictor | 200 USDT | 30天 |
| Portfolio Optimizer | 120 USDT | 30天 |
| Smart Contract Auditor | 180 USDT | 30天 |
| Sentiment Analyzer | 90 USDT | 30天 |

## 🌐 网络信息

- **网络名称**：TRON Nile Testnet
- **Chain ID**：3448148188
- **RPC URL**：https://nile.trongrid.io
- **区块浏览器**：https://nile.tronscan.org
- **测试币水龙头**：https://nileex.io

## 🔧 前端配置

前端已自动配置，无需手动修改。部署完成后：

1. 合约地址会自动保存到 `frontend/src/contracts/contract-addresses-nile.json`
2. 前端会自动读取并使用这些地址
3. 用户只需在钱包中切换到 TRON Nile 测试网即可

## 🎮 测试流程

### 1. 启动前端

```bash
cd ../frontend
npm run dev
```

### 2. 配置钱包

在 MetaMask 或 OKX 钱包中添加 TRON Nile 测试网：

- 网络名称：TRON Nile Testnet
- RPC URL：https://nile.trongrid.io
- Chain ID：3448148188
- 货币符号：TRX
- 区块浏览器：https://nile.tronscan.org

### 3. 连接钱包并测试

1. 打开前端应用
2. 连接钱包（确保选择 TRON Nile 网络）
3. 访问 Model Market 页面
4. 浏览并订阅 AI 模型
5. 管理你的订阅

## 📊 查看合约

部署完成后，你可以在 Tronscan 上查看合约：

1. 访问：https://nile.tronscan.org
2. 搜索合约地址（从部署输出中获取）
3. 查看合约代码、交易历史、事件日志

## ⚠️ 注意事项

1. **Gas 费用**：每次交易需要消耗少量 TRX 作为 gas 费
2. **USDT 授权**：首次订阅前需要授权 USDT 代币
3. **网络切换**：确保钱包已切换到 TRON Nile 测试网
4. **测试币**：如果 TRX 不足，访问 https://nileex.io 领取

## 🐛 故障排除

### 部署失败？

1. 检查 `.env` 文件是否存在且包含正确的私钥
2. 确认账户有足够的 TRX（至少 100 TRX）
3. 检查网络连接

### 前端无法连接？

1. 确认钱包已切换到 TRON Nile 测试网
2. 检查合约地址是否正确
3. 清除浏览器缓存并刷新

### 交易失败？

1. 检查账户 TRX 余额
2. 查看 Tronscan 上的错误信息
3. 确认 USDT 授权是否成功

## 📚 相关文档

- 详细部署指南：`contract/NILE_DEPLOYMENT_GUIDE.md`
- 合约文档：`contract/MODEL_SUBSCRIPTION_DEPLOYMENT.md`
- 项目文档：`project_documentation.md`

## 🎉 完成！

部署成功后，你就可以开始演示和测试完整的 AI 模型订阅功能了！

---

**需要帮助？** 查看部署日志或 Tronscan 交易记录获取详细信息。
