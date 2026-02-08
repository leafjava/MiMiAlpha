import { useState } from 'react';
import './ModelMarket.css';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  type: 'gold' | 'crypto' | 'stock' | 'forex';
  sharpeRatio: number;
  accuracy: number;
  totalSignals: number;
  pricePerSignal: number;
  monthlySubscription: number;
  stakedAmount: number;
  avgConfidence: number;
  recentSignals: {
    date: string;
    prediction: string;
    confidence: number;
    result: 'accurate' | 'inaccurate' | 'pending';
  }[];
}

const mockModels: Model[] = [
  {
    id: '1',
    name: '黄金价格预测模型',
    provider: '0x1234...5678',
    description: '基于机器学习的黄金价格预测模型，夏普比率 2.5，历史准确率 82%',
    type: 'gold',
    sharpeRatio: 2.5,
    accuracy: 82,
    totalSignals: 100,
    pricePerSignal: 500,
    monthlySubscription: 5000,
    stakedAmount: 10000,
    avgConfidence: 78,
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ $2,100', confidence: 85, result: 'accurate' },
      { date: '2024-02-06', prediction: 'HOLD', confidence: 72, result: 'accurate' },
      { date: '2024-02-05', prediction: 'SELL @ $2,050', confidence: 80, result: 'accurate' },
    ]
  },
  {
    id: '2',
    name: 'BTC 趋势预测',
    provider: '0xabcd...ef01',
    description: '比特币短期趋势预测，专注于 4 小时级别波动捕捉',
    type: 'crypto',
    sharpeRatio: 1.8,
    accuracy: 75,
    totalSignals: 150,
    pricePerSignal: 300,
    monthlySubscription: 3000,
    stakedAmount: 8000,
    avgConfidence: 72,
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ $45,000', confidence: 78, result: 'pending' },
      { date: '2024-02-06', prediction: 'SELL @ $44,500', confidence: 75, result: 'accurate' },
    ]
  },
  {
    id: '3',
    name: '美股大盘指数模型',
    provider: '0x9876...5432',
    description: 'S&P 500 指数日内波动预测，适合日内交易者',
    type: 'stock',
    sharpeRatio: 2.1,
    accuracy: 79,
    totalSignals: 80,
    pricePerSignal: 400,
    monthlySubscription: 4000,
    stakedAmount: 12000,
    avgConfidence: 76,
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ 4,850', confidence: 82, result: 'pending' },
    ]
  }
];

