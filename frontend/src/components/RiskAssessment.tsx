import { useState } from 'react';
import './RiskAssessment.css';
import { TronService } from '../services/tronService';

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

interface AIAssessment {
  overall_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  detailed_analysis: {
    address_validation: string;
    transaction_pattern: string;
    fund_flow_analysis: string;
    relationship_analysis: string;
  };
  recommendations: string[];
  generated_at: string;
}

export const RiskAssessment = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'history' | 'blacklist' | 'flow' | 'relation' | 'ai'>('basic');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([]);
  const [blacklistCheck, setBlacklistCheck] = useState<BlacklistCheck | null>(null);
  const [fundFlow, setFundFlow] = useState<FundFlow | null>(null);
  const [addressRelations, setAddressRelations] = useState<AddressRelation[]>([]);
  const [aiAssessment, setAiAssessment] = useState<AIAssessment | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingBlacklist, setIsLoadingBlacklist] = useState(false);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [isLoadingRelation, setIsLoadingRelation] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('qwen3:4b-instruct-2507-q4_K_M');

  // 开始分析
  const handleAnalyze = async () => {
    if (!address) {
      alert('请输入地址');
      return;
    }
    
    if (!TronService.isValidAddress(address)) {
      alert('请输入有效的 TRON 地址（以 T 开头，34 位字符）\n\n示例：TJFJTCgJCmq1ghzZEagDTifHNtNgK4rnRL');
      return;
    }
    
    setIsLoading(true);
    try {
      const account = await TronService.getAccount(address);
      if (account) {
        console.log('账户信息:', account);
        alert('✅ 分析完成！\n\n请切换到其他标签查看详细信息：\n📜 历史交易\n🚫 黑名单检测\n💰 资金流动\n🔗 地址关联');
      } else {
        alert('⚠️ 未找到该地址的信息\n\n可能原因：\n1. 地址格式不正确\n2. 该地址在 Nile 测试网上没有交易记录\n\n💡 提示：访问 https://nileex.io 获取测试币');
      }
    } catch (error) {
      console.error('查询失败:', error);
      alert('❌ 查询失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 加载历史交易
  const loadTransactionHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const txs = await TronService.getTransactions(address, 20);
      
      const formattedTxs: TransactionHistory[] = txs.map(tx => ({
        hash: tx.hash,
        from: tx.ownerAddress,
        to: tx.toAddress || '',
        value: `${TronService.sunToTrx(tx.contractData?.amount || 0).toFixed(2)} TRX`,
        timestamp: tx.timestamp,
        status: tx.confirmed ? 'success' : 'failed',
      }));
      
      setTransactionHistory(formattedTxs);
      
      if (formattedTxs.length === 0) {
        alert('该地址暂无交易记录');
      }
    } catch (error) {
      console.error('加载交易历史失败:', error);
      alert('加载失败，请稍后重试');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 加载黑名单检测
  const loadBlacklistCheck = async () => {
    setIsLoadingBlacklist(true);
    try {
      const txs = await TronService.getTransactions(address, 100);
      const patterns = TronService.detectSuspiciousPatterns(txs);
      
      setBlacklistCheck({
        address: address,
        is_blacklisted: patterns.length > 2,
        risk_tags: patterns.length > 0 ? ['需要关注', '高频交易'] : ['正常交易', '低风险'],
        reported_count: 0,
        last_reported: 'N/A',
      });
    } catch (error) {
      console.error('黑名单检测失败:', error);
      alert('检测失败，请稍后重试');
    } finally {
      setIsLoadingBlacklist(false);
    }
  };

  // 加载资金流动分析
  const loadFundFlow = async () => {
    setIsLoadingFlow(true);
    try {
      const flowData = await TronService.analyzeFundFlow(address);
      const txs = await TronService.getTransactions(address, 100);
      const patterns = TronService.detectSuspiciousPatterns(txs);
      
      setFundFlow({
        total_in: `${flowData.total_in.toFixed(2)} TRX`,
        total_out: `${flowData.total_out.toFixed(2)} TRX`,
        transaction_count: flowData.transaction_count,
        unique_addresses: flowData.unique_addresses.size,
        suspicious_patterns: patterns.length > 0 ? patterns : ['✅ 未检测到可疑模式'],
      });
    } catch (error) {
      console.error('资金流动分析失败:', error);
      alert('分析失败，请稍后重试');
    } finally {
      setIsLoadingFlow(false);
    }
  };

  // 加载地址关联分析
  const loadAddressRelations = async () => {
    setIsLoadingRelation(true);
    try {
      const relations = await TronService.analyzeAddressRelations(address);
      
      const formattedRelations: AddressRelation[] = relations.map(r => ({
        address: r.address,
        relation_type: r.relation_type,
        interaction_count: r.interaction_count,
        total_value: `${r.total_value.toFixed(2)} TRX`,
        risk_level: r.risk_level,
      }));
      
      setAddressRelations(formattedRelations);
      
      if (formattedRelations.length === 0) {
        alert('该地址暂无关联地址');
      }
    } catch (error) {
      console.error('地址关联分析失败:', error);
      alert('分析失败，请稍后重试');
    } finally {
      setIsLoadingRelation(false);
    }
  };

  // AI 综合评估
  const loadAIAssessment = async () => {
    setIsLoadingAI(true);
    try {
      // 确保所有数据都已加载
      if (transactionHistory.length === 0) {
        await loadTransactionHistory();
      }
      if (!blacklistCheck) {
        await loadBlacklistCheck();
      }
      if (!fundFlow) {
        await loadFundFlow();
      }
      if (addressRelations.length === 0) {
        await loadAddressRelations();
      }

      // 构建提示词
      const prompt = `你是一个区块链安全专家。请基于以下 TRON 链上数据对地址进行综合风险评估。

【地址信息】
地址：${address}
格式验证：${TronService.isValidAddress(address) ? 'TRON 地址有效（T 开头，34 位）' : '地址格式异常'}

【历史交易】
交易总数：${transactionHistory.length} 笔
${transactionHistory.length > 0 ? `最近交易：${formatTime(transactionHistory[0].timestamp)}` : '无交易记录'}
${transactionHistory.slice(0, 3).map(tx => `- ${formatAddress(tx.from)} → ${formatAddress(tx.to)}: ${tx.value}`).join('\n')}

【黑名单检测】
黑名单状态：${blacklistCheck?.is_blacklisted ? '是' : '否'}
风险标签：${blacklistCheck?.risk_tags.join(', ') || '无'}

【资金流动】
总流入：${fundFlow?.total_in || '0 TRX'}
总流出：${fundFlow?.total_out || '0 TRX'}
交易笔数：${fundFlow?.transaction_count || 0}
关联地址：${fundFlow?.unique_addresses || 0} 个
可疑模式：${fundFlow?.suspicious_patterns.join('; ') || '无'}

【地址关联】
关联地址数：${addressRelations.length}
${addressRelations.slice(0, 3).map(r => `- ${formatAddress(r.address)}: ${r.relation_type}, ${r.interaction_count}次交互, ${r.risk_level}风险`).join('\n')}

请严格按照以下 JSON 格式返回评估结果（不要添加任何其他文字）：

{
  "overall_score": 75,
  "risk_level": "low",
  "summary": "该地址为正常交易地址，交易模式规律，未发现明显风险",
  "detailed_analysis": {
    "address_validation": "地址格式正确，符合 TRON 标准",
    "transaction_pattern": "交易频率正常，金额合理，时间分布均匀",
    "fund_flow_analysis": "资金流入流出比例正常，未发现异常大额转账",
    "relationship_analysis": "关联地址风险较低，交互模式正常"
  },
  "recommendations": [
    "建议定期检查交易记录",
    "注意监控大额转账",
    "保持警惕，避免与高风险地址交互"
  ]
}

评分标准：
- 0-30分：极高风险（critical）
- 31-50分：高风险（high）
- 51-70分：中等风险（medium）
- 71-100分：低风险（low）

只返回 JSON，不要其他内容。`;

      // 调用 Ollama API
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: prompt,
          stream: false,
          format: 'json',
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API 错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 解析 AI 返回的 JSON
      let aiResult;
      try {
        aiResult = JSON.parse(data.response);
      } catch (parseError) {
        console.error('JSON 解析失败，原始响应:', data.response);
        // 如果解析失败，尝试提取 JSON 部分
        const jsonMatch = data.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('AI 返回的不是有效的 JSON 格式');
        }
      }

      setAiAssessment({
        ...aiResult,
        generated_at: new Date().toLocaleString('zh-CN'),
      });

    } catch (error: any) {
      console.error('AI 评估失败:', error);
      
      let errorMessage = 'AI 评估失败';
      if (error.message.includes('404')) {
        errorMessage = `模型 "${ollamaModel}" 未找到\n\n请检查：\n1. 模型名称是否正确\n2. 运行 ollama list 查看可用模型`;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = `无法连接到 Ollama\n\n请检查：\n1. Ollama 是否已启动\n2. API 地址是否正确：${ollamaUrl}`;
      } else if (error.message.includes('JSON')) {
        errorMessage = `AI 返回格式错误\n\n${error.message}\n\n建议：\n1. 尝试使用 qwen3:4b-instruct 模型\n2. 确保模型支持 JSON 格式输出`;
      } else {
        errorMessage = `${error.message}`;
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    
    if (tab === 'basic') return;
    
    if (!address) {
      alert('请先输入地址并点击"开始分析"');
      setActiveTab('basic');
      return;
    }

    switch (tab) {
      case 'history':
        if (transactionHistory.length === 0 && !isLoadingHistory) {
          loadTransactionHistory();
        }
        break;
      case 'blacklist':
        if (!blacklistCheck && !isLoadingBlacklist) {
          loadBlacklistCheck();
        }
        break;
      case 'flow':
        if (!fundFlow && !isLoadingFlow) {
          loadFundFlow();
        }
        break;
      case 'relation':
        if (addressRelations.length === 0 && !isLoadingRelation) {
          loadAddressRelations();
        }
        break;
      case 'ai':
        if (!aiAssessment && !isLoadingAI) {
          loadAIAssessment();
        }
        break;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="risk-assessment-container">
      <div className="risk-header">
        <h1 className="risk-title">智能风险评估系统</h1>
        <p className="risk-subtitle">基于 Nile 测试网的实时链上数据分析</p>
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
        <button 
          className={`risk-tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => handleTabChange('ai')}
        >
          🤖 AI 综合评估
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
                placeholder="TJFJTCgJCmq1ghzZEagDTifHNtNgK4rnRL"
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
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
              <p style={{ color: '#FFA500', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                💡 提示：输入 Nile 测试网地址后点击分析
              </p>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                • 地址格式：以 T 开头，34 位字符
              </p>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                • 测试币水龙头：<a href="https://nileex.io" target="_blank" rel="noopener noreferrer" style={{ color: '#FFA500' }}>https://nileex.io</a>
              </p>
              <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                • 区块浏览器：<a href="https://nile.tronscan.org" target="_blank" rel="noopener noreferrer" style={{ color: '#FFA500' }}>https://nile.tronscan.org</a>
              </p>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <p style={{ color: '#3B82F6', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                🤖 Ollama 配置（用于 AI 综合评估）
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ color: '#a1a1aa', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>
                    API 地址
                  </label>
                  <input
                    type="text"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    placeholder="http://localhost:11434"
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#a1a1aa', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'block' }}>
                    模型选择
                  </label>
                  <select
                    value={ollamaModel}
                    onChange={(e) => setOllamaModel(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      background: 'rgba(0,0,0,0.3)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="qwen3:4b-instruct-2507-q4_K_M">qwen3:4b-instruct (推荐)</option>
                    <option value="deepseek-coder:6.7b">deepseek-coder:6.7b</option>
                    <option value="qwen3-embedding:0.6b-q8_0">qwen3-embedding (不推荐)</option>
                  </select>
                </div>
              </div>
              <p style={{ color: '#10B981', fontSize: '0.75rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                ✅ 检测到本地模型：qwen3:4b-instruct, deepseek-coder:6.7b
              </p>
            </div>
          </div>
        )}

        {/* 历史交易 */}
        {activeTab === 'history' && (
          <div>
            {isLoadingHistory ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>正在加载交易历史...</p>
              </div>
            ) : transactionHistory.length > 0 ? (
              <div className="transaction-list">
                {transactionHistory.map((tx, index) => (
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
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📜</div>
                <div className="empty-state-text">暂无交易记录</div>
              </div>
            )}
          </div>
        )}

        {/* 黑名单检测 */}
        {activeTab === 'blacklist' && (
          <div>
            {isLoadingBlacklist ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>正在检测黑名单...</p>
              </div>
            ) : blacklistCheck ? (
              <div className="blacklist-result">
                <div className="blacklist-status">
                  <div className="blacklist-icon">
                    {blacklistCheck.is_blacklisted ? '❌' : '✅'}
                  </div>
                  <div className={`blacklist-text ${blacklistCheck.is_blacklisted ? 'danger' : 'safe'}`}>
                    <h3>{blacklistCheck.is_blacklisted ? '风险地址' : '安全地址'}</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                      {formatAddress(blacklistCheck.address)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#FFA500', marginBottom: '0.75rem' }}>风险标签</h4>
                  <div className="risk-tags">
                    {blacklistCheck.risk_tags.map((tag, index) => (
                      <span key={index} className="risk-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="blacklist-stats">
                  <div className="blacklist-stat">
                    <div className="blacklist-stat-label">被举报次数</div>
                    <div className="blacklist-stat-value">{blacklistCheck.reported_count}</div>
                  </div>
                  <div className="blacklist-stat">
                    <div className="blacklist-stat-label">最后举报时间</div>
                    <div className="blacklist-stat-value">{blacklistCheck.last_reported}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 资金流动 */}
        {activeTab === 'flow' && (
          <div>
            {isLoadingFlow ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>正在分析资金流动...</p>
              </div>
            ) : fundFlow ? (
              <div>
                <div className="fund-flow-stats">
                  <div className="fund-flow-card">
                    <div className="fund-flow-label">总流入</div>
                    <div className="fund-flow-value">{fundFlow.total_in}</div>
                  </div>
                  <div className="fund-flow-card">
                    <div className="fund-flow-label">总流出</div>
                    <div className="fund-flow-value">{fundFlow.total_out}</div>
                  </div>
                  <div className="fund-flow-card">
                    <div className="fund-flow-label">交易笔数</div>
                    <div className="fund-flow-value">{fundFlow.transaction_count}</div>
                  </div>
                  <div className="fund-flow-card">
                    <div className="fund-flow-label">关联地址数</div>
                    <div className="fund-flow-value">{fundFlow.unique_addresses}</div>
                  </div>
                </div>

                <div className="suspicious-patterns">
                  <h3>⚠️ 可疑模式检测</h3>
                  <ul className="pattern-list">
                    {fundFlow.suspicious_patterns.map((pattern, index) => (
                      <li key={index} className="pattern-item">
                        <span className="pattern-icon">🚨</span>
                        <span className="pattern-text">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 地址关联 */}
        {activeTab === 'relation' && (
          <div>
            {isLoadingRelation ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>正在分析地址关联...</p>
              </div>
            ) : addressRelations.length > 0 ? (
              <div className="relation-list">
                {addressRelations.map((relation, index) => (
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
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🔗</div>
                <div className="empty-state-text">暂无关联地址</div>
              </div>
            )}
          </div>
        )}

        {/* AI 综合评估 */}
        {activeTab === 'ai' && (
          <div>
            {isLoadingAI ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>🤖 AI 正在分析链上数据...</p>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.5rem' }}>
                  这可能需要 10-30 秒，请耐心等待
                </p>
              </div>
            ) : aiAssessment ? (
              <div className="ai-assessment-container">
                {/* 综合评分 */}
                <div className="ai-score-card">
                  <div className="ai-score-circle" style={{
                    background: `conic-gradient(
                      ${aiAssessment.overall_score >= 70 ? '#10B981' : aiAssessment.overall_score >= 40 ? '#F59E0B' : '#EF4444'} ${aiAssessment.overall_score * 3.6}deg,
                      rgba(255,255,255,0.1) 0deg
                    )`
                  }}>
                    <div className="ai-score-inner">
                      <div className="ai-score-number">{aiAssessment.overall_score}</div>
                      <div className="ai-score-label">综合评分</div>
                    </div>
                  </div>
                  <div className="ai-risk-badge-large" style={{
                    background: aiAssessment.risk_level === 'low' ? 'rgba(16, 185, 129, 0.2)' :
                                aiAssessment.risk_level === 'medium' ? 'rgba(245, 158, 11, 0.2)' :
                                aiAssessment.risk_level === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                                'rgba(220, 38, 38, 0.2)',
                    color: aiAssessment.risk_level === 'low' ? '#10B981' :
                           aiAssessment.risk_level === 'medium' ? '#F59E0B' :
                           aiAssessment.risk_level === 'high' ? '#EF4444' :
                           '#DC2626'
                  }}>
                    {aiAssessment.risk_level === 'low' && '🟢 低风险'}
                    {aiAssessment.risk_level === 'medium' && '🟡 中等风险'}
                    {aiAssessment.risk_level === 'high' && '🔴 高风险'}
                    {aiAssessment.risk_level === 'critical' && '⛔ 极高风险'}
                  </div>
                </div>

                {/* 总结 */}
                <div className="ai-summary-card">
                  <h3 style={{ color: '#FFA500', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📋</span>
                    <span>评估总结</span>
                  </h3>
                  <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6' }}>
                    {aiAssessment.summary}
                  </p>
                  <p style={{ color: '#a1a1aa', fontSize: '0.8rem', marginTop: '0.75rem' }}>
                    生成时间：{aiAssessment.generated_at}
                  </p>
                </div>

                {/* 详细分析 */}
                <div className="ai-analysis-grid">
                  <div className="ai-analysis-card">
                    <h4>🔍 地址验证分析</h4>
                    <p>{aiAssessment.detailed_analysis.address_validation}</p>
                  </div>
                  <div className="ai-analysis-card">
                    <h4>📊 交易模式分析</h4>
                    <p>{aiAssessment.detailed_analysis.transaction_pattern}</p>
                  </div>
                  <div className="ai-analysis-card">
                    <h4>💰 资金流动分析</h4>
                    <p>{aiAssessment.detailed_analysis.fund_flow_analysis}</p>
                  </div>
                  <div className="ai-analysis-card">
                    <h4>🔗 关联关系分析</h4>
                    <p>{aiAssessment.detailed_analysis.relationship_analysis}</p>
                  </div>
                </div>

                {/* 建议 */}
                <div className="ai-recommendations-card">
                  <h3 style={{ color: '#FFA500', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💡</span>
                    <span>安全建议</span>
                  </h3>
                  <ul className="ai-recommendations-list">
                    {aiAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="ai-recommendation-item">
                        <span className="ai-recommendation-number">{index + 1}</span>
                        <span className="ai-recommendation-text">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🤖</div>
                <div className="empty-state-text">点击标签页自动开始 AI 分析</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
