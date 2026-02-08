import { useState, useEffect } from 'react';
import type { TradingSignal } from '../data/mockSignals';
import { historicalSignals, generateLiveSignal, modelPerformance } from '../data/mockSignals';
import { getRealTimeGoldPrice } from '../services/goldPriceService';
import './LiveTradingSignals.css';

export function LiveTradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>(historicalSignals.slice(0, 6));
  const [isLive, setIsLive] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // 获取实时黄金价格
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const priceData = await getRealTimeGoldPrice();
        setCurrentPrice(priceData.price);
        setPriceChange(priceData.changePercent);
        console.log('💰 当前黄金价格:', priceData.price);
      } catch (error) {
        console.error('获取价格失败:', error);
      }
    };

    fetchPrice();
    // 每分钟更新一次价格
    const priceInterval = setInterval(fetchPrice, 60000);

    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    if (!isLive) return;

    // 模拟实时信号推送（每8秒一个新信号）
    const interval = setInterval(async () => {
      const newSignal = await generateLiveSignal();
      setSignals(prev => [newSignal, ...prev].slice(0, 10));
    }, 8000);

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
          {currentPrice && (
            <div className="current-price-badge">
              <span className="price-label">当前金价:</span>
              <span className="price-value">${currentPrice.toFixed(2)}</span>
              {priceChange !== 0 && (
                <span className={`price-change ${priceChange > 0 ? 'positive' : 'negative'}`}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </div>
        <button 
          className={`toggle-live-btn ${isLive ? 'active' : ''}`}
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? '⏸️ 暂停推送' : '▶️ 开始推送'}
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
          <div className="metric-value">${modelPerformance.totalProfit.toFixed(2)}</div>
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
              {signal.profit !== undefined && (
                <span className={`profit ${signal.profit > 0 ? 'positive' : 'negative'}`}>
                  {signal.profit > 0 ? '+' : ''}{signal.profit.toFixed(2)} USD
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 模型说明 */}
      <div className="model-info-box">
        <h4>📊 模型技术细节</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">算法:</span>
            <span className="info-value">PPO (Proximal Policy Optimization)</span>
          </div>
          <div className="info-item">
            <span className="info-label">特征数:</span>
            <span className="info-value">127 个特征</span>
          </div>
          <div className="info-item">
            <span className="info-label">时间框架:</span>
            <span className="info-value">M5, M15, H1, H4, D1, W1</span>
          </div>
          <div className="info-item">
            <span className="info-label">训练数据:</span>
            <span className="info-value">11 年历史数据 (2015-2026)</span>
          </div>
          <div className="info-item">
            <span className="info-label">宏观数据:</span>
            <span className="info-value">Bitcoin, EUR/USD, VIX, Oil, Silver, GLD</span>
          </div>
          <div className="info-item">
            <span className="info-label">经济日历:</span>
            <span className="info-value">1,104 个重要事件</span>
          </div>
        </div>
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