export function ModelMarket() {
  const [activeTab, setActiveTab] = useState<'browse' | 'publish'>('browse');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'gold' | 'crypto' | 'stock' | 'forex'>('all');

  const filteredModels = filterType === 'all' 
    ? mockModels 
    : mockModels.filter(m => m.type === filterType);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'gold': return '🥇';
      case 'crypto': return '₿';
      case 'stock': return '📈';
      case 'forex': return '💱';
      default: return '📊';
    }
  };

  const getResultBadge = (result: string) => {
    switch(result) {
      case 'accurate': return <span className="result-badge accurate">✓ 准确</span>;
      case 'inaccurate': return <span className="result-badge inaccurate">✗ 偏差</span>;
      case 'pending': return <span className="result-badge pending">⏳ 待验证</span>;
      default: return null;
    }
  };

  return (
    <div className="model-market">
      {/* Hero Section */}
      <div className="model-hero">
        <div className="model-hero-content">
          <h1>🧠 引擎 B：量化模型信号交易</h1>
          <p className="model-hero-subtitle">
            AI 版彭博终端 - 低频高额，链上业绩追溯
          </p>
          <div className="model-hero-stats">
            <div className="stat-item">
              <div className="stat-value">100+</div>
              <div className="stat-label">活跃模型</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$2.5M</div>
              <div className="stat-label">月交易额</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">82%</div>
              <div className="stat-label">平均准确率</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">2.3</div>
              <div className="stat-label">平均夏普比率</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="model-tabs">
        <button
          className={`model-tab ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 浏览模型
        </button>
        <button
          className={`model-tab ${activeTab === 'publish' ? 'active' : ''}`}
          onClick={() => setActiveTab('publish')}
        >
          📤 发布模型
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="model-browse">
          {/* Filters */}
          <div className="model-filters">
            <button
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              全部
            </button>
            <button
              className={`filter-btn ${filterType === 'gold' ? 'active' : ''}`}
              onClick={() => setFilterType('gold')}
            >
              🥇 黄金
            </button>
            <button
              className={`filter-btn ${filterType === 'crypto' ? 'active' : ''}`}
              onClick={() => setFilterType('crypto')}
            >
              ₿ 加密货币
            </button>
            <button
              className={`filter-btn ${filterType === 'stock' ? 'active' : ''}`}
              onClick={() => setFilterType('stock')}
            >
              📈 股票
            </button>
            <button
              className={`filter-btn ${filterType === 'forex' ? 'active' : ''}`}
              onClick={() => setFilterType('forex')}
            >
              💱 外汇
            </button>
          </div>

          {/* Model Grid */}
          <div className="model-grid">
            {filteredModels.map(model => (
              <div key={model.id} className="model-card">
                <div className="model-card-header">
                  <div className="model-type-icon">{getTypeIcon(model.type)}</div>
                  <h3>{model.name}</h3>
                </div>
                
                <div className="model-provider">
                  提供者: <span className="provider-address">{model.provider}</span>
                </div>
                
                <p className="model-description">{model.description}</p>
                
                <div className="model-metrics">
                  <div className="metric">
                    <span className="metric-label">夏普比率</span>
                    <span className="metric-value sharpe">{model.sharpeRatio}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">准确率</span>
                    <span className="metric-value accuracy">{model.accuracy}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">总信号</span>
                    <span className="metric-value">{model.totalSignals}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">平均置信度</span>
                    <span className="metric-value">{model.avgConfidence}%</span>
                  </div>
                </div>

                <div className="model-pricing">
                  <div className="price-option">
                    <span className="price-label">单次信号</span>
                    <span className="price-value">${model.pricePerSignal}</span>
                  </div>
                  <div className="price-option">
                    <span className="price-label">月度订阅</span>
                    <span className="price-value">${model.monthlySubscription}</span>
                  </div>
                </div>

                <div className="model-stake">
                  🔒 质押金额: <strong>${model.stakedAmount.toLocaleString()}</strong>
                </div>

                <button
                  className="view-details-btn"
                  onClick={() => setSelectedModel(model)}
                >
                  查看详情 & 订阅
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publish Tab */}
      {activeTab === 'publish' && (
        <div className="model-publish">
          <div className="publish-container">
            <h2>📤 发布你的量化模型</h2>
            <p className="publish-subtitle">
              将你的高夏普比率模型变现，通过链上业绩追溯建立信任
            </p>

            <div className="publish-form">
              <div className="form-group">
                <label>模型名称</label>
                <input type="text" placeholder="例如：黄金价格预测模型" />
              </div>

              <div className="form-group">
                <label>模型类型</label>
                <select>
                  <option value="gold">🥇 黄金</option>
                  <option value="crypto">₿ 加密货币</option>
                  <option value="stock">📈 股票</option>
                  <option value="forex">💱 外汇</option>
                </select>
              </div>

              <div className="form-group">
                <label>模型描述</label>
                <textarea 
                  rows={4} 
                  placeholder="描述你的模型策略、适用场景、历史表现等..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>单次信号价格 (USDT)</label>
                  <input type="number" placeholder="500" />
                </div>
                <div className="form-group">
                  <label>月度订阅价格 (USDT)</label>
                  <input type="number" placeholder="5000" />
                </div>
              </div>

              <div className="form-group">
                <label>质押金额 (USDT)</label>
                <input type="number" placeholder="最低 1000 USDT" />
                <small className="form-hint">
                  质押金用于保证信号质量，如果连续出现错误信号将被罚没
                </small>
              </div>

              <div className="stake-info">
                <h3>💎 质押机制说明</h3>
                <ul>
                  <li>✓ 最低质押：1,000 USDT</li>
                  <li>✓ 信号准确率 &lt; 70%：罚没 10%</li>
                  <li>✓ 连续 3 次错误：自动退款订阅者 50%</li>
                  <li>✓ 质押金不足：模型自动暂停</li>
                </ul>
              </div>

              <div className="track-record-info">
                <h3>📊 链上业绩追溯</h3>
                <p>
                  每笔信号预测和实际结果都会记录在 TRON 链上，形成不可篡改的业绩记录。
                  机构可以验证你的历史表现，建立信任。
                </p>
              </div>

              <button className="publish-btn">
                发布模型并质押
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Detail Modal */}
      {selectedModel && (
        <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedModel(null)}>
              ✕
            </button>

            <div className="modal-header">
              <div className="modal-type-icon">{getTypeIcon(selectedModel.type)}</div>
              <h2>{selectedModel.name}</h2>
            </div>

            <div className="modal-provider">
              提供者: <span>{selectedModel.provider}</span>
            </div>

            <p className="modal-description">{selectedModel.description}</p>

            <div className="modal-metrics-grid">
              <div className="modal-metric">
                <div className="modal-metric-label">夏普比率</div>
                <div className="modal-metric-value sharpe">{selectedModel.sharpeRatio}</div>
              </div>
              <div className="modal-metric">
                <div className="modal-metric-label">准确率</div>
                <div className="modal-metric-value accuracy">{selectedModel.accuracy}%</div>
              </div>
              <div className="modal-metric">
                <div className="modal-metric-label">总信号数</div>
                <div className="modal-metric-value">{selectedModel.totalSignals}</div>
              </div>
              <div className="modal-metric">
                <div className="modal-metric-label">平均置信度</div>
                <div className="modal-metric-value">{selectedModel.avgConfidence}%</div>
              </div>
            </div>

            <div className="modal-stake-info">
              🔒 质押金额: <strong>${selectedModel.stakedAmount.toLocaleString()}</strong>
              <span className="stake-tooltip">
                质押金保证信号质量，错误信号将被罚没
              </span>
            </div>

            <div className="recent-signals">
              <h3>📈 近期信号</h3>
              <div className="signals-list">
                {selectedModel.recentSignals.map((signal, idx) => (
                  <div key={idx} className="signal-item">
                    <div className="signal-date">{signal.date}</div>
                    <div className="signal-prediction">{signal.prediction}</div>
                    <div className="signal-confidence">
                      置信度: <strong>{signal.confidence}%</strong>
                    </div>
                    {getResultBadge(signal.result)}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-pricing">
              <div className="pricing-option">
                <h4>单次购买</h4>
                <div className="pricing-value">${selectedModel.pricePerSignal}</div>
                <p>购买单个信号</p>
                <button className="subscribe-btn secondary">
                  购买信号
                </button>
              </div>
              <div className="pricing-option featured">
                <div className="featured-badge">推荐</div>
                <h4>月度订阅</h4>
                <div className="pricing-value">${selectedModel.monthlySubscription}</div>
                <p>无限制接收所有信号</p>
                <button className="subscribe-btn primary">
                  立即订阅
                </button>
              </div>
            </div>

            <div className="modal-guarantee">
              <h4>🛡️ 质量保证</h4>
              <ul>
                <li>✓ 链上业绩可验证</li>
                <li>✓ 错误信号自动退款</li>
                <li>✓ 质押金保障</li>
                <li>✓ Smart Facilitator 监管</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
