import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { useTranslation } from 'react-i18next';
import './ModelMarket2.css';

// 导入合约配置 - 使用 TRX 支付版本
import ModelSubscriptionTRXABI from '../contracts/ModelSubscriptionTRX.json';

// 尝试加载 TRX 版本的合约地址
let trxAddresses: any = null;
try {
  trxAddresses = require('../contracts/contract-addresses-trx-nile.json');
} catch (e) {
  console.log('TRX addresses not found, using default');
}

// 使用 TRX 支付版本的合约地址
const MODEL_SUBSCRIPTION_ADDRESS = (trxAddresses?.contracts?.ModelSubscriptionTRX || '0x0') as `0x${string}`;
const PAYMENT_METHOD = 'TRX'; // 使用 TRX 原生代币支付

// 模型订阅配置
const SUBSCRIPTION_CONFIG = {
  minStakeAmount: '100',
  platformFeeRate: 300, // 3%
  unstakeCooldown: 60, // 60 seconds for testing
  pointsPerToken: 1000,
  minClaimPoints: 100
};

// 订阅状态枚举
const SubscriptionStatus = {
  0: 'Active',
  1: 'Expired',
  2: 'Cancelled',
  3: 'Refunded'
};

// 模型卡片组件
function ModelCard({ 
  modelId, 
  onSubscribe,
  onCancel,
  isSubscribing,
  isCancelling,
  subscribeSuccess,
  cancelSuccess
}: { 
  modelId: number;
  onSubscribe: (id: number) => void;
  onCancel: (id: number) => void;
  isSubscribing: boolean;
  isCancelling: boolean;
  subscribeSuccess: boolean;
  cancelSuccess: boolean;
}) {
  const { t } = useTranslation();
  
  // 从合约读取模型信息
  const { data: modelData } = useReadContract({
    address: MODEL_SUBSCRIPTION_ADDRESS,
    abi: ModelSubscriptionTRXABI.abi as any,
    functionName: 'getModel',
    args: [BigInt(modelId)],
  });

  if (!modelData || !Array.isArray(modelData)) {
    return (
      <div className="model-card">
        <p>Loading model #{modelId}...</p>
      </div>
    );
  }

  const [, name, description, price, duration, provider, subscribers, active] = modelData;
  
  // 格式化价格（从 wei 转换为 USDT）
  const formattedPrice = formatUnits(price as bigint, 18);
  const durationDays = Number(duration);

  return (
    <div className="model-card">
      <div className="model-header">
        <div className="model-icon">🤖</div>
        <div className="model-info">
          <h3>{name as string}</h3>
          <p className="model-provider">{(provider as string).slice(0, 6)}...{(provider as string).slice(-4)}</p>
        </div>
        <div className="model-rating">
          <span className="rating-star">⭐</span>
          <span>4.5</span>
        </div>
      </div>

      <div className="model-description">
        <p>{description as string}</p>
      </div>

      <div className="model-stats">
        <div className="stat-item">
          <span className="stat-label">{t('modelMarket2.price')}</span>
          <span className="stat-value">1 TRX</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('modelMarket2.duration')}</span>
          <span className="stat-value">{durationDays} {t('modelMarket2.days')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{t('modelMarket2.subscribers')}</span>
          <span className="stat-value">{Number(subscribers)}</span>
        </div>
      </div>

      <div className="model-actions">
        <button
          className="btn-subscribe"
          onClick={() => onSubscribe(modelId)}
          disabled={isSubscribing || !active}
        >
          {isSubscribing ? t('modelMarket2.subscribing') : t('modelMarket2.subscribe')}
        </button>
      </div>
    </div>
  );
}

