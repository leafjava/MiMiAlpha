import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useSmartFacilitator } from '../hooks/useSmartFacilitator';
import { formatEther } from 'viem';
import './AgentManager.css';

export function AgentManager() {
  const { account, isConnected } = useContract();
  const { 
    createAgent, 
    depositFunds, 
    agentInfo,
    quotaUsage,
    refetchAgentInfo,
    refetchQuota,
    loading,
    isSuccess,
    hash
  } = useSmartFacilitator();

  const [agentName, setAgentName] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // 监听交易成功
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      refetchAgentInfo();
      refetchQuota();
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isSuccess, refetchAgentInfo, refetchQuota]);

  const handleCreateAgent = async () => {
    if (!account || !agentName) return;
    try {
      await createAgent(account, agentName);
    } catch (error: any) {
      alert('创建失败：' + error.message);
    }
  };

  const handleDeposit = async () => {
    if (!account || !depositAmount) return;
    try {
      await depositFunds(account, depositAmount);
    } catch (error: any) {
      alert('充值失败：' + error.message);
    }
  };

  if (!isConnected) {
    return (
      <div className="agent-manager">
        <div className="not-connected">
          <h2>🤖 AI Agent 管理</h2>
          <p>请先连接钱包以使用 Agent 功能</p>
        </div>
      </div>
    );
  }

  if (!agentInfo || !agentInfo.active) {
    return (
      <div className="agent-manager">
        <div className="create-agent-section">
          <div className="ainft-badge">
            <div className="badge-icon">🤝</div>
            <div className="badge-text">
              <div className="badge-title">基于 AINFT Agent Framework</div>
              <div className="badge-subtitle">TRON 官方 MAS 框架</div>
            </div>
          </div>

          <h2>🤖 创建 AI Agent</h2>
          <p className="description">
            基于 AINFT MAS 框架构建您的 AI Agent，享受官方生态支持
          </p>
          
          <div className="form-group">
            <label>Agent 名称</label>
            <input
              type="text"
              placeholder="例如：我的采购 Agent"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="agent-input"
            />
          </div>
          
          <button 
            onClick={handleCreateAgent} 
            disabled={loading || !agentName}
            className="create-button"
          >
            {loading ? '创建中...' : '创建 Agent'}
          </button>

          {hash && (
            <div className="tx-info">
              <p>交易哈希: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
            </div>
          )}

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>财务治理</h4>
              <p>Smart Facilitator 实时监控</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>配额管理</h4>
              <p>日限额和月限额自动控制</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>微支付聚合</h4>
              <p>批量结算节省 Gas</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-manager">
      <div className="ainft-badge">
        <div className="badge-icon">🤝</div>
        <div className="badge-text">
          <div className="badge-title">基于 AINFT Agent Framework</div>
          <div className="badge-subtitle">官方 MAS 框架实时审计</div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✅ 交易成功！
        </div>
      )}

      <h2>🤖 AI Agent 管理</h2>
      
      {/* Agent 信息 */}
      <div className="agent-info-card">
        <div className="card-header">
          <h3>{agentInfo.name}</h3>
          <span className="status-badge active">● 活跃</span>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">地址</span>
            <span className="info-value">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">余额</span>
            <span className="info-value highlight">{formatEther(agentInfo.balance)} cUSD</span>
          </div>
          <div className="info-item">
            <span className="info-label">累计消费</span>
            <span className="info-value">{formatEther(agentInfo.totalSpent)} cUSD</span>
          </div>
          <div className="info-item">
            <span className="info-label">交易次数</span>
            <span className="info-value">{agentInfo.transactionCount.toString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">信用评分</span>
            <span className="info-value credit-score">
              {agentInfo.creditScore.toString()} / 1000
            </span>
          </div>
        </div>
      </div>

      {/* 配额使用情况 */}
      {quotaUsage && (
        <div className="quota-card">
          <h3>📊 配额使用情况</h3>
          
          <div className="quota-section">
            <div className="quota-header">
              <span>日限额</span>
              <span>{Number(quotaUsage.dailySpent) / 1e6} / {Number(quotaUsage.dailyLimit) / 1e6} USDT</span>
            </div>
            <div className="quota-bar">
              <div 
                className="quota-fill"
                style={{ 
                  width: `${(Number(quotaUsage.dailySpent) / Number(quotaUsage.dailyLimit)) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="quota-section">
            <div className="quota-header">
              <span>月限额</span>
              <span>{Number(quotaUsage.monthlySpent) / 1e6} / {Number(quotaUsage.monthlyLimit) / 1e6} USDT</span>
            </div>
            <div className="quota-bar">
              <div 
                className="quota-fill"
                style={{ 
                  width: `${(Number(quotaUsage.monthlySpent) / Number(quotaUsage.monthlyLimit)) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 充值 */}
      <div className="deposit-card">
        <h3>💰 充值</h3>
        <p className="deposit-description">为您的 Agent 充值以执行支付操作</p>
        
        <div className="deposit-form">
          <input
            type="number"
            placeholder="充值金额（cUSD）"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="deposit-input"
            step="0.1"
            min="0"
          />
          <button 
            onClick={handleDeposit} 
            disabled={loading || !depositAmount}
            className="deposit-button"
          >
            {loading ? '充值中...' : '充值'}
          </button>
        </div>

        <div className="quick-amounts">
          <button onClick={() => setDepositAmount('10')} className="quick-btn">10 cUSD</button>
          <button onClick={() => setDepositAmount('50')} className="quick-btn">50 cUSD</button>
          <button onClick={() => setDepositAmount('100')} className="quick-btn">100 cUSD</button>
        </div>

        {hash && (
          <div className="tx-info">
            <p>交易哈希: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
          </div>
        )}
      </div>

      {/* 核心叙事 */}
      <div className="narrative-card">
        <h3>🎯 智能互联网的财务治理层</h3>
        <p>
          响应 TRON 2025 战略升级，MiMiAlpha 致力于解决
          "智能互联网"时代最核心的矛盾：
          <strong>AI Agent 自主决策的高频性与人类资产安全的确定性之间的平衡</strong>。
        </p>
        <div className="narrative-features">
          <div className="narrative-item">
            <span className="narrative-icon">🤖</span>
            <span>Agent 自主决策</span>
          </div>
          <div className="narrative-item">
            <span className="narrative-icon">🔒</span>
            <span>资产安全保障</span>
          </div>
          <div className="narrative-item">
            <span className="narrative-icon">⚡</span>
            <span>高频微支付</span>
          </div>
          <div className="narrative-item">
            <span className="narrative-icon">📊</span>
            <span>实时审计流</span>
          </div>
        </div>
      </div>
    </div>
  );
}
