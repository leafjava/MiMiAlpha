# TRX 余额显示修复指南

## 问题描述
用户 TronLink 钱包中有 100 TRX，但前端显示 0.0000 TRX

## 修复内容

### 1. 余额获取逻辑优化
- 直接使用 `window.tronWeb.defaultAddress.base58` 获取地址
- 移除了对 `account` prop 的依赖（可能格式不正确）
- 添加了更详细的错误日志

### 2. 支付函数改进
- `handlePurchaseSignal` 和 `handleSubscribe` 现在直接从 TronWeb 获取当前地址
- 添加了钱包连接状态检查
- 改进了错误提示信息

### 3. 交易流程优化
- 移除了不必要的 `facilitatorSuccess` 监听
- 交易成功后直接显示结果并关闭弹窗
- 返回交易哈希供用户查看

## 测试步骤

### 1. 检查余额显示
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 刷新页面
4. 查找日志：`✅ TRX 余额:` 
5. 应该看到类似：
   ```
   ✅ TRX 余额: {
     address: "TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn",
     balanceInSun: 100000000,
     balanceInTrx: "100"
   }
   ```

### 2. 测试购买功能
1. 点击任意模型的"查看详情 & 订阅"
2. 在弹窗中点击"购买信号"或"立即订阅"
3. 应该弹出 TronLink 交易确认窗口
4. 确认交易后，应该看到成功提示

### 3. 常见问题排查

#### 余额仍然显示 0
检查控制台日志：
- 如果看到 `⚠️ TronWeb 未就绪` → 确保 TronLink 已安装并解锁
- 如果看到 `⚠️ 未找到 TronLink 地址` → 在 TronLink 中选择一个账户
- 如果看到 `❌ 获取 TRX 余额失败` → 检查网络连接，确保在 Nile 测试网

#### 点击购买没有弹出交易窗口
检查控制台日志：
- 如果看到 `❌ TronLink 未连接` → 点击页面顶部的"连接钱包"按钮
- 如果看到 `❌ TronLink 未就绪` → 刷新页面重试
- 如果看到 `❌ 无法获取钱包地址` → 确保 TronLink 已解锁

#### 交易失败
- 检查是否在 Nile 测试网（TronLink 右上角应显示 "Nile Testnet"）
- 确保有足够的 TRX 余额（至少 1 TRX + 少量手续费）
- 检查接收地址是否正确（应该是 T 开头的 TRON 地址）

## 技术细节

### 地址格式
- TRON 地址格式：`TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn` (Base58)
- 以太坊地址格式：`0x5401ea437737a889cd2771424203a680e298ae60ac70862b98267fc569b62884` (Hex)
- TronLink 使用 Base58 格式

### 余额单位
- 1 TRX = 1,000,000 Sun
- `window.tronWeb.trx.getBalance()` 返回 Sun
- `window.tronWeb.fromSun()` 转换为 TRX

### 交易流程
1. 检查钱包连接状态
2. 获取当前地址（Base58 格式）
3. 检查余额是否足够
4. 调用 `tronWeb.trx.sendTransaction()` 发送 TRX
5. 等待用户在 TronLink 中确认
6. 返回交易哈希

## 下一步
如果余额显示正常但购买仍然失败，请提供：
1. 浏览器控制台的完整日志
2. TronLink 显示的错误信息
3. 当前网络（应该是 Nile Testnet）