// 我的订阅卡片组件
function MySubscriptionCard({ 
  subscriptionId,
  onCancel,
  onRenew,
  isCancelling,
  isRenewing,
  cancelSuccess,
  renewSuccess
}: {
  subscriptionId: number;
  onCancel: (id: number) => void;
  onRenew: (id: number) => void;
  isCancelling: boolean;
  isRenewing: boolean;
  cancelSuccess: boolean;
  renewSuccess: boolean;
}) {
  const { t } = useTranslation();
  
  // 从合约读取订阅信息
  const { data: subscriptionData, refetch } = useReadContract({
    address: MODEL_SUBSCRIPTION_ADDRESS,
    abi: ModelSubscriptionTRXABI.abi as any,
    functionName: 'getSubscription',
    args: [BigInt(subscriptionId)],
  });

  // 刷新订阅数据
  useEffect(() => {
    if (cancelSuccess || renewSuccess) {
      refetch();
    }
  }, [cancelSuccess, renewSuccess, refetch]);

  if (!subscriptionData || !Array.isArray(subscriptionData)) {
    return (
      <div className="subscription-card">
        <p>Loading subscription #{subscriptionId}...</p>
      </div>
    );
  }

  const [, , modelId, startTime, endTime, price, status] = subscriptionData;
  
  // 读取模型信息
  const { data: modelData } = useReadContract({
    address: MODEL_SUBSCRIPTION_ADDRESS,
    abi: ModelSubscriptionTRXABI.abi as any,
    functionName: 'getModel',
    args: [modelId as bigint],
  });

  const now = Math.floor(Date.now() / 1000);
  const isActive = Number(status) === 0 && now < Number(endTime);
  const daysLeft = Math.ceil((Number(endTime) - now) / (24 * 60 * 60));
  
  const modelName = modelData && Array.isArray(modelData) ? (modelData[1] as string) : `Model #${Number(modelId)}`;
  const formattedPrice = formatUnits(price as bigint, 18);

  return (
    <div className={`subscription-card ${isActive ? 'active' : 'inactive'}`}>
      <div className="subscription-header">
        <div>
          <h4>{modelName}</h4>
          <span className={`status-badge status-${Number(status)}`}>
            {SubscriptionStatus[Number(status) as keyof typeof SubscriptionStatus]}
          </span>
        </div>
        <div className="subscription-price">
          1 TRX
        </div>
      </div>

      <div className="subscription-timeline">
        <div className="timeline-item">
          <span className="timeline-label">{t('modelMarket2.startDate')}</span>
          <span className="timeline-value">
            {new Date(Number(startTime) * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="timeline-item">
          <span className="timeline-label">{t('modelMarket2.endDate')}</span>
          <span className="timeline-value">
            {new Date(Number(endTime) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>

      {isActive && daysLeft > 0 && (
        <div className="days-left">
          <span className="days-number">{daysLeft}</span>
          <span className="days-label">{t('modelMarket2.daysLeft')}</span>
        </div>
      )}

      <div className="subscription-actions">
        {isActive && (
          <>
            <button
              className="btn-renew"
              onClick={() => onRenew(subscriptionId)}
              disabled={isRenewing}
            >
              {isRenewing ? t('modelMarket2.renewing') : t('modelMarket2.renew')}
            </button>
            <button
              className="btn-cancel"
              onClick={() => onCancel(subscriptionId)}
              disabled={isCancelling}
            >
              {isCancelling ? t('modelMarket2.cancelling') : t('modelMarket2.cancel')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function ModelMarket2() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mySubscriptions'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // 读取模型总数
  const { data: modelCount } = useReadContract({
    address: MODEL_SUBSCRIPTION_ADDRESS,
    abi: ModelSubscriptionTRXABI.abi as any,
    functionName: 'getModelCount',
  });

  // 读取用户的订阅列表
  const { data: userSubscriptionIds, refetch: refetchSubscriptions } = useReadContract({
    address: MODEL_SUBSCRIPTION_ADDRESS,
    abi: ModelSubscriptionTRXABI.abi as any,
    functionName: 'getUserSubscriptions',
    args: address ? [address] : undefined,
  });

  // 合约写入操作 - TRX 支付版本
  const { writeContract: createSubscription, data: subscribeHash } = useWriteContract();
  const { writeContract: renewSubscription, data: renewHash } = useWriteContract();
  const { writeContract: cancelSubscription, data: cancelHash } = useWriteContract();

  // 等待交易确认
  const { isLoading: isSubscribing, isSuccess: subscribeSuccess } = useWaitForTransactionReceipt({ hash: subscribeHash });
  const { isLoading: isRenewing, isSuccess: renewSuccess } = useWaitForTransactionReceipt({ hash: renewHash });
  const { isLoading: isCancelling, isSuccess: cancelSuccess } = useWaitForTransactionReceipt({ hash: cancelHash });

  // 生成模型ID列表
  const models = modelCount ? Array.from({ length: Number(modelCount) }, (_, i) => i + 1) : [];
  const mySubscriptions = userSubscriptionIds ? (userSubscriptionIds as bigint[]).map(id => Number(id)) : [];

  // 订阅成功后刷新数据
  useEffect(() => {
    if (subscribeSuccess || renewSuccess || cancelSuccess) {
      refetchSubscriptions();
      setSelectedModelId(null);
    }
  }, [subscribeSuccess, renewSuccess, cancelSuccess, refetchSubscriptions]);

  const handleSubscribe = async (modelId: number) => {
    setSelectedModelId(modelId);
    // TRX 支付版本：直接订阅，无需授权
    handleCreateSubscription(modelId);
  };

  const handleCreateSubscription = async (modelId: number) => {
    // 订阅 30 天，支付 1 TRX
    const duration = 30;
    const value = parseUnits("1", 6); // 1 TRX = 1,000,000 sun
    
    createSubscription({
      address: MODEL_SUBSCRIPTION_ADDRESS,
      abi: ModelSubscriptionTRXABI.abi as any,
      functionName: 'createSubscription',
      args: [BigInt(modelId), BigInt(duration)],
      value: value, // 发送 1 TRX
    });
  };

  const handleRenew = async (subscriptionId: number) => {
    const value = parseUnits("1", 6); // 1 TRX
    
    renewSubscription({
      address: MODEL_SUBSCRIPTION_ADDRESS,
      abi: ModelSubscriptionTRXABI.abi as any,
      functionName: 'renewSubscription',
      args: [BigInt(subscriptionId)],
      value: value, // 发送 1 TRX
    });
  };

  const handleCancel = async (subscriptionId: number) => {
    cancelSubscription({
      address: MODEL_SUBSCRIPTION_ADDRESS,
      abi: ModelSubscriptionTRXABI.abi as any,
      functionName: 'cancelSubscription',
      args: [BigInt(subscriptionId)],
    });
  };

  if (!isConnected) {
    return (
      <div className="model-market2-container">
        <div className="connect-wallet-prompt">
          <div className="prompt-icon">🔐</div>
          <h2>{t('modelMarket2.connectWallet')}</h2>
          <p>{t('modelMarket2.pleaseConnectWalletToAccessModels')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="model-market2-container">
      {/* 页面头部 */}
      <div className="market-header">
        <div className="header-content">
          <h1 className="market-title">
            <span className="title-icon">🧠</span>
            {t('modelMarket2.title')}
          </h1>
          <p className="market-subtitle">{t('modelMarket2.subscribeToAIModels')}</p>
        </div>

        {/* 用户余额卡片 */}
        <div className="balance-card">
          <div className="balance-item">
            <span className="balance-label">{t('modelMarket2.network')}</span>
            <span className="balance-value">TRON Nile</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">{t('modelMarket2.activeSubscriptions')}</span>
            <span className="balance-value">{mySubscriptions.length}</span>
          </div>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          <span className="tab-icon">🛒</span>
          {t('modelMarket2.marketplace')}
        </button>
        <button
          className={`tab-button ${activeTab === 'mySubscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('mySubscriptions')}
        >
          <span className="tab-icon">📋</span>
          {t('modelMarket2.mySubscriptions')}
        </button>
      </div>

      {/* 市场页面 */}
      {activeTab === 'marketplace' && (
        <div className="marketplace-content">
          {/* 分类筛选 */}
          <div className="category-filter">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {t('modelMarket2.all')}
            </button>
            <button
              className={`category-btn ${selectedCategory === 'trading' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('trading')}
            >
              {t('modelMarket2.trading')}
            </button>
            <button
              className={`category-btn ${selectedCategory === 'risk' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('risk')}
            >
              {t('modelMarket2.riskAnalysis')}
            </button>
            <button
              className={`category-btn ${selectedCategory === 'prediction' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('prediction')}
            >
              {t('modelMarket2.prediction')}
            </button>
          </div>

          {/* 模型网格 */}
          <div className="models-grid">
            {models.map((modelId) => (
              <ModelCard
                key={modelId}
                modelId={modelId}
                onSubscribe={handleSubscribe}
                onCancel={handleCancel}
                isSubscribing={isSubscribing}
                isCancelling={isCancelling}
                subscribeSuccess={false}
                cancelSuccess={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* 我的订阅页面 */}
      {activeTab === 'mySubscriptions' && (
        <div className="my-subscriptions-content">
          {mySubscriptions.length > 0 ? (
            <div className="subscriptions-grid">
              {mySubscriptions.map((subscriptionId) => (
                <MySubscriptionCard
                  key={subscriptionId}
                  subscriptionId={subscriptionId}
                  onCancel={handleCancel}
                  onRenew={handleRenew}
                  isCancelling={isCancelling}
                  isRenewing={isRenewing}
                  cancelSuccess={false}
                  renewSuccess={false}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>{t('modelMarket2.noSubscriptions')}</h3>
              <p>{t('modelMarket2.startBySubscribingToModels')}</p>
              <button
                className="btn-browse"
                onClick={() => setActiveTab('marketplace')}
              >
                {t('modelMarket2.browseModels')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 订阅说明 */}
      <div className="subscription-info">
        <h3>{t('modelMarket2.howItWorks')}</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">1️⃣</div>
            <h4>{t('modelMarket2.chooseModel')}</h4>
            <p>{t('modelMarket2.browseAndSelectAIModel')}</p>
          </div>
          <div className="info-item">
            <div className="info-icon">2️⃣</div>
            <h4>{t('modelMarket2.subscribe')}</h4>
            <p>Pay with 1 TRX to subscribe</p>
          </div>
          <div className="info-item">
            <div className="info-icon">3️⃣</div>
            <h4>{t('modelMarket2.useModel')}</h4>
            <p>{t('modelMarket2.accessModelDuringSubscription')}</p>
          </div>
          <div className="info-item">
            <div className="info-icon">4️⃣</div>
            <h4>{t('modelMarket2.manageSubscription')}</h4>
            <p>{t('modelMarket2.renewOrCancelAnytime')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
