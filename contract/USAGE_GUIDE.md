# 📖 MiMiAlpha 合约使用指南

## 🎯 快速开始

### 1. 安装依赖

```bash
cd Hackathon/contract
npm install
```

### 2. 配置环境

```bash
# 复制环境变量示例
copy .env.example .env

# 编辑 .env 文件（可选，本地测试不需要）
# PRIVATE_KEY=你的私钥
```

### 3. 编译合约

```bash
npm run compile
```

### 4. 运行测试

```bash
npm test
```

### 5. 部署合约

#### 方式 A：一键部署（推荐）

```bash
# Windows 用户
QUICK_START.bat

# 选择选项 1: 启动本地节点
# 然后在新终端运行部署脚本
```

#### 方式 B：手动部署

```bash
# 终端 1: 启动本地节点
npm run node

# 终端 2: 部署合约
npm run deploy:local
```

---

## 📋 可用命令

```bash
# 编译合约
npm run compile

# 运行测试
npm test

# 查看测试覆盖率
npm run coverage

# 启动本地节点
npm run node

# 部署到本地节点
npm run deploy:local

# 部署到内存网络（快速测试）
npm run deploy:hardhat

# 清理编译缓存
npm run clean

# 查看帮助
npm run help
```

---

## 🔧 与合约交互

### 使用 Hardhat Console

```bash
# 启动 console
npx hardhat console --network localhost
```

在 console 中：

```javascript
// 1. 获取合约工厂
const MockERC20 = await ethers.getContractFactory("MockERC20");

// 2. 连接到已部署的合约
const addresses = require("./contract-addresses.json");
const token = await MockERC20.attach(addresses.contracts.MockERC20);

// 3. 查询余额
const [owner] = await ethers.getSigners();
const balance = await token.balanceOf(owner.address);
console.log("余额:", ethers.formatEther(balance), "MTK");

// 4. 转账
const [owner, addr1] = await ethers.getSigners();
const tx = await token.transfer(addr1.address, ethers.parseEther("100"));
await tx.wait();
console.log("转账成功!");

// 5. 查询总供应量
const totalSupply = await token.totalSupply();
console.log("总供应量:", ethers.formatEther(totalSupply), "MTK");
```

### 使用脚本交互

创建 `scripts/interact.js`：

```javascript
const hre = require("hardhat");
const addresses = require("../contract-addresses.json");

async function main() {
  const [owner, addr1] = await hre.ethers.getSigners();
  
  // 连接到 MockERC20
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = await MockERC20.attach(addresses.contracts.MockERC20);
  
  // 查询余额
  console.log("Owner 余额:", 
    hre.ethers.formatEther(await token.balanceOf(owner.address))
  );
  
  // 转账
  console.log("\n转账 100 MTK 到 addr1...");
  const tx = await token.transfer(addr1.address, hre.ethers.parseEther("100"));
  await tx.wait();
  
  // 查询新余额
  console.log("Addr1 新余额:", 
    hre.ethers.formatEther(await token.balanceOf(addr1.address))
  );
}

main().catch(console.error);
```

运行：
```bash
npx hardhat run scripts/interact.js --network localhost
```

---

## 🧪 测试合约

### 运行所有测试

```bash
npm test
```

### 运行特定测试文件

```bash
npx hardhat test test/MockERC20.test.js
```

### 查看测试覆盖率

```bash
npm run coverage
```

### 查看 Gas 使用情况

```bash
REPORT_GAS=true npm test
```

---

## 📊 合约说明

### MockERC20.sol

**测试代币合约**

```solidity
// 主要功能
function transfer(address to, uint256 amount) public returns (bool)
function approve(address spender, uint256 amount) public returns (bool)
function transferFrom(address from, address to, uint256 amount) public returns (bool)
function mint(address to, uint256 amount) public
function balanceOf(address account) public view returns (uint256)
function totalSupply() public view returns (uint256)
```

**使用示例：**

```javascript
// 转账
await token.transfer(recipient, ethers.parseEther("100"));

// 授权
await token.approve(spender, ethers.parseEther("100"));

// 使用授权转账
await token.connect(spender).transferFrom(owner, recipient, ethers.parseEther("50"));

// 铸造新代币
await token.mint(recipient, ethers.parseEther("1000"));

// 查询余额
const balance = await token.balanceOf(address);
```

### Escrow.sol

**托管合约**

```solidity
// 主要功能
function createEscrow(address seller, uint256 amount) public returns (uint256)
function releaseEscrow(uint256 escrowId) public
function refundEscrow(uint256 escrowId) public
function getEscrow(uint256 escrowId) public view returns (Escrow memory)
```

**使用示例：**

```javascript
// 1. 授权 Escrow 合约使用代币
await token.approve(escrowAddress, ethers.parseEther("100"));

// 2. 创建托管
const tx = await escrow.createEscrow(sellerAddress, ethers.parseEther("100"));
const receipt = await tx.wait();
const escrowId = receipt.events[0].args.escrowId;

// 3. 释放托管（卖家收款）
await escrow.releaseEscrow(escrowId);

// 4. 或者退款（买家收回）
await escrow.refundEscrow(escrowId);

// 5. 查询托管信息
const escrowInfo = await escrow.getEscrow(escrowId);
console.log("买家:", escrowInfo.buyer);
console.log("卖家:", escrowInfo.seller);
console.log("金额:", ethers.formatEther(escrowInfo.amount));
console.log("状态:", escrowInfo.status);
```

### SmartFacilitator.sol

**智能治理合约**

