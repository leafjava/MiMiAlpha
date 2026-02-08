# 🚀 宝塔面板部署后端指南

## 📋 前置要求

- ✅ 已安装宝塔面板（Linux 版本）
- ✅ 服务器至少 1GB 内存
- ✅ Python 3.8+ 已安装
- ✅ 有公网 IP 或域名

---

## 🎯 部署步骤

### 步骤 1: 安装 Python 环境

1. 登录宝塔面板
2. 进入 **软件商店**
3. 搜索并安装 **Python 项目管理器**
4. 安装 **Python 3.9** 或更高版本

### 步骤 2: 上传项目文件

#### 方法 1: 通过宝塔文件管理器

1. 进入 **文件** 管理
2. 创建目录：`/www/wwwroot/mimialpha-backend`
3. 上传以下文件：
   ```
   /www/wwwroot/mimialpha-backend/
   ├── ai_assistant_server_openai.py
   ├── risk_assessment_api_openai.py
   ├── dispute_arbitration_api.py
   ├── requirements.txt
   ├── .env
   └── start_all.sh
   ```

#### 方法 2: 通过 Git（推荐）

```bash
cd /www/wwwroot
git clone https://github.com/your-username/Hackathon.git
cd Hackathon/backend
```

### 步骤 3: 创建虚拟环境

在宝塔终端执行：

```bash
cd /www/wwwroot/mimialpha-backend

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 步骤 4: 配置环境变量

创建 `.env` 文件：

```bash
nano .env
```

添加以下内容：

```bash
# OpenAI API 配置
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_BASE_URL=https://api.openai.com/v1

# 或使用国内镜像（更快）
# OPENAI_BASE_URL=https://api.deepseek.com/v1
# OPENAI_MODEL=deepseek-chat

# 服务器配置
HOST=0.0.0.0
PORT=8000
```

保存并退出（Ctrl+X, Y, Enter）

### 步骤 5: 创建启动脚本

创建 `start_all.sh`：

```bash
#!/bin/bash

# 激活虚拟环境
source /www/wwwroot/mimialpha-backend/venv/bin/activate

# 启动 AI 助手服务（端口 8000）
nohup python ai_assistant_server_openai.py > logs/ai_assistant.log 2>&1 &
echo $! > pids/ai_assistant.pid

# 启动风险评估服务（端口 5003）
nohup python risk_assessment_api_openai.py > logs/risk_assessment.log 2>&1 &
echo $! > pids/risk_assessment.pid

# 启动争议仲裁服务（端口 5004）
nohup python dispute_arbitration_api.py > logs/dispute.log 2>&1 &
echo $! > pids/dispute.pid

echo "所有服务已启动"
echo "AI 助手: http://your-server-ip:8000"
echo "风险评估: http://your-server-ip:5003"
echo "争议仲裁: http://your-server-ip:5004"
```

创建停止脚本 `stop_all.sh`：

```bash
#!/bin/bash

# 停止所有服务
if [ -f pids/ai_assistant.pid ]; then
    kill $(cat pids/ai_assistant.pid)
    rm pids/ai_assistant.pid
fi

if [ -f pids/risk_assessment.pid ]; then
    kill $(cat pids/risk_assessment.pid)
    rm pids/risk_assessment.pid
fi

if [ -f pids/dispute.pid ]; then
    kill $(cat pids/dispute.pid)
    rm pids/dispute.pid
fi

echo "所有服务已停止"
```

赋予执行权限：

```bash
chmod +x start_all.sh stop_all.sh
mkdir -p logs pids
```

### 步骤 6: 使用宝塔 Python 项目管理器（推荐）

1. 进入 **软件商店** → **Python 项目管理器**
2. 点击 **添加项目**
3. 配置如下：
   - **项目名称**: MiMiAlpha Backend
   - **项目路径**: `/www/wwwroot/mimialpha-backend`
   - **Python 版本**: 3.9
   - **启动文件**: `ai_assistant_server_openai.py`
   - **端口**: 8000
   - **启动方式**: gunicorn（生产环境）或 python（开发环境）

4. 重复添加其他服务：
   - 风险评估服务（端口 5003）
   - 争议仲裁服务（端口 5004）

### 步骤 7: 配置反向代理（重要）

#### 为什么需要反向代理？
- ✅ 使用域名访问（而不是 IP:端口）
- ✅ 自动配置 HTTPS
- ✅ 负载均衡
- ✅ 隐藏真实端口

#### 配置步骤

1. 进入 **网站** → **添加站点**
2. 配置：
   - **域名**: `api.yourdomain.com`
   - **根目录**: `/www/wwwroot/mimialpha-backend`
   - **PHP 版本**: 纯静态

3. 点击站点 → **反向代理** → **添加反向代理**

**AI 助手服务**：
```
代理名称: AI Assistant
目标 URL: http://127.0.0.1:8000
发送域名: $host
```

**风险评估服务**：
```
代理名称: Risk Assessment
目标 URL: http://127.0.0.1:5003
发送域名: $host
```

4. 配置路径规则：
   - `/api/chat` → `http://127.0.0.1:8000/v1/assistant/chat`
   - `/api/risk-assess` → `http://127.0.0.1:5003/api/risk/assess`
   - `/api/health` → `http://127.0.0.1:8000/health`

### 步骤 8: 配置 SSL 证书（推荐）

1. 在站点设置中点击 **SSL**
2. 选择 **Let's Encrypt** 免费证书
3. 勾选域名，点击 **申请**
4. 开启 **强制 HTTPS**

