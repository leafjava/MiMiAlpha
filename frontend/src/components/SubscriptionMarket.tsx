import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useSmartFacilitator } from '../hooks/useSmartFacilitator';
import { useToken } from '../hooks/useToken';
import './SubscriptionMarket.css';

type BillingMode = 'per-use' | 'per-time';

interface Subscription {
  id: string;
  owner: string;
  service: 'ChatGPT Plus' | 'Claude Pro' | 'Midjourney' | 'DeepL' | 'Mureka AI' | 'Vizard' | 'Astrill VPN' | 'ELSA Speak';
  billingMode: BillingMode;
  billingUnit: string; // '次' for per-use, '天' or '小时' for per-time
  totalQuota: number;
  availableQuota: number;
  pricePerUnit: number;
  rating: number;
  reviews: number;
  availableHours: string;
  ownerCredit: number;
  description?: string;
}

const mockSubscriptions: Subscription[] = [
  // 按次计费 (Per Use) - AI 对话和生成类
  {
    id: '1',
    owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    service: 'ChatGPT Plus',
    billingMode: 'per-use',
    billingUnit: '次',
    totalQuota: 40,
    availableQuota: 35,
    pricePerUnit: 0.5,
    rating: 4.9,
    reviews: 128,
    availableHours: '工作日 9:00-18:00',
    ownerCredit: 850,
    description: '实时解析请求内容，按对话次数计费'
  },
  {
    id: '2',
    owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    service: 'Claude Pro',
    billingMode: 'per-use',
    billingUnit: '次',
    totalQuota: 50,
    availableQuota: 42,
    pricePerUnit: 0.6,
    rating: 4.8,
    reviews: 95,
    availableHours: '全天候',
    ownerCredit: 920,
    description: '实时解析请求内容，按对话次数计费'
  },
  {
    id: '3',
    owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    service: 'Midjourney',
    billingMode: 'per-use',
    billingUnit: '次',
    totalQuota: 200,
    availableQuota: 180,
    pricePerUnit: 0.3,
    rating: 4.7,
    reviews: 156,
    availableHours: '工作日 18:00-24:00',
    ownerCredit: 780,
    description: '实时解析请求内容，按图片生成次数计费'
  },
  {
    id: '4',
    owner: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    service: 'Mureka AI',
    billingMode: 'per-use',
    billingUnit: '次',
    totalQuota: 100,
    availableQuota: 85,
    pricePerUnit: 0.4,
    rating: 4.8,
    reviews: 89,
    availableHours: '全天候',
    ownerCredit: 880,
    description: '实时解析请求内容，按音乐生成次数计费'
  },
  {
    id: '5',
    owner: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    service: 'Vizard',
    billingMode: 'per-use',
    billingUnit: '次',
    totalQuota: 60,
    availableQuota: 52,
    pricePerUnit: 0.8,
    rating: 4.9,
    reviews: 76,
    availableHours: '工作日 9:00-22:00',
    ownerCredit: 910,
    description: '实时解析请求内容，按视频转换次数计费'
  },
  
  // 按时计费 (Per Time) - VPN 和持续使用类
  {
    id: '6',
    owner: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    service: 'Astrill VPN',
    billingMode: 'per-time',
    billingUnit: '天',
    totalQuota: 30,
    availableQuota: 22,
    pricePerUnit: 0.3,
    rating: 4.9,
    reviews: 234,
    availableHours: '全天候',
    ownerCredit: 950,
    description: '租约到期后自动撤销 Session，按天计费'
  },
  {
    id: '7',
    owner: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    service: 'ELSA Speak',
    billingMode: 'per-time',
    billingUnit: '天',
    totalQuota: 30,
    availableQuota: 25,
    pricePerUnit: 0.15,
    rating: 4.7,
    reviews: 167,
    availableHours: '全天候',
    ownerCredit: 890,
    description: 'AI 口语练习，租约到期后自动撤销访问权限'
  }
];

