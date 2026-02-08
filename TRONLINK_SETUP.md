# 🔗 TronLink 钱包配置指南

## 📥 安装 TronLink

### Chrome/Edge 浏览器
1. 访问 Chrome Web Store
2. 搜索 "TronLink"
3. 点击 "添加到 Chrome"
4. 安装完成后，点击浏览器右上角的 TronLink 图标

### 或者使用 OKX 钱包
OKX 钱包也支持 TRON 网络，可以作为替代方案。

---

## ⚙️ 配置 Nile 测试网

### 方法 1: TronLink 钱包

1. **打开 TronLink 钱包**
   - 点击浏览器右上角的 TronLink 图标
   - 如果是首次使用，创建或导入钱包

2. **切换到 Nile 测试网**
   - 点击钱包顶部的网络名称（默认显示 "Mainnet"）
   - 在下拉菜单中选择 **"Nile Testnet"**
   - 确认切换

3. **验证网络**
   - 确认钱包顶部显示 "Nile Testnet"
   - 网络图标应该显示为测试网标识

### 方法 2: OKX 钱包

1. **打开 OKX 钱包**
   - 点击浏览器右上角的 OKX 图标
   - 确保已启用 TRON 网络支持

2. **切换到 TRON Nile**
   - 点击钱包顶部的网络选择器
   - 找到 TRON 部分
   - 选择 **"TRON Nile Testnet"**

3. **验证连接**
   - 确认显示 "TRON Nile Testnet"
   - 查看账户地址（应该以 T 开头）

---

## 💰 获取测试 TRX

### 使用 Nile 水龙头

1. **访问水龙头网站**
   - 打开 https://nileex.io
   - 或访问 https://nile.tronscan.org

2. **领取测试币**
   - 复制你的 TRON 地址（从 TronLink 钱包）
   - 粘贴到水龙头页面
   - 点击 "Submit" 或 "领取"
   - 等待 10-30 秒

3. **验证余额**
   - 返回 TronLink 钱包
   - 查看余额是否增加
   - 通常会收到 10,000 TRX

### 导入测试账户（可选）

如果你想使用项目部署账户进行测试：

1. **在 TronLink 中导入账户**
   - 点击 "导入账户"
   - 选择 "私钥导入"
   - 输入私钥: `5401ea437737a889cd2771424203a680e298ae60ac70862b98267fc569b62884`
   - 设置账户名称（如 "Test Account"）
   - 确认导入

2. **验证账户**
   - 地址应该是: `TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn`
   - 余额应该有约 1600+ TRX

⚠️ **注意**: 这是测试网私钥，仅用于演示！切勿在主网使用！

---

## 🔌 连接到前端应用

### 1. 启动前端

```bash
cd frontend
npm run dev
```

### 2. 打开应用

访问 http://localhost:3000

### 3. 连接钱包

1. **点击 "Connect Wallet" 按钮**
   - 应该会弹出 TronLink 授权窗口
   - 或者 OKX 钱包授权窗口

2. **授权连接**
   - 选择要连接的账户
   - 点击 "Accept" 或 "确认"
   - 等待连接完成

3. **验证连接**
   - 页面应该显示你的地址
   - 显示 "Nile Testnet" 网络
   - 显示 TRX 余额

### 4. 测试订阅

1. **浏览模型市场**
   - 查看 6 个 AI 模型
   - 每个模型价格 1 TRX

2. **订阅模型**
   - 点击任意模型的 "Subscribe" 按钮
   - TronLink 会弹出交易确认窗口
   - 确认发送 1 TRX
   - 等待交易确认（约 10-15 秒）

3. **查看订阅**
   - 切换到 "My Subscriptions" 标签
   - 查看订阅详情
   - 尝试续订或取消

---

## 🔍 故障排除

### 问题 1: TronLink 未检测到

**症状**: 点击 "Connect Wallet" 没有反应

**解决方案**:
1. 确认 TronLink 已安装并启用
2. 刷新页面
3. 检查浏览器控制台是否有错误
4. 尝试重启浏览器

### 问题 2: 网络不正确

**症状**: 显示 "Mainnet" 而不是 "Nile Testnet"

**解决方案**:
1. 打开 TronLink 钱包
2. 点击顶部网络名称
3. 选择 "Nile Testnet"
4. 刷新页面并重新连接

### 问题 3: 余额为 0

**症状**: TRX 余额显示 0

**解决方案**:
1. 访问 https://nileex.io 领取测试币
2. 等待 30 秒后刷新
3. 检查 Tronscan 确认交易: https://nile.tronscan.org

### 问题 4: 交易失败

**症状**: 订阅时交易失败

**解决方案**:
1. 确认 TRX 余额足够（至少 2 TRX）
2. 检查网络是否为 Nile Testnet
3. 查看 TronLink 中的错误信息
4. 在 Tronscan 上查看交易详情

### 问题 5: OKX 钱包无法连接

**症状**: OKX 钱包连接失败

**解决方案**:
1. 确认 OKX 钱包已启用 TRON 支持
2. 切换到 TRON Nile 测试网
3. 尝试刷新页面
4. 如果仍然失败，尝试使用 TronLink

---

## 📊 网络信息

### TRON Nile 测试网

| 参数 | 值 |
|------|-----|
| 网络名称 | Nile Testnet |
| RPC URL | https://nile.trongrid.io |
| Chain ID | 3448148188 |
| 货币符号 | TRX |
| 区块浏览器 | https://nile.tronscan.org |
| 水龙头 | https://nileex.io |

### 合约地址

| 合约 | 地址 |
|------|------|
| ModelSubscriptionTRX | TTn6Y1UwTbqQGXmwZJPqXNi1x5BpdqHtFN |
| 部署账户 | TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn |

---

## 🎯 快速检查清单

在开始测试前，确认以下项目：

- [ ] TronLink 或 OKX 钱包已安装
- [ ] 钱包已切换到 Nile Testnet
- [ ] 账户有足够的 TRX（至少 2 TRX）
- [ ] 前端应用已启动
- [ ] 能够成功连接钱包
- [ ] 页面显示正确的网络和余额

---

## 📚 相关资源

- **TronLink 官网**: https://www.tronlink.org
- **TronLink 文档**: https://docs.tronlink.org
- **TRON 开发者文档**: https://developers.tron.network
- **Nile 测试网浏览器**: https://nile.tronscan.org
- **测试币水龙头**: https://nileex.io

---

## 💡 提示

1. **保持钱包解锁**: 在使用应用时，确保 TronLink 钱包处于解锁状态
2. **检查网络**: 每次使用前确认网络为 Nile Testnet
3. **足够的 TRX**: 保持至少 2 TRX 用于交易和 gas 费用
4. **交易确认**: TRON 交易通常在 10-15 秒内确认
5. **查看交易**: 在 Tronscan 上查看交易详情和状态

---

**准备好了吗？开始测试吧！** 🚀
