import { useState } from 'react';
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
    owner: '0x7a3f...9b2c',
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
    owner: '0x4d8e...1f5a',
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
    owner: '0x9c2b...7e4d',
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

  const handleRent = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  const confirmRent = () => {
    if (!selectedSubscription) return;
    const totalCost = selectedSubscription.pricePerUnit * rentQuantity;
    alert(`租赁确认：\n服务：${selectedSubscription.service}\n数量：${rentQuantity} 次\n总计：$${totalCost.toFixed(2)} USDT`);
    setSelectedSubscription(null);
  };

  const handleListSubscription = () => {
    alert(`上架成功！\n服务：${listForm.service}\n可用额度：${listForm.availableQuota} 次\n单价：$${listForm.pricePerUnit}/次`);
  };

  return (
    <div className="subscription-market">
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
                      <span className="owner-address">{subscription.owner}</span>
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

      {/* List Tab */}
      {activeTab === 'list' && (
        <div className="list-section">
          <div className="list-form">
            <h2>上架你的闲置订阅</h2>
            <p className="form-description">
              让闲置的 AI 订阅变成收益，每月多赚 $15+
            </p>

            <div className="form-group">
              <label>选择服务</label>
              <select 
                value={listForm.service}
                onChange={(e) => setListForm({...listForm, service: e.target.value})}
              >
                <option value="ChatGPT Plus">🤖 ChatGPT Plus</option>
                <option value="Claude Pro">🧠 Claude Pro</option>
                <option value="Midjourney">🎨 Midjourney</option>
                <option value="DeepL">🌍 DeepL</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>总额度（次/月）</label>
                <input 
                  type="number" 
                  value={listForm.totalQuota}
                  onChange={(e) => setListForm({...listForm, totalQuota: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>可分享额度</label>
                <input 
                  type="number" 
                  value={listForm.availableQuota}
                  onChange={(e) => setListForm({...listForm, availableQuota: parseInt(e.target.value)})}
                />
                <small>保留 {listForm.totalQuota - listForm.availableQuota} 次自用</small>
              </div>
            </div>

            <div className="form-group">
              <label>单价（USDT/次）</label>
              <input 
                type="number" 
                step="0.1"
                value={listForm.pricePerUnit}
                onChange={(e) => setListForm({...listForm, pricePerUnit: parseFloat(e.target.value)})}
              />
              <div className="price-suggestion">
                💡 AI 建议：$0.45 - $0.55（市场均价 $0.50）
              </div>
            </div>

            <div className="form-group">
              <label>可用时段</label>
              <select 
                value={listForm.availableHours}
                onChange={(e) => setListForm({...listForm, availableHours: e.target.value})}
              >
                <option value="weekday_9_18">工作日 9:00-18:00</option>
                <option value="weekday_18_24">工作日 18:00-24:00</option>
                <option value="weekend">周末全天</option>
                <option value="24_7">24/7 全天候</option>
              </select>
            </div>

            <div className="earnings-preview">
              <h3>收益预估</h3>
              <div className="earnings-grid">
                <div className="earnings-item">
                  <span className="earnings-label">预计月租出</span>
                  <span className="earnings-value">30 次</span>
                </div>
                <div className="earnings-item">
                  <span className="earnings-label">预计月收入</span>
                  <span className="earnings-value highlight">${(listForm.pricePerUnit * 30).toFixed(2)}</span>
                </div>
                <div className="earnings-item">
                  <span className="earnings-label">实际成本</span>
                  <span className="earnings-value">${(20 - listForm.pricePerUnit * 30).toFixed(2)}</span>
                </div>
                <div className="earnings-item">
                  <span className="earnings-label">节省比例</span>
                  <span className="earnings-value success">{((listForm.pricePerUnit * 30 / 20) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <button className="submit-button" onClick={handleListSubscription}>
              提交上架 →
            </button>
          </div>

          <div className="list-benefits">
            <h3>为什么选择 MiMiAlpha？</h3>
            <div className="benefit-item">
              <span className="benefit-icon">🔒</span>
              <div>
                <h4>API Proxy 模式</h4>
                <p>账号密码永不泄露，完全安全</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <div>
                <h4>速率限制保护</h4>
                <p>自动控制使用频率，防止账号被封</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <div>
                <h4>微支付聚合</h4>
                <p>批量结算，节省 98% Energy</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <div>
                <h4>自动收益</h4>
                <p>无需人工管理，收益自动到账</p>
              </div>
            </div>
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
                <p>账号主：{selectedSubscription.owner}</p>
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
                  <span>${(selectedSubscription.pricePerUnit * rentQuantity).toFixed(2)} USDT</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setSelectedSubscription(null)}>
                取消
              </button>
              <button className="confirm-button" onClick={confirmRent}>
                确认租赁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