export function SubscriptionMarket() {
  const { account, connectWallet, isConnected, isHardhatNetwork, switchToHardhat } = useContract();
  const { executePayment, loading: facilitatorLoading, isSuccess, hash } = useSmartFacilitator();
  const { balance } = useToken();
  
  const [activeTab, setActiveTab] = useState<'rent' | 'list'>('rent');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedBillingMode, setSelectedBillingMode] = useState<string>('all');
  const [rentQuantity, setRentQuantity] = useState(5);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // List subscription form state
  const [listForm, setListForm] = useState({
    service: 'ChatGPT Plus',
    totalQuota: 40,
    availableQuota: 35,
    pricePerUnit: 0.5,
    availableHours: 'weekday_9_18'
  });

  const billingModes = [
    { value: 'all', label: '全部模式', icon: '🌐' },
    { value: 'per-use', label: '按次计费', icon: '🔢', desc: '实时计数扣费' },
    { value: 'per-time', label: '按时计费', icon: '⏰', desc: '租约到期撤销' }
  ];

  const services = [
    { value: 'all', label: '全部服务', icon: '🌐' },
    // 按次计费
    { value: 'ChatGPT Plus', label: 'ChatGPT Plus', icon: '🤖', mode: 'per-use' },
    { value: 'Claude Pro', label: 'Claude Pro', icon: '🧠', mode: 'per-use' },
    { value: 'Midjourney', label: 'Midjourney', icon: '🎨', mode: 'per-use' },
    { value: 'Mureka AI', label: 'Mureka AI', icon: '🎵', mode: 'per-use' },
    { value: 'Vizard', label: 'Vizard', icon: '🎬', mode: 'per-use' },
    // 按时计费
    { value: 'Astrill VPN', label: 'Astrill VPN', icon: '🔒', mode: 'per-time' },
    { value: 'ELSA Speak', label: 'ELSA Speak', icon: '🗣️', mode: 'per-time' }
  ];

  const filteredSubscriptions = mockSubscriptions.filter(s => {
    const serviceMatch = selectedService === 'all' || s.service === selectedService;
    const modeMatch = selectedBillingMode === 'all' || s.billingMode === selectedBillingMode;
    return serviceMatch && modeMatch;
  });

  // 监听交易成功
  useEffect(() => {
    if (isSuccess && hash) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedSubscription(null);
      }, 5000);
    }
  }, [isSuccess, hash]);

  const handleRent = async (subscription: Subscription) => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        alert('请先连接钱包');
        return;
      }
    }

    if (!isHardhatNetwork) {
      try {
        await switchToHardhat();
      } catch (error) {
        alert('请切换到 Hardhat 本地网络');
        return;
      }
    }

    setSelectedSubscription(subscription);
  };

  const confirmRent = async () => {
    if (!selectedSubscription) return;
    
    const totalCost = selectedSubscription.pricePerUnit * rentQuantity;
    
    try {
      // 使用用户地址作为 Agent 地址
      const agentAddress = account;
      
      console.log('🚀 执行支付:', {
        agentAddress,
        recipient: selectedSubscription.owner,
        amount: totalCost.toString(),
        service: selectedSubscription.service
      });
      
      // 执行支付
      await executePayment(
        agentAddress,
        selectedSubscription.owner,
        totalCost.toString(),
        selectedSubscription.service
      );

      alert(`✅ 租赁交易已提交！\n\n服务：${selectedSubscription.service}\n数量：${rentQuantity} 次\n总计：${totalCost.toFixed(2)} cUSD\n\n请在钱包中确认交易...`);
    } catch (error: any) {
      console.error('❌ Rent failed:', error);
      alert('租赁失败：' + (error.message || '未知错误'));
    }
  };

  const handleListSubscription = () => {
    alert(`上架成功！\n服务：${listForm.service}\n可用额度：${listForm.availableQuota} 次\n单价：${listForm.pricePerUnit}/次`);
  };

  return (
    <div className="subscription-market">
      {/* Success Banner */}
      {showSuccess && hash && (
        <div className="success-banner">
          ✅ 交易成功！哈希: {hash.slice(0, 10)}...{hash.slice(-8)}
        </div>
      )}

      {/* Header */}
      <div className="market-header">
        <div className="header-content">
          <h1>🔄 闲置订阅权 RWA Token 交易所</h1>
          <p>基于 AINFT Nova 资产化平台 · 订阅权管理领域的首个治理层</p>
          <div className="ainft-integration-badge">
            <span className="badge-icon">🤝</span>
            <span className="badge-text">Powered by AINFT Nova & MAS Framework</span>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">40+</div>
            <div className="stat-label">可用账号</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">$0.15-0.8</div>
            <div className="stat-label">价格范围</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">2 种</div>
            <div className="stat-label">计费模式</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">&lt; 1 分钟</div>
            <div className="stat-label">平均响应</div>
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      {isConnected && (
        <div className="wallet-status-bar">
          <div className="status-item">
            <span className="status-label">账户：</span>
            <span className="status-value">{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">余额：</span>
            <span className="status-value highlight">{balance} cUSD</span>
          </div>
          {!isHardhatNetwork && (
            <button onClick={switchToHardhat} className="switch-network-btn">
              切换到 Hardhat 网络
            </button>
          )}
        </div>
      )}

      {!isConnected && (
        <div className="connect-prompt">
          <p>💡 请先连接钱包以使用租赁功能</p>
          <button onClick={connectWallet} className="connect-wallet-btn">
            连接钱包
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="market-tabs">
        <button 
          className={`tab-button ${activeTab === 'rent' ? 'active' : ''}`}
          onClick={() => setActiveTab('rent')}
        >
          🛒 租赁服务
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          💰 上架订阅
        </button>
      </div>

      {/* Rent Tab */}
      {activeTab === 'rent' && (
        <div className="rent-section">
          {/* Billing Mode Filter */}
          <div className="billing-mode-filter">
            <h3>💳 计费模式</h3>
            <div className="mode-buttons">
              {billingModes.map(mode => (
                <button
                  key={mode.value}
                  className={`mode-button ${selectedBillingMode === mode.value ? 'active' : ''}`}
                  onClick={() => setSelectedBillingMode(mode.value)}
                >
                  <span className="mode-icon">{mode.icon}</span>
                  <div className="mode-info">
                    <span className="mode-label">{mode.label}</span>
                    {mode.desc && <span className="mode-desc">{mode.desc}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Service Filter */}
          <div className="service-filter">
            <h3>🎯 服务类型</h3>
            <div className="filter-buttons">
              {services.map(service => (
                <button
                  key={service.value}
                  className={`filter-button ${selectedService === service.value ? 'active' : ''}`}
                  onClick={() => setSelectedService(service.value)}
                >
                  <span className="filter-icon">{service.icon}</span>
                  <span>{service.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscriptions Grid */}
          <div className="subscriptions-grid">
            {filteredSubscriptions.map(subscription => (
              <div key={subscription.id} className="subscription-card">
                <div className="card-header">
                  <div className="service-info">
                    <h3>{subscription.service}</h3>
                    <div className="owner-info">
                      <span className="owner-address">{subscription.owner.slice(0, 6)}...{subscription.owner.slice(-4)}</span>
                      <span className="credit-badge">
                        🏆 信用 {subscription.ownerCredit}
                      </span>
                    </div>
                  </div>
                  <div className="rating">
                    <span className="stars">⭐ {subscription.rating}</span>
                    <span className="reviews">({subscription.reviews})</span>
                  </div>
                </div>

                <div className="card-body">
                  {/* Billing Mode Badge */}
                  <div className="billing-badge">
                    {subscription.billingMode === 'per-use' ? (
                      <span className="badge per-use">🔢 按次计费</span>
                    ) : (
                      <span className="badge per-time">⏰ 按时计费</span>
                    )}
                  </div>

                  {subscription.description && (
                    <div className="service-description">
                      {subscription.description}
                    </div>
                  )}

                  <div className="quota-info">
                    <div className="quota-bar">
                      <div 
                        className="quota-fill" 
                        style={{ width: `${(subscription.availableQuota / subscription.totalQuota) * 100}%` }}
                      />
                    </div>
                    <div className="quota-text">
                      可用 {subscription.availableQuota}/{subscription.totalQuota} {subscription.billingUnit}
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">💰 单价</span>
                      <span className="detail-value">${subscription.pricePerUnit}/{subscription.billingUnit}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏰ 可用时段</span>
                      <span className="detail-value">{subscription.availableHours}</span>
                    </div>
                  </div>

                  <div className="features">
                    <span className="feature-tag">⚡ 立即可用</span>
                    {subscription.billingMode === 'per-use' ? (
                      <>
                        <span className="feature-tag">🔒 API Proxy</span>
                        <span className="feature-tag">📊 实时计数</span>
                      </>
                    ) : (
                      <>
                        <span className="feature-tag">🔐 Session 管理</span>
                        <span className="feature-tag">⏱️ 自动撤销</span>
                      </>
                    )}
                  </div>
                </div>

                <button 
                  className="rent-button"
                  onClick={() => handleRent(subscription)}
                  disabled={facilitatorLoading}
                >
                  {facilitatorLoading ? '处理中...' : '立即租用 →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List Tab - 保持原样 */}
      {activeTab === 'list' && (
        <div className="list-section">
          {/* ... 原有的上架表单代码 ... */}
          <div className="list-form">
            <h2>上架你的闲置订阅</h2>
            <p className="form-description">
              让闲置的 AI 订阅变成收益，每月多赚 $15+
            </p>
            <button className="submit-button" onClick={handleListSubscription}>
              提交上架 →
            </button>
          </div>
        </div>
      )}

      {/* Rent Modal */}
      {selectedSubscription && (
        <div className="modal-overlay" onClick={() => setSelectedSubscription(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>租赁确认</h2>
            <div className="modal-body">
              <div className="modal-info">
                <h3>{selectedSubscription.service}</h3>
                <p>账号主：{selectedSubscription.owner.slice(0, 6)}...{selectedSubscription.owner.slice(-4)}</p>
                <p>信用评分：{selectedSubscription.ownerCredit}/1000</p>
              </div>

              <div className="quantity-selector">
                <label>租赁数量（{selectedSubscription.billingUnit}）</label>
                <div className="quantity-controls">
                  <button onClick={() => setRentQuantity(Math.max(1, rentQuantity - 1))}>-</button>
                  <input 
                    type="number" 
                    value={rentQuantity}
                    onChange={(e) => setRentQuantity(parseInt(e.target.value) || 1)}
                  />
                  <button onClick={() => setRentQuantity(Math.min(selectedSubscription.availableQuota, rentQuantity + 1))}>+</button>
                </div>
              </div>

              <div className="cost-summary">
                <div className="cost-row">
                  <span>单价</span>
                  <span>${selectedSubscription.pricePerUnit}/{selectedSubscription.billingUnit}</span>
                </div>
                <div className="cost-row">
                  <span>数量</span>
                  <span>{rentQuantity} {selectedSubscription.billingUnit}</span>
                </div>
                <div className="cost-row total">
                  <span>总计</span>
                  <span>${(selectedSubscription.pricePerUnit * rentQuantity).toFixed(2)} cUSD</span>
                </div>
              </div>

              {hash && (
                <div className="tx-info">
                  <p>交易哈希: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setSelectedSubscription(null)}
                disabled={facilitatorLoading}
              >
                取消
              </button>
              <button 
                className="confirm-button" 
                onClick={confirmRent}
                disabled={facilitatorLoading}
              >
                {facilitatorLoading ? '处理中...' : '确认租赁'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
