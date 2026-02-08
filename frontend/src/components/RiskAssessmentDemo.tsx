import { useState } from 'react';
import './RiskAssessment.css';

interface TransactionHistory {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'failed';
}

interface BlacklistCheck {
  address: string;
  is_blacklisted: boolean;
  risk_tags: string[];
  reported_count: number;
  last_reported: string;
}

interface FundFlow {
  total_in: string;
  total_out: string;
  transaction_count: number;
  unique_addresses: number;
  suspicious_patterns: string[];
}

interface AddressRelation {
  address: string;
  relation_type: string;
  interaction_count: number;
  total_value: string;
  risk_level: 'low' | 'medium' | 'high';
}

export const RiskAssessment = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'blacklist' | 'flow' | 'relation'>('basic');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 模拟数据
  const mockTransactions: TransactionHistory[] = [
    {
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      from: '0xabcd1234567890abcdef1234567890abcdef1234',
      to: '0x9876543210fedcba9876543210fedcba98765432',
      value: '100 USDD',
      timestamp: Date.now() - 3600000,
      status: 'success'
    },
    {
      hash: '0x2345678901bcdef02345678901bcdef023456789',
      from: '0xbcde2345678901bcdef02345678901bcdef02345',
      to: '0xabcd1234567890abcdef1234567890abcdef1234',
      value: '50 USDD',
      timestamp: Date.now() - 7200000,
      status: 'success'
    },
    {
      hash: '0x3456789012cdef013456789012cdef0134567890',
      from: '0xabcd1234567890abcdef1234567890abcdef1234',
      to: '0xcdef3456789012cdef013456789012cdef013456',
      value: '200 USDD',
      timestamp: Date.now() - 10800000,
      status: 'failed'
    }
  ];

  const mockBlacklist: BlacklistCheck = {
    address: '0xabcd1234567890abcdef1234567890abcdef1234',
    is_blacklisted: false,
    risk_tags: ['高频交易', '新地址'],
    reported_count: 0,
    last_reported: 'N/A'
  };

  const mockFundFlow: FundFlow = {
    total_in: '5,000 USDD',
    total_out: '3,500 USDD',
    transaction_count: 156,
    unique_addresses: 42,
    suspicious_patterns: [
      '检测到高频小额转账（可能是洗钱行为）',
      '与已知风险地址有交互',
      '存在异常交易时间模式'
    ]
  };

  const mockRelations: AddressRelation[] = [
    {
      address: '0xabcd1234567890abcdef1234567890abcdef1234',
      relation_type: '频繁交易对手',
      interaction_count: 25,
      total_value: '1,200 USDD',
      risk_level: 'low'
    },
    {
      address: '0xbcde2345678901bcdef02345678901bcdef02345',
      relation_type: '资金中转地址',
      interaction_count: 8,
      total_value: '5,000 USDD',
      risk_level: 'medium'
    },
    {
      address: '0xcdef3456789012cdef013456789012cdef013456',
      relation_type: '可疑关联地址',
      interaction_count: 3,
      total_value: '10,000 USDD',
      risk_level: 'high'
    }
  ];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab !== 'basic' && !address) {
      alert('请先输入地址');
      setActiveTab('basic');
    }
  };

  const handleAnalyze = () => {
    if (!address) {
      alert('请输入地址');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('分析完成！请切换到其他标签查看详细信息');
    }, 1000);
  };

  return (
    <div className="risk-assessment-container">
      <div className="risk-header">
        <h1 className="risk-title">智能风险评估系统</h1>
        <p className="risk-subtitle">AI 驱动的交易风险分析与预警</p>
      </div>

      {/* 标签页导航 */}
      <div className="risk-tabs">
        <button 
          className={`risk-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          📊 基础评估
        </button>
        <button 
          className={`risk-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          📜 历史交易
        </button>
        <button 
          className={`risk-tab ${activeTab === 'blacklist' ? 'active' : ''}`}
          onClick={() => handleTabChange('blacklist')}
        >
          🚫 黑名单检测
        </button>
        <button 
          className={`risk-tab ${activeTab === 'flow' ? 'active' : ''}`}
          onClick={() => handleTabChange('flow')}
        >
          💰 资金流动
        </button>
        <button 
          className={`risk-tab ${activeTab === 'relation' ? 'active' : ''}`}
          onClick={() => handleTabChange('relation')}
        >
          🔗 地址关联
        </button>
      </div>

      <div className="risk-content">
        {/* 基础评估 */}
        {activeTab === 'basic' && (
          <div className="risk-form-card">
            <div className="form-group">
              <label>地址</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="risk-input"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="analyze-button"
            >
              {isLoading ? '分析中...' : '开始分析'}
            </button>
            <p style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
              💡 提示：输入地址后点击分析，然后切换到其他标签查看详细信息
            </p>
          </div>
        )}

        {/* 历史交易 */}
        {activeTab === 'history' && (
          <div className="transaction-list">
            {mockTransactions.map((tx, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-hash">
                  交易哈希: {formatAddress(tx.hash)}
                </div>
                <div className="transaction-addresses">
                  <span>从: {formatAddress(tx.from)}</span>
                  <span>→</span>
                  <span>到: {formatAddress(tx.to)}</span>
                </div>
                <div className="transaction-value">{tx.value}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div className="transaction-time">{formatTime(tx.timestamp)}</div>
                  <span className={`transaction-status ${tx.status}`}>
                    {tx.status === 'success' ? '✅ 成功' : '❌ 失败'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 黑名单检测 */}
        {activeTab === 'blacklist' && (
          <div className="blacklist-result">
            <div className="blacklist-status">
              <div className="blacklist-icon">
                {mockBlacklist.is_blacklisted ? '❌' : '✅'}
              </div>
              <div className={`blacklist-text ${mockBlacklist.is_blacklisted ? 'danger' : 'safe'}`}>
                <h3>{mockBlacklist.is_blacklisted ? '风险地址' : '安全地址'}</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                  {formatAddress(mockBlacklist.address)}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#FFA500', marginBottom: '0.75rem' }}>风险标签</h4>
              <div className="risk-tags">
                {mockBlacklist.risk_tags.map((tag, index) => (
                  <span key={index} className="risk-tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="blacklist-stats">
              <div className="blacklist-stat">
                <div className="blacklist-stat-label">被举报次数</div>
                <div className="blacklist-stat-value">{mockBlacklist.reported_count}</div>
              </div>
              <div className="blacklist-stat">
                <div className="blacklist-stat-label">最后举报时间</div>
                <div className="blacklist-stat-value">{mockBlacklist.last_reported}</div>
              </div>
            </div>
          </div>
        )}

        {/* 资金流动 */}
        {activeTab === 'flow' && (
          <div>
            <div className="fund-flow-stats">
              <div className="fund-flow-card">
                <div className="fund-flow-label">总流入</div>
                <div className="fund-flow-value">{mockFundFlow.total_in}</div>
              </div>
              <div className="fund-flow-card">
                <div className="fund-flow-label">总流出</div>
                <div className="fund-flow-value">{mockFundFlow.total_out}</div>
              </div>
              <div className="fund-flow-card">
                <div className="fund-flow-label">交易笔数</div>
                <div className="fund-flow-value">{mockFundFlow.transaction_count}</div>
              </div>
              <div className="fund-flow-card">
                <div className="fund-flow-label">关联地址数</div>
                <div className="fund-flow-value">{mockFundFlow.unique_addresses}</div>
              </div>
            </div>

            <div className="suspicious-patterns">
              <h3>⚠️ 可疑模式检测</h3>
              <ul className="pattern-list">
                {mockFundFlow.suspicious_patterns.map((pattern, index) => (
                  <li key={index} className="pattern-item">
                    <span className="pattern-icon">🚨</span>
                    <span className="pattern-text">{pattern}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 地址关联 */}
        {activeTab === 'relation' && (
          <div className="relation-list">
            {mockRelations.map((relation, index) => (
              <div key={index} className="relation-item">
                <div className="relation-header">
                  <div className="relation-address">
                    {formatAddress(relation.address)}
                  </div>
                  <span className={`relation-risk-badge ${relation.risk_level}`}>
                    {relation.risk_level === 'low' && '🟢 低风险'}
                    {relation.risk_level === 'medium' && '🟡 中风险'}
                    {relation.risk_level === 'high' && '🔴 高风险'}
                  </span>
                </div>
                <div className="relation-details">
                  <div className="relation-detail">
                    <div className="relation-detail-label">关系类型</div>
                    <div className="relation-detail-value">{relation.relation_type}</div>
                  </div>
                  <div className="relation-detail">
                    <div className="relation-detail-label">交互次数</div>
                    <div className="relation-detail-value">{relation.interaction_count}</div>
                  </div>
                  <div className="relation-detail">
                    <div className="relation-detail-label">总交易金额</div>
                    <div className="relation-detail-value">{relation.total_value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
