import { http, createConfig } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// TRON Nile 测试网配置
const tronNile = {
  id: 3448148188,
  name: 'TRON Nile Testnet',
  nativeCurrency: {
    name: 'TRX',
    symbol: 'TRX',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['https://nile.trongrid.io'] },
    public: { http: ['https://nile.trongrid.io'] },
  },
  blockExplorers: {
    default: { 
      name: 'Tronscan', 
      url: 'https://nile.tronscan.org' 
    },
  },
  testnet: true,
};

// Hardhat 本地网络配置
const hardhatLocal = {
  ...localhost,
  id: 1337,
  name: 'Hardhat Local',
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
};

// 仅使用 injected（MetaMask/OKX）
const connectors = [
  injected({
    shimDisconnect: true,
  }),
];

// 配置 Wagmi - 默认使用 TRON Nile 测试网
export const wagmiConfig = createConfig({
  chains: [tronNile, hardhatLocal],
  connectors,
  transports: {
    [tronNile.id]: http('https://nile.trongrid.io'),
    [hardhatLocal.id]: http('http://127.0.0.1:8545'),
  },
  ssr: false,
});
