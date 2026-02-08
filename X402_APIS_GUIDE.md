# x402 Smart Facilitator APIs 使用指南

## 📋 概述

本文档介绍 FacilitatorX 项目中新增的两个核心 API，它们是实现 TRON 挑战2 "Smart Facilitator" 的关键组件。

---

## 🎯 两大核心 API

### 1. 微支付聚合 API (端口 8007)
**功能**: 高频微支付聚合、批量结算、Energy 优化

### 2. x402 解析 API (端口 8008)
**功能**: 解析 x402 协议数据、生成人类可读审计日志

---

## 🚀 快速开始

### 启动服务

```bash
# 方式 1: 单独启动
cd Hackathon/backend
start_micropayment_api.bat  # 启动微支付聚合 API
start_x402_api.bat          # 启动 x402 解析 API

# 方式 2: 一键启动所有服务
cd Hackathon
START_ALL.bat
```

### 测试服务

```bash
# 运行测试脚本
cd Hackathon
TEST_X402_APIS.bat
```

---

## 📡 API 1: 微支付聚合 API

### 端口: 8007

### 核心功能

#### 1. 添加微支付到聚合队列

**端点**: `POST /api/micropayment/add`

**请求体**:
```json
{
  "agent_address": "0x1234567890abcdef",
  "recipient": "0xServiceProvider",
  "amount": 100000,
  "service": "ChatGPT API Call"
}
```

**响应**:
```json
{
  "success": true,
  "message": "微支付已添加到聚合队列",
  "queue_size": 15,
  "batch_threshold": 50,
  "settled": false
}
```

**自动结算条件**:
- 队列达到 50 笔支付
- 或超过 5 分钟未结算

#### 2. 强制结算

**端点**: `POST /api/micropayment/force-settle`

**请求体**:
```json
{
  "agent_address": "0x1234567890abcdef"
}
```

**响应**:
```json
{
  "success": true,
  "message": "批次已结算",
  "batch": {
    "batch_id": "batch_1707398400",
    "total_payments": 45,
    "aggregated_transfers": 3,
    "energy_savings": {
      "traditional_energy": 12600,
      "aggregated_energy": 280,
      "energy_saved": 12320,
      "cost_saved": 1.232,
      "savings_rate": 97.78
    }
  }
}
```

#### 3. 查看队列状态

**端点**: `GET /api/micropayment/queue?agent_address=0x...`

**响应**:
```json
{
  "agent_address": "0x1234567890abcdef",
  "queue_size": 15,
  "payments": [...],
  "should_settle": false
}
```

#### 4. 查看已结算批次

**端点**: `GET /api/micropayment/batches?limit=10`

**响应**:
```json
{
  "total_batches": 5,
  "batches": [...]
}
```

#### 5. 查看统计信息

**端点**: `GET /api/micropayment/stats`

**响应**:
```json
{
  "energy_stats": {
    "total_payments": 250,
    "total_batches": 5,
    "energy_saved": 69720,
    "cost_saved": 6.972
  },
  "average_batch_size": 50,
  "average_savings_per_batch": 13944
}
```

#### 6. AI 分析 Energy 节省

**端点**: `POST /api/micropayment/analyze`

**请求体**:
```json
{
  "num_payments": 1000,
  "time_period": "daily"
}
```

**响应**:
```json
{
  "savings": {
    "traditional_energy": 280000,
    "aggregated_energy": 5600,
    "energy_saved": 274400,
    "cost_saved": 27.44,
    "savings_rate": 98.0
  },
  "ai_analysis": {
    "summary": "通过聚合 1000 笔微支付，节省了 98.0% 的 Energy",
    "recommendation": "继续使用微支付聚合以降低链上成本"
  }
}
```

### Energy 节省计算

```
传统方式（每笔都上链）:
- 1000 笔支付 × 280 Energy = 280,000 Energy
- 成本: $28/天

聚合方式（批量结算）:
- 20 批 × 280 Energy = 5,600 Energy
- 成本: $0.56/天

节省: $27.44/天 (98%)
```

---

## 📡 API 2: x402 解析 API

### 端口: 8008

### 核心功能

#### 1. 解析 x402 交易

**端点**: `POST /api/x402/parse-transaction`

