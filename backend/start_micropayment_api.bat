@echo off
echo ========================================
echo 启动微支付聚合 API (端口 8007)
echo ========================================
echo.

REM 激活虚拟环境（如果存在）
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM 启动服务
python micropayment_aggregator_api.py

pause
