@echo off
echo ========================================
echo 启动 x402 解析 API (端口 8008)
echo ========================================
echo.

REM 激活虚拟环境（如果存在）
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM 启动服务
python x402_parser_api.py

pause
