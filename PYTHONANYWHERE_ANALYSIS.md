# PythonAnywhere 部署分析

## ❌ 不推荐使用 PythonAnywhere

### 主要问题

1. **多服务架构不兼容**
   - 你的项目有 4 个独立服务（端口 8000, 5003, 5004, 8006）
   - PythonAnywhere 免费版只支持 1 个 Web 应用
   - 付费版（$10/月）也只支持 3 个

2. **OpenAI API 访问限制**
   - 免费版只能访问白名单网站
   - OpenAI API 可能无法访问
   - 会导致所有 AI 功能失效

3. **CPU 时间限制**
   - 免费版：100 秒/天
   - AI 推理可能需要 5-15 秒/次
   - 很快就会超限

4. **网络限制**
   - 免费版带宽很低
   - 不支持自定义域名
   - 只能用 `username.pythonanywhere.com`

## ✅ 推荐方案对比

| 方案 | 成本 | 难度 | 适合度 | 推荐指数 |
|------|------|------|--------|----------|
| **阿里云 ECS（当前）** | 已有 | ⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Railway.app** | $5/月免费额度 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Render.com** | 免费（有限制） | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Vercel Serverless** | 免费 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Heroku** | $7/月起 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| PythonAnywhere | $10/月 | ⭐ | ⭐ | ❌ |

---

## 🎯 最佳方案：继续使用阿里云 ECS

你的阿里云服务器已经配置好了，服务运行正常。只需要做一些优化：

### 1. 配置进程守护（防止服务崩溃）

#### 方案 A：使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件
```

创建 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [
    {
      name: 'ai-assistant',
      script: 'venv/bin/python',
      args: 'ai_assistant_server.py',
      cwd: '/www/wwwroot/MiMiAlpha/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 8000
      }
    },
    {
      name: 'risk-assessment',
      script: 'venv/bin/python',
      args: 'risk_assessment_api_openai.py',
      cwd: '/www/wwwroot/MiMiAlpha/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 5003
      }
    },
    {
      name: 'dispute-arbitration',
      script: 'venv/bin/python',
      args: 'dispute_arbitration_api_openai.py',
      cwd: '/www/wwwroot/MiMiAlpha/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 5004
      }
    },
    {
      name: 'payment-governance',
      script: 'venv/bin/python',
      args: 'payment_governance_api_openai.py',
      cwd: '/www/wwwroot/MiMiAlpha/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 8006
      }
    }
  ]
};
```

启动服务：
```bash
cd /www/wwwroot/MiMiAlpha/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 方案 B：使用 systemd

创建服务文件 `/etc/systemd/system/mimialpha-ai.service`：
```ini
[Unit]
Description=MiMiAlpha AI Assistant
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/www/wwwroot/MiMiAlpha/backend
Environment="PATH=/www/wwwroot/MiMiAlpha/backend/venv/bin"
ExecStart=/www/wwwroot/MiMiAlpha/backend/venv/bin/python ai_assistant_server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
systemctl daemon-reload
systemctl enable mimialpha-ai
systemctl start mimialpha-ai
```

### 2. 配置 Nginx 反向代理（可选但推荐）

创建 `/etc/nginx/sites-available/mimialpha`：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 或使用 IP

    # AI 助手
    location /api/chat {
        proxy_pass http://127.0.0.1:8000/v1/assistant/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # 风险评估
    location /api/risk {
        proxy_pass http://127.0.0.1:5003/api/risk;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 争议仲裁
    location /api/dispute {
        proxy_pass http://127.0.0.1:5004/api/dispute;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 支付治理
    location /api/governance {
        proxy_pass http://127.0.0.1:8006/api/governance;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用配置：
```bash
ln -s /etc/nginx/sites-available/mimialpha /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 3. 配置 HTTPS（推荐）

```bash
# 安装 Certbot
apt install certbot python3-certbot-nginx

# 获取证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

### 4. 监控和日志

```bash
# 查看服务状态
pm2 status
pm2 logs

# 或使用 systemd
systemctl status mimialpha-*
journalctl -u mimialpha-ai -f

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🚀 备选方案：Railway.app

如果你想尝试其他平台，Railway 是最好的选择：

### 优势
- ✅ 每月 $5 免费额度（约 500 小时）
- ✅ 支持多服务部署
- ✅ 自动 HTTPS
- ✅ 简单的 Git 部署
- ✅ 无外部 API 限制

### 部署步骤

1. **注册 Railway**
   - 访问 https://railway.app
   - 使用 GitHub 登录

2. **创建项目**
   - New Project → Deploy from GitHub repo
   - 选择你的仓库

3. **配置服务**

为每个服务创建 `Procfile`：

```bash
# Hackathon/backend/Procfile.ai
web: python ai_assistant_server.py

# Hackathon/backend/Procfile.risk
web: python risk_assessment_api_openai.py

# Hackathon/backend/Procfile.dispute
web: python dispute_arbitration_api_openai.py

# Hackathon/backend/Procfile.governance
web: python payment_governance_api_openai.py
```

4. **设置环境变量**

在 Railway 项目设置中添加：
```
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_BASE_URL=https://api.openai.com/v1
```

5. **部署**
   - Railway 会自动检测并部署
   - 每个服务会获得一个公开 URL

---

## 📊 成本对比

| 方案 | 月成本 | 年成本 | 备注 |
|------|--------|--------|------|
| **阿里云 ECS** | ¥0（已有） | ¥0 | 最佳选择 |
| **Railway** | $0-5 | $0-60 | 免费额度够用 |
| **Render** | $0 | $0 | 有休眠限制 |
| **Vercel** | $0 | $0 | 需要改造成 Serverless |
| PythonAnywhere | $10 | $120 | 不推荐 |
| Heroku | $7 | $84 | 性价比低 |

---

## 🎯 最终建议

### 短期（Demo/测试）
**继续使用阿里云 ECS** + 配置 PM2/systemd 守护进程

### 中期（正式上线）
**阿里云 ECS** + Nginx 反向代理 + HTTPS

### 长期（扩展）
考虑使用 **Docker + Kubernetes** 或 **Railway** 实现自动扩展

---

## ⚠️ PythonAnywhere 的唯一适用场景

PythonAnywhere 只适合：
- 单个简单的 Flask 应用
- 不需要调用外部 API
- 流量很小的个人项目
- 学习和测试用途

**你的项目不符合以上任何条件，强烈不推荐使用！**

---

## 📞 需要帮助？

如果你想：
1. ✅ 配置 PM2 守护进程 → 我可以帮你生成配置文件
2. ✅ 配置 Nginx 反向代理 → 我可以生成完整配置
3. ✅ 迁移到 Railway → 我可以指导你完成部署
4. ✅ 配置 HTTPS → 我可以提供详细步骤

告诉我你想做什么，我来帮你！
