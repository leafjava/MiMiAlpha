# ⚡ 快速开始：迁移到 TRON 挑战2

## 🎯 第一步：环境准备（30 分钟）

### 1. 安装 TronLink 钱包
```
1. 访问 https://www.tronlink.org/
2. 下载浏览器扩展
3. 创建钱包
4. 切换到 Nile Testnet
5. 获取测试币：https://nileex.io/join/getJoinPage
```

### 2. 配置 TRON 开发环境
```bash
cd Hackathon/contract

# 安装 TronBox（TRON 的 Hardhat）
npm install -g tronbox

# 或使用 Hardhat + tronweb
npm install --save-dev tronweb @nomiclabs/hardhat-ethers
```

### 3. 创建 TRON 配置文件
```bash
# 创建 tronbox.js
cat > tronbox.js << 'EOF'
module.exports = {
  networks: {
    nile: {
      privateKey: process.env.PRIVATE_KEY,
      userFeePercentage: 100,
      feeLimit: 1000 * 1e6,
      fullHost: 'https://nile.trongrid.io',
      network_id: '3448148188'
    }
  }
};
EOF
```

---

## 🔧 第二步：核心合约开发（2-3 小时）

### 创建 SmartFacilitator.sol
```bash
cd Hackathon/contract/contracts
```

创建新文件：
