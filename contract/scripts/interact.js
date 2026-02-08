const hre = require("hardhat");
const addresses = require("../contract-addresses.json");

async function main() {
  console.log("\n========================================");
  console.log("  🔧 MiMiAlpha 合约交互示例");
  console.log("========================================\n");

  const [owner, addr1, addr2] = await hre.ethers.getSigners();
  console.log("📝 使用账户:", owner.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(owner.address)), "ETH\n");

  // 1. 连接到 MockERC20
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 [1/5] 测试 MockERC20 代币");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const token = await MockERC20.attach(addresses.contracts.MockERC20);
  
  console.log("代币名称:", await token.name());
  console.log("代币符号:", await token.symbol());
  console.log("总供应量:", hre.ethers.formatEther(await token.totalSupply()), "cUSD");
  console.log("Owner 余额:", hre.ethers.formatEther(await token.balanceOf(owner.address)), "cUSD");

  // 2. 转账测试
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 [2/5] 测试代币转账");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("转账 1000 cUSD 到 addr1...");
  let tx = await token.transfer(addr1.address, hre.ethers.parseEther("1000"));
  await tx.wait();
  console.log("✅ 转账成功!");
  console.log("Addr1 余额:", hre.ethers.formatEther(await token.balanceOf(addr1.address)), "cUSD");

  // 3. 连接到 SmartFacilitator
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 [3/5] 测试 SmartFacilitator");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const SmartFacilitator = await hre.ethers.getContractFactory("SmartFacilitator");
  const facilitator = await SmartFacilitator.attach(addresses.contracts.SmartFacilitator);
  
  console.log("合约地址:", addresses.contracts.SmartFacilitator);
  console.log("USDT 地址:", await facilitator.usdt());

  // 4. 创建 AI Agent
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 [4/5] 创建 AI Agent");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const agentAddress = addr1.address;
  console.log("创建 Agent:", agentAddress);
  
  tx = await facilitator.createAgent(agentAddress, "测试 Agent");
  await tx.wait();
  console.log("✅ Agent 创建成功!");
  
  const agentInfo = await facilitator.getAgentInfo(agentAddress);
  console.log("\nAgent 信息:");
  console.log("  名称:", agentInfo.name);
  console.log("  所有者:", agentInfo.owner);
  console.log("  余额:", agentInfo.balance.toString(), "cUSD (最小单位)");
  console.log("  信用评分:", agentInfo.creditScore.toString(), "/ 1000");
  console.log("  状态:", agentInfo.active ? "激活" : "未激活");

  // 5. 为 Agent 充值
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📝 [5/5] 为 Agent 充值");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const depositAmount = hre.ethers.parseEther("100");
  console.log("充值金额:", hre.ethers.formatEther(depositAmount), "cUSD");
  
  // 先授权
  console.log("授权 Facilitator 使用代币...");
  tx = await token.approve(addresses.contracts.SmartFacilitator, depositAmount);
  await tx.wait();
  console.log("✅ 授权成功!");
  
  // 充值
  console.log("执行充值...");
  tx = await facilitator.depositFunds(agentAddress, depositAmount);
  await tx.wait();
  console.log("✅ 充值成功!");
  
  const updatedAgentInfo = await facilitator.getAgentInfo(agentAddress);
  console.log("Agent 新余额:", hre.ethers.formatEther(updatedAgentInfo.balance), "cUSD");

  // 6. 查询配额使用情况
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 配额使用情况");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  const quota = await facilitator.getQuotaUsage(agentAddress);
  console.log("日限额:", hre.ethers.formatUnits(quota.dailyLimit, 6), "USDT");
  console.log("日已用:", hre.ethers.formatUnits(quota.dailySpent, 6), "USDT");
  console.log("月限额:", hre.ethers.formatUnits(quota.monthlyLimit, 6), "USDT");
  console.log("月已用:", hre.ethers.formatUnits(quota.monthlySpent, 6), "USDT");

  // 总结
  console.log("\n========================================");
  console.log("  🎉 交互测试完成!");
  console.log("========================================");
  console.log("\n📊 统计信息:");
  console.log("  总 Agent 数:", (await facilitator.totalAgents()).toString());
  console.log("  总支付次数:", (await facilitator.totalPayments()).toString());
  console.log("  总交易量:", hre.ethers.formatEther(await facilitator.totalVolume()), "cUSD");
  
  console.log("\n💡 提示:");
  console.log("  - 使用 'npx hardhat console --network localhost' 进行更多交互");
  console.log("  - 查看 contract-addresses.json 获取合约地址");
  console.log("  - 运行 'npm test' 进行完整测试");
  console.log("\n========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
