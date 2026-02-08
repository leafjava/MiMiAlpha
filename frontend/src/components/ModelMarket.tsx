import { useState, useEffect } from 'react';
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
  contractAddress?: string; // TRON 合约地址
  recentSignals: {
    date: string;
    prediction: string;
    confidence: number;
    result: 'accurate' | 'inaccurate' | 'pending';
  }[];
}

interface TronStats {
  trxPrice: number;
  totalTransactions: number;
  totalAccounts: number;
  tps: number;
  blockHeight: number;
  energyPrice: number;
}

const mockModels: Model[] = [
  {
    id: '1',
    name: '黄金价格预测模型',
    provider: 'TJFJTCgJCmq1ghzZEagDTifHNtNgK4rnRL',
    description: '基于机器学习的黄金价格预测模型，夏普比率 2.5，历史准确率 82%',
    type: 'gold',
    sharpeRatio: 2.5,
    accuracy: 82,
    totalSignals: 100,
    pricePerSignal: 5,
    monthlySubscription: 50,
    stakedAmount: 100,
    avgConfidence: 78,
    contractAddress: 'TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL',
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ $2,100', confidence: 85, result: 'accurate' },
      { date: '2024-02-06', prediction: 'HOLD', confidence: 72, result: 'accurate' },
      { date: '2024-02-05', prediction: 'SELL @ $2,050', confidence: 80, result: 'accurate' },
    ]
  },
  {
    id: '2',
    name: 'BTC 趋势预测',
    provider: 'TLPbmb5Qma7yLKJZWjD8PWdVDB6FhXy8Yx',
    description: '比特币短期趋势预测，专注于 4 小时级别波动捕捉',
    type: 'crypto',
    sharpeRatio: 1.8,
    accuracy: 75,
    totalSignals: 150,
    pricePerSignal: 3,
    monthlySubscription: 30,
    stakedAmount: 80,
    avgConfidence: 72,
    contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ $45,000', confidence: 78, result: 'pending' },
      { date: '2024-02-06', prediction: 'SELL @ $44,500', confidence: 75, result: 'accurate' },
    ]
  },
  {
    id: '3',
    name: '美股大盘指数模型',
    provider: 'TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp',
    description: 'S&P 500 指数日内波动预测，适合日内交易者',
    type: 'stock',
    sharpeRatio: 2.1,
    accuracy: 79,
    totalSignals: 80,
    pricePerSignal: 4,
    monthlySubscription: 40,
    stakedAmount: 120,
    avgConfidence: 76,
    contractAddress: 'TUpMhErZL2fhh4sVNULAbNKLokS4GjC1F4',
    recentSignals: [
      { date: '2024-02-07', prediction: 'BUY @ 4,850', confidence: 82, result: 'pending' },
    ]
  }
];

