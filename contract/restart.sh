#!/bin/bash

echo "========================================"
echo "🔄 MiMiAlpha 合约重启脚本"
echo "========================================"
echo ""

echo "📝 步骤 1: 停止现有 Hardhat 节点..."
pkill -f "hardhat node" 2>/dev/null
sleep 2

echo ""
echo "📝 步骤 2: 清理缓存..."
rm -rf artifacts cache

echo ""
echo "📝 步骤 3: 重新编译合约..."
npx hardhat compile

echo ""
echo "📝 步骤 4: 启动 Hardhat 节点（后台）..."
npx hardhat node > hardhat.log 2>&1 &
HARDHAT_PID=$!
echo "Hardhat 节点 PID: $HARDHAT_PID"

echo ""
echo "⏳ 等待节点启动..."
sleep 5

echo ""
echo "📝 步骤 5: 部署合约..."
npx hardhat run scripts/deploy-all.js --network localhost

echo ""
echo "📝 步骤 6: 复制合约地址到前端..."
cp contract-addresses.json ../frontend/src/contracts/contract-addresses.json

echo ""
echo "========================================"
echo "✅ 合约重启完成！"
echo "========================================"
echo ""
echo "📋 下一步:"
echo "1. Hardhat 节点正在后台运行 (PID: $HARDHAT_PID)"
echo "2. 查看日志: tail -f hardhat.log"
echo "3. 停止节点: kill $HARDHAT_PID"
echo "4. 启动前端: cd ../frontend && npm run dev"
echo ""
