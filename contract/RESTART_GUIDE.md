# 🔄 合约重新启动完整指南

## 📋 快速启动步骤

### 方法一：使用快捷脚本（推荐）

#### Windows 用户

```bash
cd contract
.\QUICK_START.bat
```

这个脚本会自动：
1. 启动 Hardhat 本地节点（后台运行）
2. 等待 3 秒
3. 部署所有合约
4. 显示合约地址

---

### 方法二：手动启动（完整控制）

#### 步骤 1: 启动 Hardhat 节点

打开**第一个终端**：

```bash
cd D:\webProject\Hackathon\contract
npx hardhat node
```

**预期输出：**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**⚠️ 重要：保持这个终端运行，不要关闭！**

---

#### 步骤 2: 部署合约

打开**第二个终端**：

```bash
cd D:\webProject\Hackathon\contract
npx hardhat run scripts/deploy-all.js --network localhost
```

**预期输出：**
```
========================================
🚀 MiMiAlpha 合约部署
========================================
📝 部署账户: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
💰 账户余额: 10000.0 ETH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 [1/3] 部署 MockERC20 测试代币...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MockERC20 部署成功!
地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 [2/3] 部署 Escrow 托管合约...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Escrow 部署成功!
地址: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 [3/3] 部署 SmartFacilitator 治理合约...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SmartFacilitator 部署成功!
地址: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```

---

## 🔍 验证部署

### 检查合约地址文件

```bash
cat contract-addresses.json
```

**应该看到：**
```json
{
  "network": "localhost",
  "chainId": "1337",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "timestamp": "2026-02-08T...",
  "contracts": {
    "MockERC20": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "Escrow": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "SmartFacilitator": "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  }
}
```

### 测试合约交互

```bash
npx hardhat run scripts/interact.js --network localhost
```

---

## 🛑 停止和重启

### 停止 Hardhat 节点

在运行 `npx hardhat node` 的终端中：
- Windows: 按 `Ctrl + C`
- Mac/Linux: 按 `Ctrl + C`

### 完全重启流程

1. **停止现有节点**
   ```bash
   # 在 hardhat node 终端按 Ctrl+C
   ```

2. **清理（可选）**
   ```bash
   # 删除缓存和构建文件
   rm -rf artifacts cache
   # 或 Windows:
   rmdir /s /q artifacts cache
   ```

3. **重新编译（可选）**
   ```bash
   npx hardhat compile
   ```

4. **重新启动节点**
   ```bash
   npx hardhat node
   ```

5. **重新部署合约**
   ```bash
   # 在新终端
   npx hardhat run scripts/deploy-all.js --network localhost
   ```

---

## 🔧 常见问题

### Q1: 端口 8545 已被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use 127.0.0.1:8545
```

**解决方法：**

#### Windows:
```bash
# 查找占用端口的进程
netstat -ano | findstr :8545

# 杀死进程（替换 <PID> 为实际进程 ID）
taskkill /PID <PID> /F
```

#### Mac/Linux:
```bash
# 查找并杀死进程
lsof -ti:8545 | xargs kill -9
```

---

### Q2: 合约地址不匹配

**问题：** 前端显示的合约地址与部署的不一致

**解决方法：**

1. 检查 `contract-addresses.json` 文件
2. 确保前端使用的是最新的合约地址
3. 重新复制合约地址到前端：

```bash
# 在 contract 目录
copy contract-addresses.json ..\frontend\src\contracts\contract-addresses.json

