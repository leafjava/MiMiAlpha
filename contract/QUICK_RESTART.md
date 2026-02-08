# ⚡ 快速重启指南

## 🚀 最简单的方式

### 方法 1: 使用 npm 脚本（推荐）

#### 终端 1 - 启动节点
```bash
cd D:\webProject\Hackathon\contract
npm run node
```
**保持运行！**

#### 终端 2 - 部署合约
```bash
cd D:\webProject\Hackathon\contract
npm run deploy:local
```

---

### 方法 2: 使用一键脚本

#### Windows
```bash
cd D:\webProject\Hackathon\contract
restart.bat
```

#### Mac/Linux
```bash
cd ~/webProject/Hackathon/contract
chmod +x restart.sh
./restart.sh
```

---

### 方法 3: 手动命令

#### 终端 1
```bash
cd D:\webProject\Hackathon\contract
npx hardhat node
```

#### 终端 2
```bash
cd D:\webProject\Hackathon\contract
npx hardhat run scripts/deploy-all.js --network localhost
```

---

## ✅ 验证部署

部署成功后应该看到：

```
✅ MockERC20 部署成功!
地址: 0x5FbDB2315678afecb367f032d93F642f64180aa3

✅ Escrow 部署成功!
地址: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

✅ SmartFacilitator 部署成功!
地址: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```

---

## 🔧 常见错误

### ❌ 错误 1: `Cannot find package 'js-conflux-sdk'`

**原因：** 使用了错误的部署脚本（deploy.js 是 Conflux 版本）

**解决：**
```bash
# 使用正确的脚本
npm run deploy:local

# 或直接运行
npx hardhat run scripts/deploy-all.js --network localhost
```

---

### ❌ 错误 2: `Error: listen EADDRINUSE: address already in use`

**原因：** 端口 8545 已被占用

**解决：**
```bash
# Windows
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8545 | xargs kill -9
```

---

### ❌ 错误 3: `incorrect number of arguments to constructor`

**原因：** SmartFacilitator 需要 USDT 地址参数

**解决：** 确保使用 `deploy-all.js`，它会自动处理参数

---

## 📋 完整流程

1. **启动节点**
   ```bash
   npm run node
   ```

2. **部署合约**（新终端）
   ```bash
   npm run deploy:local
   ```

3. **启动前端**（新终端）
   ```bash
   cd ../frontend
   npm install  # 首次运行
   npm run dev
   ```

4. **配置钱包**
   - 网络: Hardhat Local
   - RPC: http://127.0.0.1:8545
   - Chain ID: 1337

5. **开始使用**
   - 连接钱包
   - 创建 Agent
   - 充值和交易

---

## 🎯 npm 脚本说明

```json
{
  "scripts": {
    "node": "hardhat node",              // 启动本地节点
    "compile": "hardhat compile",        // 编译合约
    "test": "hardhat test",              // 运行测试
    "deploy:local": "...",               // 部署到本地 (Hardhat)
    "deploy:conflux": "...",             // 部署到 Conflux
    "clean": "hardhat clean"             // 清理缓存
  }
}
```

---

## 💡 提示

- ✅ 使用 `npm run deploy:local` 部署到 Hardhat 本地网络
- ✅ 使用 `npm run deploy:conflux` 部署到 Conflux 网络
- ✅ `deploy-all.js` 是 Hardhat 版本（3 个合约）
- ✅ `deploy.js` 是 Conflux 版本（2 个合约）

---

**现在可以正确重启了！** 🚀
