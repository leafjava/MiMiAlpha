@echo off
echo ========================================
echo 部署合约到 TRON Nile 测试网
echo ========================================
echo.

echo 检查环境...
if not exist .env (
    echo 错误: .env 文件不存在
    echo 请先创建 .env 文件并配置私钥
    pause
    exit /b 1
)

echo 安装 TronWeb 依赖...
call npm install tronweb

echo.
echo 开始部署...
echo.

node scripts/deploy-tron-nile.js

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 请查看上方输出的合约地址
echo 合约地址已保存到:
echo   - contract-addresses-nile.json
echo   - frontend/src/contracts/contract-addresses-nile.json
echo.
pause
