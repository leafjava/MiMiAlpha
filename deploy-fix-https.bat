@echo off
echo ========================================
echo 修复 Mixed Content 错误 - 快速部署
echo ========================================
echo.

echo [1/3] 添加所有新文件...
git add api/*.py
git add frontend/.env.production
git add *.md
git add deploy-fix-https.bat

echo.
echo [2/3] 提交更改...
git commit -m "修复 Mixed Content 错误：添加 Vercel Serverless Functions"

echo.
echo [3/3] 推送到 GitHub...
git push origin main

echo.
echo ========================================
echo ✅ 部署完成！
echo ========================================
echo.
echo Vercel 正在自动部署，请等待 2-3 分钟
echo.
echo 然后访问: https://mi-mi-alpha-ud8f.vercel.app
echo.
echo 如果还有问题，请查看:
echo - Vercel 部署日志
echo - 浏览器控制台 (F12)
echo - VERCEL_API_SETUP.md 文档
echo.
pause
