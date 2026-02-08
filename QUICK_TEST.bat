@echo off
echo ========================================
echo VirtualVault 快速功能测试
echo ========================================
echo.

echo 测试前请确保所有服务已启动！
echo 如果还没启动，请运行: START_ALL.bat
echo.
pause

echo.
echo ========================================
echo 测试资产管理 API (8004)
echo ========================================
cd backend
python test_asset_api.py

echo.
echo ========================================
echo 测试收益计算 API (8005)
echo ========================================
python test_yield_api.py

echo.
echo ========================================
echo 所有测试完成！
echo ========================================
echo.
echo 现在可以访问前端查看效果:
echo http://localhost:5173
echo.
pause
