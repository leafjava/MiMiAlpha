# 🚀 MiMiAlpha 智能合约

基于 TRON 生态的 MiMiAlpha 智能合约套件，包含订阅资产管理、托管服务和智能治理功能。

## 📁 项目结构

```
contract/
├── contracts/              # Solidity 合约
│   ├── SmartFacilitator.sol   # 智能治理合约
│   ├── Escrow.sol              # 托管合约
│   └── MockERC20.sol           # 测试代币
├── scripts/               # 部署脚本
│   └── deploy.js
├── hardhat.config.cjs     # Hardhat 配置
├── package.json           # 依赖配置
├── .env.example           # 环境变量示例
├── QUICK_START.bat        # 一键启动脚本（Windows）
└── CONTRACT_DEPLOYMENT_GUIDE.md  # 详细部署指南
```

## ⚡ 快速开始（Windows）

### 方式 1：一键启动（推荐）

```bash
# 双击运行
QUICK_START.bat
```

脚本会自动：
1. ✅ 检查 Node.js 安装
2. ✅ 安装依赖
3. ✅ 配置环境变量
4. ✅ 编译合约
5. ✅ 提供部署选项

### 方式 2：手动启动

```bash
# 1. 安装依赖
npm install

# 2. 编译合约
npx hardhat compile

# 3. 启动本地节点
npx hardhat node

# 4. 新开终端，部署合约
npx hardhat run scripts/deploy.js --network localhost
```

## 📋 合约说明

### 1. SmartFacilitator.sol
**智能治理合约** - MiMiAlpha 的核心创新

**功能：**
- 多维支付策略管理
- 风险识别与熔断
- 微支付聚合优化
- 语义化审计流水

**基于 AINFT 生态：**
- 为 AINFT Agent 提供财务治理
- 监控 AINFT Nova Token 使用安全
- 解决 AI Agent 自主决策与资产安全的矛盾

### 2. Escrow.sol
**托管合约** - 安全的资金托管

**功能：**
- 订阅交易托管
- 自动释放/退款
- 争议仲裁支持

### 3. MockERC20.sol
**测试代币** - 用于本地测试

**功能：**
- 标准 ERC20 代币
- 用于模拟 TRC20 代币

## 🌐 部署网络

### 本地开发网络

```bash
# 启动本地节点
npx hardhat node

# 部署
npx hardhat run scripts/deploy.js --network localhost
```

**特点：**
- ✅ 快速启动
- ✅ 免费测试
- ✅ 完全控制
- ✅ 20 个测试账户

### TRON Nile 测试网（推荐）

```bash
# 安装 TronBox
npm install -g tronbox

# 编译
tronbox compile

# 部署
tronbox migrate --network nile
```

**获取测试币：**
- 水龙头：https://nileex.io/join/getJoinPage
- 浏览器：https://nile.tronscan.org/

### TRON 主网

```bash
tronbox migrate --network mainnet
```

**注意：**
- ⚠️ 需要真实 TRX
- ⚠️ 谨慎操作
- ⚠️ 建议先在测试网充分测试

## 🔧 配置说明

### 环境变量 (.env)

```bash
# 复制示例文件
copy .env.example .env

# 编辑 .env
PRIVATE_KEY=你的私钥（不要带0x前缀）
```

### Hardhat 配置 (hardhat.config.cjs)

```javascript
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},      // 本地内存网络
    localhost: {      // 本地节点
      url: "http://127.0.0.1:8545"
    }
  }
};
```

## 📊 部署后验证

### 1. 查看部署地址

部署成功后会生成 `contract-addresses.json`：

```json
{
  "MockERC20": "0x...",
  "Escrow": "0x...",
  "SmartFacilitator": "0x..."
}
```

### 2. 在浏览器查看

**本地网络：**
- 使用 Hardhat Console 交互

**TRON Nile 测试网：**
- https://nile.tronscan.org/#/contract/你的合约地址

