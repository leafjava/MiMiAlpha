import { useState, useEffect } from 'react';
import './InvestmentPool.css';

interface VaultStats {
  tvl: number;
  assets_value: number;
  cash_balance: number;
  total_investors: number;
  days_running: number;
}

interface Returns {
  monthly_return: number;
  apy: number;
}

interface YieldOverview {
  vault_stats: VaultStats;
  monthly_revenue: {
    trading_profit: number;
    rental_income: number;
    total: number;
  };
  fees: {
    management_fee: number;
    performance_fee: number;
    total_fees: number;
  };
  net_revenue: number;
  returns: Returns;
}

interface Asset {
  name: string;
  icon: string;
  quantity: number;
  unit_value: number;
  total_value: number;
  percentage: number;
}

export function InvestmentPool() {
  const [overview, setOverview] = useState<YieldOverview | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState('1000');
  const [calculatedYield, setCalculatedYield] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 获取收益总览
      const overviewRes = await fetch('http://localhost:8005/api/yield/overview');
      const overviewData = await overviewRes.json();
      setOverview(overviewData);

      // 获取资产组成
      const assetsRes = await fetch('http://localhost:8005/api/yield/assets');
      const assetsData = await assetsRes.json();
      setAssets(assetsData.assets);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const calculateYield = async () => {
    try {
      const response = await fetch('http://localhost:8005/api/yield/investor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(investAmount),
          days: 30
        })
      });
      const data = await response.json();
      setCalculatedYield(data);
    } catch (error) {
      console.error('Failed to calculate yield:', error);
    }
  };

  if (loading) {
    return <div className="investment-pool-loading">加载中...</div>;
  }

  if (!overview) {
    return <div className="investment-pool-error">数据加载失败</div>;
  }

  return (
    <div className="investment-pool">
      <div className="pool-header">
        <h1>💎 MiMiAlpha - TRON AI 生态的财务治理层</h1>
        <p className="pool-subtitle">
          响应 TRON 2025 战略升级，解决智能互联网时代的核心矛盾
        </p>
        <div className="ainft-vision-card">
          <div className="vision-icon">🎯</div>
          <div className="vision-content">
            <h3>智能互联网的财务治理</h3>
            <p>
              从"价值互联网"到"智能互联网"，MiMiAlpha 致力于解决 AI Agent 自主决策的高频性与人类资产安全的确定性之间的平衡。
            </p>
            <div className="vision-badges">
              <span className="vision-badge">🤝 AINFT MAS Framework</span>
              <span className="vision-badge">🔒 Smart Facilitator 治理</span>
              <span className="vision-badge">📊 量化信号市场</span>
            </div>
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="metrics-grid">
        <div className="metric-card highlight">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-label">总锁仓价值 (TVL)</div>
            <div className="metric-value">${overview.vault_stats.tvl.toLocaleString()}</div>
          </div>
        </div>

        <div className="metric-card highlight">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-label">年化收益率 (APY)</div>
            <div className="metric-value apy">{overview.returns.apy}%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-label">投资者数量</div>
            <div className="metric-value">{overview.vault_stats.total_investors}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-label">运行天数</div>
            <div className="metric-value">{overview.vault_stats.days_running} 天</div>
          </div>
        </div>
      </div>

      {/* 收益来源 */}
      <div className="revenue-section">
        <h2>💵 月度收益来源</h2>
        <div className="revenue-grid">
          <div className="revenue-card">
            <div className="revenue-icon">📊</div>
            <div className="revenue-info">
              <div className="revenue-label">量化信号交易</div>
              <div className="revenue-amount">
                ${overview.monthly_revenue.trading_profit.toLocaleString()}
              </div>
              <div className="revenue-percentage">
                {((overview.monthly_revenue.trading_profit / overview.monthly_revenue.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="revenue-card">
            <div className="revenue-icon">🔒</div>
            <div className="revenue-info">
              <div className="revenue-label">模型订阅收入</div>
              <div className="revenue-amount">
                ${overview.monthly_revenue.rental_income.toLocaleString()}
              </div>
              <div className="revenue-percentage">
                {((overview.monthly_revenue.rental_income / overview.monthly_revenue.total) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="revenue-card total">
            <div className="revenue-icon">💎</div>
            <div className="revenue-info">
              <div className="revenue-label">总收益</div>
              <div className="revenue-amount">
                ${overview.monthly_revenue.total.toLocaleString()}
              </div>
              <div className="revenue-percentage">100%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 费用结构 */}
      <div className="fees-section">
        <h2>💳 费用结构</h2>
        <div className="fees-grid">
          <div className="fee-item">
            <span className="fee-label">管理费 (2% 年化)</span>
            <span className="fee-value">${overview.fees.management_fee.toFixed(2)}</span>
          </div>
          <div className="fee-item">
            <span className="fee-label">表现费 (20% 超额收益)</span>
            <span className="fee-value">${overview.fees.performance_fee.toFixed(2)}</span>
          </div>
          <div className="fee-item total">
            <span className="fee-label">总费用</span>
            <span className="fee-value">${overview.fees.total_fees.toFixed(2)}</span>
          </div>
          <div className="fee-item net">
            <span className="fee-label">净收益</span>
            <span className="fee-value">${overview.net_revenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 资产组成 */}
      <div className="assets-section">
        <h2>📦 资产组成</h2>
        <div className="assets-list">
          {assets.map((asset, index) => {
            // 映射资产名称和图标
            const assetMapping: { [key: string]: { name: string; icon: string } } = {
              'ChatGPT Plus': { name: '黄金价格预测模型', icon: '🥇' },
              'Claude Pro': { name: 'BTC 趋势预测模型', icon: '₿' },
              'VPN Premium': { name: '美股指数预测模型', icon: '📈' },
              'Steam 礼品卡': { name: '外汇波动预测模型', icon: '💱' },
              'Netflix 4K': { name: '商品期货预测模型', icon: '📊' },
              'Spotify Premium': { name: '加密货币预测模型', icon: '🪙' },
              '瑜伽馆会员': { name: '量化策略组合', icon: '🎯' }
            };

            const mappedAsset = assetMapping[asset.name] || { name: asset.name, icon: asset.icon };

            return (
              <div key={index} className="asset-item">
                <div className="asset-icon">{mappedAsset.icon}</div>
                <div className="asset-info">
                  <div className="asset-name">{mappedAsset.name}</div>
                  <div className="asset-quantity">{asset.quantity} 个模型</div>
                </div>
                <div className="asset-value">
                  <div className="asset-total">${asset.total_value.toLocaleString()}</div>
                  <div className="asset-percentage">{asset.percentage.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 投资计算器 */}
      <div className="calculator-section">
        <h2>🧮 收益计算器</h2>
        <div className="calculator-card">
          <div className="calculator-input">
            <label>投资金额 (cUSD)</label>
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder="输入投资金额"
            />
          </div>
          <button onClick={calculateYield} className="calculate-btn">
            计算预期收益
          </button>

          {calculatedYield && (
            <div className="calculator-result">
              <div className="result-item">
                <span>月度收益</span>
                <span className="result-value">
                  ${calculatedYield.revenue.total.toFixed(2)}
                </span>
              </div>
              <div className="result-item">
                <span>收益率</span>
                <span className="result-value">
                  {calculatedYield.revenue.return_rate.toFixed(2)}%
                </span>
              </div>
              <div className="result-item highlight">
                <span>年化收益率 (APY)</span>
                <span className="result-value">
                  {calculatedYield.revenue.apy.toFixed(2)}%
                </span>
              </div>
              <div className="result-item">
                <span>30天后总价值</span>
                <span className="result-value">
                  ${calculatedYield.final_value.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 投资按钮 */}
      <div className="invest-actions">
        <button className="invest-btn primary">
          💰 立即投资
        </button>
        <button className="invest-btn secondary">
          📊 查看详细报告
        </button>
      </div>
    </div>
  );
}
