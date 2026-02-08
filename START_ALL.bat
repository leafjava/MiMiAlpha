@echo off
echo ========================================
echo VirtualVault 虚拟商品资产管理平台
echo 一键启动所有服务
echo ========================================
echo.

echo 正在检查 Ollama 服务...
curl -s http://localhost:11434 >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [警告] Ollama 服务未运行！
    echo 请先在单独的终端运行: ollama serve
    echo.
    pause
    exit /b 1
)
echo [OK] Ollama 服务正常运行
echo.

echo ========================================
echo 启动后端 API 服务...
echo ========================================

echo [1/6] 启动智能客服 API (端口 8000)...
start "智能客服 API" cmd /k "cd backend && start_server.bat"
timeout /t 2 >nul

echo [2/6] 启动风险评估 API (端口 8001)...
start "风险评估 API" cmd /k "cd backend && start_risk_api.bat"
timeout /t 2 >nul

echo [3/6] 启动争议仲裁 API (端口 8002)...
start "争议仲裁 API" cmd /k "cd backend && start_dispute_api.bat"
timeout /t 2 >nul

echo [4/6] 启动信用评分 API (端口 8003)...
start "信用评分 API" cmd /k "cd backend && start_credit_api.bat"
timeout /t 2 >nul

echo [5/6] 启动资产管理 API (端口 8004)...
start "资产管理 API" cmd /k "cd backend && start_asset_api.bat"
timeout /t 2 >nul

echo [6/6] 启动收益计算 API (端口 8005)...
start "收益计算 API" cmd /k "cd backend && start_yield_api.bat"
timeout /t 2 >nul

echo.
echo ========================================
echo 启动前端服务...
echo ========================================
echo 启动前端 (端口 5173)...
start "前端服务" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 所有服务启动完成！
echo ========================================
echo.
echo 🌐 服务地址:
echo - 前端界面:   http://localhost:5173
echo.
echo 🤖 AI 服务:
echo - 智能客服:   http://localhost:8000
echo - 风险评估:   http://localhost:8001
echo - 争议仲裁:   http://localhost:8002
echo - 信用评分:   http://localhost:8003
echo.
echo 💎 RWA 服务:
echo - 资产管理:   http://localhost:8004
echo - 收益计算:   http://localhost:8005
echo.
echo 等待 10 秒后自动打开浏览器...
timeout /t 10 >nul

start http://localhost:5173

echo.
echo 按任意键关闭此窗口 (服务将继续运行)...
pause >nul
