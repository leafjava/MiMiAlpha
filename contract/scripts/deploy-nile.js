const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("========================================");
  console.log("开始部署到 TRON Nile 测试网");
  console.log("========================================\n");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "TRX\n");

  // 1. 部署 MockERC20 (USDT)
  console.log("步骤 1: 部署 MockERC20 (USDT) 代币...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const usdt = await MockERC20.deploy("Tether USD", "USDT", 18);
  await usdt.waitForDeployment();
  const usdtAddress = await usdt.getAddress();
  console.log("✓ USDT 代币已部署:", usdtAddress);

  // 给部署者铸造一些 USDT 用于测试
  console.log("\n铸造测试 USDT...");
  const mintAmount = hre.ethers.parseUnits("1000000", 18); // 1,000,000 USDT
  const mintTx = await usdt.mint(deployer.address, mintAmount);
  await mintTx.wait();
  console.log("✓ 已铸造", hre.ethers.formatUnits(mintAmount, 18), "USDT 到部署账户\n");

  // 2. 部署 ModelSubscription
  console.log("步骤 2: 部署 ModelSubscription 合约...");
  const ModelSubscription = await hre.ethers.getContractFactory("ModelSubscription");
  const modelSubscription = await ModelSubscription.deploy(usdtAddress);
  await modelSubscription.waitForDeployment();
  const modelSubscriptionAddress = await modelSubscription.getAddress();
  console.log("✓ ModelSubscription 合约已部署:", modelSubscriptionAddress, "\n");

  // 3. 注册示例模型
  console.log("步骤 3: 注册示例模型...");
  
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
    console.log(`注册模型 ${i + 1}/${models.length}: ${model.name}`);
    
    const tx = await modelSubscription.registerModel(
      model.name,
      model.description,
      model.price,
      model.duration
    );
    await tx.wait();
    console.log(`✓ 模型 ${i + 1} 注册成功`);
  }

  console.log("\n✅ 所有模型注册完成!\n");

  // 4. 保存合约地址
  const addresses = {
    network: "nile",
    chainId: 3448148188,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      MockERC20: usdtAddress,
      USDT: usdtAddress,
      ModelSubscription: modelSubscriptionAddress
    },
    explorer: {
      usdt: `https://nile.tronscan.org/#/contract/${usdtAddress}`,
      modelSubscription: `https://nile.tronscan.org/#/contract/${modelSubscriptionAddress}`
    }
  };

  // 保存到合约目录
  const addressesPath = path.join(__dirname, "../contract-addresses-nile.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("合约地址已保存到:", addressesPath);

  // 同步到前端
  const frontendAddressesPath = path.join(__dirname, "../../frontend/src/contracts/contract-addresses-nile.json");
  fs.writeFileSync(frontendAddressesPath, JSON.stringify(addresses, null, 2));
  console.log("合约地址已同步到前端:", frontendAddressesPath);

  // 5. 输出部署摘要
  console.log("\n========================================");
  console.log("部署摘要 - TRON Nile 测试网");
  console.log("========================================");
  console.log("网络:", "Nile Testnet");
  console.log("Chain ID:", "3448148188");
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", hre.ethers.formatEther(balance), "TRX");
  console.log("\n合约地址:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("USDT Token:", usdtAddress);
  console.log("ModelSubscription:", modelSubscriptionAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n浏览器链接:");
  console.log("USDT:", `https://nile.tronscan.org/#/contract/${usdtAddress}`);
  console.log("ModelSubscription:", `https://nile.tronscan.org/#/contract/${modelSubscriptionAddress}`);
  console.log("\n已注册模型数量:", models.length);
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:");
    console.error(error);
    process.exit(1);
  });