```solidity
// 主要功能
function registerAsset(uint256 assetId, address owner) public
function checkUsagePermission(uint256 assetId, address user, uint256 amount) public view returns (bool)
function recordUsage(uint256 assetId, uint256 amount) public
function getAssetInfo(uint256 assetId) public view returns (Asset memory)
```

**使用示例：**

```javascript
// 1. 注册资产
await facilitator.registerAsset(assetId, ownerAddress);

// 2. 检查使用权限
const canUse = await facilitator.checkUsagePermission(assetId, userAddress, amount);

// 3. 记录使用
await facilitator.recordUsage(assetId, amount);

// 4. 查询资产信息
const assetInfo = await facilitator.getAssetInfo(assetId);
console.log("所有者:", assetInfo.owner);
console.log("总额度:", assetInfo.totalQuota);
console.log("已使用:", assetInfo.usedQuota);
```

---

## 🌐 部署到不同网络

### 本地 Hardhat 网络（内存）

```bash
npm run deploy:hardhat
```

**特点：**
- ✅ 最快速度
- ✅ 不需要启动节点
- ❌ 部署后立即销毁

### 本地 Localhost 网络（持久）

```bash
# 终端 1
npm run node

# 终端 2
npm run deploy:local
```

**特点：**
- ✅ 持久化（节点运行期间）
- ✅ 可以多次交互
- ✅ 20 个测试账户

### TRON Nile 测试网

```bash
# 1. 安装 TronBox
npm install -g tronbox

# 2. 获取测试币
# https://nileex.io/join/getJoinPage

# 3. 配置 .env
# PRIVATE_KEY=你的私钥

# 4. 部署
tronbox migrate --network nile
```

**特点：**
- ✅ 真实的区块链环境
- ✅ 免费测试币
- ✅ 可以在浏览器查看

---

## 🔍 验证部署

### 1. 查看部署地址

```bash
# 查看 contract-addresses.json
cat contract-addresses.json
```

### 2. 在浏览器查看

**本地网络：**
- 使用 Hardhat Console 交互

**TRON Nile 测试网：**
- https://nile.tronscan.org/#/contract/你的合约地址

### 3. 验证合约代码

```bash
# Etherscan (以太坊测试网)
npx hardhat verify --network goerli 合约地址 构造函数参数

# 示例
npx hardhat verify --network goerli 0x123... "0x456..."
```

---

## 🐛 故障排除

### 问题 1: 编译失败

```bash
# 清理缓存
npm run clean

# 重新编译
npm run compile
```

### 问题 2: 测试失败

```bash
# 确保本地节点正在运行
npm run node

# 在新终端运行测试
npm test
```

### 问题 3: 部署失败 - 余额不足

```bash
# 本地网络：使用 Hardhat 提供的测试账户
# 测试网：从水龙头获取测试币
# 主网：确保账户有足够的代币
```

### 问题 4: 找不到合约地址

```bash
# 确保已经部署
npm run deploy:local

# 检查 contract-addresses.json 文件
cat contract-addresses.json
```

---

## 📚 学习资源

### Hardhat 文档
- 官方文档: https://hardhat.org/docs
- 教程: https://hardhat.org/tutorial

### Solidity 文档
- 官方文档: https://docs.soliditylang.org/
- 示例: https://solidity-by-example.org/

### OpenZeppelin
- 合约库: https://docs.openzeppelin.com/contracts/
- 向导: https://wizard.openzeppelin.com/

### TRON 开发
- 开发者中心: https://developers.tron.network/
- TronBox: https://developers.tron.network/docs/tronbox-overview

---

## 🎯 开发工作流

### 日常开发

```bash
# 1. 修改合约
# 编辑 contracts/*.sol

# 2. 编译
npm run compile

# 3. 测试
npm test

# 4. 部署到本地
npm run deploy:local

# 5. 交互测试
npx hardhat console --network localhost
```

### 准备上线

```bash
# 1. 完整测试
npm test
npm run coverage

# 2. 部署到测试网
tronbox migrate --network nile

# 3. 验证功能
# 在测试网充分测试

# 4. 审计合约
# 建议进行专业审计

# 5. 部署到主网
tronbox migrate --network mainnet
```

---

## 💡 最佳实践

### 1. 安全性

- ✅ 使用 OpenZeppelin 的安全合约
- ✅ 进行充分的测试
- ✅ 考虑进行专业审计
- ✅ 使用多签钱包管理重要合约

### 2. Gas 优化

- ✅ 使用 `view` 和 `pure` 函数
- ✅ 批量操作减少交易次数
- ✅ 优化存储布局
- ✅ 使用事件记录重要操作

### 3. 测试

- ✅ 编写全面的单元测试
- ✅ 测试边界条件
- ✅ 测试失败场景
- ✅ 使用测试覆盖率工具

### 4. 文档

- ✅ 为合约添加 NatSpec 注释
- ✅ 维护 README 文档
- ✅ 记录部署地址和配置
- ✅ 提供使用示例

---

## 🤝 AINFT 生态集成

MiMiAlpha 智能合约是 TRON AI 生态的关键组成部分：

**基于 AINFT 基础设施：**
- ✅ AINFT Agent Framework - AI Agent 开发框架
- ✅ AINFT Nova - 资产代币化平台

**MiMiAlpha 的创新：**
- ✅ Smart Facilitator - 财务治理层
- ✅ 订阅权 RWA Token 交易所
- ✅ 解决 AI Agent 自主决策与资产安全的矛盾

---

**祝你开发顺利！** 🚀

如有问题，请查看：
- [详细部署指南](./CONTRACT_DEPLOYMENT_GUIDE.md)
- [合约 README](./README.md)
- [Hardhat 文档](https://hardhat.org/docs)
