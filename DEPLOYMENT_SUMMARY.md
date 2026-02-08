# 🚀 MiMiAlpha 部署总结

## 📊 部署架构

```
┌─────────────────────────────────────────────────────────┐
│              Vercel (前端)                               │
│  https://your-project.vercel.app                        │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP 请求
                  ↓
┌─────────────────────────────────────────────────────────┐
│         阿里云 ECS (后端 API)                            │
│  IP: 172.28.109.217                                     │
│  - AI 助手服务:    http://172.28.109.217:8000          │
│  - 风险评估服务:   http://172.28.109.217:5003          │
│  - 争议仲裁服务:   http://172.28.109.217:5004          │
│  - 支付治理服务:   http://172.28.109.217:8006          │
└─────────────────────────────────────────────────────────┘
```

## ✅ 后端部署状态

### 服务器信息
- **云服务商**: 阿里云 ECS
- **IP地址**: 172.28.109.217
- **部署路径**: /www/wwwroot/MiMiAlpha/backend
- **Python环境**: venv (虚拟环境)

### 已部署服务

| 服务名称 | 端口 | 状态 | API地址 |
|---------|------|------|---------|
| AI 助手 | 8000 | ✅ 运行中 | http://172.28.109.217:8000 |
| 风险评估 | 5003 | ✅ 运行中 | http://172.28.109.217:5003 |
| 争议仲裁 | 5004 | ✅ 运行中 | http://172.28.109.217:5004 |
| 支付治理 | 8006 | ✅ 运行中 | http://172.28.109.217:8006 |

### OpenAI 配置
- ✅ API Key 已配置
- ✅ 模型: gpt-3.5-turbo
- ✅ 所有服务已迁移到 OpenAI API

---

## 🎯 前端部署步骤

### 1. 本地构建测试

```bash
cd Hackathon/frontend

# 安装依赖
npm install

# 本地测试（使用生产环境配置）
npm run build
npm run preview
```

### 2. 推送到 GitHub

```bash
# 确保所有更改已提交
git add .
git commit -m "配置生产环境API地址"
git push origin main
```

### 3. 部署到 Vercel

#### 方式一：通过 Vercel 网站部署

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `Hackathon/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 添加环境变量：
   ```
   VITE_AI_API_URL=http://172.28.109.217:8000
   ```
7. 点击 "Deploy"

#### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd Hackathon/frontend
vercel --prod
```

---

## 🔧 配置说明

### 前端环境变量

**开发环境** (`.env`):
```bash
VITE_AI_API_URL=http://localhost:8000
```

**生产环境** (`.env.production`):
```bash
VITE_AI_API_URL=http://172.28.109.217:8000
```

### 后端环境变量

**服务器** (`/www/wwwroot/MiMiAlpha/backend/.env`):
```bash
OPENAI_API_KEY=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
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_BASE_URL=https://api.openai.com/v1
```

---

## 🌐 CORS 配置

如果前端访问后端时出现 CORS 错误，需要在后端添加 Vercel 域名到 CORS 白名单。

在每个后端 API 文件中修改：

```python
from flask_cors import CORS

app = Flask(__name__)
# 允许 Vercel 域名
CORS(app, origins=[
    'http://localhost:5173',  # 本地开发
    'https://your-project.vercel.app',  # Vercel 部署地址
    'http://172.28.109.217:8000'  # 服务器地址
])
```

---

## 🔒 安全建议

### 1. 配置防火墙

确保阿里云安全组开放了以下端口：
- 8000 (AI 助手)
- 5003 (风险评估)
- 5004 (争议仲裁)
- 8006 (支付治理)

### 2. 使用 Nginx 反向代理（推荐）

创建 Nginx 配置：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # 替换为你的域名

    # AI 助手
    location /api/chat {
        proxy_pass http://127.0.0.1:8000/v1/assistant/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
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

### 3. 配置 HTTPS（推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

配置 HTTPS 后，前端环境变量改为：
```bash
VITE_AI_API_URL=https://api.yourdomain.com
```

---

## 🧪 测试部署

### 测试后端 API

```bash
# 健康检查
curl http://172.28.109.217:8000/health
curl http://172.28.109.217:5003/health
curl http://172.28.109.217:5004/health
curl http://172.28.109.217:8006/health

# AI 助手测试
curl -X POST http://172.28.109.217:8000/v1/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'
```

### 测试前端

1. 访问 Vercel 部署地址
2. 打开浏览器开发者工具 (F12)
3. 查看 Network 标签
4. 测试各个功能，确认 API 请求正常

---

## 📝 维护命令

### 服务器端

```bash
# SSH 登录
ssh root@172.28.109.217

# 进入项目目录
cd /www/wwwroot/MiMiAlpha/backend

# 激活虚拟环境
source venv/bin/activate

# 查看服务状态
ps aux | grep python

# 重启服务
pkill -f python
./start_all_openai.sh

# 查看日志
tail -f logs/ai_assistant.log
tail -f logs/risk_assessment.log
tail -f logs/dispute.log
tail -f logs/payment_governance.log
```

### 前端更新

```bash
# 本地修改后
git add .
git commit -m "更新说明"
git push

# Vercel 会自动重新部署
```

---

## 🎉 部署完成检查清单

- [x] 后端服务器配置完成
- [x] 4 个后端服务运行正常
- [x] OpenAI API Key 配置正确
- [x] 前端生产环境配置创建
- [ ] 前端推送到 GitHub
- [ ] Vercel 项目创建
- [ ] Vercel 环境变量配置
- [ ] 前端部署成功
- [ ] CORS 配置正确
- [ ] 所有功能测试通过
- [ ] （可选）配置域名
- [ ] （可选）配置 HTTPS
- [ ] （可选）配置 Nginx 反向代理

---

## 🆘 常见问题

### 1. CORS 错误

**问题**: 前端访问后端时出现 CORS 错误

**解决**: 
- 在后端添加 Vercel 域名到 CORS 白名单
- 或使用 Nginx 反向代理

### 2. API 超时

**问题**: OpenAI API 调用超时

**解决**:
- 检查服务器网络连接
- 考虑使用国内镜像（DeepSeek、月之暗面）
- 增加超时时间

### 3. 服务崩溃

**问题**: 后端服务意外停止

**解决**:
```bash
# 查看日志
tail -f logs/*.log

# 重启服务
pkill -f python
./start_all_openai.sh
```

### 4. 端口被占用

**问题**: 启动服务时提示端口被占用

**解决**:
```bash
# 查看端口占用
sudo lsof -i :8000
sudo lsof -i :5003

# 杀死进程
sudo kill -9 <PID>
```

---

## 📞 技术支持

如果遇到问题：
1. 查看服务器日志文件
2. 检查环境变量配置
3. 验证 API Key 是否有效
4. 确认网络连接正常
5. 检查防火墙和安全组设置

---

**🎊 恭喜！你的 MiMiAlpha 项目即将完成部署！** 🎊

下一步：将前端部署到 Vercel，然后就可以向全世界展示你的项目了！
