@echo off
echo ========================================
echo Starting Payment Governance API (8006)
echo ========================================
cd /d "%~dp0"
call venv\Scripts\activate.bat
python payment_governance_api.py
pause
