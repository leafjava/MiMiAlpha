@echo off
echo ========================================
echo   MiMiAlpha 合约快速启动脚本
echo ========================================
echo.

REM 检查是否在 contract 目录
if not exist "package.json" (
    echo [错误] 请在 contract 目录下运行此脚本
    echo 当前目录: %CD%
    pause
    exit /b 1
)

echo [1/5] 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo [✓] Node.js 已安装
echo.

echo [2/5] 检查依赖...
if not exist "node_modules" (
    echo [提示] 未检测到 node_modules，开始安装依赖...
    call npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo [✓] 依赖已安装
)
echo.

echo [3/5] 检查环境变量...
if not exist ".env" (
    echo [提示] 未检测到 .env 文件，从 .env.example 复制...
    copy .env.example .env >nul
    echo [警告] 请编辑 .env 文件，填入你的私钥
    echo.
    echo 按任意键继续（将使用示例私钥）...
    pause >nul
)
echo [✓] 环境变量已配置
echo.

echo [4/5] 编译合约...
call npx hardhat compile
if errorlevel 1 (
    echo [错误] 合约编译失败
    pause
    exit /b 1
)
echo [✓] 合约编译成功
echo.

echo [5/5] 选择部署方式:
echo.
echo   1. 启动本地节点（推荐用于开发）
echo   2. 直接部署到内存网络（快速测试）
echo   3. 部署到 TRON Nile 测试网
echo   4. 退出
echo.
set /p choice="请选择 (1-4): "

if "%choice%"=="1" goto local_node
if "%choice%"=="2" goto memory_deploy
if "%choice%"=="3" goto tron_deploy
if "%choice%"=="4" goto end

:local_node
echo.
echo ========================================
echo   启动本地节点
echo ========================================
echo.
echo [提示] 本地节点将在 http://127.0.0.1:8545 运行
echo [提示] 请保持此窗口打开
echo [提示] 在新终端运行: npx hardhat run scripts/deploy.js --network localhost
echo.
call npx hardhat node
goto end

:memory_deploy
echo.
echo ========================================
echo   部署到内存网络
echo ========================================
echo.
call npx hardhat run scripts/deploy.js --network hardhat
if errorlevel 1 (
    echo [错误] 部署失败
    pause
    exit /b 1
)
echo.
echo [✓] 部署成功！
echo [提示] 合约地址已保存到 contract-addresses.json
goto end

:tron_deploy
echo.
echo ========================================
echo   部署到 TRON Nile 测试网
echo ========================================
echo.
echo [检查] 是否安装 TronBox...
tronbox --version >nul 2>&1
if errorlevel 1 (
    echo [提示] 未检测到 TronBox，开始安装...
    call npm install -g tronbox
    if errorlevel 1 (
        echo [错误] TronBox 安装失败
        pause
        exit /b 1
    )
)
echo [✓] TronBox 已安装
echo.
echo [提示] 确保你的钱包有足够的测试网 TRX
echo [提示] 获取测试币: https://nileex.io/join/getJoinPage
echo.
pause
echo.
call tronbox migrate --network nile
if errorlevel 1 (
    echo [错误] 部署失败
    pause
    exit /b 1
)
echo.
echo [✓] 部署成功！
goto end

:end
echo.
echo ========================================
echo   操作完成
echo ========================================
pause