**请求体**:
```json
{
  "tx_hash": "0x1234567890abcdef...",
  "agent": "Agent_Trading_Bot"
}
```

**响应**:
```json
{
  "success": true,
  "audit_log": {
    "log_id": "a1b2c3d4e5f6g7h8",
    "timestamp": "2026-02-08T14:30:25",
    "tx_hash": "0x1234567890abcdef...",
    "agent": "Agent_Trading_Bot",
    "service": "ChatGPT Plus API",
    "service_type": "chatgpt-plus",
    "amount": 0.5,
    "details": {
      "model": "gpt-4",
      "requests": 10,
      "tokens": 50000
    },
    "human_readable": "Agent_Trading_Bot 调用了 ChatGPT Plus API，使用 gpt-4 模型，消耗 50,000 Tokens，支付 0.5 USDT"
  }
}
```

#### 2. 批量解析交易

**端点**: `POST /api/x402/parse-batch`

**请求体**:
```json
{
  "transactions": [
    {"tx_hash": "0xabc...", "agent": "Agent_A"},
    {"tx_hash": "0xdef...", "agent": "Agent_B"}
  ]
}
```

#### 3. 获取审计日志

**端点**: `GET /api/x402/audit-logs?limit=50&agent=Agent_A&service_type=chatgpt-plus`

**响应**:
```json
{
  "total": 125,
  "logs": [...]
}
```

#### 4. 生成审计报告

**端点**: `POST /api/x402/generate-report`

**请求体**:
```json
{
  "agent": "Agent_Trading_Bot",
  "start_date": "2026-02-01",
  "end_date": "2026-02-08"
}
```

**响应**:
```json
{
  "success": true,
  "report": {
    "agent": "Agent_Trading_Bot",
    "period": {
      "start": "2026-02-01",
      "end": "2026-02-08"
    },
    "statistics": {
      "total_transactions": 45,
      "total_amount": 125.5,
      "services_used": {
        "ChatGPT Plus API": {
          "count": 30,
          "amount": 15.0
        },
        "BTC 量化信号": {
          "count": 15,
          "amount": 110.5
        }
      }
    },
    "ai_analysis": {
      "summary": "Agent_Trading_Bot 在指定时间范围内共进行了 45 笔交易，总支出 $125.5",
      "insights": [
        "主要使用 ChatGPT Plus API 和量化信号服务",
        "支付行为正常，无异常大额支出"
      ],
      "alerts": []
    }
  }
}
```

#### 5. 模拟交易（测试用）

**端点**: `POST /api/x402/simulate`

**请求体**:
```json
{
  "agent": "Agent_Test",
  "service_type": "chatgpt-plus",
  "amount": 500000,
  "metadata": {
    "model": "gpt-4",
    "tokens_used": 50000,
    "requests": 10
  }
}
```

### 支持的服务类型

| 服务类型 | 服务名称 | 人类可读格式示例 |
|---------|---------|----------------|
| `quant-signal-btc` | BTC 量化信号 | "Agent_A 购买了 BTC 1h 量化信号，置信度 88%，支付 500 USDT" |
| `quant-signal-eth` | ETH 量化信号 | "Agent_B 购买了 ETH 4h 量化信号，置信度 85%，支付 300 USDT" |
| `quant-signal-gold` | 黄金价格预测 | "Agent_C 购买了 GOLD 1d 量化信号，置信度 92%，支付 400 USDT" |
| `quant-strategy-hft` | 高频交易策略 | "Agent_D 订阅了高频交易策略，预期收益 15%，风险等级 high，支付 1000 USDT" |

---

## 🎬 Demo 演示场景

### 场景 1: 高频微支付聚合

```python
# 模拟 100 笔高频量化信号订阅
for i in range(100):
    requests.post('http://localhost:8007/api/micropayment/add', json={
        'agent_address': '0xAgent',
        'recipient': '0xQuantProvider',
        'amount': 10000,  # 0.01 USDT
        'service': f'量化信号推送 #{i+1}'
    })

# 结果: 自动聚合为 2 批，节省 98% Energy
```

### 场景 2: 语义化审计

