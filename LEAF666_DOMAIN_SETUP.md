# leaf666.icu 域名配置指南

## 🎯 域名规划

使用 `leaf666.icu` 配置以下子域名：

- **前端**: `https://mimialpha.leaf666.icu` 或 `https://app.leaf666.icu`
- **API**: `https://api.leaf666.icu`

---

## 📋 配置步骤

### 步骤 1：配置 DNS 解析

登录你的域名服务商（阿里云/腾讯云/Cloudflare），添加以下 DNS 记录：

#### 记录 1：API 服务器（指向阿里云 ECS）
```
类型: A
主机记录: api
记录值: 47.93.166.48
TTL: 600
```

#### 记录 2：前端（指向 Vercel）
```
类型: CNAME
主机记录: mimialpha (或 app)
记录值: cname.vercel-dns.com
TTL: 600
```

**完成后等待 5-10 分钟 DNS 生效。**

---

### 步骤 2：宝塔面板配置 SSL（API 服务器）

#### 2.1 添加网站

1. 登录宝塔面板
2. 点击左侧 **"网站"** → **"添加站点"**
3. 填写信息：
   - **域名**: `api.leaf666.icu`
   - **根目录**: `/www/wwwroot/mimialpha-api`（新建）
   - **PHP 版本**: 纯静态
   - **数据库**: 不创建

#### 2.2 申请 SSL 证书

1. 点击网站设置 → **"SSL"** 标签
2. 选择 **"Let's Encrypt"**
3. 勾选 `api.leaf666.icu`
4. 点击 **"申请"**
5. 等待证书申请完成（1-2 分钟）
6. 开启 **"强制 HTTPS"**

#### 2.3 配置反向代理

1. 在网站设置中，点击 **"反向代理"**
2. 点击 **"添加反向代理"**

**代理配置 1：AI 助手**
```
代理名称: ai-assistant
目标URL: http://127.0.0.1:8000
发送域名: $host
```

**代理配置 2：风险评估**
```
代理名称: risk-assessment
目标URL: http://127.0.0.1:5003
发送域名: $host
```

**代理配置 3：争议仲裁**
```
代理名称: dispute-arbitration
目标URL: http://127.0.0.1:5004
发送域名: $host
```

**代理配置 4：支付治理**
```
代理名称: payment-governance
目标URL: http://127.0.0.1:8006
发送域名: $host
```

**代理配置 5：收益计算**
```
代理名称: yield-calculation
目标URL: http://127.0.0.1:8005
发送域名: $host
```

#### 2.4 配置 Nginx（高级）

如果需要更精细的控制，可以直接编辑 Nginx 配置：

