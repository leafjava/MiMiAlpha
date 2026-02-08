# 黄金模型快速演示方案（2小时实现）

## 目标

在黑客松中快速展示黄金量化模型的发布、订阅和信号推送功能，使用模拟数据。

---

## 实现步骤

### 步骤 1: 准备模拟信号数据（15分钟）

创建 `Hackathon/frontend/src/data/mockSignals.ts`:

```typescript
export interface TradingSignal {
  id: string;
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  confidence: number;
  stopLoss: number;
  takeProfit: number;
  result?: 'win' | 'loss' | 'pending';
  resultPrice?: number;
  profit?: number;
}

export const historicalSignals: TradingSignal[] = [
  {
    id: 'sig-001',
    timestamp: '2026-02-09T09:15:00',
    action: 'BUY',
    price: 2095.50,
    confidence: 0.87,
    stopLoss: 2090.00,
    takeProfit: 2105.00,
    result: 'win',
    resultPrice: 2105.00,
    profit: 9.50
  },
  {
    id: 'sig-002',
    timestamp: '2026-02-09T10:30:00',
    action: 'SELL',
    price: 2103.20,
    confidence: 0.82,
    stopLoss: 2108.00,
    takeProfit: 2095.00,
    result: 'win',
    resultPrice: 2095.00,
    profit: 8.20
  },
  {
    id: 'sig-003',
    timestamp: '2026-02-09T11:45:00',
    action: 'BUY',
    price: 2097.80,
    confidence: 0.75,
    stopLoss: 2093.00,
    takeProfit: 2107.00,
    result: 'loss',
    resultPrice: 2093.00,
    profit: -4.80
  },
  {
    id: 'sig-004',
    timestamp: '2026-02-09T13:00:00',
    action: 'BUY',
    price: 2091.50,
    confidence: 0.91,
    stopLoss: 2086.00,
    takeProfit: 2101.00,
    result: 'win',
    resultPrice: 2101.00,
    profit: 9.50
  },
  {
    id: 'sig-005',
    timestamp: '2026-02-09T14:15:00',
    action: 'SELL',
    price: 2099.30,
    confidence: 0.88,
    stopLoss: 2104.00,
    takeProfit: 2089.00,
    result: 'win',
    resultPrice: 2089.00,
    profit: 10.30
  },
  {
    id: 'sig-006',
    timestamp: '2026-02-09T15:30:00',
    action: 'BUY',
    price: 2092.00,
    confidence: 0.79,
    stopLoss: 2087.00,
    takeProfit: 2102.00,
    result: 'pending',
  }
];

export const modelPerformance = {
  totalSignals: 100,
  winRate: 82,
  avgProfit: 8.5,
  sharpeRatio: 2.5,
  maxDrawdown: 3.2,
  totalProfit: 850.0,
  last30Days: {
    signals: 30,
    wins: 25,
    losses: 5,
    accuracy: 83.3
  }
};

// 生成实时信号（模拟）
export function generateLiveSignal(): TradingSignal {
  const actions: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const basePrice = 2095 + Math.random() * 10;
  const confidence = 0.7 + Math.random() * 0.25;
  
  return {
    id: `sig-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    price: parseFloat(basePrice.toFixed(2)),
    confidence: parseFloat(confidence.toFixed(2)),
    stopLoss: action === 'BUY' 
      ? parseFloat((basePrice - 5).toFixed(2))
      : parseFloat((basePrice + 5).toFixed(2)),
    takeProfit: action === 'BUY'
      ? parseFloat((basePrice + 10).toFixed(2))
      : parseFloat((basePrice - 10).toFixed(2)),
    result: 'pending'
  };
}
```

---

### 步骤 2: 创建实时信号组件（30分钟）

创建 `Hackathon/frontend/src/components/LiveTradingSignals.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { historicalSignals, generateLiveSignal, modelPerformance, TradingSignal } from '../data/mockSignals';
import './LiveTradingSignals.css';