```python
# 原始交易哈希
tx_hash = "0x1234567890abcdef..."

# 解析为人类可读格式
response = requests.post('http://localhost:8008/api/x402/parse-transaction', json={
    'tx_hash': tx_hash,
    'agent': 'Agent_Quant'
})

# 输出: "Agent_Quant 购买了 BTC 1h 量化信号，置信度 88%，支付 500 USDT"
```

### 场景 3: 生成审计报告

```python
# 生成月度报告
response = requests.post('http://localhost:8008/api/x402/generate-report', json={
    'agent': 'Agent_Trading_Bot',
    'start_date': '2026-02-01',
    'end_date': '2026-02-28'
})

# AI 自动分析支付行为，识别异常
```

---

## 🔧 技术实现

### 微支付聚合机制

```python
# 聚合队列
pending_payments = {
    'agent_address': [
        {'recipient': '0xA', 'amount': 100000, 'service': 'API Call 1'},
        {'recipient': '0xA', 'amount': 100000, 'service': 'API Call 2'},
        {'recipient': '0xB', 'amount': 200000, 'service': 'API Call 3'},
        # ... 共 50 笔
    ]
}

# 批量结算
aggregated = {
    '0xA': 200000,  # 2 笔合并
    '0xB': 200000   # 1 笔
}

# 只需 1 笔链上交易，节省 49 笔的 Energy
```

### x402 数据解析

```python
# 原始 Hex 数据
raw_data = "0xa9059cbb000000000000000000000000742d35cc..."

# 解析为结构化数据
x402_data = {
    'protocol': 'x402',
    'service_type': 'chatgpt-plus',
    'amount': 500000,
    'tokens_used': 50000,
    'metadata': {...}
}

# AI 生成人类可读描述
human_readable = "Agent_A 调用了 ChatGPT Plus API，消耗 50,000 Tokens，支付 0.5 USDT"
```

---

## 📊 与挑战2的对应关系

| 挑战2要求 | API 实现 | 端点 |
|----------|---------|------|
| **多维支付治理** | payment_governance_api.py (8006) | 已实现 |
| **高频微支付处理** | micropayment_aggregator_api.py (8007) | ✅ 新增 |
| **语义化审计流水** | x402_parser_api.py (8008) | ✅ 新增 |

---

## 🧪 测试指南

### 1. 健康检查

```bash
# 微支付聚合 API
curl http://localhost:8007/health

# x402 解析 API
curl http://localhost:8008/health
```

### 2. 运行完整测试

```bash
# 测试微支付聚合
cd Hackathon/backend
python test_micropayment_api.py

# 测试 x402 解析
python test_x402_api.py
```

### 3. 一键测试

```bash
cd Hackathon
TEST_X402_APIS.bat
```

---

## 📈 性能指标

### 微支付聚合

- **聚合阈值**: 50 笔/批
- **超时时间**: 5 分钟
- **Energy 节省**: 98%
- **成本节省**: $27.44/天 (1000 笔)
- **响应时间**: < 100ms

### x402 解析

- **解析速度**: < 50ms/笔
- **批量解析**: 支持
- **AI 分析**: < 2s
- **日志存储**: 内存（可扩展到数据库）

---

## 🔐 安全特性

### 微支付聚合

- ✅ 按 Agent 隔离队列
- ✅ 自动超时结算
- ✅ 防止重复结算
- ✅ 完整的审计追踪

### x402 解析

- ✅ 交易数据验证
- ✅ 服务类型白名单
- ✅ AI 异常检测
- ✅ 完整的日志记录

---

## 🚀 后续扩展

### Phase 1 (当前)
- ✅ 基础聚合功能
- ✅ x402 协议解析
- ✅ AI 审计日志

### Phase 2 (计划中)
- [ ] 数据库持久化
- [ ] 实时 WebSocket 推送
- [ ] 更多服务类型支持
- [ ] 跨链聚合

### Phase 3 (未来)
- [ ] 机器学习异常检测
- [ ] 动态聚合策略
- [ ] 分布式聚合节点

---

## 📞 技术支持

如有问题，请参考：
- [TRON 开发文档](https://developers.tron.network/)
- [x402 协议规范](https://x402.org/)
- [项目 README](./README.md)

---

**版本**: 1.0  
**创建日期**: 2026-02-09  
**状态**: ✅ 已实现并测试

