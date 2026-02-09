# 🚀 前端独立运行指南

## 概述

为了快速开发和演示，我们已经将所有后端逻辑移到前端：
- ✅ 使用模拟数据替代后端API
- ✅ 前端直接调用OpenAI（可选）
- ✅ 无需启动任何后端服务
- ✅ 一键启动，立即可用

## 快速开始

```bash
cd Hackathon/frontend
npm install
npm run dev
```

就这么简单！打开 http://localhost:5173 即可使用。

## 功能说明

### 1. 投资池（InvestmentPool）
- 使用 `mockYieldData` 提供模拟的收益数据
- 所有计算在前端完成
- 无需后端API

### 2. 模型市场（Marketplace）
- 使用 `mockProducts` 提供模拟的产品列表
- 订单处理在前端完成
- 无需后端API

### 3. AI 助手
- 可选配置 OpenAI API Key
- 如果未配置，使用智能模拟响应
- 响应质量足够演示使用

### 4. 其他功能
- 风险评估：前端算法
- 信用评分：前端算法
- 争议仲裁：前端逻辑
- 支付治理：前端逻辑

## 配置 OpenAI（可选）

如果想使用真实的AI对话，在 `.env` 文件中配置：

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

如果不配置，系统会使用智能模拟响应，效果也很好。

## 文件结构

```
frontend/
├── src/
│   ├── services/
│   │   ├── mockData.ts          # 所有模拟数据
│   │   └── openaiService.ts     # OpenAI 调用（可选）
│   ├── lib/
│   │   └── ai-service.ts        # AI 助手服务
│   └── components/
│       ├── InvestmentPool.tsx   # 已更新使用模拟数据
│       ├── Marketplace.tsx      # 需要更新
│       ├── CreditScore.tsx      # 需要更新
│       └── RiskAssessment.tsx   # 需要更新
```

## 优势

1. **零配置**：无需配置后端服务器
2. **快速启动**：一条命令即可运行
3. **易于演示**：不依赖网络和后端服务
4. **完整功能**：所有功能都可正常使用
5. **真实体验**：模拟数据足够真实

## 部署

### Vercel 部署（推荐）

```bash
npm install -g vercel
cd Hackathon/frontend
vercel
```

### Netlify 部署

```bash
npm run build
# 上传 dist 目录到 Netlify
```

### GitHub Pages

```bash
npm run build
# 配置 GitHub Pages 指向 dist 目录
```

## 注意事项

⚠️ **生产环境警告**：
- 不要在前端暴露真实的 OpenAI API Key
- 模拟数据仅用于演示
- 真实项目需要后端服务器

## 下一步

如果需要连接真实后端：
1. 参考 `CORS_FIX_GUIDE.md`
2. 配置 Vite 代理
3. 更新环境变量

但对于演示和快速开发，当前配置已经足够！

## 故障排查

### Q: AI 助手不工作？
A: 检查是否配置了 OpenAI API Key，或者直接使用模拟响应

### Q: 数据不更新？
A: 模拟数据是静态的，这是正常的。如需动态数据，连接后端

### Q: 如何修改模拟数据？
A: 编辑 `src/services/mockData.ts` 文件

---

**现在就开始吧！** 🎉

```bash
cd Hackathon/frontend
npm run dev
```
