const TronWeb = require('tronweb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// TRON Nile 测试网配置
const NILE_API = 'https://nile.trongrid.io';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  console.log("========================================");
  console.log("开始部署到 TRON Nile 测试网");
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
  const mockERC20Path = path.join(__dirname, '../artifacts/contracts/MockERC20.sol/MockERC20.json');
  const modelSubscriptionPath = path.join(__dirname, '../artifacts/contracts/ModelSubscription.sol/ModelSubscription.json');

  if (!fs.existsSync(mockERC20Path) || !fs.existsSync(modelSubscriptionPath)) {
    console.error("错误: 合约未编译，请先运行: npx hardhat compile");
    process.exit(1);
  }

  const MockERC20Artifact = JSON.parse(fs.readFileSync(mockERC20Path, 'utf8'));
  const ModelSubscriptionArtifact = JSON.parse(fs.readFileSync(modelSubscriptionPath, 'utf8'));

  // 1. 部署 MockERC20 (USDT)
  console.log("步骤 1: 部署 MockERC20 (USDT) 代币...");
  
  try {
    const usdtContract = await tronWeb.contract().new({
      abi: MockERC20Artifact.abi,
      bytecode: MockERC20Artifact.bytecode,
      feeLimit: 1000_000_000,
      callValue: 0,
      parameters: ["Tether USD", "USDT", 18]
    });

    const usdtAddress = usdtContract.address;
    console.log("✓ USDT 代币已部署:", usdtAddress);
    console.log("  Base58:", tronWeb.address.fromHex(usdtAddress));

    // 等待交易确认
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 铸造测试 USDT
    console.log("\n铸造测试 USDT...");
    const mintAmount = tronWeb.toSun(1000000); // 1,000,000 USDT (注意：这里使用6位小数)
    
    const mintTx = await usdtContract.mint(deployerAddress, mintAmount).send({
      feeLimit: 100_000_000,
      callValue: 0
    });
    
    console.log("✓ 已铸造 1,000,000 USDT 到部署账户");
    console.log("  交易ID:", mintTx, "\n");

    // 等待交易确认
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. 部署 ModelSubscription
    console.log("步骤 2: 部署 ModelSubscription 合约...");
    
    const modelSubscriptionContract = await tronWeb.contract().new({
      abi: ModelSubscriptionArtifact.abi,
      bytecode: ModelSubscriptionArtifact.bytecode,
      feeLimit: 1000_000_000,
      callValue: 0,
      parameters: [usdtAddress]
    });

    const modelSubscriptionAddress = modelSubscriptionContract.address;
    console.log("✓ ModelSubscription 合约已部署:", modelSubscriptionAddress);
    console.log("  Base58:", tronWeb.address.fromHex(modelSubscriptionAddress), "\n");

    // 等待交易确认
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. 注册示例模型
    console.log("步骤 3: 注册示例模型...");
    
    const models = [
      {
        name: "AI Trading Bot Pro",
        description: "Advanced AI model for automated trading strategies",
        price: tronWeb.toSun(100), // 100 USDT
        duration: 30
      },
      {
        name: "Risk Assessment AI",
        description: "Comprehensive risk analysis model for DeFi protocols",
        price: tronWeb.toSun(150),
        duration: 30
      },
      {
        name: "Market Predictor",
        description: "Machine learning model for price prediction",
        price: tronWeb.toSun(200),
        duration: 30
      },
      {
        name: "Portfolio Optimizer",
        description: "AI-powered portfolio optimization",
        price: tronWeb.toSun(120),
        duration: 30
      },
      {
        name: "Smart Contract Auditor",
        description: "Automated smart contract security analysis",
        price: tronWeb.toSun(180),
        duration: 30
      },
      {
        name: "Sentiment Analyzer",
        description: "Real-time social media sentiment analysis",
        price: tronWeb.toSun(90),
        duration: 30
      }
    ];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      console.log(`注册模型 ${i + 1}/${models.length}: ${model.name}`);
      
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

    // 4. 保存合约地址
    const usdtBase58 = tronWeb.address.fromHex(usdtAddress);
    const modelSubscriptionBase58 = tronWeb.address.fromHex(modelSubscriptionAddress);

    const addresses = {
      network: "nile",
      chainId: 3448148188,
      timestamp: new Date().toISOString(),
      deployer: deployerAddress,
      contracts: {
        MockERC20: usdtAddress,
        MockERC20Base58: usdtBase58,
        USDT: usdtAddress,
        USDTBase58: usdtBase58,
        ModelSubscription: modelSubscriptionAddress,
        ModelSubscriptionBase58: modelSubscriptionBase58
      },
      explorer: {
        usdt: `https://nile.tronscan.org/#/contract/${usdtBase58}`,
        modelSubscription: `https://nile.tronscan.org/#/contract/${modelSubscriptionBase58}`
      }
    };

    // 保存到合约目录
    const addressesPath = path.join(__dirname, "../contract-addresses-nile.json");
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log("合约地址已保存到:", addressesPath);

    // 同步到前端
    const frontendDir = path.join(__dirname, "../../frontend/src/contracts");
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    const frontendAddressesPath = path.join(frontendDir, "contract-addresses-nile.json");
    fs.writeFileSync(frontendAddressesPath, JSON.stringify(addresses, null, 2));
    console.log("合约地址已同步到前端:", frontendAddressesPath);

    // 5. 输出部署摘要
    console.log("\n========================================");
    console.log("部署摘要 - TRON Nile 测试网");
    console.log("========================================");
    console.log("网络:", "Nile Testnet");
    console.log("API:", NILE_API);
    console.log("部署账户:", deployerAddress);
    console.log("\n合约地址 (Hex):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("USDT Token:", usdtAddress);
    console.log("ModelSubscription:", modelSubscriptionAddress);
    console.log("\n合约地址 (Base58):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("USDT Token:", usdtBase58);
    console.log("ModelSubscription:", modelSubscriptionBase58);
    console.log("\n浏览器链接:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("USDT:", `https://nile.tronscan.org/#/contract/${usdtBase58}`);
    console.log("ModelSubscription:", `https://nile.tronscan.org/#/contract/${modelSubscriptionBase58}`);
    console.log("\n已注册模型数量:", models.length);
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
