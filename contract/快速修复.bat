@echo off
echo ========================================
echo   快速修复 npm 依赖问题
echo ========================================
echo.

echo 正在修复...
echo.

REM 删除旧依赖
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del /f /q package-lock.json

REM 清理缓存
npm cache clean --force

REM 安装依赖
npm install --legacy-peer-deps

echo.
echo ========================================
echo   修复完成！
echo ========================================
echo.
echo 下一步：
echo   npm run compile
echo.
pause
