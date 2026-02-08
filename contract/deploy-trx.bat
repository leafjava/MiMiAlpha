@echo off
echo ========================================
echo 部署 TRX 支付版本到 TRON Nile 测试网
echo ========================================
echo.
echo 特点:
echo - 使用 TRX 原生代币支付
echo - 统一定价 1 TRX
echo - 无需 USDT 授权
echo - 更简单的测试流程
echo.

echo 检查环境...
if not exist .env (
    echo 错误: .env 文件不存在
    pause
    exit /b 1
)

echo 编译合约...
call npx hardhat compile

echo.
echo 开始部署...
echo.

node scripts/deploy-trx-nile.js

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 合约地址已保存到:
echo   - contract-addresses-trx-nile.json
echo   - frontend/src/contracts/contract-addresses-trx-nile.json
echo.
echo 查看详情: TRX_DEPLOYMENT_SUCCESS.md
echo.
pause
