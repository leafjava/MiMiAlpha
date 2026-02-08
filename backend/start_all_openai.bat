@echo off
chcp 65001 >nul
echo ==========================================
echo 启动 MiMiAlpha 后端服务（OpenAI 版本）
echo ==========================================

REM 创建必要的目录
if not exist logs mkdir logs
if not exist pids mkdir pids

REM 检查环境变量
if "%OPENAI_API_KEY%"=="" (
    echo ⚠️  警告: OPENAI_API_KEY 未设置
    echo    请在 .env 文件中配置或使用: set OPENAI_API_KEY=your-key
)

REM 启动 AI 助手服务（端口 8000）
echo.
echo 🚀 启动 AI 助手服务...
start /B python ai_assistant_server_openai.py > logs\ai_assistant.log 2>&1
echo    ✅ AI 助手服务已启动
echo    📡 http://localhost:8000

REM 等待 2 秒
timeout /t 2 /nobreak >nul

REM 启动风险评估服务（端口 5003）
echo.
echo 🛡️  启动风险评估服务...
start /B python risk_assessment_api_openai.py > logs\risk_assessment.log 2>&1
echo    ✅ 风险评估服务已启动
echo    📡 http://localhost:5003

REM 等待 2 秒
timeout /t 2 /nobreak >nul

REM 启动争议仲裁服务（端口 5004）
echo.
echo ⚖️  启动争议仲裁服务...
start /B python dispute_arbitration_api_openai.py > logs\dispute.log 2>&1
echo    ✅ 争议仲裁服务已启动
echo    📡 http://localhost:5004

REM 等待 2 秒
timeout /t 2 /nobreak >nul

REM 启动支付治理服务（端口 8006）
echo.
echo 💰 启动支付治理服务...
start /B python payment_governance_api_openai.py > logs\payment_governance.log 2>&1
echo    ✅ 支付治理服务已启动
echo    📡 http://localhost:8006

echo.
echo ==========================================
echo ✅ 所有服务已启动
echo ==========================================
echo.
echo 📊 服务列表:
echo    - AI 助手:   http://localhost:8000
echo    - 风险评估:  http://localhost:5003
echo    - 争议仲裁:  http://localhost:5004
echo    - 支付治理:  http://localhost:8006
echo.
echo 📝 查看日志:
echo    type logs\ai_assistant.log
echo    type logs\risk_assessment.log
echo    type logs\dispute.log
echo    type logs\payment_governance.log
echo.
echo 🧪 测试服务:
echo    python test_openai_services.py
echo.
echo 🛑 停止服务:
echo    taskkill /F /IM python.exe
echo.
echo ==========================================

pause
