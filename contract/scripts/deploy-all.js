const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n========================================");
  console.log("  🚀 MiMiAlpha 合约部署");
  console.log("========================================\n");

  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "ETH\n");

  const deployedContracts = {};

  try {
    // 1. 部署 MockERC20
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 [1/3] 部署 MockERC20 测试代币...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy();
    await mockToken.waitForDeployment();
    const mockTokenAddress = await mockToken.getAddress();
    
    console.log("✅ MockERC20 部署成功!");
    console.log("   地址:", mockTokenAddress);
    console.log("   交易:", mockToken.deploymentTransaction().hash);
    
    deployedContracts.MockERC20 = mockTokenAddress;

    // 2. 部署 Escrow
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 [2/3] 部署 Escrow 托管合约...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const Escrow = await hre.ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(mockTokenAddress);
    await escrow.waitForDeployment();
    const escrowAddress = await escrow.getAddress();
    
    console.log("✅ Escrow 部署成功!");
    console.log("   地址:", escrowAddress);
    console.log("   交易:", escrow.deploymentTransaction().hash);
    console.log("   代币地址:", mockTokenAddress);
    
    deployedContracts.Escrow = escrowAddress;

    // 3. 部署 SmartFacilitator
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📝 [3/3] 部署 SmartFacilitator 治理合约...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    const SmartFacilitator = await hre.ethers.getContractFactory("SmartFacilitator");
    const facilitator = await SmartFacilitator.deploy();
    await facilitator.waitForDeployment();
    const facilitatorAddress = await facilitator.getAddress();
    
    console.log("✅ SmartFacilitator 部署成功!");
    console.log("   地址:", facilitatorAddress);
    console.log("   交易:", facilitator.deploymentTransaction().hash);
    
    deployedContracts.SmartFacilitator = facilitatorAddress;

    // 保存部署信息
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💾 保存部署信息...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: deployedContracts,
      blockNumber: await hre.ethers.provider.getBlockNumber()
    };

    // 保存到 JSON 文件
    const outputPath = path.join(__dirname, "../contract-addresses.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("✅ 部署信息已保存到:", outputPath);

    // 显示摘要
    console.log("\n========================================");
    console.log("  🎉 部署完成!");
    console.log("========================================");
    console.log("\n📋 部署摘要:");
    console.log("   网络:", hre.network.name);
    console.log("   Chain ID:", deploymentInfo.chainId);
    console.log("   区块高度:", deploymentInfo.blockNumber);
    console.log("\n📄 合约地址:");
    console.log("   MockERC20:", deployedContracts.MockERC20);
    console.log("   Escrow:", deployedContracts.Escrow);
    console.log("   SmartFacilitator:", deployedContracts.SmartFacilitator);
    
    console.log("\n🔗 下一步:");
    console.log("   1. 验证合约: npx hardhat verify --network", hre.network.name, deployedContracts.MockERC20);
    console.log("   2. 与合约交互: npx hardhat console --network", hre.network.name);
    console.log("   3. 运行测试: npx hardhat test");
    
    if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
      console.log("\n💡 提示: 你正在使用本地网络，合约将在节点停止后消失");
    }

    console.log("\n========================================\n");

  } catch (error) {
    console.error("\n❌ 部署失败:", error.message);
    console.error("\n详细错误:");
    console.error(error);
    process.exit(1);
  }
}

// 执行部署
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
