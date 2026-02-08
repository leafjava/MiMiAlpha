@echo off
echo ========================================
echo 测试 x402 Smart Facilitator APIs
echo ========================================
echo.

echo 正在检查服务状态...
echo.

REM 检查微支付聚合 API
echo [1/2] 检查微支付聚合 API (端口 8007)...
curl -s http://localhost:8007/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 微支付聚合 API 正常运行
) else (
    echo [X] 微支付聚合 API 未运行
    echo 请先运行: cd backend ^&^& start_micropayment_api.bat
)
echo.

REM 检查 x402 解析 API
echo [2/2] 检查 x402 解析 API (端口 8008)...
curl -s http://localhost:8008/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] x402 解析 API 正常运行
) else (
    echo [X] x402 解析 API 未运行
    echo 请先运行: cd backend ^&^& start_x402_api.bat
)
echo.

echo ========================================
echo 运行测试脚本
echo ========================================
echo.

cd backend

echo [1/2] 测试微支付聚合 API...
python test_micropayment_api.py
echo.

echo [2/2] 测试 x402 解析 API...
python test_x402_api.py
echo.

echo ========================================
echo 测试完成！
echo ========================================
pause