**TRON 主网：**
- https://tronscan.org/#/contract/你的合约地址

### 3. 与合约交互

```bash
# 启动 Hardhat Console
npx hardhat console --network localhost

# 交互示例
const MockERC20 = await ethers.getContractFactory("MockERC20");
const token = await MockERC20.attach("合约地址");
const balance = await token.balanceOf("地址");
console.log(balance.toString());
```

## 🧪 测试合约

### 运行测试

```bash
# 运行所有测试
npx hardhat test

# 运行特定测试
npx hardhat test test/SmartFacilitator.test.js

# 查看测试覆盖率
npx hardhat coverage
```

### 创建测试文件

在 `test/` 目录创建测试文件：

```javascript
// test/SmartFacilitator.test.js
const { expect } = require("chai");

describe("SmartFacilitator", function () {
  it("Should deploy successfully", async function () {
    const SmartFacilitator = await ethers.getContractFactory("SmartFacilitator");
    const facilitator = await SmartFacilitator.deploy();
    await facilitator.deployed();
    
    expect(facilitator.address).to.be.properAddress;
  });
});
```

## 🐛 常见问题

### Q1: 编译失败

**错误：** `Error: Cannot find module 'hardhat'`

**解决：**
```bash
npm install
```

### Q2: 部署失败 - 余额不足

**错误：** `Insufficient funds`

**解决：**
- 本地网络：使用 Hardhat 提供的测试账户
- 测试网：从水龙头获取测试币
- 主网：确保账户有足够的 TRX

### Q3: 私钥格式错误

**错误：** `Invalid private key`

**解决：**
- TRON 私钥：不要带 `0x` 前缀
- 以太坊私钥：需要带 `0x` 前缀

### Q4: 找不到 artifacts

**错误：** `Artifact not found`

**解决：**
```bash
npx hardhat compile
```

## 📚 相关文档

- [详细部署指南](./CONTRACT_DEPLOYMENT_GUIDE.md) - 完整的部署教程
- [Hardhat 文档](https://hardhat.org/docs) - Hardhat 官方文档
- [TronBox 文档](https://developers.tron.network/docs/tronbox-overview) - TronBox 官方文档
- [TRON 开发者中心](https://developers.tron.network/) - TRON 开发资源

## 🎯 开发工作流

### 日常开发

```bash
# 1. 修改合约
# 编辑 contracts/*.sol

# 2. 编译
npx hardhat compile

# 3. 测试
npx hardhat test

# 4. 部署到本地
npx hardhat run scripts/deploy.js --network localhost
```

### 准备上线

```bash
# 1. 完整测试
npx hardhat test
npx hardhat coverage

# 2. 部署到测试网
tronbox migrate --network nile

# 3. 验证功能
# 在测试网充分测试

# 4. 部署到主网
tronbox migrate --network mainnet
```

## 🤝 AINFT 生态集成

MiMiAlpha 智能合约是 TRON AI 生态的关键组成部分：

**基于 AINFT 基础设施：**
- ✅ AINFT Agent Framework - AI Agent 开发框架
- ✅ AINFT Nova - 资产代币化平台

**MiMiAlpha 的创新：**
- ✅ Smart Facilitator - 财务治理层
- ✅ 订阅权 RWA Token 交易所
- ✅ 解决 AI Agent 自主决策与资产安全的矛盾

**生态定位：**
> "官方提供了'车（Agent）'和'货（Tokenized Assets）'，
> 我们提供了'交通规则和减震器（Smart Facilitator）'。
> 我们是 TRON AI 生态落地大规模商业化的最后一块拼图。"

## 📞 支持

如有问题，请查看：
1. [详细部署指南](./CONTRACT_DEPLOYMENT_GUIDE.md)
2. [常见问题](#-常见问题)
3. [相关文档](#-相关文档)

---

**MiMiAlpha - TRON AI 生态的财务治理层** 🚀