### 步骤 9: 配置防火墙

1. 进入 **安全** → **防火墙**
2. 放行端口：
   - 8000（AI 助手）
   - 5003（风险评估）
   - 5004（争议仲裁）
   - 80（HTTP）
   - 443（HTTPS）

### 步骤 10: 启动服务

#### 方法 1: 使用启动脚本

```bash
cd /www/wwwroot/mimialpha-backend
./start_all.sh
```

#### 方法 2: 使用宝塔 Python 项目管理器

在 Python 项目管理器中点击 **启动** 按钮

#### 方法 3: 使用 Supervisor（推荐生产环境）

1. 安装 Supervisor：
```bash
pip install supervisor
```

2. 创建配置文件 `/etc/supervisor/conf.d/mimialpha.conf`：

```ini
[program:ai_assistant]
command=/www/wwwroot/mimialpha-backend/venv/bin/python ai_assistant_server_openai.py
directory=/www/wwwroot/mimialpha-backend
user=www
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/www/wwwroot/mimialpha-backend/logs/ai_assistant.log

[program:risk_assessment]
command=/www/wwwroot/mimialpha-backend/venv/bin/python risk_assessment_api_openai.py
directory=/www/wwwroot/mimialpha-backend
user=www
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/www/wwwroot/mimialpha-backend/logs/risk_assessment.log
```

3. 启动 Supervisor：
```bash
supervisorctl reread
supervisorctl update
supervisorctl start all
```

---

## 🔍 验证部署

### 1. 检查服务状态

```bash
# 查看进程
ps aux | grep python

# 查看端口
netstat -tlnp | grep -E '8000|5003|5004'

# 查看日志
tail -f logs/ai_assistant.log
```

### 2. 测试 API

```bash
# 健康检查
curl http://your-server-ip:8000/health

# AI 助手
curl -X POST http://your-server-ip:8000/v1/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'

# 风险评估
curl -X POST http://your-server-ip:5003/api/risk/assess \
  -H "Content-Type: application/json" \
  -d '{"amount":"1000","description":"测试交易"}'
```

### 3. 浏览器访问

- AI 助手: `https://api.yourdomain.com/api/chat`
- 风险评估: `https://api.yourdomain.com/api/risk-assess`
- 健康检查: `https://api.yourdomain.com/api/health`

---

## 🔧 更新前端配置

在 `frontend/.env.production` 中：

```bash
# 生产环境 API 地址
VITE_API_URL=https://api.yourdomain.com
```

在代码中：

```typescript
// frontend/src/config/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 使用
const response = await fetch(`${API_BASE_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
});
```

---

## 📊 监控和维护

### 1. 查看日志

```bash
# 实时查看日志
tail -f logs/ai_assistant.log
tail -f logs/risk_assessment.log

# 查看错误日志
grep ERROR logs/*.log
```

### 2. 重启服务

```bash
# 停止所有服务
./stop_all.sh

# 启动所有服务
./start_all.sh

# 或使用 Supervisor
supervisorctl restart all
```

### 3. 更新代码

```bash
cd /www/wwwroot/mimialpha-backend

# 拉取最新代码
git pull

# 重启服务
./stop_all.sh
./start_all.sh
```

### 4. 性能监控

在宝塔面板中：
- **监控** → 查看 CPU、内存、网络使用情况
- **日志** → 查看访问日志和错误日志

---

## ⚠️ 常见问题

### 1. 端口被占用

```bash
# 查看占用端口的进程
lsof -i :8000

# 杀死进程
kill -9 <PID>
```

### 2. 权限问题

```bash
# 修改文件所有者
chown -R www:www /www/wwwroot/mimialpha-backend

# 修改文件权限
chmod -R 755 /www/wwwroot/mimialpha-backend
```

### 3. Python 依赖安装失败

```bash
# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 4. OpenAI API 调用失败

- 检查 API Key 是否正确
- 检查网络连接
- 尝试使用国内镜像（如 DeepSeek）

### 5. CORS 跨域问题

确保后端代码中已配置 CORS：

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://your-frontend.vercel.app",
    "http://localhost:5173"
])
```

---

## 🎯 性能优化

### 1. 使用 Gunicorn（生产环境）

```bash
# 安装 Gunicorn
pip install gunicorn

# 启动服务
gunicorn -w 4 -b 0.0.0.0:8000 ai_assistant_server_openai:app
```

### 2. 配置 Nginx 缓存

在反向代理配置中添加：

```nginx
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_pass http://127.0.0.1:8000;
}
```

### 3. 限流保护

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api/ {
    limit_req zone=api_limit burst=20;
    proxy_pass http://127.0.0.1:8000;
}
```

---

## 📝 总结

### 部署清单

- [x] 安装 Python 环境
- [x] 上传项目文件
- [x] 创建虚拟环境
- [x] 配置环境变量
- [x] 创建启动脚本
- [x] 配置反向代理
- [x] 配置 SSL 证书
- [x] 配置防火墙
- [x] 启动服务
- [x] 验证部署

### 最终架构

```
用户浏览器
    ↓
Vercel (前端)
    ↓
宝塔服务器 (后端)
    ├── Nginx (反向代理 + SSL)
    ├── AI 助手服务 (8000)
    ├── 风险评估服务 (5003)
    └── 争议仲裁服务 (5004)
    ↓
OpenAI API
```

---

**部署完成！你的后端现在运行在宝塔服务器上了！** 🎉

需要帮助配置具体的服务吗？
