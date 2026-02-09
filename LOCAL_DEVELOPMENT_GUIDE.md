# 本地开发指南

## 🚀 快速开始

### 1. 安装依赖

```bash
cd Hackathon/frontend
npm install
```

### 2. 配置环境变量

本地开发默认使用 PythonAnywhere 后端（已在 `.env` 中配置）：

```bash
VITE_API_BASE_URL=https://a37615959.pythonanywhere.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问：`http://localhost:5173`

---

## 🔧 环境配置说明

### 环境变量优先级

Vite 会按以下优先级加载环境变量：

1. `.env.local` - 本地覆盖（不提交到 Git）
2. `.env.development` - 开发环境
3. `.env` - 所有环境的默认值

### 当前配置

**开发环境** (`.env`):
```bash
# 使用 PythonAnywhere 后端
VITE_API_BASE_URL=https://a37615959.pythonanywhere.com
```

**生产环境** (`.env.production`):
```bash
# 使用 PythonAnywhere 后端
VITE_API_BASE_URL=https://a37615959.pythonanywhere.com
```

---

## 🎯 三种开发模式

### 模式 1：使用 PythonAnywhere 后端（推荐）✅

**优势**：
- ✅ 无需本地运行后端
- ✅ HTTPS，无跨域问题
- ✅ 与生产环境一致

**配置**（`.env` 默认配置）：
```bash
VITE_API_BASE_URL=https://a37615959.pythonanywhere.com
VITE_AI_API_URL=https://a37615959.pythonanywhere.com/v1/assistant/chat
```

**启动**：
```bash
npm run dev
```

---

### 模式 2：使用本地后端

**适用场景**：
- 需要调试后端代码
- 需要修改 API 逻辑
- 离线开发

**步骤**：

#### 2.1 启动本地后端

```bash
# 在另一个终端
cd Hackathon/backend

# 激活虚拟环境
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows

# 启动服务
python ai_assistant_server.py
```

#### 2.2 修改前端配置

创建 `.env.local` 文件：
```bash
cd Hackathon/frontend

# 创建本地配置
cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:8000
VITE_AI_API_URL=http://localhost:8000/v1/assistant/chat
VITE_RISK_API_URL=http://localhost:5003/api/risk/assess
VITE_DISPUTE_API_URL=http://localhost:5004/api/dispute/arbitrate
VITE_GOVERNANCE_API_URL=http://localhost:8006/api/governance/analyze
VITE_YIELD_API_URL=http://localhost:8005/api/yield/overview
EOF
```

#### 2.3 启动前端

```bash
npm run dev
```

---

### 模式 3：使用阿里云服务器后端

**适用场景**：
- 测试服务器部署
- 多人协作开发

**配置** (`.env.local`):
```bash
VITE_API_BASE_URL=http://47.93.166.48:8000
VITE_AI_API_URL=http://47.93.166.48:8000/v1/assistant/chat
VITE_RISK_API_URL=http://47.93.166.48:5003/api/risk/assess
```

⚠️ **注意**：使用 HTTP 后端可能会有跨域问题。

---

## 🧪 测试 API 连接

### 方法 1：浏览器测试

访问：
```
https://a37615959.pythonanywhere.com/health
```

应该看到：
```json
{
  "status": "ok",
  "engine": "OpenAI",
  "model": "gpt-3.5-turbo"
}
```

### 方法 2：命令行测试

```bash
# 健康检查
curl https://a37615959.pythonanywhere.com/health

# AI 对话测试
curl -X POST https://a37615959.pythonanywhere.com/v1/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好"}]}'
```

### 方法 3：前端测试

启动开发服务器后，打开浏览器控制台（F12），查看 Network 标签，确认：
- ✅ API 请求成功（状态码 200）
- ✅ 返回正确的 JSON 数据
- ✅ 无 CORS 错误

---

## 🔍 常见问题

### Q1: CORS 错误

**问题**：
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**解决方案**：
- 使用 PythonAnywhere 后端（已配置 CORS）
- 或在本地后端添加 CORS 配置

### Q2: API 请求失败

**检查清单**：
1. 后端服务是否运行？
2. API 地址是否正确？
3. 网络连接是否正常？
4. 查看浏览器控制台错误信息

### Q3: 环境变量不生效

**解决方案**：
1. 重启开发服务器（Ctrl+C 然后 `npm run dev`）
2. 清除缓存：`rm -rf node_modules/.vite`
3. 确认环境变量名称以 `VITE_` 开头

---

## 📊 开发流程

### 日常开发

```bash
# 1. 拉取最新代码
git pull

# 2. 安装依赖（如果有更新）
npm install

# 3. 启动开发服务器
npm run dev

# 4. 开发...

# 5. 提交代码
git add .
git commit -m "描述"
git push
```

### 测试生产构建

```bash
# 构建
npm run build

# 预览
npm run preview

# 访问 http://localhost:4173
```

---

## 🎯 推荐工作流

### 前端开发（无需后端）

```bash
# 使用 PythonAnywhere 后端
cd Hackathon/frontend
npm run dev
```

### 全栈开发（需要调试后端）

**终端 1 - 后端**：
```bash
cd Hackathon/backend
source venv/bin/activate
python ai_assistant_server.py
```

**终端 2 - 前端**：
```bash
cd Hackathon/frontend
# 创建 .env.local 指向 localhost
npm run dev
```

---

## 🚀 部署前检查

```bash
# 1. 确保使用生产环境配置
cat frontend/.env.production

# 2. 本地测试生产构建
npm run build
npm run preview

# 3. 提交并推送
git add .
git commit -m "准备部署"
git push

# 4. Vercel 自动部署
```

---

## 📝 环境变量参考

### 完整的环境变量列表

```bash
# API 配置
VITE_API_BASE_URL=https://a37615959.pythonanywhere.com
VITE_AI_API_URL=https://a37615959.pythonanywhere.com/v1/assistant/chat
VITE_RISK_API_URL=https://a37615959.pythonanywhere.com/api/risk/assess
VITE_DISPUTE_API_URL=https://a37615959.pythonanywhere.com/api/dispute/arbitrate
VITE_GOVERNANCE_API_URL=https://a37615959.pythonanywhere.com/api/governance/analyze
VITE_YIELD_API_URL=https://a37615959.pythonanywhere.com/api/yield/overview

# 应用配置
VITE_APP_NAME=MiMiAlpha
VITE_NETWORK=testnet

# 区块链配置（如果需要）
VITE_CHAIN_ID=71
VITE_RPC_URL=https://evmtestnet.confluxrpc.com
```

---

## ✅ 快速测试清单

启动开发服务器后，测试以下功能：

- [ ] 页面正常加载
- [ ] AI 助手对话
- [ ] 风险评估
- [ ] 钱包连接
- [ ] 交易功能
- [ ] 无控制台错误

---

**现在就可以开始本地开发了！** 🎉

默认配置已经指向 PythonAnywhere 后端，直接运行 `npm run dev` 即可！
