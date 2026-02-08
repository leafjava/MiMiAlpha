# 🚀 合约本地部署指南

## 📁 项目结构

```
Hackathon/contract/
├── contracts/              # Solidity 合约文件
│   ├── SmartFacilitator.sol
│   ├── Escrow.sol
│   └── MockERC20.sol
├── scripts/               # 部署脚本
│   └── deploy.js
├── hardhat.config.cjs     # Hardhat 配置
├── package.json           # 依赖配置
├── .env                   # 环境变量（需要创建）
└── .env.example           # 环境变量示例
```

---

## 🎯 快速开始（3 步）

### Step 1: 安装依赖

```bash
cd Hackathon/contract
npm install
```

### Step 2: 配置环境变量

```bash
# 复制示例文件
copy .env.example .env

# 编辑 .env 文件，填入你的私钥
# PRIVATE_KEY=你的私钥（不要带0x前缀）
```

### Step 3: 编译和部署

```bash
# 编译合约
npx hardhat compile

# 部署到本地网络
npx hardhat node

# 新开一个终端，部署合约
npx hardhat run scripts/deploy.js --network localhost
```

---

## 📝 详细步骤

### 1. 安装 Node.js 依赖

```bash
cd Hackathon/contract
npm install
```

**安装的依赖包括：**
- `hardhat`: 以太坊开发环境
- `@nomicfoundation/hardhat-toolbox`: Hardhat 工具集
- `@openzeppelin/contracts`: OpenZeppelin 合约库
- `dotenv`: 环境变量管理

---

### 2. 编译合约

```bash
npx hardhat compile
```

**编译后会生成：**
- `artifacts/` 文件夹：包含编译后的 ABI 和 bytecode
- `cache/` 文件夹：编译缓存

**如果编译失败，检查：**
- Solidity 版本是否匹配（当前配置是 0.8.24）
- 合约语法是否正确

---

### 3. 本地部署（Hardhat Network）

#### 方式 1：启动本地节点

**终端 1 - 启动本地区块链：**
```bash
npx hardhat node
```

这会启动一个本地以太坊节点，默认端口 8545，并提供 20 个测试账户。

**终端 2 - 部署合约：**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### 方式 2：直接部署（不启动节点）

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

这会在内存中运行一个临时网络，部署后立即销毁。

---

### 4. 部署到 TRON 测试网（推荐）

由于你的项目是基于 TRON 生态的，建议部署到 TRON Nile 测试网。

#### 4.1 安装 TronBox

```bash
npm install -g tronbox
```

#### 4.2 创建 TronBox 配置

创建 `tronbox.js`：

```javascript
module.exports = {
  networks: {
    development: {
      privateKey: process.env.PRIVATE_KEY,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'http://127.0.0.1:9090',
      network_id: '*'
    },
    nile: {
      privateKey: process.env.PRIVATE_KEY,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://nile.trongrid.io',
      network_id: '3'
    },
    mainnet: {
      privateKey: process.env.PRIVATE_KEY,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://api.trongrid.io',
      network_id: '1'
    }
  },
  solc: {
    version: '0.8.24'
  }
};
```

#### 4.3 部署到 TRON Nile 测试网

```bash
# 编译
tronbox compile

# 部署到 Nile 测试网
tronbox migrate --network nile
```

---

## 🔧 配置文件详解

### hardhat.config.cjs

当前配置：
```javascript
require('dotenv').config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      // 本地内存网络
    },
  },
};
```

**添加更多网络：**

```javascript
require('dotenv').config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

---

## 🌐 部署到不同网络

### 本地 Hardhat 网络

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

### 本地 Localhost（需要先启动节点）

```bash
# 终端 1
npx hardhat node

# 终端 2
npx hardhat run scripts/deploy.js --network localhost
```

### TRON Nile 测试网

```bash
tronbox migrate --network nile
```

### TRON 主网（谨慎！）

```bash
tronbox migrate --network mainnet
```

---

## 📋 环境变量配置

创建 `.env` 文件：

```bash
# TRON 私钥（不要带 0x 前缀）
PRIVATE_KEY=你的私钥

# RPC 节点（可选）
TRON_NILE_RPC=https://nile.trongrid.io
TRON_MAINNET_RPC=https://api.trongrid.io

