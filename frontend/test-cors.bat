@echo off
echo ========================================
echo 测试 CORS 配置
echo ========================================
echo.

echo 1. 检查环境变量配置...
type .env | findstr "VITE_AI_API_URL"
echo.

echo 2. 检查 Vite 配置...
type vite.config.ts | findstr "proxy"
echo.

echo 3. 启动开发服务器...
echo 请在浏览器中打开 http://localhost:5173
echo 并检查网络请求是否正常
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm run dev
