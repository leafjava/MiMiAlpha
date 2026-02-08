@echo off
echo ========================================
echo Hackathon 服务状态检查
echo ========================================
echo.

echo [1/6] 检查 Ollama (11434)...
curl -s http://localhost:11434 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Ollama 运行中
) else (
    echo [X] Ollama 未运行
)

echo [2/6] 检查智能客服 API (8000)...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 智能客服 API 运行中
) else (
    echo [X] 智能客服 API 未运行
)

echo [3/6] 检查风险评估 API (8001)...
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 风险评估 API 运行中
) else (
    echo [X] 风险评估 API 未运行
)

echo [4/6] 检查争议仲裁 API (8002)...
curl -s http://localhost:8002/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 争议仲裁 API 运行中
) else (
    echo [X] 争议仲裁 API 未运行
)

echo [5/6] 检查信用评分 API (8003)...
curl -s http://localhost:8003/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 信用评分 API 运行中
) else (
    echo [X] 信用评分 API 未运行
)

echo [6/6] 检查前端服务 (5173)...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] 前端服务运行中
) else (
    echo [X] 前端服务未运行
)

echo.
echo ========================================
echo 检查完成
echo ========================================
pause
