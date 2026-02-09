# Vercel Serverless Functions 配置指南

## ✅ 已完成的配置

### 1. 创建的 API 文件

所有 API 文件都在 `Hackathon/api/` 目录下：

- ✅ `ai-chat.py` - AI 助手服务（端口 8000）
- ✅ `risk-assess.py` - 风险评估服务（端口 5003）
- ✅ `dispute.py` - 争议仲裁服务（端口 5004）
- ✅ `governance.py` - 支付治理服务（端口 8006）
- ✅ `yield.py` - 收益计算服务（端口 8005）

### 2. 更新的环境变量

`frontend/.env.production` 已更新为使用 HTTPS API：

```bash
VITE_AI_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api/ai-chat
VITE_RISK_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api/risk-assess
VITE_DISPUTE_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api/dispute
VITE_GOVERNANCE_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api/governance
VITE_YIELD_API_URL=https://mi-mi-alpha-ud8f.vercel.app/api/yield
```

---

## 🚀 部署步骤

### 步骤 1：提交代码到 Git

```bash
cd Hackathon

# 添加所有新文件
git add api/*.py
git add frontend/.env.production
git add *.md

# 提交
git commit -m "添加 Vercel Serverless Functions 解决 Mixed Content 错误"

# 推送到 GitHub
git push origin main
```

### 步骤 2：Vercel 自动部署

Vercel 会自动检测到更改并重新部署。等待 2-3 分钟。

### 步骤 3：验证部署

访问以下 URL 测试 API：

```bash
# 健康检查（如果后端有 health 接口）
https://mi-mi-alpha-ud8f.vercel.app/api/ai-chat

# 测试 AI 助手
curl -X POST https://mi-mi-alpha-ud8f.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'

# 测试收益计算
curl https://mi-mi-alpha-ud8f.vercel.app/api/yield/overview
```

---

## 🔧 工作原理

```
┌─────────────────────────────────────────────────────────┐
│  用户浏览器                                              │
│  https://mi-mi-alpha-ud8f.vercel.app                   │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS 请求
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Vercel Serverless Functions (HTTPS)                   │
│  /api/ai-chat.py                                        │
│  /api/risk-assess.py                                    │
│  /api/dispute.py                                        │
│  /api/governance.py                                     │
│  /api/yield.py                                          │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP 请求（内部网络，安全）
                  ↓
┌─────────────────────────────────────────────────────────┐
│  阿里云 ECS 后端服务器                                   │
│  http://47.93.166.48:8000  (AI 助手)                   │
│  http://47.93.166.48:5003  (风险评估)                   │
│  http://47.93.166.48:5004  (争议仲裁)                   │
│  http://47.93.166.48:8006  (支付治理)                   │
│  http://47.93.166.48:8005  (收益计算)                   │
└─────────────────────────────────────────────────────────┘
```

**优势：**
- ✅ 前端到 Vercel：HTTPS（安全）
- ✅ Vercel 到后端：HTTP（内部网络，允许）
- ✅ 浏览器不会报 Mixed Content 错误
- ✅ 完全免费
- ✅ 自动扩展

---

## 🧪 测试清单

部署完成后，测试以下功能：

- [ ] AI 助手对话
- [ ] 风险评估
- [ ] 争议仲裁
- [ ] 支付治理
- [ ] 收益计算

如果某个功能失败：
1. 检查浏览器控制台（F12）
2. 查看 Vercel 部署日志
3. 确认后端服务正在运行

---

## 🔍 故障排除

### 问题 1：API 返回 500 错误

**可能原因：**
- 后端服务未运行
- 后端 IP 地址错误
- 防火墙阻止了请求

**解决方案：**
```bash
# SSH 登录服务器
ssh root@47.93.166.48

# 检查服务状态
ps aux | grep python

# 重启服务
cd /www/wwwroot/MiMiAlpha/backend
./start_all_openai.sh
```

### 问题 2：API 超时

**可能原因：**
- OpenAI API 调用时间过长
- 网络延迟

**解决方案：**
- 增加超时时间（已设置为 60 秒）
- 考虑使用国内 AI 服务（DeepSeek、月之暗面）

### 问题 3：CORS 错误

**可能原因：**
- 后端未配置 CORS

**解决方案：**
确保后端所有服务都有 CORS 配置：
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 问题 4：前端仍然使用旧的 API 地址

**解决方案：**
```bash
# 清除构建缓存
cd Hackathon/frontend
rm -rf dist .next node_modules/.vite

# 重新构建
npm run build

# 提交并推送
git add .
git commit -m "清除缓存，使用新 API 地址"
git push
```

---

## 📊 性能优化

### 1. 启用 Vercel Edge Functions（可选）

如果需要更快的响应速度，可以将 API 改为 Edge Functions：

```javascript
// api/ai-chat.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const response = await fetch('http://47.93.166.48:8000/v1/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: await req.text(),
  });
  
  return new Response(await response.text(), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

### 2. 添加缓存（可选）

对于不经常变化的数据，可以添加缓存：

```python
def do_GET(self):
    self.send_header('Cache-Control', 'public, max-age=60')
```

---

## 🎯 下一步优化（可选）

### 1. 配置自定义域名

在 Vercel 项目设置中添加自定义域名：
- 前端：`app.yourdomain.com`
- API：`api.yourdomain.com`

### 2. 后端也配置 HTTPS

使用宝塔面板配置 SSL 证书（参考 `BAOTA_SSL_GUIDE.md`）

### 3. 添加 API 监控

使用 Vercel Analytics 监控 API 性能：
```bash
npm install @vercel/analytics
```

---

## ✅ 完成！

现在你的应用：
- ✅ 前端：HTTPS（Vercel）
- ✅ API：HTTPS（Vercel Serverless Functions）
- ✅ 后端：HTTP（内部网络）
- ✅ 无 Mixed Content 错误
- ✅ 完全免费

享受你的去中心化交易平台吧！🎉
