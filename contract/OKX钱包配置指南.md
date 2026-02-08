# 🦊 OKX 钱包连接本地 Hardhat 网络指南

## 📋 配置信息

### 本地 Hardhat 网络参数

```
网络名称: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
货币符号: ETH
区块浏览器: (留空)
```

---

## 🔧 配置步骤

### Step 1: 打开 OKX 钱包

1. 打开 OKX 钱包扩展
2. 点击右上角的网络选择器
3. 点击"添加网络"或"自定义 RPC"

---

### Step 2: 添加自定义网络

填入以下信息：

```
网络名称: Hardhat Local
新增 RPC URL: http://127.0.0.1:8545
链 ID: 1337
货币符号: ETH
区块浏览器 URL: (留空或填 http://localhost:8545)
```

**截图示例：**
```
┌─────────────────────────────────────┐
│  添加网络                            │
├─────────────────────────────────────┤
│  网络名称: Hardhat Local            │
│  RPC URL: http://127.0.0.1:8545     │
│  Chain ID: 1337                     │
│  货币符号: ETH                       │
│  区块浏览器: (留空)                  │
│                                     │
│  [取消]  [保存]                     │
└─────────────────────────────────────┘
```

---

### Step 3: 导入测试账户

Hardhat 本地网络提供了 20 个测试账户，每个账户有 10,000 ETH。

#### 账户 #0（推荐使用）

```
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
余额: 10,000 ETH
```

#### 账户 #1

```
地址: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
余额: 10,000 ETH
```

#### 账户 #2

```
地址: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
私钥: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
余额: 10,000 ETH
```

---

### Step 4: 导入私钥到 OKX

1. 在 OKX 钱包中点击"导入账户"
2. 选择"私钥导入"
3. 粘贴上面的私钥（推荐使用账户 #0）
4. 设置账户名称（如"Hardhat Test Account"）
5. 点击"导入"

**⚠️ 安全提示：**
- 这些私钥只能用于本地测试
- 永远不要在主网或测试网使用这些私钥
- 不要向这些地址发送真实资产

---

## 🚀 验证连接

### 1. 确保 Hardhat 节点正在运行

**终端 1：**
```bash
cd D:\webProject\Hackathon\contract
npm run node
```

**应该显示：**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

---

### 2. 在 OKX 钱包中切换网络

1. 点击网络选择器
2. 选择"Hardhat Local"
3. 查看余额是否显示 10,000 ETH

---

### 3. 测试连接

在 OKX 钱包中：
- ✅ 应该看到 10,000 ETH 余额
- ✅ 地址应该是 0xf39Fd...
- ✅ 网络显示"Hardhat Local"

---

## 🔗 与已部署的合约交互

### 合约地址

根据你的部署输出：

```
MockERC20: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
Escrow: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
SmartFacilitator: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
```

---

### 添加 MockERC20 代币到 OKX

1. 在 OKX 钱包中点击"添加代币"
2. 选择"自定义代币"
3. 填入信息：

```
代币合约地址: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
代币符号: cUSD
小数位数: 18
```

4. 点击"添加"
5. 应该看到 1,000,000 cUSD 余额（因为部署者获得了初始供应）

---

## 🎯 完整配置流程

### 1. 启动 Hardhat 节点

```bash
# 终端 1
cd D:\webProject\Hackathon\contract
npm run node
```

**保持这个终端运行！**

---

### 2. 部署合约（如果还没部署）

```bash
# 终端 2
cd D:\webProject\Hackathon\contract
npx hardhat run scripts/deploy-all.js --network localhost
```

---

### 3. 配置 OKX 钱包

1. **添加网络：**
   - 网络名称: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - 货币符号: ETH

2. **导入账户：**
   - 私钥: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - 账户名: Hardhat Test Account

3. **添加代币：**
   - 合约地址: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
   - 符号: cUSD
   - 小数: 18

---

### 4. 验证配置

在 OKX 钱包中应该看到：
- ✅ 网络: Hardhat Local
- ✅ ETH 余额: ~10,000 ETH
- ✅ cUSD 余额: 1,000,000 cUSD

---

## 🌐 连接前端应用

如果你的前端需要连接 OKX 钱包：

### 前端代码示例

