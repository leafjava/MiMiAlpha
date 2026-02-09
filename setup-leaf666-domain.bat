@echo off
chcp 65001 >nul
echo ========================================
echo leaf666.icu 域名配置向导
echo ========================================
echo.

echo 📋 配置步骤概览：
echo.
echo 1. 配置 DNS 解析（域名服务商）
echo 2. 宝塔面板配置 SSL 证书
echo 3. Vercel 添加自定义域名
echo 4. 更新代码并部署
echo.
echo ========================================
echo.

echo [步骤 1] 配置 DNS 解析
echo.
echo 请登录你的域名服务商（阿里云/腾讯云/Cloudflare）
echo 添加以下 DNS 记录：
echo.
echo 记录 1 - API 服务器：
echo   类型: A
echo   主机记录: api
echo   记录值: 47.93.166.48
echo   TTL: 600
echo.
echo 记录 2 - 前端（Vercel）：
echo   类型: CNAME
echo   主机记录: mimialpha
echo   记录值: cname.vercel-dns.com
echo   TTL: 600
echo.
pause
echo.

echo [步骤 2] 宝塔面板配置
echo.
echo 1. 登录宝塔面板
echo 2. 网站 → 添加站点
echo    域名: api.leaf666.icu
echo 3. SSL → Let's Encrypt → 申请
echo 4. 开启"强制 HTTPS"
echo 5. 反向代理 → 添加代理（参考 LEAF666_DOMAIN_SETUP.md）
echo.
pause
echo.

echo [步骤 3] Vercel 配置
echo.
echo 1. 访问 https://vercel.com
echo 2. 进入项目 → Settings → Domains
echo 3. 添加域名: mimialpha.leaf666.icu
echo 4. 等待验证通过
echo.
pause
echo.

echo [步骤 4] 更新代码并部署
echo.
echo 正在提交更改...
git add .
git commit -m "配置 leaf666.icu 自定义域名"
git push origin main

echo.
echo ========================================
echo ✅ 配置完成！
echo ========================================
echo.
echo 等待 DNS 生效（5-10 分钟）后访问：
echo.
echo 前端: https://mimialpha.leaf666.icu
echo API:  https://api.leaf666.icu/health
echo.
echo 详细文档: LEAF666_DOMAIN_SETUP.md
echo.
pause
