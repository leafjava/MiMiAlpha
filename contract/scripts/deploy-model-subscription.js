const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("开始部署 ModelSubscription 合约...");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 读取现有的合约地址
  const addressesPath = path.join(__dirname, "../contract-addresses.json");
  let addresses = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  }

  // 使用 MockERC20 作为 USDT 代币
  const usdtAddress = addresses.contracts?.MockERC20;
  
  if (!usdtAddress) {
    console.error("错误: 未找到 MockERC20 合约地址");
    console.log("请先运行: node scripts/deploy-all.js");
    process.exit(1);
  }

  console.log("使用 USDT 代币地址:", usdtAddress);

  // 部署 ModelSubscription 合约
  console.log("\n部署 ModelSubscription 合约...");
  const ModelSubscription = await hre.ethers.getContractFactory("ModelSubscription");
  const modelSubscription = await ModelSubscription.deploy(usdtAddress);
  await modelSubscription.waitForDeployment();
  const modelSubscriptionAddress = await modelSubscription.getAddress();

  console.log("ModelSubscription 合约已部署到:", modelSubscriptionAddress);

  // 更新合约地址文件
  addresses.contracts = addresses.contracts || {};
  addresses.contracts.ModelSubscription = modelSubscriptionAddress;
  addresses.timestamp = new Date().toISOString();

  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("\n合约地址已保存到:", addressesPath);

  // 同步到前端
  const frontendAddressesPath = path.join(__dirname, "../../frontend/src/contracts/contract-addresses.json");
  fs.writeFileSync(frontendAddressesPath, JSON.stringify(addresses, null, 2));
  console.log("合约地址已同步到前端:", frontendAddressesPath);

  // 注册一些示例模型
  console.log("\n注册示例模型...");
  
  const models = [
    {
      name: "AI Trading Bot Pro",
      description: "Advanced AI model for automated trading strategies",
      price: hre.ethers.parseUnits("100", 18), // 100 USDT
      duration: 30 // 30 days
    },
    {
      name: "Risk Assessment AI",
      description: "Comprehensive risk analysis model for DeFi protocols",
      price: hre.ethers.parseUnits("150", 18), // 150 USDT
      duration: 30
    },
    {
      name: "Market Predictor",
      description: "Machine learning model for price prediction",
      price: hre.ethers.parseUnits("200", 18), // 200 USDT
      duration: 30
    },
    {
      name: "Portfolio Optimizer",
      description: "AI-powered portfolio optimization",
      price: hre.ethers.parseUnits("120", 18), // 120 USDT
      duration: 30
    },
    {
      name: "Smart Contract Auditor",
      description: "Automated smart contract security analysis",
      price: hre.ethers.parseUnits("180", 18), // 180 USDT
      duration: 30
    },
    {
      name: "Sentiment Analyzer",
      description: "Real-time social media sentiment analysis",
      price: hre.ethers.parseUnits("90", 18), // 90 USDT
      duration: 30
    }
  ];

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    console.log(`\n注册模型 ${i + 1}: ${model.name}`);
    
    const tx = await modelSubscription.registerModel(
      model.name,
      model.description,
      model.price,
      model.duration
    );
    await tx.wait();
    
    console.log(`✓ 模型 ${i + 1} 注册成功`);
  }

  console.log("\n✅ 所有模型注册完成!");
  console.log("\n部署摘要:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("ModelSubscription:", modelSubscriptionAddress);
  console.log("USDT Token:", usdtAddress);
  console.log("已注册模型数量:", models.length);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
