# 🚀 Vercel 部署完整指南

## 📋 部署架构

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (前端)                         │
│  - Next.js 应用                                          │
│  - 静态资源托管                                           │
│  - 自动 HTTPS                                            │
└─────────────────┬───────────────────────────────────────┘
                  │ API 调用
                  ↓
┌─────────────────────────────────────────────────────────┐
│              云服务器 (后端 API)                          │
│  - Python Flask 服务                                     │
│  - OpenAI API 调用                                       │
│  - 4 个 AI 服务                                          │
└─────────────────────────────────────────────────────────┘
```

## 🎯 部署步骤

### 第一步：部署后端到云服务器

#### 1.1 准备服务器

推荐配置：
- **CPU**: 2核
- **内存**: 4GB
- **系统**: Ubuntu 20.04 / CentOS 7+
- **带宽**: 5Mbps+

云服务商选择：
- 阿里云 ECS
- 腾讯云 CVM
- AWS EC2
- 华为云 ECS

#### 1.2 上传后端代码

```bash
# 在本地打包后端代码
cd Hackathon/backend
tar -czf backend.tar.gz *.py requirements.txt .env start_all_openai.sh

# 上传到服务器
scp backend.tar.gz root@your-server-ip:/root/

# 登录服务器
ssh root@your-server-ip

# 解压
cd /root
tar -xzf backend.tar.gz
mkdir mimialpha-backend
mv *.py requirements.txt .env start_all_openai.sh mimialpha-backend/
cd mimialpha-backend
```

#### 1.3 安装依赖

```bash
# 安装 Python 3.8+
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

#### 1.4 配置环境变量

```bash
# 编辑 .env 文件
nano .env
```

确保包含你的 OpenAI API Key：
```bash
OPENAI_API_KEY=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
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_BASE_URL=https://api.openai.com/v1
```

#### 1.5 启动服务

```bash
# 给启动脚本执行权限
chmod +x start_all_openai.sh

# 启动所有服务
./start_all_openai.sh

# 测试服务
python test_openai_services.py
```

#### 1.6 配置防火墙

```bash
# 开放端口
sudo ufw allow 8000
sudo ufw allow 5003
sudo ufw allow 5004
sudo ufw allow 8006

# 或者使用云服务商的安全组配置
```

#### 1.7 配置 Nginx 反向代理（推荐）

```bash
# 安装 Nginx
sudo apt install nginx -y

# 创建配置文件
sudo nano /etc/nginx/sites-available/mimialpha
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    # AI 助手服务
    location /api/chat {
        proxy_pass http://127.0.0.1:8000/v1/assistant/chat;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 风险评估服务
    location /api/risk {
        proxy_pass http://127.0.0.1:5003/api/risk;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 争议仲裁服务
    location /api/dispute {
        proxy_pass http://127.0.0.1:5004/api/dispute;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 支付治理服务
    location /api/governance {
        proxy_pass http://127.0.0.1:8006/api/governance;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;
    }

    # 健康检查
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/mimialpha /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 1.8 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

#### 1.9 配置开机自启动

创建 systemd 服务文件：
```bash
sudo nano /etc/systemd/system/mimialpha.service
```

添加内容：
```ini
[Unit]
Description=MiMiAlpha Backend Services
After=network.target

[Service]
Type=forking
User=root
WorkingDirectory=/root/mimialpha-backend
ExecStart=/root/mimialpha-backend/start_all_openai.sh
Restart=always

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable mimialpha
sudo systemctl start mimialpha
sudo systemctl status mimialpha
```

---

### 第二步：部署前端到 Vercel

#### 2.1 准备前端代码

```bash
cd Hackathon/frontend

# 安装依赖
npm install

# 本地测试构建
npm run build
```

#### 2.2 配置环境变量

创建 `.env.production` 文件：
```bash
# API 地址（替换为你的服务器地址）
VITE_API_URL=https://your-domain.com
# 或使用 IP
# VITE_API_URL=http://your-server-ip

# 其他配置
VITE_APP_NAME=MiMiAlpha
VITE_NETWORK=testnet
```

#### 2.3 推送到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Ready for Vercel deployment"

# 推送到 GitHub
git remote add origin https://github.com/your-username/mimialpha.git
git branch -M main
git push -u origin main
```

