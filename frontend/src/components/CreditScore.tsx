import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CreditScore.css';

interface CreditResult {
  address: string;
  credit_score: number;
  credit_level: {
    key: string;
    name: string;
    color: string;
  };
  user_tags: string[];
  transaction_stats: {
    account_age_days: number;
    total_transactions: number;
    completed_transactions: number;
    completion_rate: number;
    total_volume: number;
    avg_transaction_value: number;
    disputes_initiated: number;
    positive_reviews: number;
    negative_reviews: number;
    avg_response_time: number;
    last_active_days: number;
  };
  trading_advice: {
    recommended: boolean;
    confidence: number;
    reasons: string[];
    suggestions: string[];
  };
  ai_analysis: string;
}

export const CreditScore = () => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CreditResult | null>(null);

  const handleAnalyze = async () => {
    if (!address) {
      alert('请输入用户地址');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_AI_API_URL || 'http://47.93.166.48:8000';
      const creditApiUrl = apiUrl.replace(':8000', ':8003');
      
      const response = await fetch(`${creditApiUrl}/api/credit/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address })
      });

      if (!response.ok) {
        throw new Error('Credit analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Credit analysis error:', error);
      alert('信用评分服务暂时不可用，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return '#f59e0b';
    if (score >= 600) return '#10b981';
    if (score >= 300) return '#3b82f6';
    return '#6b7280';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 800) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    if (score >= 600) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (score >= 300) return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
    return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
  };

  return (
    <div className="credit-container">
      <div className="credit-header">
        <h1 className="credit-title">🏆 智能身份信用评分</h1>
        <p className="credit-subtitle">基于链上行为的可信度分析</p>
      </div>

      <div className="credit-content">
        {/* 输入区域 */}
        <div className="credit-input-section">
          <div className="input-card">
            <label className="input-label">用户地址</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... 或 cfx:..."
              className="address-input"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="analyze-btn"
            >
              {isAnalyzing ? (
                <>
                  <span className="spinner"></span>
                  分析中...
                </>
              ) : (
                '🔍 分析信用'
              )}
            </button>
          </div>

          {/* 快速测试地址 */}
          <div className="quick-test-section">
            <h3 className="quick-test-title">快速测试</h3>
            <div className="test-addresses">
              <button
                onClick={() => setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')}
                className="test-address-btn"
              >
                优秀用户示例
              </button>
              <button
                onClick={() => setAddress('0x0000000000000000000000000000000000000001')}
                className="test-address-btn"
              >
                新手用户示例
              </button>
              <button
                onClick={() => setAddress('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed')}
                className="test-address-btn"
              >
                普通用户示例
              </button>
            </div>
          </div>
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="credit-result-section">
            {/* 信用评分卡片 */}
            <div className="score-card">
              <div
                className="score-circle"
                style={{
                  background: getScoreGradient(result.credit_score),
                  boxShadow: `0 8px 32px ${getScoreColor(result.credit_score)}40`
                }}
              >
                <div className="score-number">{result.credit_score}</div>
                <div className="score-max">/1000</div>
              </div>
              <div
                className="credit-level-badge"
                style={{
                  background: result.credit_level.color,
                  boxShadow: `0 4px 16px ${result.credit_level.color}40`
                }}
              >
                {result.credit_level.name}
              </div>
            </div>

            {/* 用户标签 */}
            <div className="tags-section">
              <h3 className="section-title">🏷️ 用户画像</h3>
              <div className="tags-container">
                {result.user_tags.map((tag, index) => (
                  <span key={index} className="user-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 交易统计 */}
            <div className="stats-section">
              <h3 className="section-title">📊 交易统计</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">账户年龄</div>
                  <div className="stat-value">
                    {result.transaction_stats.account_age_days} 天
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">总交易</div>
                  <div className="stat-value">
                    {result.transaction_stats.total_transactions} 笔
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">完成率</div>
                  <div className="stat-value">
                    {result.transaction_stats.completion_rate}%
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">交易总额</div>
                  <div className="stat-value">
                    {result.transaction_stats.total_volume.toFixed(0)} cUSD
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">平均交易</div>
                  <div className="stat-value">
                    {result.transaction_stats.avg_transaction_value.toFixed(0)} cUSD
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">纠纷次数</div>
                  <div className="stat-value">
                    {result.transaction_stats.disputes_initiated} 次
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">好评数</div>
                  <div className="stat-value">
                    {result.transaction_stats.positive_reviews} 个
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">差评数</div>
                  <div className="stat-value">
                    {result.transaction_stats.negative_reviews} 个
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">响应时间</div>
                  <div className="stat-value">
                    {result.transaction_stats.avg_response_time.toFixed(1)} 小时
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">最后活跃</div>
                  <div className="stat-value">
                    {result.transaction_stats.last_active_days} 天前
                  </div>
                </div>
              </div>
            </div>

            {/* 交易建议 */}
            <div className="advice-section">
              <h3 className="section-title">💡 交易建议</h3>
              <div
                className="recommendation-box"
                style={{
                  borderLeft: `4px solid ${result.trading_advice.recommended ? '#10b981' : '#ef4444'}`
                }}
              >
                <div className="recommendation-header">
                  <span className={`recommendation-status ${result.trading_advice.recommended ? 'positive' : 'negative'}`}>
                    {result.trading_advice.recommended ? '✅ 推荐交易' : '❌ 不推荐交易'}
                  </span>
                  <span className="confidence-badge">
                    置信度: {result.trading_advice.confidence}%
                  </span>
                </div>

                <div className="reasons-list">
                  <h4 className="reasons-title">分析理由：</h4>
                  {result.trading_advice.reasons.map((reason, index) => (
                    <div key={index} className="reason-item">
                      {reason}
                    </div>
                  ))}
                </div>

                <div className="suggestions-list">
                  <h4 className="suggestions-title">操作建议：</h4>
                  {result.trading_advice.suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI 分析 */}
            {result.ai_analysis && result.ai_analysis !== 'AI 分析失败' && (
              <div className="ai-analysis-section">
                <h3 className="section-title">🤖 AI 深度分析</h3>
                <div className="ai-analysis-box">
                  {result.ai_analysis}
                </div>
              </div>
            )}

            {/* 地址信息 */}
            <div className="address-info">
              <span className="address-label">分析地址:</span>
              <span className="address-value">{result.address}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
