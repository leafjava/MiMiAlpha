# 跨域问题解决方案

## 问题描述
前端（localhost:5173）访问 PythonAnywhere 后端时遇到 CORS 错误：
```
Referrer Policy: strict-origin-when-cross-origin
```

## 解决方案

### 方案1：使用 Vite 代理 + 混合后端（本地开发，已配置）✅

**优点：**
- 无需修改后端
- 立即生效
- 适合本地开发
- 支持多个后端服务器

**配置：**
1. `vite.config.ts` 已添加代理配置
2. `.env` 已修改为使用相对路径
3. 代理规则：
   - `/v1/*` → PythonAnywhere（AI助手）
   - `/api/yield/*` → 阿里云 47.93.166.48:8005
   - `/api/risk/*` → 阿里云 47.93.166.48:5003
   - `/api/assets/*` → 阿里云 47.93.166.48:8004
   - `/api/credit/*` → 阿里云 47.93.166.48:8003
   - `/api/dispute/*` → 阿里云 47.93.166.48:5004
   - `/api/governance/*` → 阿里云 47.93.166.48:8006

**使用方法：**
```bash
cd frontend
npm run dev
```

现在所有 API 请求会通过 Vite 代理转发到对应的后端服务器，避免跨域问题。

---

### 方案2：修复 PythonAnywhere 后端 CORS

如果需要直接访问 PythonAnywhere（不通过代理），需要在服务器上配置 CORS。

#### 步骤1：登录 PythonAnywhere
访问：https://www.pythonanywhere.com/

#### 步骤2：修改 Flask 应用

找到你的 Flask 应用文件（通常在 `/home/a37615959/mysite/flask_app.py`），添加 CORS 配置：

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# 配置 CORS - 允许所有来源（开发环境）
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": False
    }
})

# 或者只允许特定来源（生产环境推荐）
# CORS(app, resources={
#     r"/*": {
#         "origins": [
#             "http://localhost:5173",
#             "https://your-domain.com"
#         ],
#         "methods": ["GET", "POST", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"]
#     }
# })

# 你的路由...
@app.route('/v1/assistant/chat', methods=['POST'])
def chat():
    # ...
    pass
```

#### 步骤3：安装 flask-cors

在 PythonAnywhere 的 Bash 控制台中：

```bash
pip install --user flask-cors
```

或者在 `requirements.txt` 中添加：
```
flask-cors==4.0.0
```

然后运行：
```bash
pip install --user -r requirements.txt
```

#### 步骤4：重启 Web 应用

在 PythonAnywhere 的 Web 页面点击 "Reload" 按钮重启应用。

---

### 方案3：使用 Vercel Serverless Functions（生产环境）

项目中已经有 Vercel API 代理配置（`/api` 目录），可以部署到 Vercel：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
cd Hackathon
vercel
```

Vercel 会自动处理 CORS，并提供 HTTPS 支持。

---

## 当前配置状态

### ✅ 已完成
- Vite 代理配置（`vite.config.ts`）
- 环境变量修改（`.env`）- 使用空字符串作为基础URL

### 📝 重要说明
前端代码使用 `VITE_AI_API_URL` 作为基础URL，然后拼接具体路径：
- AI助手: `${VITE_AI_API_URL}/v1/assistant/chat`
- 风险评估: `${VITE_AI_API_URL.replace(':8000', ':5003')}/api/risk/assess`
- 资产管理: `${VITE_AI_API_URL.replace(':8000', ':8004')}/api/assets/products`
- 收益计算: `${VITE_AI_API_URL.replace(':8000', ':8005')}/api/yield/overview`
- 信用评分: `${VITE_AI_API_URL.replace(':8000', ':8003')}/api/credit/analyze`

当 `VITE_AI_API_URL` 为空时，会使用相对路径，通过 Vite 代理转发。

### 📝 待完成（可选）
- PythonAnywhere CORS 配置
- Vercel 部署

---

## 测试方法

### 测试本地代理
```bash
cd frontend
npm run dev
```

打开浏览器控制台，检查网络请求：
- 请求 URL 应该是 `http://localhost:5173/v1/assistant/chat`
- 实际会被代理到 `https://a37615959.pythonanywhere.com/v1/assistant/chat`
- 不应该有 CORS 错误

### 测试直连（需要先修复 PythonAnywhere CORS）
修改 `.env`：
```env
VITE_AI_API_URL=https://a37615959.pythonanywhere.com/v1/assistant/chat
```

重启开发服务器，检查是否还有 CORS 错误。

---

## 常见问题

### Q: 代理配置后还是有 CORS 错误？
A: 
1. 确保重启了 Vite 开发服务器
2. 清除浏览器缓存
3. 检查 `.env` 文件是否正确使用相对路径

### Q: 为什么还在访问 47.93.166.48:8005？
A: 这是因为代码中的默认值问题。已修复：
- 修改前：`const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://47.93.166.48:8000'`
- 修改后：`const apiUrl = import.meta.env.VITE_AI_API_URL`

当环境变量为空字符串时，会直接使用相对路径（如 `/api/yield/overview`）

### Q: 如何验证配置是否正确？
A: 
1. 运行 `verify-config.bat` 检查配置
2. 启动开发服务器后，打开浏览器开发者工具
3. 查看 Network 标签，请求应该是：
   - ✅ `http://localhost:5173/v1/assistant/chat`
   - ✅ `http://localhost:5173/api/yield/overview`
   - ❌ 不应该是 `http://47.93.166.48:xxxx`
   - ❌ 不应该是 `https://a37615959.pythonanywhere.com`

### Q: 生产环境怎么办？
A: 生产环境有几个选择：
1. 使用 Vercel Serverless Functions（推荐）
2. 在后端正确配置 CORS
3. 使用 Nginx 反向代理

### Q: 为什么不直接在 PythonAnywhere 配置 CORS？
A: 可以，但是：
1. 需要服务器访问权限
2. 配置可能需要时间生效
3. 本地代理更快更方便

---

## 推荐方案

**本地开发：** 使用 Vite 代理（已配置）✅

**生产部署：** 
1. 前端部署到 Vercel/Netlify
2. 后端使用 Vercel Serverless Functions 或配置 CORS
3. 使用自定义域名和 HTTPS

---

## 相关文件
- `frontend/vite.config.ts` - Vite 代理配置
- `frontend/.env` - 环境变量
- `api/*.py` - Vercel Serverless Functions
- `vercel.json` - Vercel 配置