# 或 Mac/Linux:
cp contract-addresses.json ../frontend/src/contracts/contract-addresses.json
```

---

### Q3: 部署失败 - 构造函数参数错误

**错误信息：**
```
Error: incorrect number of arguments to constructor
```

**解决方法：**

检查 `scripts/deploy-all.js` 中的部署参数：

```javascript
// SmartFacilitator 需要 USDT 地址参数
const facilitator = await SmartFacilitator.deploy(mockERC20.target);
```

---

### Q4: 账户余额不足

**错误信息：**
```
Error: insufficient funds for gas
```

**解决方法：**

1. 确保使用 Hardhat 提供的测试账户
2. 重启 Hardhat 节点（会重置所有账户余额）
3. 检查钱包是否连接到正确的网络

---

### Q5: 合约未找到

**错误信息：**
```
Error: call revert exception
```

**解决方法：**

1. 确认 Hardhat 节点正在运行
2. 确认合约已成功部署
3. 检查合约地址是否正确
4. 尝试重新部署合约

---

## 📝 快速命令参考

### 启动节点
```bash
cd contract
npx hardhat node
```

### 部署合约
```bash
cd contract
npx hardhat run scripts/deploy-all.js --network localhost
```

### 运行测试
```bash
cd contract
npm test
```

### 编译合约
```bash
cd contract
npm run compile
```

### 交互测试
```bash
cd contract
npx hardhat run scripts/interact.js --network localhost
```

---

## 🔄 完整重启流程（一键复制）

### Windows PowerShell

```powershell
# 停止现有进程（如果有）
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 进入合约目录
cd D:\webProject\Hackathon\contract

# 清理缓存
Remove-Item -Recurse -Force artifacts, cache -ErrorAction SilentlyContinue

# 重新编译
npx hardhat compile

# 启动节点（新窗口）
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\webProject\Hackathon\contract; npx hardhat node"

# 等待节点启动
Start-Sleep -Seconds 3

# 部署合约
npx hardhat run scripts/deploy-all.js --network localhost

# 复制合约地址到前端
Copy-Item contract-addresses.json ..\frontend\src\contracts\contract-addresses.json
```

### Mac/Linux Bash

```bash
# 停止现有进程
pkill -f "hardhat node"

# 进入合约目录
cd ~/webProject/Hackathon/contract

# 清理缓存
rm -rf artifacts cache

# 重新编译
npx hardhat compile

# 启动节点（后台）
npx hardhat node > hardhat.log 2>&1 &

# 等待节点启动
sleep 3

# 部署合约
npx hardhat run scripts/deploy-all.js --network localhost

# 复制合约地址到前端
cp contract-addresses.json ../frontend/src/contracts/contract-addresses.json
```

---

## 🎯 最佳实践

### 1. 开发流程

```
启动节点 → 部署合约 → 启动前端 → 开发测试
```

### 2. 修改合约后

```
停止节点 → 修改合约 → 重新编译 → 重启节点 → 重新部署
```

### 3. 前端开发

- 保持 Hardhat 节点运行
- 只在修改合约时重新部署
- 前端修改不需要重启合约

### 4. 调试技巧

- 使用 `console.log` 在合约中打印日志
- 查看 Hardhat 节点终端的交易日志
- 使用 `scripts/interact.js` 测试合约功能

---

## 📚 相关文档

- [合约部署完整指南.md](./合约部署完整指南.md)
- [OKX钱包配置指南.md](./OKX钱包配置指南.md)
- [前端合约交互完整指南.md](../frontend/前端合约交互完整指南.md)
- [WAGMI_IMPLEMENTATION.md](../frontend/WAGMI_IMPLEMENTATION.md)

---

## ✅ 检查清单

部署前检查：
- [ ] Node.js 已安装（v16+）
- [ ] 依赖已安装（`npm install`）
- [ ] 合约已编译（`npm run compile`）
- [ ] 端口 8545 未被占用

部署后检查：
- [ ] Hardhat 节点正在运行
- [ ] 合约部署成功（3 个合约）
- [ ] `contract-addresses.json` 文件已生成
- [ ] 合约地址已复制到前端
- [ ] 测试脚本运行成功

前端连接检查：
- [ ] 前端已启动（`npm run dev`）
- [ ] 钱包已连接
- [ ] 网络已切换到 Hardhat Local (1337)
- [ ] 可以读取合约数据
- [ ] 可以发送交易

---

**现在你可以轻松重启合约了！** 🚀

如果遇到问题，请参考"常见问题"部分或查看相关文档。