export function LiveTradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>(historicalSignals.slice(0, 5));
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    // 模拟实时信号推送（每10秒一个新信号）
    const interval = setInterval(() => {
      const newSignal = generateLiveSignal();
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
    }, 10000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getSignalIcon = (action: string) => {
    return action === 'BUY' ? '📈' : action === 'SELL' ? '📉' : '⏸️';
  };

  const getResultBadge = (result?: string) => {
    if (!result || result === 'pending') {
      return <span className="result-badge pending">⏳ 进行中</span>;
    }
    return result === 'win' 
      ? <span className="result-badge win">✓ 盈利</span>
      : <span className="result-badge loss">✗ 止损</span>;
  };

  return (
    <div className="live-trading-signals">
      {/* 头部 */}
      <div className="signals-header">
        <div className="header-left">
          <h3>🔴 实时交易信号</h3>
          <div className={`live-indicator ${isLive ? 'active' : ''}`}>
            <span className="pulse"></span>
            {isLive ? 'LIVE' : '离线'}
          </div>
        </div>
        <button 
          className={`toggle-live-btn ${isLive ? 'active' : ''}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? '⏸️ 暂停' : '▶️ 开始推送'}
        </button>
      </div>

      {/* 性能指标 */}
      <div className="performance-metrics">
        <div className="metric-card">
          <div className="metric-label">总信号数</div>
          <div className="metric-value">{modelPerformance.totalSignals}</div>
        </div>
        <div className="metric-card highlight">
          <div className="metric-label">胜率</div>
          <div className="metric-value">{modelPerformance.winRate}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">夏普比率</div>
          <div className="metric-value">{modelPerformance.sharpeRatio}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">总盈利</div>
          <div className="metric-value">${modelPerformance.totalProfit}</div>
        </div>
      </div>

      {/* 信号列表 */}
      <div className="signals-list">
        {signals.map((signal) => (
          <div key={signal.id} className={`signal-card ${signal.action.toLowerCase()}`}>
            <div className="signal-header-row">
              <div className="signal-action">
                <span className="action-icon">{getSignalIcon(signal.action)}</span>
                <span className="action-text">{signal.action}</span>
              </div>
              <div className="signal-time">
                {new Date(signal.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div className="signal-details">
              <div className="detail-row">
                <span className="detail-label">入场价格:</span>
                <span className="detail-value price">${signal.price.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">置信度:</span>
                <span className="detail-value confidence">
                  {(signal.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">止损:</span>
                <span className="detail-value">${signal.stopLoss.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">止盈:</span>
                <span className="detail-value">${signal.takeProfit.toFixed(2)}</span>
              </div>
            </div>

            <div className="signal-footer">
              {getResultBadge(signal.result)}
              {signal.profit && (
                <span className={`profit ${signal.profit > 0 ? 'positive' : 'negative'}`}>
                  {signal.profit > 0 ? '+' : ''}{signal.profit.toFixed(2)} USD
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 订阅提示 */}
      <div className="subscription-cta">
        <div className="cta-content">
          <div className="cta-icon">🎯</div>
          <div className="cta-text">
            <h4>订阅获取实时信号</h4>
            <p>月度订阅仅需 20 TRX，无限接收所有交易信号</p>
          </div>
          <button className="cta-button">立即订阅</button>
        </div>
      </div>
    </div>
  );
}
```

---

### 步骤 3: 创建样式文件（15分钟）

创建 `Hackathon/frontend/src/components/LiveTradingSignals.css`:

```css
.live-trading-signals {
  background: rgba(24, 24, 27, 0.8);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
}

.signals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 165, 0, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #FFA500;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #a1a1aa;
}

.live-indicator.active {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a1a1aa;
}

.live-indicator.active .pulse {
  background: #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.toggle-live-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #3f3f46;
  background: transparent;
  color: #a1a1aa;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-live-btn:hover {
  border-color: #FFA500;
  color: #FFA500;
}

.toggle-live-btn.active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: #ef4444;
  color: white;
}

/* 性能指标 */
.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #3f3f46;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.metric-card.highlight {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.metric-label {
  font-size: 0.85rem;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFA500;
}

.metric-card.highlight .metric-value {
  color: #10B981;
}

/* 信号列表 */
.signals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.signal-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #3f3f46;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s;
}

.signal-card:hover {
  border-color: #FFA500;
  transform: translateX(4px);
}

.signal-card.buy {
  border-left: 3px solid #10B981;
}

.signal-card.sell {
  border-left: 3px solid #ef4444;
}

.signal-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.signal-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-icon {
  font-size: 1.5rem;
}

.action-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.signal-time {
  font-size: 0.9rem;
  color: #a1a1aa;
}

.signal-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.85rem;
  color: #a1a1aa;
}

.detail-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
}

.detail-value.price {
  color: #FFA500;
  font-size: 1rem;
}

.detail-value.confidence {
  color: #10B981;
}

.signal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.result-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.result-badge.win {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.result-badge.loss {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.result-badge.pending {
  background: rgba(255, 165, 0, 0.1);
  color: #FFA500;
}

.profit {
  font-size: 0.9rem;
  font-weight: 600;
}

.profit.positive {
  color: #10B981;
}

.profit.negative {
  color: #ef4444;
}

/* 订阅CTA */
.subscription-cta {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 12px;
}

.cta-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cta-icon {
  font-size: 3rem;
}

.cta-text h4 {
  margin: 0 0 0.5rem 0;
  color: #FFA500;
  font-size: 1.1rem;
}

.cta-text p {
  margin: 0;
  color: #a1a1aa;
  font-size: 0.9rem;
}

.cta-button {
  margin-left: auto;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 165, 0, 0.3);
}
```

---

### 步骤 4: 集成到模型详情（15分钟）

在 `ModelMarket.tsx` 中添加实时信号组件：

```typescript
// 在文件顶部导入
import { LiveTradingSignals } from './LiveTradingSignals';

// 在模型详情弹窗中添加（在 modal-guarantee 之后）
{selectedModel && selectedModel.id === '1' && (
  <LiveTradingSignals />
)}
```

---

### 步骤 5: 更新黄金模型数据（10分钟）

在 `ModelMarket.tsx` 中更新第一个模型的数据：

```typescript
{
  id: '1',
  name: 'PPO Ultimate 黄金价格预测模型',
  provider: 'TXbQ8vC34TytH56r9uV2xndg5NGPP8EiWn',
  description: '基于深度强化学习的黄金价格预测模型，使用 127 个特征，包含多时间框架分析、宏观经济指标和市场微观结构。历史准确率 82%，夏普比率 2.5',
  type: 'gold',
  sharpeRatio: 2.5,
  accuracy: 82,
  totalSignals: 100,
  pricePerSignal: 1,
  monthlySubscription: 20,
  stakedAmount: 100,
  avgConfidence: 85,
  contractAddress: 'TTn6Y1UwTbqQGXmwZJPqXNi1x5BpdqHtFN',
  recentSignals: [
    { date: '2026-02-09', prediction: 'BUY @ $2,095.50', confidence: 87, result: 'accurate' },
    { date: '2026-02-09', prediction: 'SELL @ $2,103.20', confidence: 82, result: 'accurate' },
    { date: '2026-02-09', prediction: 'BUY @ $2,091.50', confidence: 91, result: 'accurate' },
  ]
}
```

---

## 演示流程（5分钟）

### 1. 浏览模型（30秒）
"这是我们的黄金价格预测模型，基于 PPO 深度强化学习算法。"

### 2. 查看详情（1分钟）
"点击查看详情，可以看到模型的完整信息：
- 准确率 82%
- 夏普比率 2.5
- 已发布 100 个信号"

### 3. 实时信号（2分钟）
"这里是实时交易信号推送：
- 每个信号包含入场价格、止损、止盈
- 显示置信度和历史结果
- 点击'开始推送'可以看到模拟的实时信号"

### 4. 订阅（1分钟）
"用户可以：
- 单次购买：1 TRX/信号
- 月度订阅：20 TRX/月，无限信号
- 所有交易都在 TRON 链上记录"

### 5. 质量保证（30秒）
"模型提供者质押了 100 TRX，如果准确率低于 70%，会被罚没质押金。"

---

## 完成检查清单

- [ ] 创建 mockSignals.ts
- [ ] 创建 LiveTradingSignals.tsx
- [ ] 创建 LiveTradingSignals.css
- [ ] 更新 ModelMarket.tsx（导入组件）
- [ ] 更新黄金模型数据
- [ ] 测试实时信号推送
- [ ] 测试订阅按钮
- [ ] 准备演示脚本

---

## 时间分配

- 准备数据：15分钟
- 创建组件：30分钟
- 创建样式：15分钟
- 集成测试：15分钟
- 演示准备：15分钟
- **总计：90分钟**

---

## 演示亮点

✅ **实时信号推送** - 模拟 WebSocket 实时更新
✅ **历史业绩** - 显示准确率和盈利数据
✅ **专业指标** - 夏普比率、胜率、总盈利
✅ **链上质押** - 真实的 TRX 质押机制
✅ **用户友好** - 清晰的 UI 和交互

准备好开始实现了吗？我可以帮你创建这些文件！
