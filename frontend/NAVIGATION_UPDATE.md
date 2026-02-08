# 导航跳转配置更新

## 更新内容

### 1. FacilitatorXHome 组件更新

**新增 Props**：
```typescript
type PageType = 'subscription' | 'model' | 'tech' | 'risk' | 'dispute' | 'agent';

interface FacilitatorXHomeProps {
  onEnter?: () => void;
  onNavigate?: (page: PageType) => void;
}
```

**按钮跳转配置**：

#### 引擎卡片
- **引擎 A 按钮**："进入订阅市场 →"
  - 点击后跳转到订阅市场页面（SubscriptionMarket）
  
- **引擎 B 按钮**："进入模型市场 →"
  - 点击后跳转到模型市场页面（ModelMarket）

#### Smart Facilitator 功能卡片
- **🔐 x402 支付拦截与治理**
  - 点击后跳转到风险评估页面（RiskAssessment）
  - 展示支付限额、配额管理、黑白名单等功能
  
- **⚡ x402 微支付聚合**
  - 点击后跳转到技术展示页面（TechShowcase）
  - 展示微支付聚合技术和 Energy 优化
  
- **📝 x402 语义化审计**
  - 点击后跳转到 Agent 管理页面（AgentManager）
  - 展示审计日志和 Agent 活动记录
  
- **🛡️ 动态定价仲裁**
  - 点击后跳转到争议仲裁页面（DisputeArbitration）
  - 展示价格对比和仲裁机制

### 2. App.tsx 路由配置

**FacilitatorXHome 调用**：
```typescript
<FacilitatorXHome 
  onEnter={() => setShowMiMiAlphaHome(false)} 
  onNavigate={(page) => {
    setShowMiMiAlphaHome(false);
    setCurrentPage(page);
  }}
/>
```

**页面路由映射**：
- `'subscription'` → `<SubscriptionMarket />`
- `'model'` → `<ModelMarket />`

### 3. 导航栏配置

顶部导航栏已有的按钮：
- 🏠 首页 → InvestmentPool
- 🔄 订阅市场 → SubscriptionMarket
- 📈 模型市场 → ModelMarket
- 🔬 技术展示 → TechShowcase
- ⚠️ 风险评估 → RiskAssessment
- ⚖️ 争议仲裁 → DisputeArbitration
- 💳 信用评分 → CreditScore
- 🤖 Agent 管理 → AgentManager

### 4. 视觉反馈

**Hover 效果**：
- 鼠标悬停时，卡片会：
  - 向上移动 4px
  - 边框变为橙色
  - 显示阴影效果
  - 底部显示"点击查看详情 →"提示

**Cursor 样式**：
- 所有可点击的卡片都设置了 `cursor: pointer`

## 用户体验流程

### 流程 1：从首页进入订阅市场

1. 用户看到 Spline 3D 动画
2. 点击进入，看到 FacilitatorXHome 页面
3. 看到"引擎 A"卡片，点击"进入订阅市场 →"
4. 跳转到 SubscriptionMarket 页面
5. 可以浏览和购买订阅权

### 流程 2：从首页进入模型市场

1. 用户看到 Spline 3D 动画
2. 点击进入，看到 FacilitatorXHome 页面
3. 看到"引擎 B"卡片，点击"进入模型市场 →"
4. 跳转到 ModelMarket 页面
5. 可以浏览和购买量化信号

### 流程 3：查看 Smart Facilitator 功能详情

1. 用户在 FacilitatorXHome 页面
2. 向下滚动到"Smart Facilitator"区域
3. 鼠标悬停在任意功能卡片上
4. 看到"点击查看详情 →"提示
5. 点击卡片，跳转到对应的功能页面：
   - 🔐 支付拦截 → 风险评估页面
   - ⚡ 微支付聚合 → 技术展示页面
   - 📝 语义化审计 → Agent 管理页面
   - 🛡️ 动态定价 → 争议仲裁页面

### 流程 4：通过导航栏切换页面

1. 用户在任何页面
2. 点击顶部导航栏的按钮
3. 立即切换到对应页面
4. 导航栏高亮显示当前页面

## 技术实现

### 状态管理

```typescript
const [currentPage, setCurrentPage] = useState<Page>('home');
const [showMiMiAlphaHome, setShowMiMiAlphaHome] = useState(false);
```

### 页面渲染逻辑

```typescript
{currentPage === 'home' && <InvestmentPool />}
{currentPage === 'subscription' && <SubscriptionMarket />}
{currentPage === 'model' && <ModelMarket />}
{currentPage === 'tech' && <TechShowcase />}
// ... 其他页面
```

## 测试步骤

### 测试引擎按钮
1. ✅ 启动开发服务器：`npm run dev`
2. ✅ 访问 `http://localhost:5173/`
3. ✅ 点击 Spline 动画进入首页
4. ✅ 点击"引擎 A"的"进入订阅市场 →"按钮
5. ✅ 验证是否跳转到订阅市场页面
6. ✅ 点击导航栏的"🏠 首页"返回
7. ✅ 再次进入 FacilitatorXHome
8. ✅ 点击"引擎 B"的"进入模型市场 →"按钮
9. ✅ 验证是否跳转到模型市场页面

### 测试 Smart Facilitator 卡片
1. ✅ 在 FacilitatorXHome 页面向下滚动
2. ✅ 鼠标悬停在"🔐 x402 支付拦截与治理"卡片
3. ✅ 验证是否显示"点击查看详情 →"提示
4. ✅ 点击卡片，验证是否跳转到风险评估页面
5. ✅ 返回首页，测试其他三个卡片：
   - ⚡ 微支付聚合 → 技术展示
   - 📝 语义化审计 → Agent 管理
   - 🛡️ 动态定价仲裁 → 争议仲裁

## 注意事项

1. **TypeScript 错误**：
   - 如果看到"找不到模块"错误，尝试重启开发服务器
   - 运行 `npm run dev` 重新启动

2. **导航栏高亮**：
   - 当前页面的按钮会显示橙色背景
   - 其他页面的按钮显示灰色文字

3. **返回首页**：
   - 点击左上角的"🚀 MiMiAlpha"可以返回 Spline 动画页面
   - 点击导航栏的"🏠 首页"可以进入 InvestmentPool 页面

## 后续优化

1. **面包屑导航**：
   - 添加面包屑显示当前位置
   - 例如：首页 > 引擎 A > 订阅市场

2. **页面过渡动画**：
   - 添加页面切换的淡入淡出效果
   - 提升用户体验

3. **历史记录**：
   - 支持浏览器前进/后退按钮
   - 使用 React Router 管理路由

---

**更新时间**：2026-02-08  
**状态**：已完成 ✅