点击网站设置 → **"配置文件"**，添加以下内容：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.leaf666.icu;
    
    # SSL 证书（宝塔自动配置）
    ssl_certificate /www/server/panel/vhost/cert/api.leaf666.icu/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/api.leaf666.icu/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 强制 HTTPS
    if ($server_port !~ 443){
        rewrite ^(/.*)$ https://$host$1 permanent;
    }
    
    # CORS 配置
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
    
    # OPTIONS 请求处理
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    # AI 助手
    location /api/chat {
        proxy_pass http://127.0.0.1:8000/v1/assistant/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # 风险评估
    location /api/risk {
        proxy_pass http://127.0.0.1:5003/api/risk;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 争议仲裁
    location /api/dispute {
        proxy_pass http://127.0.0.1:5004/api/dispute;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 支付治理
    location /api/governance {
        proxy_pass http://127.0.0.1:8006/api/governance;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 收益计算
    location /api/yield {
        proxy_pass http://127.0.0.1:8005/api/yield;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 日志
    access_log /www/wwwlogs/api.leaf666.icu.log;
    error_log /www/wwwlogs/api.leaf666.icu.error.log;
}
```

保存后，点击 **"重载配置"**。

---

### 步骤 3：Vercel 配置自定义域名（前端）

#### 3.1 添加域名

1. 登录 Vercel: https://vercel.com
2. 进入你的项目（mi-mi-alpha）
3. 点击 **"Settings"** → **"Domains"**
4. 添加域名：`mimialpha.leaf666.icu` 或 `app.leaf666.icu`
5. Vercel 会提示你配置 DNS（已在步骤 1 完成）
6. 等待验证通过（通常 1-5 分钟）

#### 3.2 Vercel 自动配置 SSL

Vercel 会自动为你的域名申请和配置 SSL 证书，无需手动操作。

---

### 步骤 4：更新前端环境变量

修改 `Hackathon/frontend/.env.production`：

```bash
# 生产环境配置 - 使用自定义域名（HTTPS）

# API 基础地址
VITE_API_BASE_URL=https://api.leaf666.icu

# 各服务 API 地址
VITE_AI_API_URL=https://api.leaf666.icu/api/chat
VITE_RISK_API_URL=https://api.leaf666.icu/api/risk
VITE_DISPUTE_API_URL=https://api.leaf666.icu/api/dispute
VITE_GOVERNANCE_API_URL=https://api.leaf666.icu/api/governance
VITE_YIELD_API_URL=https://api.leaf666.icu/api/yield

# 应用配置
VITE_APP_NAME=MiMiAlpha
VITE_NETWORK=testnet
```

---

### 步骤 5：更新后端 CORS 配置

确保后端允许新域名访问。编辑所有后端 API 文件，更新 CORS 配置：

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",  # 本地开发
            "https://mi-mi-alpha-ud8f.vercel.app",  # Vercel 默认域名
            "https://mimialpha.leaf666.icu",  # 自定义域名
            "https://app.leaf666.icu",  # 备用域名
            "https://api.leaf666.icu"  # API 域名
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

或者简单粗暴（仅测试环境）：
```python
CORS(app, origins="*")  # 允许所有来源
```

---

### 步骤 6：部署更新

```bash
cd Hackathon

# 提交更改
git add frontend/.env.production
git add backend/*.py
git commit -m "配置 leaf666.icu 自定义域名"
git push origin main
```

Vercel 会自动重新部署。

---

## 🧪 测试配置

### 测试 DNS 解析

```bash
# Windows
nslookup api.leaf666.icu
nslookup mimialpha.leaf666.icu

# 或使用在线工具
# https://tool.chinaz.com/dns/
```

### 测试 API（HTTPS）

```bash
# 健康检查
curl https://api.leaf666.icu/health

# AI 助手
curl -X POST https://api.leaf666.icu/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'

# 收益计算
curl https://api.leaf666.icu/api/yield/overview
```

### 测试前端

访问：
- `https://mimialpha.leaf666.icu`
- 或 `https://app.leaf666.icu`

打开浏览器控制台（F12），确认：
- ✅ 所有请求都是 HTTPS
- ✅ 没有 Mixed Content 错误
- ✅ API 调用成功

---

## 📊 最终架构

```
┌─────────────────────────────────────────────────────────┐
│  用户浏览器                                              │
│  https://mimialpha.leaf666.icu                          │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS 请求
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Vercel (前端托管)                                       │
│  - 自动 HTTPS                                           │
│  - 全球 CDN                                             │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS 请求
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Nginx (api.leaf666.icu)                                │
│  - SSL 证书（Let's Encrypt）                            │
│  - 反向代理                                             │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP 请求（内部网络）
                  ↓
┌─────────────────────────────────────────────────────────┐
│  阿里云 ECS 后端服务器 (47.93.166.48)                   │
│  - AI 助手:    localhost:8000                           │
│  - 风险评估:   localhost:5003                           │
│  - 争议仲裁:   localhost:5004                           │
│  - 支付治理:   localhost:8006                           │
│  - 收益计算:   localhost:8005                           │
└─────────────────────────────────────────────────────────┘
```

**优势：**
- ✅ 全程 HTTPS，安全可靠
- ✅ 自定义域名，更专业
- ✅ 免费 SSL 证书，自动续期
- ✅ 全球 CDN 加速（Vercel）
- ✅ 无 Mixed Content 错误

---

## 🔒 安全建议

### 1. 配置防火墙

确保阿里云安全组只开放必要端口：
- ✅ 80 (HTTP，用于重定向到 HTTPS)
- ✅ 443 (HTTPS)
- ✅ 22 (SSH，仅限你的 IP)
- ❌ 8000, 5003, 5004, 5005, 8006（不对外开放，仅内部访问）

### 2. 配置 SSL 安全等级

在宝塔面板 SSL 设置中：
- 启用 **HSTS**（强制 HTTPS）
- 启用 **TLS 1.3**
- 禁用 **TLS 1.0/1.1**

### 3. 配置速率限制

在 Nginx 配置中添加：
```nginx
# 限制请求速率
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... 其他配置
}
```

---

## 🎉 完成检查清单

- [ ] DNS 解析配置完成（A 记录 + CNAME）
- [ ] 宝塔面板添加网站
- [ ] SSL 证书申请成功
- [ ] Nginx 反向代理配置完成
- [ ] Vercel 自定义域名添加
- [ ] 前端环境变量更新
- [ ] 后端 CORS 配置更新
- [ ] 代码提交并推送
- [ ] DNS 解析测试通过
- [ ] API HTTPS 测试通过
- [ ] 前端访问测试通过
- [ ] 无 Mixed Content 错误

---

## 🆘 常见问题

### Q: DNS 解析不生效？
A: 等待 5-10 分钟，或清除本地 DNS 缓存：
```bash
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache
```

### Q: SSL 证书申请失败？
A: 
1. 确认 DNS 解析已生效
2. 确认 80 端口可访问
3. 检查域名是否已被其他网站使用

### Q: Vercel 域名验证失败？
A: 
1. 确认 CNAME 记录正确
2. 等待 DNS 传播（最多 24 小时）
3. 尝试删除域名重新添加

### Q: API 请求仍然失败？
A: 
1. 检查后端服务是否运行
2. 检查 Nginx 配置是否正确
3. 查看 Nginx 错误日志：`tail -f /www/wwwlogs/api.leaf666.icu.error.log`

---

## 📞 需要帮助？

如果遇到问题：
1. 检查宝塔面板日志
2. 检查 Nginx 错误日志
3. 检查浏览器控制台
4. 使用在线工具测试 DNS 和 SSL

---

**🎊 配置完成后，你将拥有一个完全专业的 HTTPS 网站！** 🎊

- 前端：`https://mimialpha.leaf666.icu`
- API：`https://api.leaf666.icu`
- 全程加密，安全可靠！
