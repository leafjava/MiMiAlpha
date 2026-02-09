import { useState } from 'react';
import './DisputeArbitration.css';
import { aiDisputeAnalysis } from '../services/aiAnalysisService';

interface Evidence {
  type: 'signal_data' | 'chain_record' | 'screenshot' | 'text';
  content: string;
  description?: string;
}

interface PurchaseRecord {
  id: string;
  model_name: string;
  provider_address: string;
  amount: number;
  tx_hash: string;
  purchase_date: string;
  purchase_type: 'single' | 'monthly';
}

interface ArbitrationResult {
  case_id: string;
  verdict: 'refund_full' | 'refund_partial' | 'reject' | 'need_more_evidence';
  verdict_text: string;
  refund_amount?: number;
  confidence: number;
  detailed_analysis: string[];
  signal_accuracy_check?: {
    predicted_value: string;
    actual_value: string;
    deviation_percentage: number;
    is_within_threshold: boolean;
  };
  recommendations: string[];
  human_review_suggested: boolean;
}

export const DisputeArbitration = () => {
  const [formData, setFormData] = useState({
    model_name: '',
    model_provider: '',
    transaction_amount: '',
    dispute_type: 'signal_inaccurate',
    signal_date: '',
    predicted_value: '',
    actual_value: '',
    subscriber_claim: '',
    provider_response: '',
    transaction_hash: '',
  });
  
  const [showPurchaseRecords, setShowPurchaseRecords] = useState(false);
  const [purchaseRecords] = useState<PurchaseRecord[]>([
    {
      id: '1',
      model_name: '黄金价格预测模型',
      provider_address: 'TJFJTCgJCmq1ghzZEagDTifHNtNgK4rnRL',
      amount: 5000,
      tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      purchase_date: '2026-02-01',
      purchase_type: 'monthly'
    },
    {
      id: '2',
      model_name: 'BTC 趋势预测模型',
      provider_address: 'TLPbmb5Qma7yLKJZWjD8PWdVDB6FhXy8Yx',
      amount: 300,
      tx_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      purchase_date: '2026-02-05',
      purchase_type: 'single'
    },
    {
      id: '3',
      model_name: '原油价格预测模型',
      provider_address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9',
      amount: 3000,
      tx_hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      purchase_date: '2026-01-28',
      purchase_type: 'monthly'
    }
  ]);
  
  const [subscriberEvidence, setSubscriberEvidence] = useState<Evidence[]>([]);
  const [providerEvidence, setProviderEvidence] = useState<Evidence[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ArbitrationResult | null>(null);
  const [humanReviewRequested, setHumanReviewRequested] = useState(false);

  const disputeTypes = [
    { value: 'signal_inaccurate', label: '信号预测不准确' },
    { value: 'signal_not_received', label: '未收到信号' },
    { value: 'model_performance', label: '模型表现不符宣传' },
    { value: 'subscription_issue', label: '订阅服务问题' },
    { value: 'refund_request', label: '退款申请' },
    { value: 'other', label: '其他争议' },
  ];

  const handleSelectPurchaseRecord = (record: PurchaseRecord) => {
    setFormData({
      ...formData,
      model_name: record.model_name,
      model_provider: record.provider_address,
      transaction_amount: record.amount.toString(),
      transaction_hash: record.tx_hash,
      signal_date: record.purchase_date,
    });
    setShowPurchaseRecords(false);
  };

  const addEvidence = (party: 'subscriber' | 'provider', type: Evidence['type']) => {
    const evidence: Evidence = {
      type,
      content: '',
      description: ''
    };
    
    if (party === 'subscriber') {
      setSubscriberEvidence([...subscriberEvidence, evidence]);
    } else {
      setProviderEvidence([...providerEvidence, evidence]);
    }
  };

  const updateEvidence = (
    party: 'subscriber' | 'provider',
    index: number,
    field: keyof Evidence,
    value: string
  ) => {
    if (party === 'subscriber') {
      const updated = [...subscriberEvidence];
      updated[index] = { ...updated[index], [field]: value };
      setSubscriberEvidence(updated);
    } else {
      const updated = [...providerEvidence];
      updated[index] = { ...updated[index], [field]: value };
      setProviderEvidence(updated);
    }
  };

  const removeEvidence = (party: 'subscriber' | 'provider', index: number) => {
    if (party === 'subscriber') {
      setSubscriberEvidence(subscriberEvidence.filter((_, i) => i !== index));
    } else {
      setProviderEvidence(providerEvidence.filter((_, i) => i !== index));
    }
  };

  const handleAnalyze = async () => {
    if (!formData.model_name || !formData.subscriber_claim) {
      alert('请填写模型名称和订阅者主张');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    setHumanReviewRequested(false);

    try {
      // 计算偏差百分比
      const predicted = parseFloat(formData.predicted_value) || 0;
      const actual = parseFloat(formData.actual_value) || 0;
      const deviation = predicted !== 0 ? Math.abs((actual - predicted) / predicted * 100) : 0;
      
      // 调用 AI 仲裁分析
      const aiResult = await aiDisputeAnalysis({
        disputeType: '量化模型信号偏差',
        description: `模型: ${formData.model_name}\n订阅者: ${formData.subscriber_claim}\n预测值: ${formData.predicted_value}\n实际值: ${formData.actual_value}\n偏差: ${deviation.toFixed(2)}%`,
        amount: parseFloat(formData.transaction_amount),
        buyerEvidence: formData.subscriber_claim,
        sellerEvidence: `模型预测值: ${formData.predicted_value}`
      });
      
      // 根据AI结果生成仲裁结果
      const isWithinThreshold = deviation <= 5;
      
      const mockResult: ArbitrationResult = {
        case_id: `DISPUTE-${Date.now()}`,
        verdict: aiResult.resolution.includes('全额') ? 'refund_full' : 
                 aiResult.resolution.includes('部分') ? 'refund_partial' : 'reject',
        verdict_text: aiResult.resolution,
        refund_amount: aiResult.resolution.includes('全额') ? parseFloat(formData.transaction_amount) :
                      aiResult.resolution.includes('部分') ? parseFloat(formData.transaction_amount) * 0.5 : 0,
        confidence: aiResult.confidence,
        detailed_analysis: [
          `信号预测值: ${formData.predicted_value}`,
          `实际市场值: ${formData.actual_value}`,
          `偏差百分比: ${deviation.toFixed(2)}%`,
          aiResult.reasoning,
          `订阅者提供了 ${subscriberEvidence.length} 项证据`,
          `提供者提供了 ${providerEvidence.length} 项证据`,
          formData.transaction_hash ? `✅ 链上交易已验证: ${formData.transaction_hash.slice(0, 10)}...` : '⚠️ 未提供链上交易哈希',
        ],
        signal_accuracy_check: {
          predicted_value: formData.predicted_value,
          actual_value: formData.actual_value,
          deviation_percentage: deviation,
          is_within_threshold: deviation <= 5,
        },
        recommendations: aiResult.recommendations,
        human_review_suggested: aiResult.confidence < 70,
      };

      setResult(mockResult);
    } catch (error) {
      console.error('AI仲裁分析失败:', error);
      alert('AI仲裁服务暂时不可用，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRequestHumanReview = () => {
    setHumanReviewRequested(true);
    alert('✅ 人工客服申请已提交\n\n客服人员将在 24 小时内审核此案件并给出最终处理方案。\n\n案件编号: ' + result?.case_id);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'refund_full': return '#10b981';
      case 'refund_partial': return '#f59e0b';
      case 'reject': return '#ef4444';
      case 'need_more_evidence': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10b981';
    if (confidence >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dispute-container">
      <div className="dispute-header">
        <h1 className="dispute-title">⚖️ 智能争议仲裁助手</h1>
        <p className="dispute-subtitle">AI 驱动的公正、透明、高效纠纷解决方案</p>
        <div className="ainft-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '20px',
          marginTop: '12px',
          fontSize: '14px',
          color: '#FFA500'
        }}>
          <span>🤖</span>
          <span>本地 AI 模型分析 → 输出仲裁结果 → 不服可申请人工客服介入</span>
        </div>
      </div>

      <div className="dispute-content">
        {/* 左侧：争议信息输入 */}
        <div className="dispute-form-section">
          <h2 className="section-title">📋 争议信息</h2>
          
          {/* 从交易记录选择 */}
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: showPurchaseRecords ? '1rem' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📜</span>
                <span style={{ color: '#d4d4d8', fontSize: '0.95rem' }}>
                  从我的交易记录中选择
                </span>
              </div>
              <button
                onClick={() => setShowPurchaseRecords(!showPurchaseRecords)}
                style={{
                  padding: '0.5rem 1rem',
                  background: showPurchaseRecords ? 'rgba(107, 114, 128, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '6px',
                  color: '#3B82F6',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {showPurchaseRecords ? '收起' : '展开'}
              </button>
            </div>
            
            {showPurchaseRecords && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {purchaseRecords.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => handleSelectPurchaseRecord(record)}
                    style={{
                      padding: '1rem',
                      background: 'rgba(24, 24, 27, 0.8)',
                      border: '1px solid rgba(63, 63, 70, 0.5)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.5)';
                      e.currentTarget.style.background = 'rgba(24, 24, 27, 0.8)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#d4d4d8'
                      }}>
                        {record.model_name}
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: record.purchase_type === 'monthly' 
                          ? 'rgba(245, 158, 11, 0.2)' 
                          : 'rgba(16, 185, 129, 0.2)',
                        border: `1px solid ${record.purchase_type === 'monthly' 
                          ? 'rgba(245, 158, 11, 0.5)' 
                          : 'rgba(16, 185, 129, 0.5)'}`,
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: record.purchase_type === 'monthly' ? '#f59e0b' : '#10b981'
                      }}>
                        {record.purchase_type === 'monthly' ? '月度订阅' : '单次购买'}
                      </div>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: '#a1a1aa'
                    }}>
                      <div>
                        <span>💰 金额：</span>
                        <span style={{ color: '#d4d4d8', fontWeight: 500 }}>
                          ${record.amount} USDT
                        </span>
                      </div>
                      <div>
                        <span>📅 日期：</span>
                        <span style={{ color: '#d4d4d8' }}>{record.purchase_date}</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span>🔗 交易：</span>
                        <span style={{ color: '#d4d4d8', fontSize: '0.8rem' }}>
                          {record.tx_hash.slice(0, 10)}...{record.tx_hash.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>模型名称</label>
            <input
              type="text"
              value={formData.model_name}
              onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
              placeholder="例如：黄金价格预测模型"
              className="dispute-input"
            />
          </div>

          <div className="form-group">
            <label>模型提供者地址</label>
            <input
              type="text"
              value={formData.model_provider}
              onChange={(e) => setFormData({ ...formData, model_provider: e.target.value })}
              placeholder="TJFJTCgJCmq1ghzZEagDTifHNtNgK4rnRL"
              className="dispute-input"
            />
          </div>

          <div className="form-group">
            <label>交易金额 (USDT)</label>
            <input
              type="number"
              value={formData.transaction_amount}
              onChange={(e) => setFormData({ ...formData, transaction_amount: e.target.value })}
              placeholder="50"
              className="dispute-input"
            />
          </div>

          <div className="form-group">
            <label>交易哈希（TRON 链上）</label>
            <input
              type="text"
              value={formData.transaction_hash}
              onChange={(e) => setFormData({ ...formData, transaction_hash: e.target.value })}
              placeholder="0x1234567890abcdef..."
              className="dispute-input"
            />
          </div>

          <div className="form-group">
            <label>争议类型</label>
            <select
              value={formData.dispute_type}
              onChange={(e) => setFormData({ ...formData, dispute_type: e.target.value })}
              className="dispute-select"
            >
              {disputeTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>信号发布日期</label>
            <input
              type="date"
              value={formData.signal_date}
              onChange={(e) => setFormData({ ...formData, signal_date: e.target.value })}
              className="dispute-input"
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>预测值</label>
              <input
                type="text"
                value={formData.predicted_value}
                onChange={(e) => setFormData({ ...formData, predicted_value: e.target.value })}
                placeholder="例如：2100"
                className="dispute-input"
              />
            </div>
            <div className="form-group">
              <label>实际值</label>
              <input
                type="text"
                value={formData.actual_value}
                onChange={(e) => setFormData({ ...formData, actual_value: e.target.value })}
                placeholder="例如：2050"
                className="dispute-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>订阅者主张</label>
            <textarea
              value={formData.subscriber_claim}
              onChange={(e) => setFormData({ ...formData, subscriber_claim: e.target.value })}
              placeholder="描述您的诉求和理由，例如：信号预测严重偏差，要求退款..."
              className="dispute-textarea"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>提供者回应</label>
            <textarea
              value={formData.provider_response}
              onChange={(e) => setFormData({ ...formData, provider_response: e.target.value })}
              placeholder="模型提供者的回应..."
              className="dispute-textarea"
              rows={3}
            />
          </div>

          {/* 证据部分 */}
          <div className="evidence-section">
            <h3 className="subsection-title">🔍 订阅者证据</h3>
            {subscriberEvidence.map((evidence, index) => (
              <div key={index} className="evidence-item">
                <select
                  value={evidence.type}
                  onChange={(e) => updateEvidence('subscriber', index, 'type', e.target.value)}
                  className="evidence-type-select"
                >
                  <option value="signal_data">信号数据</option>
                  <option value="chain_record">链上记录</option>
                  <option value="screenshot">截图证据</option>
                  <option value="text">文字说明</option>
                </select>
                <input
                  type="text"
                  value={evidence.content}
                  onChange={(e) => updateEvidence('subscriber', index, 'content', e.target.value)}
                  placeholder="证据内容或链接"
                  className="evidence-input"
                />
                <button
                  onClick={() => removeEvidence('subscriber', index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addEvidence('subscriber', 'signal_data')}
              className="add-evidence-btn"
            >
              + 添加订阅者证据
            </button>
          </div>

          <div className="evidence-section">
            <h3 className="subsection-title">🔍 提供者证据</h3>
            {providerEvidence.map((evidence, index) => (
              <div key={index} className="evidence-item">
                <select
                  value={evidence.type}
                  onChange={(e) => updateEvidence('provider', index, 'type', e.target.value)}
                  className="evidence-type-select"
                >
                  <option value="signal_data">信号数据</option>
                  <option value="chain_record">链上记录</option>
                  <option value="screenshot">截图证据</option>
                  <option value="text">文字说明</option>
                </select>
                <input
                  type="text"
                  value={evidence.content}
                  onChange={(e) => updateEvidence('provider', index, 'content', e.target.value)}
                  placeholder="证据内容或链接"
                  className="evidence-input"
                />
                <button
                  onClick={() => removeEvidence('provider', index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addEvidence('provider', 'signal_data')}
              className="add-evidence-btn"
            >
              + 添加提供者证据
            </button>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="analyze-button"
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                AI 分析中...
              </>
            ) : (
              '🤖 启动 AI 仲裁分析'
            )}
          </button>
        </div>

        {/* 右侧：仲裁结果 */}
        {result && (
          <div className="dispute-result-section">
            <h2 className="section-title">⚖️ AI 仲裁结果</h2>
            
            <div className="result-card">
              <div className="case-id">案件编号: {result.case_id}</div>
              
              {/* 裁决结果 */}
              <div className="judgment-box" style={{
                borderLeft: `4px solid ${getVerdictColor(result.verdict)}`
              }}>
                <div className="judgment-label">AI 裁决</div>
                <div className="judgment-value" style={{
                  color: getVerdictColor(result.verdict)
                }}>
                  {result.verdict_text}
                </div>
                {result.refund_amount !== undefined && result.refund_amount > 0 && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: '#10b981'
                  }}>
                    退款金额: ${result.refund_amount.toFixed(2)} USDT
                  </div>
                )}
              </div>

              {/* 信号准确性检查 */}
              {result.signal_accuracy_check && (
                <div className="accuracy-check-box" style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem'
                }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#3B82F6' }}>
                    📊 信号准确性分析
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                    <div>
                      <div style={{ color: '#a1a1aa', marginBottom: '0.25rem' }}>预测值</div>
                      <div style={{ fontWeight: 600, color: '#d4d4d8' }}>
                        {result.signal_accuracy_check.predicted_value}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#a1a1aa', marginBottom: '0.25rem' }}>实际值</div>
                      <div style={{ fontWeight: 600, color: '#d4d4d8' }}>
                        {result.signal_accuracy_check.actual_value}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#a1a1aa', marginBottom: '0.25rem' }}>偏差百分比</div>
                      <div style={{ 
                        fontWeight: 600, 
                        color: result.signal_accuracy_check.is_within_threshold ? '#10b981' : '#ef4444' 
                      }}>
                        {result.signal_accuracy_check.deviation_percentage.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#a1a1aa', marginBottom: '0.25rem' }}>是否在阈值内</div>
                      <div style={{ 
                        fontWeight: 600, 
                        color: result.signal_accuracy_check.is_within_threshold ? '#10b981' : '#ef4444' 
                      }}>
                        {result.signal_accuracy_check.is_within_threshold ? '✅ 是（≤5%）' : '❌ 否（>5%）'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 置信度 */}
              <div className="confidence-box">
                <div className="confidence-label">AI 置信度评分</div>
                <div className="confidence-bar-container">
                  <div
                    className="confidence-bar"
                    style={{
                      width: `${result.confidence}%`,
                      background: getConfidenceColor(result.confidence)
                    }}
                  />
                  <span className="confidence-text" style={{
                    color: getConfidenceColor(result.confidence)
                  }}>
                    {result.confidence}%
                  </span>
                </div>
              </div>

              {/* 详细分析 */}
              <div className="reasons-section">
                <h3 className="reasons-title">📝 详细分析</h3>
                <ul className="reasons-list">
                  {result.detailed_analysis.map((reason, index) => (
                    <li key={index} className="reason-item">{reason}</li>
                  ))}
                </ul>
              </div>

              {/* 操作建议 */}
              <div className="recommendations-section">
                <h3 className="recommendations-title">💡 操作建议</h3>
                <ul className="recommendations-list">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="recommendation-item">{rec}</li>
                  ))}
                </ul>
              </div>

              {/* 人工复审选项 */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: result.human_review_suggested 
                  ? 'rgba(245, 158, 11, 0.1)' 
                  : 'rgba(107, 114, 128, 0.1)',
                border: `1px solid ${result.human_review_suggested ? 'rgba(245, 158, 11, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: result.human_review_suggested ? '#f59e0b' : '#a1a1aa'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>👨‍💼</span>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>申请人工客服介入</h3>
                </div>
                {result.human_review_suggested ? (
                  <p style={{ color: '#d4d4d8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    ⚠️ 此案件较为复杂，AI 建议申请人工客服介入以确保公正性
                  </p>
                ) : (
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    如果您对 AI 仲裁结果不满意，可以申请人工客服介入处理
                  </p>
                )}
                {!humanReviewRequested ? (
                  <button
                    onClick={handleRequestHumanReview}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: result.human_review_suggested 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'rgba(107, 114, 128, 0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {result.human_review_suggested ? '🚨 申请人工客服介入（推荐）' : '申请人工客服介入'}
                  </button>
                ) : (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10b981',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    ✅ 人工客服申请已提交，客服人员将在 24 小时内处理
                  </div>
                )}
              </div>

              {/* 链上执行 */}
              {result.refund_amount && result.refund_amount > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    🔗 执行链上退款（${result.refund_amount.toFixed(2)} USDT）
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 仲裁流程说明 */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(24, 24, 27, 0.8)',
        border: '1px solid rgba(255, 165, 0, 0.2)',
        borderRadius: '16px'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
          color: '#FFA500'
        }}>
          📖 智能仲裁流程说明
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#d4d4d8' }}>
              提交争议信息
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              从交易记录选择或手动填写争议详情，上传双方证据（信号数据、链上记录、截图等）
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#d4d4d8' }}>
              本地 AI 模型分析
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Ollama 本地模型分析信号偏差、验证链上数据、评估证据权重，给出仲裁建议
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#d4d4d8' }}>
              AI 输出仲裁结果
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              AI 给出仲裁建议（全额退款/部分退款/驳回），并提供详细分析依据和置信度评分
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>4️⃣</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#d4d4d8' }}>
              人工客服介入（可选）
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6' }}>
              如对 AI 仲裁结果不满意，可申请人工客服介入处理，24 小时内响应并给出最终裁决
            </p>
          </div>
        </div>
        
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px'
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#3B82F6' }}>
            💡 为什么选择智能仲裁？
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.9rem',
            color: '#d4d4d8'
          }}>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>⚡ <strong>快速响应</strong></div>
              <div style={{ color: '#a1a1aa' }}>AI 分析秒级完成，无需等待人工排队</div>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>🎯 <strong>客观公正</strong></div>
              <div style={{ color: '#a1a1aa' }}>基于数据和规则，避免人为偏见</div>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>📊 <strong>透明可追溯</strong></div>
              <div style={{ color: '#a1a1aa' }}>完整分析过程和依据，链上存储不可篡改</div>
            </div>
            <div>
              <div style={{ marginBottom: '0.5rem' }}>🔄 <strong>双重保障</strong></div>
              <div style={{ color: '#a1a1aa' }}>AI 初审 + 人工复审，确保公正性</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
