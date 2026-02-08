// 动态加载合约地址
// 根据当前网络自动选择正确的合约地址

import localAddresses from './contract-addresses.json';

// 尝试加载 Nile 测试网地址
let nileAddresses: any = null;
try {
  nileAddresses = require('./contract-addresses-nile.json');
} catch (e) {
  console.log('Nile addresses not found, using local addresses');
}

// 网络配置
export const NETWORKS = {
  LOCAL: 1337,
  NILE: 3448148188,
} as const;

// 获取当前网络的合约地址
export function getContractAddresses(chainId?: number) {
  const currentChainId = chainId || NETWORKS.LOCAL;
  
  if (currentChainId === NETWORKS.NILE && nileAddresses) {
    return {
      usdt: nileAddresses.contracts.USDT || nileAddresses.contracts.MockERC20,
      modelSubscription: nileAddresses.contracts.ModelSubscription,
      network: 'nile',
      explorer: nileAddresses.explorer,
    };
  }
  
  // 默认返回本地地址
  return {
    usdt: localAddresses.contracts?.MockERC20 || localAddresses.contracts?.USDT,
    modelSubscription: localAddresses.contracts?.ModelSubscription,
    network: 'local',
    explorer: null,
  };
}

// 导出默认地址（用于向后兼容）
const defaultAddresses = getContractAddresses();

export const USDT_ADDRESS = defaultAddresses.usdt as `0x${string}`;
export const MODEL_SUBSCRIPTION_ADDRESS = defaultAddresses.modelSubscription as `0x${string}`;

// 导出网络信息
export const CURRENT_NETWORK = defaultAddresses.network;
export const EXPLORER_URLS = defaultAddresses.explorer;
