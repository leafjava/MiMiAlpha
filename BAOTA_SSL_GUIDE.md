# 宝塔面板配置 SSL 证书解决 Mixed Content 错误

## 问题说明

错误信息：
```
Mixed Content: The page at 'https://mi-mi-alpha-ud8f.vercel.app/' was loaded over HTTPS, 
but requested an insecure resource 'http://47.93.166.48:8005/api/yield/overview'. 
This request has been blocked; the content must be served over HTTPS.
```

**原因**：前端使用 HTTPS，后端使用 HTTP，浏览器出于安全考虑阻止了请求。

---

## ✅ 方案 1：宝塔面板配置 SSL（最简单，推荐）

### 步骤 1：绑定域名

1. 登录宝塔面板
2. 点击左侧 **"网站"**
3. 找到你的后端项目，点击 **"设置"**
4. 在 **"域名管理"** 中添加域名（如 `api.yourdomain.com`）

如果没有域名，可以：
- 购买域名（阿里云/腾讯云，约 ¥10-50/年）
- 或使用免费域名服务（如 freenom.com）

### 步骤 2：配置 DNS 解析

在你的域名服务商（阿里云/腾讯云）添加 A 记录：
```
类型: A
主机记录: api
记录值: 47.93.166.48
TTL: 600
```

等待 DNS 生效（通常 5-10 分钟）。

### 步骤 3：申请 SSL 证书

1. 在宝塔面板网站设置中，点击 **"SSL"** 标签
2. 选择 **"Let's Encrypt"**（免费）
3. 勾选你的域名
4. 点击 **"申请"**
5. 等待证书申请完成（通常 1-2 分钟）
6. 开启 **"强制 HTTPS"**

### 步骤 4：配置反向代理

1. 在网站设置中，点击 **"反向代理"**
2. 添加反向代理：

```
代理名称: AI助手
目标URL: http://127.0.0.1:8000
发送域名: $host
```

重复添加其他服务：
- 风险评估: http://127.0.0.1:5003
- 争议仲裁: http://127.0.0.1:5004
- 支付治理: http://127.0.0.1:8006
- 收益计算: http://127.0.0.1:8005

### 步骤 5：更新前端配置

修改 `Hackathon/frontend/.env.production`：
```bash
# 使用你的域名
VITE_AI_API_URL=https://api.yourdomain.com
VITE_RISK_API_URL=https://api.yourdomain.com
VITE_DISPUTE_API_URL=https://api.yourdomain.com
VITE_GOVERNANCE_API_URL=https://api.yourdomain.com
VITE_YIELD_API_URL=https://api.yourdomain.com
```

### 步骤 6：重新部署前端

```bash
cd Hackathon/frontend
npm run build
git add .
git commit -m "更新为 HTTPS API 地址"
git push
```

Vercel 会自动重新部署。

---

## 🔧 方案 2：使用 Cloudflare Tunnel（无需域名）

如果你不想购买域名，可以使用 Cloudflare Tunnel：

### 步骤 1：安装 Cloudflared

在服务器上执行：
```bash
# 下载 cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
```

### 步骤 2：登录 Cloudflare

```bash
cloudflared tunnel login
```

会打开浏览器，选择你的域名（需要先在 Cloudflare 添加域名）。

### 步骤 3：创建隧道

```bash
cloudflared tunnel create mimialpha
```

### 步骤 4：配置隧道

创建 `~/.cloudflared/config.yml`：
```yaml
tunnel: <你的隧道ID>
credentials-file: /root/.cloudflared/<隧道ID>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://localhost:8000
  - service: http_status:404
```

### 步骤 5：运行隧道

```bash
cloudflared tunnel run mimialpha
```

---

## 🚀 方案 3：使用 Vercel Serverless Functions（推荐用于生产）

把后端 API 也部署到 Vercel，自动获得 HTTPS。

### 步骤 1：创建 Vercel Functions

你已经有 `Hackathon/api/risk-assess.py`，继续创建其他：

```python
# Hackathon/api/ai-chat.py
from http.server import BaseHTTPRequestHandler
import json
import urllib.request

BACKEND_URL = 'http://47.93.166.48:8000'

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            req = urllib.request.Request(
                f'{BACKEND_URL}/v1/assistant/chat',
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )
            
            with urllib.request.urlopen(req, timeout=60) as response:
                data = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
                
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
```

### 步骤 2：更新前端配置

```bash
# .env.production
VITE_AI_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api
VITE_RISK_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api
```

### 步骤 3：更新 API 调用

前端调用改为：
```typescript
// 原来
fetch('http://47.93.166.48:8000/v1/assistant/chat', ...)

// 改为
fetch('/api/ai-chat', ...)
```

---

## 📊 方案对比

| 方案 | 难度 | 成本 | 速度 | 推荐度 |
|------|------|------|------|--------|
| **宝塔 SSL + 域名** | ⭐⭐ | ¥10-50/年 | 快 | ⭐⭐⭐⭐⭐ |
| **Cloudflare Tunnel** | ⭐⭐⭐ | 免费 | 中等 | ⭐⭐⭐⭐ |
| **Vercel Functions** | ⭐⭐⭐ | 免费 | 快 | ⭐⭐⭐⭐ |

---

## 🎯 我的建议

### 短期（立即解决）
使用 **方案 3：Vercel Serverless Functions**
- 无需域名
- 完全免费
- 自动 HTTPS
- 我可以帮你快速配置

### 长期（正式上线）
使用 **方案 1：宝塔 SSL + 域名**
- 更专业
- 性能更好
- 完全控制

---

## ⚡ 快速临时方案（仅用于测试）

如果你只是想快速测试，可以暂时修改前端代码，使用代理：

### 修改 `vite.config.ts`

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://47.93.166.48:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

但这只在开发环境有效，生产环境还是需要上面的方案。

---

## 🆘 需要帮助？

告诉我你想用哪个方案，我来帮你配置：

1. ✅ **方案 1（宝塔 SSL）** - 我帮你生成 Nginx 配置
2. ✅ **方案 2（Cloudflare）** - 我提供详细步骤
3. ✅ **方案 3（Vercel）** - 我帮你创建所有 API 文件

推荐先用**方案 3**快速解决，然后再配置**方案 1**作为长期方案。
