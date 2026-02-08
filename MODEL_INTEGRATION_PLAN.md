# 黄金量化模型集成方案

## 概述

将 `financial/deploy_windows` 中的黄金交易量化模型集成到 MiMiAlpha 平台，实现：
1. 模型质押发布到 TRON 链
2. 实时信号推送给订阅者
3. 链上业绩追溯
4. 自动化收益分配

---

## 模型信息

### 基本信息
- **模型名称**: PPO Ultimate 黄金价格预测模型
- **交易标的**: XAUUSD (黄金/美元)
- **时间框架**: M5 (5分钟)
- **特征数量**: 127 个特征
- **数据跨度**: 11 年 (2015-2026)
- **模型类型**: PPO (Proximal Policy Optimization)

### 性能指标
- **数据质量**: ✅ 优秀
- **历史数据**: 776,648 条
- **宏观数据**: 6 个数据源
- **经济日历**: 1,104 个事件

---

## 集成架构

```
┌─────────────────────────────────────────────────────────────┐
│                    MiMiAlpha 平台 (TRON)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  模型发布    │─────▶│  智能合约    │─────▶│  订阅者   │ │
│  │  (质押TRX)   │      │  (链上记录)  │      │  (付费)   │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         │                      │                     │       │
│         ▼                      ▼                     ▼       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              信号推送服务 (WebSocket)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              量化模型服务 (Python Backend)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  PPO 模型    │─────▶│  信号生成    │─────▶│  验证器   │ │
│  │  (预测)      │      │  (BUY/SELL)  │      │  (准确率) │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         ▼                      ▼                     ▼       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MT5 实时数据接口                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 实施步骤

### 阶段 1: 模型包装和 API 化（1-2天）

#### 1.1 创建 FastAPI 服务

```python
# model_service/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime

