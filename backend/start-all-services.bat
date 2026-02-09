@echo off
echo ========================================
echo 启动所有后端服务
echo ========================================
echo.

echo 检查虚拟环境...
if not exist "venv\" (
    echo 虚拟环境不存在，正在创建...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo.
echo ========================================
echo 启动服务...
echo ========================================
echo.

echo 1. 启动 AI 助手服务 (端口 8000)
start "AI Assistant" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python ai_assistant_server.py"
timeout /t 2 /nobreak >nul

echo 2. 启动风险评估服务 (端口 5003)
start "Risk Assessment" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python risk_assessment_api_openai.py"
timeout /t 2 /nobreak >nul

echo 3. 启动资产管理服务 (端口 8004)
start "Asset Management" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python asset_management_api.py"
timeout /t 2 /nobreak >nul

echo 4. 启动信用评分服务 (端口 8003)
start "Credit Score" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python credit_score_api.py"
timeout /t 2 /nobreak >nul

echo 5. 启动争议仲裁服务 (端口 5004)
start "Dispute Arbitration" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python dispute_arbitration_api.py"
timeout /t 2 /nobreak >nul

echo 6. 启动收益计算服务 (端口 8005)
start "Yield Calculation" cmd /k "cd /d %~dp0 && venv\Scripts\activate.bat && python yield_calculation_api.py"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo ✅ 所有服务已启动！
echo ========================================
echo.
echo 服务列表:
echo - AI 助手:    http://localhost:8000
echo - 风险评估:   http://localhost:5003
echo - 资产管理:   http://localhost:8004
echo - 信用评分:   http://localhost:8003
echo - 争议仲裁:   http://localhost:5004
echo - 收益计算:   http://localhost:8005
echo.
echo 按任意键关闭此窗口...
pause >nul