export function ModelMarket() {
  const [activeTab, setActiveTab] = useState<'browse' | 'publish'>('browse');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'gold' | 'crypto' | 'stock' | 'forex'>('all');
  const [tronStats, setTronStats] = useState<TronStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 获取 TRON 链上数据
  useEffect(() => {
    const fetchTronStats = async () => {
      try {
        // 获取 TRX 价格（使用 CoinGecko API）
        const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd');
        const priceData = await priceResponse.json();
        
        // 获取 TRON 网络统计（使用 TronScan API）
        const statsResponse = await fetch('https://apilist.tronscanapi.com/api/system/status');
        const statsData = await statsResponse.json();
        
        setTronStats({
          trxPrice: priceData.tron?.usd || 0.15,
          totalTransactions: statsData.totalTransaction || 8500000000,
          totalAccounts: statsData.totalAddress || 250000000,
          tps: statsData.tps || 2000,
          blockHeight: statsData.blockHeight || 68000000,
          energyPrice: 420, // Sun per Energy unit
        });
      } catch (error) {
        console.error('Failed to fetch TRON stats:', error);
        // 使用默认值
        setTronStats({
          trxPrice: 0.15,
          totalTransactions: 8500000000,
          totalAccounts: 250000000,
          tps: 2000,
          blockHeight: 68000000,
          energyPrice: 420,
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchTronStats();
    // 每 30 秒更新一次
    const interval = setInterval(fetchTronStats, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  return (
    <div className="model-market">
      {/* TRON Network Stats Banner */}
      <div className="tron-stats-banner">
        <div className="tron-stats-container">
          <div className="tron-logo">
            <span className="tron-icon">⚡</span>
            <span className="tron-text">TRON Network</span>
          </div>
          {isLoadingStats ? (
            <div className="stats-loading">加载中...</div>
          ) : tronStats && (
            <div className="tron-stats-grid">
              <div className="tron-stat">
                <div className="tron-stat-label">TRX 价格</div>
                <div className="tron-stat-value">${tronStats.trxPrice.toFixed(4)}</div>
              </div>
              <div className="tron-stat">
                <div className="tron-stat-label">总交易数</div>
                <div className="tron-stat-value">{formatNumber(tronStats.totalTransactions)}</div>
              </div>
              <div className="tron-stat">
                <div className="tron-stat-label">总账户数</div>
                <div className="tron-stat-value">{formatNumber(tronStats.totalAccounts)}</div>
              </div>
              <div className="tron-stat">
                <div className="tron-stat-label">TPS</div>
                <div className="tron-stat-value">{tronStats.tps}</div>
              </div>
              <div className="tron-stat">
                <div className="tron-stat-label">区块高度</div>
                <div className="tron-stat-value">{formatNumber(tronStats.blockHeight)}</div>
              </div>
              <div className="tron-stat">
                <div className="tron-stat-label">Energy 价格</div>
                <div className="tron-stat-value">{tronStats.energyPrice} Sun</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="model-hero">
        <div className="model-hero-content">
          <h1>🧠 量化信号 RWA Token 交易所</h1>
          <p className="model-hero-subtitle">
            基于 TRON 链 · AINFT Nova 资产化平台 · 量化金融领域的首个治理层
          </p>
          <div className="ainft-integration-badge">
            <span className="badge-icon">🤝</span>
            <span className="badge-text">Powered by AINFT Nova & MAS Framework on TRON</span>
          </div>
          <div className="model-hero-stats">
            <div className="stat-item">
              <div className="stat-value">100+</div>
              <div className="stat-label">活跃模型</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$25K</div>
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
          
          {/* x402 Integration Badge */}
          <div className="x402-integration-section">
            <div className="x402-badge">
              <span className="x402-icon">⚡</span>
              <span className="x402-text">Protected by x402 Smart Facilitator</span>
            </div>
            <div className="x402-features">
              <div className="x402-feature">
                <span className="feature-icon">🛡️</span>
                <span className="feature-text">支付拦截与治理</span>
              </div>
              <div className="x402-feature">
                <span className="feature-icon">💰</span>
                <span className="feature-text">微支付聚合优化</span>
              </div>
              <div className="x402-feature">
                <span className="feature-icon">📝</span>
                <span className="feature-text">语义化审计追踪</span>
              </div>
              <div className="x402-feature">
                <span className="feature-icon">⚖️</span>
                <span className="feature-text">动态定价仲裁</span>
              </div>
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
                  提供者: <span className="provider-address" title={model.provider}>{formatAddress(model.provider)}</span>
                </div>
                
                {model.contractAddress && (
                  <div className="model-contract">
                    <span className="contract-label">📜 合约:</span>
                    <a 
                      href={`https://nile.tronscan.org/#/contract/${model.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contract-link"
                      title={model.contractAddress}
                    >
                      {formatAddress(model.contractAddress)}
                    </a>
                  </div>
                )}
                
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

                <div className="x402-protection-badge">
                  <span className="protection-icon">⚡</span>
                  <span className="protection-text">x402 支付保护</span>
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
                <input type="number" placeholder="最低 10 USDT" />
                <small className="form-hint">
                  质押金用于保证信号质量，如果连续出现错误信号将被罚没
                </small>
              </div>

              <div className="stake-info">
                <h3>💎 质押机制说明</h3>
                <ul>
                  <li>✓ 最低质押：10 USDT</li>
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

            <div className="x402-protection-details">
              <h4>⚡ x402 智能支付保护</h4>
              <div className="x402-protection-grid">
                <div className="protection-item">
                  <div className="protection-item-icon">🛡️</div>
                  <div className="protection-item-content">
                    <div className="protection-item-title">支付拦截</div>
                    <div className="protection-item-desc">所有订阅支付经过 Smart Facilitator 验证</div>
                  </div>
                </div>
                <div className="protection-item">
                  <div className="protection-item-icon">💰</div>
                  <div className="protection-item-content">
                    <div className="protection-item-title">限额保护</div>
                    <div className="protection-item-desc">单次支付不超过 $10，月度不超过 $100</div>
                  </div>
                </div>
                <div className="protection-item">
                  <div className="protection-item-icon">📝</div>
                  <div className="protection-item-content">
                    <div className="protection-item-title">审计追踪</div>
                    <div className="protection-item-desc">每笔支付生成人类可读的审计日志</div>
                  </div>
                </div>
                <div className="protection-item">
                  <div className="protection-item-icon">⚖️</div>
                  <div className="protection-item-content">
                    <div className="protection-item-title">价格仲裁</div>
                    <div className="protection-item-desc">自动对比市场均价，异常溢价触发熔断</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
