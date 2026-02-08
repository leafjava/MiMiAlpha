// TRON 网络配置
export const TRON_CONFIG = {
  // TronGrid API 配置（主网）
  mainnet: {
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
    apiKey: '', // 可选，提高请求限制
  },
  
  // Nile 测试网（推荐用于开发和演示）
  nile: {
    fullNode: 'https://nile.trongrid.io',
    solidityNode: 'https://nile.trongrid.io',
    eventServer: 'https://nile.trongrid.io',
    apiKey: '', // 测试网无需 API key，QPS 限流 50 单 IP
    explorer: 'https://nile.tronscan.org',
    faucet: 'https://nileex.io/join/getJoinPage', // 水龙头地址
  },
  
  // Shasta 测试网
  shasta: {
    fullNode: 'https://api.shasta.trongrid.io',
    solidityNode: 'https://api.shasta.trongrid.io',
    eventServer: 'https://api.shasta.trongrid.io',
    apiKey: '',
  },
};

// 当前使用的网络（使用 Nile 测试网）
export const CURRENT_NETWORK = TRON_CONFIG.nile;

// TronScan API（用于更详细的数据）
export const TRONSCAN_API = {
  base: 'https://nileapi.tronscan.org',
  
  // 账户信息
  getAccount: (address: string) => 
    `https://nileapi.tronscan.org/api/account?address=${address}`,
  
  // 交易列表
  getTransactions: (address: string, limit = 20) => 
    `https://nileapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=${limit}&start=0&address=${address}`,
  
  // TRC20 交易
  getTRC20Transfers: (address: string, limit = 20) => 
    `https://nileapi.tronscan.org/api/token_trc20/transfers?limit=${limit}&start=0&relatedAddress=${address}`,
};

// TronGrid API 端点
export const TRON_API = {
  // 账户信息
  getAccount: (address: string) => 
    `${CURRENT_NETWORK.fullNode}/v1/accounts/${address}`,
  
  // 交易历史
  getTransactions: (address: string, limit = 20) => 
    `${CURRENT_NETWORK.fullNode}/v1/accounts/${address}/transactions?limit=${limit}`,
  
  // TRC20 交易
  getTRC20Transactions: (address: string, limit = 20) => 
    `${CURRENT_NETWORK.fullNode}/v1/accounts/${address}/transactions/trc20?limit=${limit}`,
  
  // 账户资源
  getAccountResources: (address: string) => 
    `${CURRENT_NETWORK.fullNode}/wallet/getaccountresource`,
  
  // 交易详情
  getTransaction: (txId: string) => 
    `${CURRENT_NETWORK.fullNode}/wallet/gettransactionbyid`,
};

// 请求头配置
export const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (CURRENT_NETWORK.apiKey) {
    headers['TRON-PRO-API-KEY'] = CURRENT_NETWORK.apiKey;
  }
  
  return headers;
};

// 测试网水龙头信息
export const FAUCET_INFO = {
  url: 'https://nileex.io/join/getJoinPage',
  dailyLimit: '2000 TRX',
  note: '每个 IP 每天可领取 2000 TRX',
};
