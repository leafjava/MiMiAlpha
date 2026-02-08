const TronWeb = require('tronweb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// TRON Nile 测试网配置
const NILE_API = 'https://nile.trongrid.io';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  console.log("========================================");
  console.log("部署 TRX 支付版本到 TRON Nile 测试网");
  console.log("========================================\n");

  // 初始化 TronWeb
  const tronWeb = new TronWeb({
    fullHost: NILE_API,
    privateKey: PRIVATE_KEY
  });

  // 获取部署者地址
  const deployerAddress = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
  console.log("部署账户:", deployerAddress);

  // 获取账户余额
  try {
    const balance = await tronWeb.trx.getBalance(deployerAddress);
    console.log("账户余额:", tronWeb.fromSun(balance), "TRX\n");
  } catch (error) {
    console.log("无法获取余额，继续部署...\n");
  }

  // 读取编译后的合约
  const modelSubscriptionPath = path.join(__dirname, '../artifacts/contracts/ModelSubscriptionTRX.sol/ModelSubscriptionTRX.json');

  if (!fs.existsSync(modelSubscriptionPath)) {
    console.error("错误: 合约未编译，请先运行: npx hardhat compile");
    process.exit(1);
  }

  const ModelSubscriptionArtifact = JSON.parse(fs.readFileSync(modelSubscriptionPath, 'utf8'));

  // 部署 ModelSubscriptionTRX
  console.log("步骤 1: 部署 ModelSubscriptionTRX 合约...");
  
  try {
    const modelSubscriptionContract = await tronWeb.contract().new({
      abi: ModelSubscriptionArtifact.abi,
      bytecode: ModelSubscriptionArtifact.bytecode,
      feeLimit: 1000_000_000,
      callValue: 0,
      parameters: []
    });

    const modelSubscriptionAddress = modelSubscriptionContract.address;
    console.log("✓ ModelSubscriptionTRX 合约已部署:", modelSubscriptionAddress);
    console.log("  Base58:", tronWeb.address.fromHex(modelSubscriptionAddress), "\n");

    // 等待交易确认
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 注册示例模型 - 统一定价 1 TRX
    console.log("步骤 2: 注册示例模型 (统一定价 1 TRX)...");
    
    const ONE_TRX = 1_000_000; // 1 TRX = 1,000,000 sun
    
    const models = [
      {
        name: "AI Trading Bot Pro",
        description: "Advanced AI model for automated trading strategies",
        price: ONE_TRX,
        duration: 30
      },
      {
        name: "Risk Assessment AI",
        description: "Comprehensive risk analysis model for DeFi protocols",
        price: ONE_TRX,
        duration: 30
      },
      {
        name: "Market Predictor",
        description: "Machine learning model for price prediction",
        price: ONE_TRX,
        duration: 30
      },
      {
        name: "Portfolio Optimizer",
        description: "AI-powered portfolio optimization",
        price: ONE_TRX,
        duration: 30
      },
      {
        name: "Smart Contract Auditor",
        description: "Automated smart contract security analysis",
        price: ONE_TRX,
        duration: 30
      },
      {
        name: "Sentiment Analyzer",
        description: "Real-time social media sentiment analysis",
        price: ONE_TRX,
        duration: 30
      }
    ];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      console.log(`注册模型 ${i + 1}/${models.length}: ${model.name} (1 TRX)`);
      
      try {
        const tx = await modelSubscriptionContract.registerModel(
          model.name,
          model.description,
          model.price,
          model.duration
        ).send({
          feeLimit: 100_000_000,
          callValue: 0
        });
        
        console.log(`✓ 模型 ${i + 1} 注册成功 (TX: ${tx})`);
        
        // 等待交易确认
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`✗ 模型 ${i + 1} 注册失败:`, error.message);
      }
    }

    console.log("\n✅ 所有模型注册完成!\n");

    // 保存合约地址
    const modelSubscriptionBase58 = tronWeb.address.fromHex(modelSubscriptionAddress);

    const addresses = {
      network: "nile",
      chainId: 3448148188,
      timestamp: new Date().toISOString(),
      deployer: deployerAddress,
      paymentMethod: "TRX",
      modelPrice: "1 TRX",
      contracts: {
        ModelSubscriptionTRX: modelSubscriptionAddress,
        ModelSubscriptionTRXBase58: modelSubscriptionBase58
      },
      explorer: {
        modelSubscription: `https://nile.tronscan.org/#/contract/${modelSubscriptionBase58}`
      }
    };

    // 保存到合约目录
    const addressesPath = path.join(__dirname, "../contract-addresses-trx-nile.json");
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log("合约地址已保存到:", addressesPath);

    // 同步到前端
    const frontendDir = path.join(__dirname, "../../frontend/src/contracts");
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    const frontendAddressesPath = path.join(frontendDir, "contract-addresses-trx-nile.json");
    fs.writeFileSync(frontendAddressesPath, JSON.stringify(addresses, null, 2));
    console.log("合约地址已同步到前端:", frontendAddressesPath);

    // 输出部署摘要
    console.log("\n========================================");
    console.log("部署摘要 - TRON Nile 测试网 (TRX 支付版本)");
    console.log("========================================");
    console.log("网络:", "Nile Testnet");
    console.log("API:", NILE_API);
    console.log("部署账户:", deployerAddress);
    console.log("支付方式:", "TRX 原生代币");
    console.log("模型定价:", "1 TRX (统一定价)");
    console.log("\n合约地址 (Hex):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ModelSubscriptionTRX:", modelSubscriptionAddress);
    console.log("\n合约地址 (Base58):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ModelSubscriptionTRX:", modelSubscriptionBase58);
    console.log("\n浏览器链接:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ModelSubscription:", `https://nile.tronscan.org/#/contract/${modelSubscriptionBase58}`);
    console.log("\n已注册模型数量:", models.length);
    console.log("每个模型价格:", "1 TRX / 30天");
    console.log("========================================\n");

  } catch (error) {
    console.error("\n❌ 部署失败:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:");
    console.error(error);
    process.exit(1);
  });
