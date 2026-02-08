import { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useSmartFacilitator } from '../hooks/useSmartFacilitator';
import { useToken } from '../hooks/useToken';
import './SubscriptionMarket.css';

interface Subscription {
  id: string;
  owner: string;
  service: 'ChatGPT Plus' | 'Claude Pro' | 'Midjourney' | 'DeepL';
  totalQuota: number;
  availableQuota: number;
  pricePerUnit: number;
  rating: number;
  reviews: number;
  availableHours: string;
  ownerCredit: number;
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Hardhat Account #1
    service: 'ChatGPT Plus',
    totalQuota: 40,
    availableQuota: 35,
    pricePerUnit: 0.5,
    rating: 4.9,
    reviews: 128,
    availableHours: '工作日 9:00-18:00',
    ownerCredit: 850
  },
  {
    id: '2',
    owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Hardhat Account #2
    service: 'Claude Pro',
    totalQuota: 50,
    availableQuota: 42,
    pricePerUnit: 0.6,
    rating: 4.8,
    reviews: 95,
    availableHours: '全天候',
    ownerCredit: 920
  },
  {
    id: '3',
    owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // Hardhat Account #3
    service: 'Midjourney',
    totalQuota: 200,
    availableQuota: 180,
    pricePerUnit: 0.3,
    rating: 4.7,
    reviews: 156,
    availableHours: '工作日 18:00-24:00',
    ownerCredit: 780
  }
];

export function SubscriptionMarket() {
  const { account, connectWallet, isConnected, isHardhatNetwork, switchToHardhat } = useContract();
  const { executePayment, loading: facilitatorLoading, isSuccess, hash } = useSmartFacilitator();
  const { balance } = useToken();
  
  const [activeTab, setActiveTab] = useState<'rent' | 'list'>('rent');
  const [selectedService, setSelectedService] = useState<string>('all');
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

  const services = [
    { value: 'all', label: '全部服务', icon: '🌐' },
    { value: 'ChatGPT Plus', label: 'ChatGPT Plus', icon: '🤖' },
    { value: 'Claude Pro', label: 'Claude Pro', icon: '🧠' },
    { value: 'Midjourney', label: 'Midjourney', icon: '🎨' },
    { value: 'DeepL', label: 'DeepL', icon: '🌍' }
  ];

  const filteredSubscriptions = selectedService === 'all' 
    ? mockSubscriptions 
    : mockSubscriptions.filter(s => s.service === selectedService);

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
          <h1>🔄 引擎 A：C2C 订阅共享市场</h1>
          <p>让闲置 AI 订阅变成收益 · AI 版闲鱼</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">25</div>
            <div className="stat-label">可用账号</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">$0.3-0.6</div>
            <div className="stat-label">价格范围</div>
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
          {/* Service Filter */}
          <div className="service-filter">
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
                  <div className="quota-info">
                    <div className="quota-bar">
                      <div 
                        className="quota-fill" 
                        style={{ width: `${(subscription.availableQuota / subscription.totalQuota) * 100}%` }}
                      />
                    </div>
                    <div className="quota-text">
                      可用 {subscription.availableQuota}/{subscription.totalQuota} 次
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">💰 单价</span>
                      <span className="detail-value">${subscription.pricePerUnit}/次</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">⏰ 可用时段</span>
                      <span className="detail-value">{subscription.availableHours}</span>
                    </div>
                  </div>

                  <div className="features">
                    <span className="feature-tag">⚡ 立即可用</span>
                    <span className="feature-tag">🔒 API Proxy</span>
                    <span className="feature-tag">📊 速率保护</span>
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
                <label>租赁数量</label>
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
                  <span>${selectedSubscription.pricePerUnit}/次</span>
                </div>
                <div className="cost-row">
                  <span>数量</span>
                  <span>{rentQuantity} 次</span>
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
