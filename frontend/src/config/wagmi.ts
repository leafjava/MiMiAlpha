import { http, createConfig } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

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

// 配置 Wagmi
export const wagmiConfig = createConfig({
  chains: [hardhatLocal],
  connectors,
  transports: {
    [hardhatLocal.id]: http('http://127.0.0.1:8545'),
  },
  ssr: false,
});
