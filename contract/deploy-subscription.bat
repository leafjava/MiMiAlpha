@echo off
echo ========================================
echo 部署模型订阅合约
echo ========================================
echo.

echo 1. 检查依赖...
call npm list hardhat >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Hardhat
    echo 请先运行: npm install
    pause
    exit /b 1
)

echo 2. 编译合约...
call npx hardhat compile
if errorlevel 1 (
    echo 编译失败!
    pause
    exit /b 1
)

echo.
echo 3. 部署 ModelSubscription 合约...
call node scripts/deploy-model-subscription.js
if errorlevel 1 (
    echo 部署失败!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 部署完成!
echo ========================================
echo.
echo 合约地址已保存到:
echo - contract-addresses.json
echo - ../frontend/src/contracts/contract-addresses.json
echo.
echo 现在可以在前端使用模型市场二功能了!
echo.
pause
