@echo off
echo ========================================
echo 验证前端配置
echo ========================================
echo.

echo 1. 检查 .env 文件
echo ----------------------------------------
type .env
echo.
echo ========================================
echo.

echo 2. 检查 vite.config.ts
echo ----------------------------------------
type vite.config.ts
echo.
echo ========================================
echo.

echo 配置说明:
echo - VITE_AI_API_URL 应该为空（使用相对路径）
echo - Vite 代理会将 /api 和 /v1 转发到 PythonAnywhere
echo.
echo 现在可以启动开发服务器:
echo   npm run dev
echo.
pause
