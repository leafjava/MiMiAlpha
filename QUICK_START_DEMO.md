# 🚀 快速启动演示指南

## ✅ 部署状态

合约已成功部署到 **TRON Nile 测试网**！

---

## 📋 合约信息

### USDT 代币
- **地址**: `TRoxJjfP6UvX7j3fwzqsHG1xrRb3Jc4uQA`
- **浏览器**: https://nile.tronscan.org/#/contract/TRoxJjfP6UvX7j3fwzqsHG1xrRb3Jc4uQA

### ModelSubscription 合约
- **地址**: `TARZF9BYKhFqcJGryLRLLwMnyqyaGESpi1`
- **浏览器**: https://nile.tronscan.org/#/contract/TARZF9BYKhFqcJGryLRLLwMnyqyaGESpi1

### 部署账户
- **地址**: `TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn`
- **TRX 余额**: ~1790 TRX
- **USDT 余额**: 1,000,000 USDT

---

## 🎮 演示步骤

### 步骤 1: 配置钱包 (5分钟)

#### 在 MetaMask/OKX 钱包中添加 TRON Nile 测试网

```
网络名称: TRON Nile Testnet
RPC URL: https://nile.trongrid.io
Chain ID: 3448148188
货币符号: TRX
区块浏览器: https://nile.tronscan.org
```

#### 导入测试账户（可选）

如果需要使用部署账户进行演示：
- 私钥: `5401ea437737a889cd2771424203a680e298ae60ac70862b98267fc569b62884`
- 地址: `TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn`
- ⚠️ **注意**: 这是测试网私钥，仅用于演示！

---

### 步骤 2: 启动前端 (2分钟)

```bash
# 进入前端目录
cd frontend

# 安装依赖（如果还没有）
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:3000 启动

---

### 步骤 3: 连接钱包 (1分钟)

1. 打开浏览器访问 http://localhost:3000
2. 点击 "Connect Wallet" 按钮
3. 选择 MetaMask 或 OKX 钱包
4. 确认钱包已切换到 **TRON Nile Testnet**
5. 授权连接

---

### 步骤 4: 浏览 AI 模型市场 (2分钟)

1. 访问 **Model Market** 页面
2. 查看 6 个已注册的 AI 模型：
   - AI Trading Bot Pro (100 USDT/30天)
   - Risk Assessment AI (150 USDT/30天)
   - Market Predictor (200 USDT/30天)
   - Portfolio Optimizer (120 USDT/30天)
   - Smart Contract Auditor (180 USDT/30天)
   - Sentiment Analyzer (90 USDT/30天)

---

### 步骤 5: 订阅 AI 模型 (3分钟)

#### 5.1 选择模型
- 点击任意模型卡片
- 查看模型详情

#### 5.2 授权 USDT
- 点击 "Subscribe" 按钮
- 首次订阅需要授权 USDT 代币
- 确认授权交易（约 10-15 秒）

#### 5.3 创建订阅
- 授权完成后，再次点击 "Subscribe"
- 确认订阅交易（约 10-15 秒）
- 等待交易确认

#### 5.4 查看订阅
- 订阅成功后，可以在 "My Subscriptions" 页面查看
- 显示订阅详情：开始时间、结束时间、状态等

---

### 步骤 6: 管理订阅 (2分钟)

#### 续订订阅
1. 访问 "My Subscriptions" 页面
2. 找到要续订的订阅
3. 点击 "Renew" 按钮
4. 确认交易

#### 取消订阅
1. 访问 "My Subscriptions" 页面
2. 找到要取消的订阅
3. 点击 "Cancel" 按钮
4. 确认交易
5. 获得 50% 退款（按剩余时间计算）

---

## 🔍 验证功能

### 在 Tronscan 上查看交易

1. 访问 https://nile.tronscan.org
2. 搜索你的钱包地址
3. 查看交易历史：
   - USDT 授权交易
   - 订阅创建交易
   - 续订交易
   - 取消交易

### 查看合约事件

1. 访问 ModelSubscription 合约页面
2. 点击 "Events" 标签
3. 查看合约事件：
   - ModelRegistered (模型注册)
   - SubscriptionCreated (订阅创建)
   - SubscriptionRenewed (订阅续订)
   - SubscriptionCancelled (订阅取消)

---

## 📊 演示数据

### 已注册的模型

| ID | 名称 | 价格 | 期限 | 类别 |
|----|------|------|------|------|
| 1 | AI Trading Bot Pro | 100 USDT | 30天 | Trading |
| 2 | Risk Assessment AI | 150 USDT | 30天 | Risk |
| 3 | Market Predictor | 200 USDT | 30天 | Prediction |
| 4 | Portfolio Optimizer | 120 USDT | 30天 | Trading |
| 5 | Smart Contract Auditor | 180 USDT | 30天 | Risk |
| 6 | Sentiment Analyzer | 90 USDT | 30天 | Prediction |

### 测试场景

#### 场景 1: 新用户订阅
1. 连接新钱包
2. 从水龙头获取 TRX
3. 从部署账户转账一些 USDT
4. 订阅最便宜的模型 (Sentiment Analyzer - 90 USDT)

#### 场景 2: 续订订阅
1. 使用已有订阅的账户
2. 查看订阅列表
3. 选择即将到期的订阅
4. 执行续订操作

#### 场景 3: 取消订阅
1. 使用已有订阅的账户
2. 选择要取消的订阅
3. 执行取消操作
4. 验证退款到账

---

## 🎯 演示要点

### 核心功能展示

1. **去中心化订阅管理**
   - 无需中心化服务器
   - 智能合约自动执行
   - 透明的订阅记录

2. **灵活的支付系统**
   - USDT 稳定币支付
   - 自动分账（提供者 97% + 平台 3%）
   - 取消退款机制

3. **AI 模型市场**
   - 多样化的 AI 模型
   - 清晰的定价和期限
   - 用户友好的界面

4. **TRON 生态集成**
   - 部署在 TRON Nile 测试网
   - 低 gas 费用
   - 快速交易确认

---

## ⚡ 快速命令

### 启动前端
```bash
cd frontend && npm run dev
```

### 查看合约地址
```bash
cat contract/contract-addresses-nile.json
```

### 重新部署（如需要）
```bash
cd contract && node scripts/deploy-tron-nile.js
```

---

## 🐛 常见问题

### Q: 钱包无法连接？
**A**: 确认已添加 TRON Nile 测试网，Chain ID 为 3448148188

### Q: 交易失败？
**A**: 检查 TRX 余额是否足够支付 gas 费用

### Q: USDT 余额不足？
**A**: 从部署账户转账 USDT，或使用部署账户进行演示

### Q: 前端显示错误？
**A**: 清除浏览器缓存，重启开发服务器

---

## 📞 支持资源

- **部署详情**: [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md)
- **完整指南**: [DEPLOY_TO_NILE.md](./DEPLOY_TO_NILE.md)
- **项目文档**: [project_documentation.md](./project_documentation.md)
- **Tronscan**: https://nile.tronscan.org
- **测试币水龙头**: https://nileex.io

---

## ✅ 演示检查清单

- [ ] 钱包已配置 TRON Nile 测试网
- [ ] 账户有足够的 TRX 和 USDT
- [ ] 前端开发服务器已启动
- [ ] 能够连接钱包
- [ ] 能够浏览模型市场
- [ ] 能够订阅模型
- [ ] 能够查看订阅列表
- [ ] 能够续订订阅
- [ ] 能够取消订阅
- [ ] 能够在 Tronscan 上查看交易

---

**准备好了吗？开始你的演示吧！** 🚀
