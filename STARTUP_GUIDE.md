# Hackathon 项目启动指南

## 🚀 快速启动（推荐）

### Windows 用户

#### 方法 1: 一键启动（最简单）
```bash
# 1. 先启动 Ollama（单独终端）
ollama serve

# 2. 双击运行
START_ALL.bat
```

#### 方法 2: 手动启动
```bash
# 终端 1: Ollama
ollama serve

# 终端 2: 智能客服
cd Hackathon/backend
start_server.bat

# 终端 3: 风险评估
cd Hackathon/backend
start_risk_api.bat

# 终端 4: 争议仲裁
cd Hackathon/backend
start_dispute_api.bat

# 终端 5: 信用评分
cd Hackathon/backend
start_credit_api.bat

# 终端 6: 前端
cd Hackathon/frontend
npm run dev
```

### Linux/Mac 用户

```bash
# 终端 1: Ollama
ollama serve

# 终端 2: 智能客服
cd Hackathon/backend
python ai_assistant_server.py

# 终端 3: 风险评估
cd Hackathon/backend
python risk_assessment_api.py

# 终端 4: 争议仲裁
cd Hackathon/backend
python dispute_arbitration_api.py

# 终端 5: 信用评分
cd Hackathon/backend
python credit_score_api.py

# 终端 6: 前端
cd Hackathon/frontend
npm run dev
```

---

## ✅ 服务检查

### 自动检查（Windows）
```bash
CHECK_SERVICES.bat
```

### 手动检查
```bash
# Ollama
curl http://localhost:11434

# 智能客服
curl http://localhost:8000/health

# 风险评估
curl http://localhost:8001/health

# 争议仲裁
curl http://localhost:8002/health

# 信用评分
curl http://localhost:8003/health

# 前端
打开浏览器: http://localhost:5173
```

---

## 📋 服务说明

| 服务 | 端口 | 必须启动 | 说明 |
|------|------|---------|------|
| Ollama | 11434 | ✅ 是 | AI 推理引擎，所有 AI 功能的基础 |
| 前端 | 5173 | ✅ 是 | 用户界面 |
| 智能客服 | 8000 | ⚠️ 可选 | Ask AI 按钮功能 |
| 风险评估 | 8001 | ⚠️ 可选 | 风险评估页面 |
| 争议仲裁 | 8002 | ⚠️ 可选 | 争议仲裁页面 |
| 信用评分 | 8003 | ⚠️ 可选 | 信用评分页面 |

**说明**: 
- Ollama 和前端必须启动
- 后端 API 可以按需启动（使用哪个功能就启动哪个）

---

## 🎯 启动策略

### 策略 1: 完整演示（启动全部）
适合：产品演示、功能展示
```
Ollama + 前端 + 4个后端API = 6个终端
```

### 策略 2: 开发测试（按需启动）
适合：开发调试、功能测试
```
Ollama + 前端 + 需要测试的API = 3-4个终端
```

### 策略 3: 最小运行（仅核心）
适合：快速查看界面
```
仅前端 = 1个终端
（AI 功能不可用，但可以看界面）
```

---

## 🔧 故障排除

### 问题 1: Ollama 连接失败
```bash
# 检查 Ollama 是否运行
curl http://localhost:11434

# 如果未运行，启动它
ollama serve

# 检查模型是否下载
ollama list
ollama pull qwen3:4b-instruct-2507-q4_K_M
```

### 问题 2: 端口被占用
```bash
# Windows 查看端口占用
netstat -ano | findstr :8000
netstat -ano | findstr :8001
netstat -ano | findstr :8002
netstat -ano | findstr :8003
netstat -ano | findstr :5173

# 结束进程
taskkill /PID <进程ID> /F
```

### 问题 3: 前端启动失败
```bash
# 重新安装依赖
cd Hackathon/frontend
rm -rf node_modules
npm install

# 清除缓存
npm run dev -- --force
```

### 问题 4: Python 虚拟环境问题
```bash
cd Hackathon/backend

# 重新创建虚拟环境
rm -rf venv
python -m venv venv

# 激活并安装依赖
venv\Scripts\activate    # Windows
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
```

---

## 📊 启动时间估算

| 服务 | 启动时间 | 说明 |
|------|---------|------|
| Ollama | 5-10秒 | 首次启动较慢 |
| 前端 | 10-20秒 | 需要编译 |
| 后端 API | 2-5秒/个 | 较快 |
| **总计** | **30-60秒** | 全部启动完成 |

---

## 🎬 演示准备清单

### 演示前 30 分钟
- [ ] 检查 Ollama 是否安装
- [ ] 检查模型是否下载
- [ ] 检查前端依赖是否安装
- [ ] 检查后端虚拟环境

### 演示前 10 分钟
- [ ] 启动 Ollama
- [ ] 启动所有后端 API
- [ ] 启动前端
- [ ] 运行 CHECK_SERVICES.bat 检查

### 演示前 5 分钟
- [ ] 打开浏览器访问前端
- [ ] 测试 Ask AI 功能
- [ ] 测试风险评估功能
- [ ] 测试争议仲裁功能
- [ ] 测试信用评分功能

---

## 💡 使用建议

### 日常开发
```bash
# 只启动需要的服务
Ollama + 前端 + 正在开发的API
```

### 功能测试
```bash
# 使用测试脚本
cd Hackathon/backend
python test_risk_api.py
python test_dispute_api.py
python test_credit_api.py
```

### 产品演示
```bash
# 启动全部服务
使用 START_ALL.bat 一键启动
```

---

## 📞 技术支持

遇到问题？查看：
- [风险评估指南](./RISK_ASSESSMENT_GUIDE.md)
- [争议仲裁指南](./DISPUTE_ARBITRATION_GUIDE.md)
- [信用评分指南](./CREDIT_SCORE_GUIDE.md)
- [AI 功能总览](./AI_FEATURES_SUMMARY.md)

---

**版本**: 1.0.0  
**更新日期**: 2026-02-06
