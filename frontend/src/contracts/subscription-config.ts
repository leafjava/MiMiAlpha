// Model Subscription contract addresses
// 使用 TRX 原生代币支付版本
import { getContractAddresses, NETWORKS } from './load-addresses';

// 获取 TRX 支付版本的合约地址
let trxAddresses: any = null;
try {
  trxAddresses = require('./contract-addresses-trx-nile.json');
} catch (e) {
  console.log('TRX addresses not found');
}

// 优先使用 TRX 支付版本
const addresses = trxAddresses || getContractAddresses();

// 导出合约地址
export const MODEL_SUBSCRIPTION_ADDRESS = (
  trxAddresses?.contracts?.ModelSubscriptionTRX || 
  addresses.modelSubscription
) as `0x${string}`;

// TRX 支付版本不需要 USDT 代币
export const USDT_TOKEN_ADDRESS = addresses.usdt as `0x${string}`;

// 支付方式配置
export const PAYMENT_METHOD = trxAddresses ? 'TRX' : 'USDT';
export const MODEL_PRICE = trxAddresses?.modelPrice || '100 USDT';

// TRON Nile 测试网配置
export const TRON_NILE_CONFIG = {
  chainId: 3448148188,
  rpcUrl: 'https://nile.trongrid.io',
  explorer: 'https://nile.tronscan.org',
  name: 'TRON Nile Testnet',
};

// 导出网络常量
export { NETWORKS, getContractAddresses };

// Contract configuration
export const SUBSCRIPTION_CONFIG = {
  minSubscriptionDuration: 1, // 1 day
  maxSubscriptionDuration: 365, // 365 days
  platformFeeRate: 300, // 3% = 300 basis points
  cancelRefundRate: 5000, // 50% refund on cancellation
};

// 模拟的模型数据 (在合约部署前使用)
// 注意：实际价格为 1 TRX，这里显示的是 TRX 单位
export const MOCK_MODELS = [
  {
    id: 1,
    name: "AI Trading Bot Pro",
    description: "Advanced AI model for automated trading strategies with real-time market analysis",
    price: "1", // TRX
    duration: 30, // days
    provider: "0x1234567890123456789012345678901234567890",
    rating: 4.8,
    subscribers: 256,
    category: "trading"
  },
  {
    id: 2,
    name: "Risk Assessment AI",
    description: "Comprehensive risk analysis model for DeFi protocols and smart contracts",
    price: "1", // TRX
    duration: 30,
    provider: "0x2345678901234567890123456789012345678901",
    rating: 4.6,
    subscribers: 189,
    category: "risk"
  },
  {
    id: 3,
    name: "Market Predictor",
    description: "Machine learning model for cryptocurrency price prediction and trend analysis",
    price: "1", // TRX
    duration: 30,
    provider: "0x3456789012345678901234567890123456789012",
    rating: 4.9,
    subscribers: 342,
    category: "prediction"
  },
  {
    id: 4,
    name: "Portfolio Optimizer",
    description: "AI-powered portfolio optimization and rebalancing recommendations",
    price: "1", // TRX
    duration: 30,
    provider: "0x4567890123456789012345678901234567890123",
    rating: 4.5,
    subscribers: 178,
    category: "trading"
  },
  {
    id: 5,
    name: "Smart Contract Auditor",
    description: "Automated smart contract vulnerability detection and security analysis",
    price: "1", // TRX
    duration: 30,
    provider: "0x5678901234567890123456789012345678901234",
    rating: 4.7,
    subscribers: 203,
    category: "risk"
  },
  {
    id: 6,
    name: "Sentiment Analyzer",
    description: "Real-time social media and news sentiment analysis for crypto markets",
    price: "1", // TRX
    duration: 30,
    provider: "0x6789012345678901234567890123456789012345",
    rating: 4.4,
    subscribers: 145,
    category: "prediction"
  }
];