app = FastAPI(title="Gold Trading Model API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 全局变量
model = None
subscribers = []

@app.on_event("startup")
async def startup_event():
    """启动时加载模型"""
    global model
    from stable_baselines3 import PPO
    model = PPO.load("../financial/deploy_windows/train/ppo_ultimate/ppo_ultimate_150_final.zip")
    print("✅ 模型加载成功")
    
    # 启动实时交易监控
    asyncio.create_task(run_trading_loop())

@app.get("/api/model/info")
async def get_model_info():
    """获取模型信息"""
    return {
        "name": "PPO Ultimate 黄金价格预测模型",
        "symbol": "XAUUSD",
        "timeframe": "M5",
        "features": 127,
        "status": "active",
        "provider": "0x...",  # 从环境变量读取
        "staked_amount": 100,  # 从链上读取
    }

@app.get("/api/signals/latest")
async def get_latest_signal():
    """获取最新信号"""
    # 从数据库或缓存读取
    return {
        "timestamp": datetime.now().isoformat(),
        "action": "BUY",
        "price": 2100.50,
        "confidence": 0.85,
        "stop_loss": 2095.00,
        "take_profit": 2110.00
    }

@app.websocket("/ws/signals")
async def websocket_signals(websocket: WebSocket):
    """WebSocket 实时信号推送"""
    await websocket.accept()
    subscribers.append(websocket)
    
    try:
        while True:
            # 保持连接
            await websocket.receive_text()
    except:
        subscribers.remove(websocket)

async def run_trading_loop():
    """实时交易循环"""
    while True:
        try:
            # 1. 获取最新数据
            signal = generate_signal()
            
            # 2. 推送给所有订阅者
            await broadcast_signal(signal)
            
            # 3. 记录到数据库
            save_signal_to_db(signal)
            
            # 4. 如果是交易信号，记录到链上
            if signal['action'] != 'HOLD':
                await record_to_blockchain(signal)
            
        except Exception as e:
            print(f"❌ 错误: {e}")
        
        await asyncio.sleep(30)  # 每30秒检查一次

def generate_signal():
    """生成交易信号"""
    # 调用 PPO 模型
    # 返回信号
    pass

async def broadcast_signal(signal):
    """广播信号给所有订阅者"""
    message = json.dumps(signal)
    for ws in subscribers:
        try:
            await ws.send_text(message)
        except:
            subscribers.remove(ws)

async def record_to_blockchain(signal):
    """记录信号到 TRON 链"""
    # 调用智能合约
    pass
```

#### 1.2 创建信号验证器

```python
# model_service/validator.py
import pandas as pd
from datetime import datetime, timedelta

class SignalValidator:
    """信号验证器：验证信号准确率"""
    
    def __init__(self):
        self.signals = []
        self.results = []
    
    def add_signal(self, signal):
        """添加新信号"""
        self.signals.append({
            'timestamp': signal['timestamp'],
            'action': signal['action'],
            'price': signal['price'],
            'take_profit': signal['take_profit'],
            'stop_loss': signal['stop_loss'],
            'status': 'pending'
        })
    
    def check_results(self, current_price):
        """检查信号结果"""
        for signal in self.signals:
            if signal['status'] == 'pending':
                # 检查是否触及止盈或止损
                if signal['action'] == 'BUY':
                    if current_price >= signal['take_profit']:
                        signal['status'] = 'win'
                        signal['result_price'] = current_price
                    elif current_price <= signal['stop_loss']:
                        signal['status'] = 'loss'
                        signal['result_price'] = current_price
                
                elif signal['action'] == 'SELL':
                    if current_price <= signal['take_profit']:
                        signal['status'] = 'win'
                        signal['result_price'] = current_price
                    elif current_price >= signal['stop_loss']:
                        signal['status'] = 'loss'
                        signal['result_price'] = current_price
    
    def get_accuracy(self, days=30):
        """计算准确率"""
        cutoff = datetime.now() - timedelta(days=days)
        recent_signals = [s for s in self.signals 
                         if s['timestamp'] > cutoff and s['status'] != 'pending']
        
        if not recent_signals:
            return 0
        
        wins = len([s for s in recent_signals if s['status'] == 'win'])
        return wins / len(recent_signals) * 100
```

---

### 阶段 2: 智能合约扩展（1天）

#### 2.1 添加信号记录功能

```solidity
// ModelSubscriptionTRX.sol 扩展

struct Signal {
    uint256 timestamp;
    uint256 modelId;
    string action;      // "BUY" or "SELL"
    uint256 price;      // 价格 (scaled by 1e6)
    uint256 confidence; // 置信度 (0-100)
    uint256 stopLoss;
    uint256 takeProfit;
    bool verified;
    bool accurate;
}

mapping(uint256 => Signal[]) public modelSignals;
mapping(uint256 => uint256) public modelAccuracy; // 准确率 (0-100)

event SignalPublished(
    uint256 indexed modelId,
    uint256 signalId,
    string action,
    uint256 price,
    uint256 confidence
);

event SignalVerified(
    uint256 indexed modelId,
    uint256 signalId,
    bool accurate
);

function publishSignal(
    uint256 modelId,
    string memory action,
    uint256 price,
    uint256 confidence,
    uint256 stopLoss,
    uint256 takeProfit
) external {
    require(models[modelId].provider == msg.sender, "Not model owner");
    require(models[modelId].active, "Model not active");
    
    Signal memory newSignal = Signal({
        timestamp: block.timestamp,
        modelId: modelId,
        action: action,
        price: price,
        confidence: confidence,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        verified: false,
        accurate: false
    });
    
    modelSignals[modelId].push(newSignal);
    
    emit SignalPublished(
        modelId,
        modelSignals[modelId].length - 1,
        action,
        price,
        confidence
    );
}

function verifySignal(
    uint256 modelId,
    uint256 signalId,
    bool accurate
) external {
    // 只有验证者可以调用
    require(msg.sender == verifier, "Not verifier");
    
    Signal storage signal = modelSignals[modelId][signalId];
    require(!signal.verified, "Already verified");
    
    signal.verified = true;
    signal.accurate = accurate;
    
    // 更新模型准确率
    updateModelAccuracy(modelId);
    
    emit SignalVerified(modelId, signalId, accurate);
}

function updateModelAccuracy(uint256 modelId) internal {
    Signal[] storage signals = modelSignals[modelId];
    uint256 verifiedCount = 0;
    uint256 accurateCount = 0;
    
    // 只统计最近 30 个已验证的信号
    uint256 startIdx = signals.length > 30 ? signals.length - 30 : 0;
    
    for (uint256 i = startIdx; i < signals.length; i++) {
        if (signals[i].verified) {
            verifiedCount++;
            if (signals[i].accurate) {
                accurateCount++;
            }
        }
    }
    
    if (verifiedCount > 0) {
        modelAccuracy[modelId] = (accurateCount * 100) / verifiedCount;
    }
}
```

---

### 阶段 3: 前端集成（1天）

#### 3.1 创建实时信号组件

```typescript
// frontend/src/components/LiveSignals.tsx
import { useState, useEffect } from 'react';

interface Signal {
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  confidence: number;
  stopLoss: number;
  takeProfit: number;
}

export function LiveSignals({ modelId }: { modelId: string }) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // 连接 WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/signals');
    
    ws.onopen = () => {
      console.log('✅ WebSocket 连接成功');
      setConnected(true);
    };
    
    ws.onmessage = (event) => {
      const signal = JSON.parse(event.data);
      setSignals(prev => [signal, ...prev].slice(0, 10)); // 只保留最新10条
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket 错误:', error);
      setConnected(false);
    };
    
    ws.onclose = () => {
      console.log('⚠️ WebSocket 断开');
      setConnected(false);
    };
    
    return () => ws.close();
  }, [modelId]);

  return (
    <div className="live-signals">
      <div className="signal-header">
        <h3>🔴 实时信号</h3>
        <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● LIVE' : '○ 离线'}
        </div>
      </div>
      
      <div className="signal-list">
        {signals.map((signal, idx) => (
          <div key={idx} className={`signal-item ${signal.action.toLowerCase()}`}>
            <div className="signal-time">
              {new Date(signal.timestamp).toLocaleTimeString()}
            </div>
            <div className="signal-action">
              {signal.action === 'BUY' ? '📈 买入' : '📉 卖出'}
            </div>
            <div className="signal-price">
              ${signal.price.toFixed(2)}
            </div>
            <div className="signal-confidence">
              置信度: {(signal.confidence * 100).toFixed(0)}%
            </div>
            <div className="signal-targets">
              <span>止损: ${signal.stopLoss.toFixed(2)}</span>
              <span>止盈: ${signal.takeProfit.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### 3.2 更新模型详情页

在 `ModelMarket.tsx` 的模型详情弹窗中添加实时信号组件：

```typescript
{selectedModel && (
  <div className="modal-content">
    {/* 现有内容 */}
    
    {/* 新增：实时信号 */}
    {selectedModel.id === 'gold-model-1' && (
      <LiveSignals modelId={selectedModel.id} />
    )}
  </div>
)}
```

---

### 阶段 4: 部署和测试（1天）

#### 4.1 部署 Python 后端

```bash
# 1. 创建虚拟环境
cd Hackathon
mkdir model_service
cd model_service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. 安装依赖
pip install fastapi uvicorn websockets
pip install stable-baselines3
pip install MetaTrader5
pip install pandas numpy

# 3. 复制模型文件
cp -r ../../financial/deploy_windows/* ./

# 4. 启动服务
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 4.2 测试流程

1. **模型发布测试**
   - 在前端发布黄金模型
   - 质押 50 TRX
   - 验证链上记录

2. **信号生成测试**
   - 启动 Python 后端
   - 验证 WebSocket 连接
   - 检查信号推送

3. **订阅测试**
   - 用户订阅模型
   - 支付 TRX
   - 接收实时信号

4. **准确率验证**
   - 等待信号触发止盈/止损
   - 自动验证准确率
   - 更新链上数据

---

## 黑客松演示方案

### 方案 A: 完整集成（如果时间充足）

1. 部署 Python 后端
2. 实时信号推送
3. 链上记录验证
4. 展示完整流程

### 方案 B: 模拟演示（推荐）

1. **预录信号数据**
   ```json
   [
     {
       "timestamp": "2026-02-09T10:30:00",
       "action": "BUY",
       "price": 2100.50,
       "confidence": 0.85,
       "result": "win"
     },
     ...
   ]
   ```

2. **前端模拟 WebSocket**
   ```typescript
   // 使用定时器模拟实时推送
   useEffect(() => {
     const interval = setInterval(() => {
       const mockSignal = generateMockSignal();
       setSignals(prev => [mockSignal, ...prev]);
     }, 5000);
     
     return () => clearInterval(interval);
   }, []);
   ```

3. **展示历史业绩**
   - 准确率: 82%
   - 总信号数: 100
   - 盈利信号: 82
   - 亏损信号: 18

---

## 商业模式

### 收费模式

1. **单次信号**: 1 TRX/信号
2. **月度订阅**: 20 TRX/月（无限信号）
3. **质押要求**: 50 TRX

### 收益分配

- 平台手续费: 10%
- 模型提供者: 90%
- 质押金利息: 归提供者

### 质量保证

- 准确率 < 70%: 罚没 10% 质押金
- 连续 3 次错误: 退款 50% 给订阅者
- 质押金不足: 自动暂停

---

## 技术栈总结

### 后端
- Python + FastAPI
- Stable Baselines3 (PPO)
- MetaTrader5
- WebSocket

### 前端
- React + TypeScript
- TronLink
- WebSocket Client

### 区块链
- TRON Nile Testnet
- Solidity 智能合约
- TronWeb

---

## 时间估算

| 阶段 | 任务 | 时间 |
|------|------|------|
| 1 | Python API 包装 | 4-6 小时 |
| 2 | 智能合约扩展 | 2-3 小时 |
| 3 | 前端集成 | 3-4 小时 |
| 4 | 测试和调试 | 2-3 小时 |
| **总计** | | **11-16 小时** |

### 黑客松快速方案（4-6小时）

1. 使用模拟数据（1小时）
2. 前端展示组件（2小时）
3. 发布流程演示（1小时）
4. PPT 和演讲准备（1-2小时）

---

## 下一步行动

### 立即开始（今天）

1. **决定演示方案**
   - [ ] 完整集成（需要更多时间）
   - [ ] 模拟演示（快速，推荐）

2. **准备模拟数据**
   - [ ] 创建历史信号 JSON
   - [ ] 准备性能指标

3. **前端组件开发**
   - [ ] LiveSignals 组件
   - [ ] 信号历史展示
   - [ ] 准确率图表

### 明天完成

4. **集成测试**
   - [ ] 发布流程
   - [ ] 信号推送
   - [ ] 订阅购买

5. **演示准备**
   - [ ] 演示脚本
   - [ ] 备用方案
   - [ ] PPT 制作

---

需要我帮你实现哪个部分？我可以：
1. 创建 FastAPI 后端代码
2. 创建前端实时信号组件
3. 准备模拟数据
4. 编写智能合约扩展
