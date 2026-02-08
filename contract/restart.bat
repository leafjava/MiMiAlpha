@echo off
chcp 65001 >nul
echo ========================================
echo 🔄 MiMiAlpha 合约重启脚本
echo ========================================
echo.

echo 📝 步骤 1: 停止现有 Hardhat 节点...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *hardhat*" 2>nul
timeout /t 2 /nobreak >nul

echo.
echo 📝 步骤 2: 清理缓存...
if exist artifacts rmdir /s /q artifacts
if exist cache rmdir /s /q cache

echo.
echo 📝 步骤 3: 重新编译合约...
call npx hardhat compile

echo.
echo 📝 步骤 4: 启动 Hardhat 节点（新窗口）...
start "Hardhat Node" cmd /k "npx hardhat node"

echo.
echo ⏳ 等待节点启动...
timeout /t 5 /nobreak >nul

echo.
echo 📝 步骤 5: 部署合约...
call npx hardhat run scripts/deploy-all.js --network localhost

echo.
echo 📝 步骤 6: 复制合约地址到前端...
copy /Y contract-addresses.json ..\frontend\src\contracts\contract-addresses.json >nul

echo.
echo ========================================
echo ✅ 合约重启完成！
echo ========================================
echo.
echo 📋 下一步:
echo 1. 检查 Hardhat 节点窗口是否正常运行
echo 2. 查看 contract-addresses.json 确认合约地址
echo 3. 启动前端: cd ..\frontend ^&^& npm run dev
echo.
pause
