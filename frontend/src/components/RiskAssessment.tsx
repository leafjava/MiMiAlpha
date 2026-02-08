import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './RiskAssessment.css';

interface RiskResult {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  risk_level_text: string;
  risk_reasons: string[];
  recommendation: string;
  should_continue: boolean;
  suggested_escrow_days: number;
}

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
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    buyer_address: '',
    seller_address: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  
  // 新增状态
  const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'blacklist' | 'flow' | 'relation'>('basic');
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
  const [blacklistCheck, setBlacklistCheck] = useState<BlacklistCheck | null>(null);
  const [fundFlow, setFundFlow] = useState<FundFlow | null>(null);
  const [addressRelations, setAddressRelations] = useState<AddressRelation[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingBlacklist, setIsLoadingBlacklist] = useState(false);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [isLoadingRelation, setIsLoadingRelation] = useState(false);

  const handleAnalyze = async () => {
    if (!formData.amount || !formData.buyer_address || !formData.seller_address) {
      alert(t('common.fill_all'));
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8001/api/risk/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Risk assessment failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Risk assessment error:', error);
      alert(t('common.error', { message: 'Risk assessment service unavailable' }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 查询链上历史交易
  const fetchTransactionHistory = async (address: string) => {
    setIsLoadingHistory(true);
    try {
      // 模拟数据 - 实际应该调用 TRON API
      const mockHistory: TransactionHistory[] = [
        {
          hash: '0x1234...5678',
          from: address,
          to: '0xabcd...ef01',
          value: '100 USDD',
          timestamp: Date.now() - 3600000,
          status: 'success'
        },
        {
          hash: '0x2345...6789',
          from: '0xbcde...f012',
          to: address,
          value: '50 USDD',
          timestamp: Date.now() - 7200000,
          status: 'success'
        },
        {
          hash: '0x3456...789a',
          from: address,
          to: '0xcdef...0123',
          value: '200 USDD',
          timestamp: Date.now() - 10800000,
          status: 'failed'
        }
      ];
      setTransactionHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 黑名单地址检测
  const checkBlacklist = async (address: string) => {
    setIsLoadingBlacklist(true);
    try {
      // 模拟数据 - 实际应该调用黑名单 API
      const mockCheck: BlacklistCheck = {
        address: address,
        is_blacklisted: false,
        risk_tags: ['高频交易', '新地址'],
        reported_count: 0,
        last_reported: 'N/A'
      };
      setBlacklistCheck(mockCheck);
    } catch (error) {
      console.error('Failed to check blacklist:', error);
    } finally {
      setIsLoadingBlacklist(false);
    }
  };

  // 资金流动分析
  const analyzeFundFlow = async (address: string) => {
    setIsLoadingFlow(true);
    try {
      // 模拟数据
      const mockFlow: FundFlow = {
        total_in: '5,000 USDD',
        total_out: '3,500 USDD',
        transaction_count: 156,
        unique_addresses: 42,
        suspicious_patterns: [
          '检测到高频小额转账（可能是洗钱行为）',
          '与已知风险地址有交互'
        ]
      };
      setFundFlow(mockFlow);
    } catch (error) {
      console.error('Failed to analyze fund flow:', error);
    } finally {
      setIsLoadingFlow(false);
    }
  };

  // 地址关联分析
  const analyzeAddressRelations = async (address: string) => {
    setIsLoadingRelation(true);
    try {
      // 模拟数据
      const mockRelations: AddressRelation[] = [
        {
          address: '0xabcd...ef01',
          relation_type: '频繁交易对手',
          interaction_count: 25,
          total_value: '1,200 USDD',
          risk_level: 'low'
        },
        {
          address: '0xbcde...f012',
          relation_type: '资金中转地址',
          interaction_count: 8,
          total_value: '5,000 USDD',
          risk_level: 'medium'
        },
        {
          address: '0xcdef...0123',
          relation_type: '可疑关联地址',
          interaction_count: 3,
          total_value: '10,000 USDD',
          risk_level: 'high'
        }
      ];
      setAddressRelations(mockRelations);
    } catch (error) {
      console.error('Failed to analyze address relations:', error);
    } finally {
      setIsLoadingRelation(false);
    }
  };

  // 切换标签页时加载对应数据
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    const address = formData.seller_address || formData.buyer_address;
    
    if (!address) {
      alert('请先输入地址');
      return;
    }

    switch (tab) {
      case 'history':
        if (transactionHistory.length === 0) {
          fetchTransactionHistory(address);
        }
        break;
      case 'blacklist':
        if (!blacklistCheck) {
          checkBlacklist(address);
        }
        break;
      case 'flow':
        if (!fundFlow) {
          analyzeFundFlow(address);
        }
        break;
      case 'relation':
        if (addressRelations.length === 0) {
          analyzeAddressRelations(address);
        }
        break;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level) {
      case 'low': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'medium': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'high': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
    }
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
        {/* 输入表单 */}
        <div className="risk-form-card">
          <div className="form-group">
            <label>{t('risk.form.amount')}</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="1000"
              className="risk-input"
            />
          </div>

          <div className="form-group">
            <label>{t('risk.form.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('risk.form.description')}
              className="risk-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>{t('risk.form.buyer_address')}</label>
            <input
              type="text"
              value={formData.buyer_address}
              onChange={(e) => setFormData({ ...formData, buyer_address: e.target.value })}
              placeholder="0x..."
              className="risk-input"
            />
          </div>

          <div className="form-group">
            <label>{t('risk.form.seller_address')}</label>
            <input
              type="text"
              value={formData.seller_address}
              onChange={(e) => setFormData({ ...formData, seller_address: e.target.value })}
              placeholder="0x..."
              className="risk-input"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="analyze-button"
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                {t('risk.form.analyzing')}
              </>
            ) : (
              t('risk.form.analyze_btn')
            )}
          </button>
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="risk-result-card">
            <h2 className="result-title">{t('risk.result.title')}</h2>

            {/* 风险评分 */}
            <div className="risk-score-section">
              <div 
                className="risk-score-circle"
                style={{ 
                  background: getRiskGradient(result.risk_level),
                  boxShadow: `0 8px 24px ${getRiskColor(result.risk_level)}40`
                }}
              >
                <div className="score-value">{result.risk_score}</div>
                <div className="score-label">{t('risk.result.score')}</div>
              </div>

              <div className="risk-level-badge" style={{ 
                background: getRiskGradient(result.risk_level),
                boxShadow: `0 4px 12px ${getRiskColor(result.risk_level)}30`
              }}>
                {result.risk_level_text}
              </div>
            </div>

            {/* 风险原因 */}
            <div className="risk-section">
              <h3 className="section-title">{t('risk.result.reasons')}</h3>
              <ul className="risk-reasons-list">
                {result.risk_reasons.map((reason, index) => (
                  <li key={index} className="risk-reason-item">
                    <span className="reason-icon">⚠️</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* 建议 */}
            <div className="risk-section">
              <h3 className="section-title">{t('risk.result.recommendation')}</h3>
              <div className="recommendation-box" style={{
                borderLeft: `4px solid ${getRiskColor(result.risk_level)}`
              }}>
                <p className="recommendation-text">{result.recommendation}</p>
                
                <div className="recommendation-details">
                  <div className="detail-item">
                    <span className="detail-label">{t('risk.result.continue')}:</span>
                    <span className={`detail-value ${result.should_continue ? 'positive' : 'negative'}`}>
                      {result.should_continue ? t('risk.result.yes') : t('risk.result.no')}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">{t('risk.result.escrow_duration')}:</span>
                    <span className="detail-value">
                      {result.suggested_escrow_days} {t('risk.result.days')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