# TronGrid API Key（可选，提高请求限制）
TRONGRID_API_KEY=你的API密钥
```

**获取测试网 TRX：**
- TRON Nile 测试网水龙头：https://nileex.io/join/getJoinPage

---

## 🔍 验证部署

### 1. 查看部署地址

部署成功后，会生成 `contract-addresses.json`：

```json
{
  "MockERC20": "TXxx...xxx",
  "Escrow": "TYxx...xxx",
  "SmartFacilitator": "TZxx...xxx"
}
```

### 2. 在区块链浏览器查看

**TRON Nile 测试网：**
- https://nile.tronscan.org/#/contract/你的合约地址

**TRON 主网：**
- https://tronscan.org/#/contract/你的合约地址

### 3. 与合约交互

使用 Hardhat Console：

```bash
npx hardhat console --network localhost
```

```javascript
const MockERC20 = await ethers.getContractFactory("MockERC20");
const token = await MockERC20.attach("合约地址");
const balance = await token.balanceOf("地址");
console.log(balance.toString());
```

---

## 🐛 常见问题

### Q1: 编译失败 - "Solidity version mismatch"

**解决方案：**
检查 `hardhat.config.cjs` 中的 Solidity 版本是否与合约文件中的 `pragma solidity` 版本匹配。

```javascript
module.exports = {
  solidity: "0.8.24",  // 确保与合约版本一致
};
```

### Q2: 部署失败 - "Insufficient funds"

**解决方案：**
- 本地网络：确保使用 Hardhat 提供的测试账户
- 测试网：从水龙头获取测试币
- 主网：确保账户有足够的 TRX

### Q3: 找不到 artifacts 文件

**解决方案：**
先编译合约：
```bash
npx hardhat compile
```

### Q4: 私钥格式错误

**解决方案：**
- TRON 私钥：不要带 `0x` 前缀
- 以太坊私钥：需要带 `0x` 前缀

---

## 📦 完整部署脚本示例

创建 `scripts/deploy-all.js`：

```javascript
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 开始部署合约...\n");

  // 1. 部署 MockERC20
  console.log("📝 部署 MockERC20...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy();
  await mockToken.deployed();
  console.log("✅ MockERC20 部署成功:", mockToken.address);

  // 2. 部署 Escrow
  console.log("\n📝 部署 Escrow...");
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(mockToken.address);
  await escrow.deployed();
  console.log("✅ Escrow 部署成功:", escrow.address);

  // 3. 部署 SmartFacilitator
  console.log("\n📝 部署 SmartFacilitator...");
  const SmartFacilitator = await hre.ethers.getContractFactory("SmartFacilitator");
  const facilitator = await SmartFacilitator.deploy();
  await facilitator.deployed();
  console.log("✅ SmartFacilitator 部署成功:", facilitator.address);

  // 4. 保存地址
  const addresses = {
    MockERC20: mockToken.address,
    Escrow: escrow.address,
    SmartFacilitator: facilitator.address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n📄 合约地址已保存到 contract-addresses.json");
  console.log("\n🎉 所有合约部署完成！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

运行：
```bash
npx hardhat run scripts/deploy-all.js --network localhost
```

---

## 🎯 快速测试脚本

创建 `scripts/test-contracts.js`：

```javascript
const hre = require("hardhat");
const addresses = require("../contract-addresses.json");

async function main() {
  console.log("🧪 测试合约...\n");

  const [owner, user1] = await hre.ethers.getSigners();

  // 连接到已部署的合约
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = MockERC20.attach(addresses.MockERC20);

  // 测试 1: 查询余额
  console.log("📊 测试 1: 查询余额");
  const balance = await token.balanceOf(owner.address);
  console.log(`Owner 余额: ${hre.ethers.utils.formatEther(balance)} tokens\n`);

  // 测试 2: 转账
  console.log("💸 测试 2: 转账");
  const tx = await token.transfer(user1.address, hre.ethers.utils.parseEther("100"));
  await tx.wait();
  const newBalance = await token.balanceOf(user1.address);
  console.log(`User1 新余额: ${hre.ethers.utils.formatEther(newBalance)} tokens\n`);

  console.log("✅ 所有测试通过！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

运行：
```bash
npx hardhat run scripts/test-contracts.js --network localhost
```

---

## 📚 相关资源

- **Hardhat 文档**: https://hardhat.org/docs
- **TronBox 文档**: https://developers.tron.network/docs/tronbox-overview
- **TRON 开发者中心**: https://developers.tron.network/
- **TRON Nile 测试网**: https://nileex.io/
- **OpenZeppelin 合约**: https://docs.openzeppelin.com/contracts/

---

## 🎉 总结

**本地开发流程：**
1. `npm install` - 安装依赖
2. `npx hardhat compile` - 编译合约
3. `npx hardhat node` - 启动本地节点
4. `npx hardhat run scripts/deploy.js --network localhost` - 部署合约

**TRON 测试网流程：**
1. 获取测试网 TRX
2. 配置 `.env` 文件
3. `tronbox compile` - 编译合约
4. `tronbox migrate --network nile` - 部署到测试网

现在你可以开始本地开发和测试了！🚀
