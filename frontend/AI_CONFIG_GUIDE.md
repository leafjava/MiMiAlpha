# 🤖 AI 配置指南

## 当前状态

前端AI助手现在支持两种模式：

### 模式1：OpenAI API（推荐）✅

**配置方法：**

在 `frontend/.env` 文件中添加：

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

**优点：**
- 真实的AI对话
- 回答质量高
- 支持复杂问题

**缺点：**
- 需要OpenAI API Key
- 有API调用费用
- ⚠️ 前端暴露API Key有安全风险（仅用于演示）

---

### 模式2：模拟响应（默认）✅

**配置方法：**

不配置任何API Key，或者留空：

```env
VITE_OPENAI_API_KEY=
```

**优点：**
- 无需配置
- 完全免费
- 无安全风险
- 响应速度快

**缺点：**
- 回答是预设的
- 不能处理复杂问题
- 但对于演示足够了！

---

## 工作原理

### 代码流程

```
用户输入
  ↓
PopupAssistant.tsx (UI组件)
  ↓
sendAIMessageStream() (ai-service.ts)
  ↓
chatWithAI() (openaiService.ts)
  ↓
检查 VITE_OPENAI_API_KEY
  ↓
有Key → 调用OpenAI API
无Key → 使用 getMockResponse()
  ↓
返回响应
```

### 模拟响应逻辑

`openaiService.ts` 中的 `getMockResponse()` 函数会根据关键词智能匹配：

- "量化"、"模型" → 介绍量化模型
- "收益"、"apy" → 介绍收益情况
- "风险"、"安全" → 介绍风险控制
- "钱包"、"连接" → 介绍钱包连接
- "测试币"、"水龙头" → 提供水龙头链接
- "购买"、"订阅" → 介绍购买流程
- 其他 → 通用欢迎消息

---

## 如何获取 OpenAI API Key

### 方法1：官方 OpenAI

1. 访问 https://platform.openai.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制到 `.env` 文件

**费用：** 按使用量计费，gpt-3.5-turbo 约 $0.002/1K tokens

### 方法2：国内代理服务

如果无法访问 OpenAI，可以使用国内代理：

**OpenAI-SB：**
```env
VITE_OPENAI_API_KEY=你的官方Key
VITE_OPENAI_BASE_URL=https://api.openai-sb.com/v1
```

**API2D：**
```env
VITE_OPENAI_API_KEY=fk-xxxxx  # API2D的Key
VITE_OPENAI_BASE_URL=https://openai.api2d.net/v1
```

**ChatAnywhere：**
```env
VITE_OPENAI_API_KEY=sk-xxxxx  # ChatAnywhere的Key
VITE_OPENAI_BASE_URL=https://api.chatanywhere.tech/v1
```

---

## 测试 AI 功能

### 1. 启动前端

```bash
cd frontend
npm run dev
```

### 2. 打开AI助手

点击右下角的 AI 助手图标

### 3. 测试对话

尝试问这些问题：
- "介绍一下量化模型"
- "收益率是多少？"
- "如何连接钱包？"
- "怎么购买模型？"

### 4. 检查响应

- 如果配置了OpenAI：响应会更自然、更详细
- 如果使用模拟：响应是预设的，但也很有用

---

## 安全建议

⚠️ **重要：不要在生产环境的前端暴露 API Key！**

**正确做法：**

1. **开发/演示：** 可以在前端直接调用（当前方案）
2. **生产环境：** 必须通过后端代理

**生产环境架构：**

```
前端 → 后端API → OpenAI
```

后端代码示例（已有）：
- `backend/ai_assistant_server.py`
- 前端调用 `/v1/assistant/chat`
- 后端转发到 OpenAI

---

## 当前配置检查

### 查看当前配置

```bash
cd frontend
cat .env | grep OPENAI
```

### 测试 OpenAI 连接

打开浏览器控制台，查看网络请求：

- 如果看到请求到 `api.openai.com` → 正在使用 OpenAI
- 如果没有网络请求 → 正在使用模拟响应

---

## 常见问题

### Q: 为什么界面显示"Powered by Ollama"？

A: 这是旧的显示文本，已经更新为：
- 有API Key → "Powered by OpenAI"
- 无API Key → "Powered by Mock AI"

刷新页面即可看到新的显示。

### Q: OpenAI API 调用失败怎么办？

A: 系统会自动降级到模拟响应，不会影响使用。

### Q: 模拟响应够用吗？

A: 对于演示和基本问答完全够用！我们预设了常见问题的回答。

### Q: 如何切换模式？

A: 只需修改 `.env` 文件中的 `VITE_OPENAI_API_KEY`：
- 有值 → OpenAI 模式
- 空值 → 模拟模式

然后重启开发服务器。

---

## 推荐配置

### 演示/展示

```env
# 使用模拟响应，无需配置
VITE_OPENAI_API_KEY=
```

**优点：** 简单、免费、安全

### 开发/测试

```env
# 使用真实 OpenAI
VITE_OPENAI_API_KEY=sk-your-key
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

**优点：** 真实体验、测试完整功能

---

**总结：** 两种模式都可以正常工作，根据需求选择即可！🎉