#### 2.4 在 Vercel 部署

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 选择 `Hackathon/frontend` 目录

3. **配置项目**
   - **Framework Preset**: Next.js
   - **Root Directory**: `Hackathon/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   VITE_API_URL=https://your-domain.com
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

6. **获取部署地址**
   - 部署成功后会得到一个地址，如：
   - `https://mimialpha.vercel.app`

#### 2.5 配置自定义域名（可选）

在 Vercel 项目设置中：
1. 进入 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

## 🧪 测试部署

### 测试后端 API

```bash
# 健康检查
curl https://your-domain.com/health

# AI 助手
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'

# 风险评估
curl -X POST https://your-domain.com/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{"amount":"1000","description":"测试交易","buyer_address":"0x123","seller_address":"0x456"}'
```

### 测试前端

1. 访问 Vercel 部署地址
2. 测试各个功能模块：
   - 模型市场
   - 技术展示
   - 风险评估
   - 争议仲裁
   - AI 助手

---

## 🔧 常见问题

### 1. CORS 错误

如果前端访问后端 API 时出现 CORS 错误，在后端添加 CORS 配置：

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://mimialpha.vercel.app'])
```

### 2. API 超时

如果 OpenAI API 调用超时，可以：
- 增加超时时间
- 使用国内镜像（DeepSeek、月之暗面）
- 优化提示词长度

### 3. 服务崩溃

查看日志：
```bash
tail -f logs/ai_assistant.log
tail -f logs/risk_assessment.log
tail -f logs/dispute.log
tail -f logs/payment_governance.log
```

重启服务：
```bash
# 停止所有 Python 进程
pkill -f python

# 重新启动
./start_all_openai.sh
```

### 4. 端口被占用

```bash
# 查看端口占用
sudo lsof -i :8000
sudo lsof -i :5003
sudo lsof -i :5004
sudo lsof -i :8006

# 杀死进程
sudo kill -9 <PID>
```

---

## 📊 监控和维护

### 日志管理

```bash
# 查看实时日志
tail -f logs/*.log

# 清理旧日志
find logs/ -name "*.log" -mtime +7 -delete
```

### 性能监控

使用工具：
- **htop**: 查看 CPU 和内存使用
- **iotop**: 查看磁盘 I/O
- **netstat**: 查看网络连接

### 定期备份

```bash
# 备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf backup-$DATE.tar.gz /root/mimialpha-backend
```

---

## 🎉 部署完成检查清单

- [ ] 后端服务器配置完成
- [ ] Python 环境安装完成
- [ ] 所有依赖安装完成
- [ ] .env 文件配置正确
- [ ] 4 个后端服务启动成功
- [ ] 防火墙端口开放
- [ ] Nginx 反向代理配置（可选）
- [ ] HTTPS 证书配置（可选）
- [ ] 前端代码推送到 GitHub
- [ ] Vercel 项目创建成功
- [ ] 环境变量配置正确
- [ ] 前端部署成功
- [ ] 所有功能测试通过

---

## 🚀 快速部署命令汇总

### 后端部署

```bash
# 1. 上传代码
scp -r backend root@your-server:/root/mimialpha-backend

# 2. 登录服务器
ssh root@your-server

# 3. 安装依赖
cd /root/mimialpha-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. 配置 .env
nano .env  # 添加 OPENAI_API_KEY

# 5. 启动服务
chmod +x start_all_openai.sh
./start_all_openai.sh

# 6. 测试
python test_openai_services.py
```

### 前端部署

```bash
# 1. 配置环境变量
cd Hackathon/frontend
echo "VITE_API_URL=https://your-domain.com" > .env.production

# 2. 推送到 GitHub
git add .
git commit -m "Deploy to Vercel"
git push

# 3. 在 Vercel 导入项目并部署
```

---

## 📞 技术支持

如果遇到问题：
1. 查看日志文件
2. 检查环境变量配置
3. 验证 API Key 是否有效
4. 确认网络连接正常

---

**🎊 恭喜！你的 MiMiAlpha 项目已经成功部署到生产环境！** 🎊