```javascript
// 检查是否安装了 OKX 钱包
if (typeof window.okxwallet !== 'undefined') {
  console.log('OKX Wallet is installed!');
}

// 连接钱包
async function connectWallet() {
  try {
    // 请求连接
    const accounts = await window.okxwallet.request({ 
      method: 'eth_requestAccounts' 
    });
    
    console.log('Connected account:', accounts[0]);
    
    // 检查网络
    const chainId = await window.okxwallet.request({ 
      method: 'eth_chainId' 
    });
    
    console.log('Chain ID:', chainId); // 应该是 0x539 (1337)
    
    // 如果不是 Hardhat 网络，提示切换
    if (chainId !== '0x539') {
      await window.okxwallet.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }],
      });
    }
    
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect wallet:', error);
  }
}

// 与合约交互
async function interactWithContract() {
  const provider = new ethers.BrowserProvider(window.okxwallet);
  const signer = await provider.getSigner();
  
  // 连接到 MockERC20
  const tokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const tokenABI = [...]; // 从 artifacts 获取
  const token = new ethers.Contract(tokenAddress, tokenABI, signer);
  
  // 查询余额
  const balance = await token.balanceOf(await signer.getAddress());
  console.log('Token balance:', ethers.formatEther(balance));
  
  // 转账
  const tx = await token.transfer(recipientAddress, ethers.parseEther('100'));
  await tx.wait();
  console.log('Transfer successful!');
}
```

---

## 🔄 切换网络

### 在 OKX 钱包中手动切换

1. 点击网络选择器
2. 选择"Hardhat Local"

### 在代码中自动切换

```javascript
async function switchToHardhat() {
  try {
    await window.okxwallet.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }], // 1337 的十六进制
    });
  } catch (switchError) {
    // 如果网络不存在，添加它
    if (switchError.code === 4902) {
      await window.okxwallet.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x539',
          chainName: 'Hardhat Local',
          rpcUrls: ['http://127.0.0.1:8545'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          }
        }]
      });
    }
  }
}
```

---

## 🐛 常见问题

### Q1: OKX 钱包无法连接到 localhost

**问题：** 显示"无法连接到网络"

**解决方案：**
1. 确保 Hardhat 节点正在运行：`npm run node`
2. 检查 RPC URL 是否正确：`http://127.0.0.1:8545`
3. 尝试使用 `http://localhost:8545` 代替
4. 检查防火墙设置

---

### Q2: 余额显示为 0

**问题：** 导入账户后余额为 0

**解决方案：**
1. 确保使用正确的私钥
2. 确保 Hardhat 节点正在运行
3. 刷新钱包或重新连接
4. 检查网络是否切换到 Hardhat Local

---

### Q3: 无法看到代币余额

**问题：** 添加 cUSD 代币后看不到余额

**解决方案：**
1. 确保合约已部署
2. 检查代币合约地址是否正确
3. 确保使用的是部署者账户（Account #0）
4. 刷新钱包

---

### Q4: 交易失败

**问题：** 发送交易时失败

**解决方案：**
1. 确保有足够的 ETH 支付 Gas
2. 检查合约地址是否正确
3. 查看 Hardhat 节点的日志
4. 尝试重启 Hardhat 节点

---

## 📊 测试账户列表

### 所有 20 个测试账户

```javascript
// Account #0
地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// Account #1
地址: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

// Account #2
地址: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
私钥: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

// Account #3
地址: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
私钥: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

// Account #4
地址: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
私钥: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

// ... 更多账户可以在启动 Hardhat 节点时看到
```

---

## 🎯 快速配置脚本

创建一个批处理文件自动化配置：

```batch
@echo off
echo ========================================
echo   OKX 钱包配置信息
echo ========================================
echo.
echo 网络配置:
echo   网络名称: Hardhat Local
echo   RPC URL: http://127.0.0.1:8545
echo   Chain ID: 1337
echo   货币符号: ETH
echo.
echo 测试账户 #0:
echo   地址: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
echo   私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
echo.
echo 代币配置:
echo   合约地址: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
echo   代币符号: cUSD
echo   小数位数: 18
echo.
echo ========================================
pause
```

---

## 🎉 总结

### 配置步骤回顾

1. ✅ 启动 Hardhat 节点：`npm run node`
2. ✅ 在 OKX 添加网络（Chain ID: 1337）
3. ✅ 导入测试账户私钥
4. ✅ 添加 cUSD 代币
5. ✅ 验证连接和余额

### 关键信息

```
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
测试私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
代币地址: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

---

**现在你可以在 OKX 钱包中与本地合约交互了！** 🚀
