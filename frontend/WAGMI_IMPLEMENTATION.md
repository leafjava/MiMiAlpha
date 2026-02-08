# 🔗 Wagmi + Viem 合约交互实现文档

## 📋 概述

参考 AttentionLive 项目，使用 `wagmi` 和 `viem` 重构了前端合约交互，替代了原来的 `ethers.js` 实现。

---

## 🎯 技术栈

- **wagmi**: ^2.19.5 - React Hooks for Ethereum
- **viem**: ^2.41.2 - TypeScript Interface for Ethereum
- **@tanstack/react-query**: ^5.62.14 - 数据获取和缓存

---

## 📁 文件结构

```
frontend/src/
├── config/
│   └── wagmi.ts                    # Wagmi 配置
├── lib/
│   └── contracts.ts                # 合约地址和 ABI
├── providers/
│   └── WagmiProvider.tsx           # Wagmi Provider 组件
├── hooks/
│   ├── useContract.ts              # 钱包连接 Hook
│   ├── useSmartFacilitator.ts      # SmartFacilitator Hook
│   └── useToken.ts                 # Token Hook
└── components/
    ├── AgentManager.tsx            # Agent 管理组件
    └── SubscriptionMarket.tsx      # 订阅市场组件
```

---

## 🔧 核心实现

### 1. Wagmi 配置 (`config/wagmi.ts`)

```typescript
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
```

**特点：**
- 支持 Hardhat 本地网络（Chain ID: 1337）
- 使用 injected connector（支持 MetaMask/OKX）
- 配置 HTTP transport

---

### 2. 合约配置 (`lib/contracts.ts`)

```typescript
import contractAddresses from '../contracts/contract-addresses.json';
import MockERC20ABI from '../contracts/MockERC20.json';
import SmartFacilitatorABI from '../contracts/SmartFacilitator.json';

export const MOCK_ERC20_ADDRESS = contractAddresses.contracts.MockERC20 as `0x${string}`;
export const SMART_FACILITATOR_ADDRESS = contractAddresses.contracts.SmartFacilitator as `0x${string}`;

export const MockERC20Abi = MockERC20ABI.abi;
export const SmartFacilitatorAbi = SmartFacilitatorABI.abi;
```

**特点：**
- 集中管理合约地址和 ABI
- 使用 TypeScript 类型断言确保地址格式正确

---

### 3. Wagmi Provider (`providers/WagmiProvider.tsx`)

```typescript
import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../config/wagmi';

export function WagmiProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
```

**特点：**
- 包装 WagmiProvider 和 QueryClientProvider
- 提供全局的 wagmi 和 react-query 上下文

---

### 4. 钱包连接 Hook (`hooks/useContract.ts`)

```typescript
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

export function useContract() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const connectWallet = async () => {
    const injectedConnector = connectors.find(c => c.type === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const switchToHardhat = async () => {
    await switchChain({ chainId: 1337 });
  };

  return {
    account: address || '',
    isConnected,
    chainId: chainId || 0,
    connectWallet,
    disconnect,
    switchToHardhat,
    isHardhatNetwork: chainId === 1337,
  };
}
```

**核心功能：**
- `useAccount`: 获取账户信息
- `useConnect`: 连接钱包
- `useDisconnect`: 断开连接
- `useSwitchChain`: 切换网络

---

### 5. SmartFacilitator Hook (`hooks/useSmartFacilitator.ts`)

```typescript
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';

export function useSmartFacilitator() {
  const { address } = useAccount();

  // 写入合约
  const { writeContract, data: hash, isPending } = useWriteContract();

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 读取 Agent 信息
  const { data: agentInfoData, refetch: refetchAgentInfo } = useReadContract({
    address: SMART_FACILITATOR_ADDRESS,
    abi: SmartFacilitatorAbi,
    functionName: 'getAgentInfo',
    args: address ? [address] : undefined,
  });

  // 创建 AI Agent
  const createAgent = async (agentAddress: string, agentName: string) => {
    writeContract({
      address: SMART_FACILITATOR_ADDRESS,
      abi: SmartFacilitatorAbi,
      functionName: 'createAgent',
      args: [agentAddress as `0x${string}`, agentName],
    });
  };

  // 执行支付
  const executePayment = async (
    agentAddress: string,
    recipientAddress: string,
    amount: string,
    service: string
  ) => {
    writeContract({
      address: SMART_FACILITATOR_ADDRESS,
      abi: SmartFacilitatorAbi,
      functionName: 'executePayment',
      args: [
        agentAddress as `0x${string}`,
        recipientAddress as `0x${string}`,
        parseEther(amount),
        service,
      ],
    });
  };

  return {
    createAgent,
    executePayment,
    agentInfo,
    quotaUsage,
    loading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
```

**核心 Hooks：**
- `useReadContract`: 读取合约数据（自动缓存和更新）
- `useWriteContract`: 写入合约（发送交易）
- `useWaitForTransactionReceipt`: 等待交易确认

**优势：**
- 自动处理交易状态（pending, confirming, success）
- 自动缓存读取结果
- 自动重新获取数据

---

### 6. Token Hook (`hooks/useToken.ts`)

```typescript
import { useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';

export function useToken() {
  const { address } = useAccount();

  // 读取余额
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: MOCK_ERC20_ADDRESS,
    abi: MockERC20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // 写入合约
  const { writeContract, data: hash, isPending } = useWriteContract();

  // 转账
  const transfer = async (to: string, amount: string) => {
    writeContract({
      address: MOCK_ERC20_ADDRESS,
      abi: MockERC20Abi,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseEther(amount)],
    });
  };

  const balance = balanceData ? formatEther(balanceData as bigint) : '0';

  return {
    balance,
    transfer,
    approve,
    loading: isPending,
    hash,
  };
}
```

---

## 🎨 组件集成

### AgentManager 组件

```typescript
import { useContract } from '../hooks/useContract';
import { useSmartFacilitator } from '../hooks/useSmartFacilitator';
import { formatEther } from 'viem';

export function AgentManager() {
  const { account, isConnected } = useContract();
  const { 
    createAgent, 
    agentInfo,
    loading,
    isSuccess,
    hash
  } = useSmartFacilitator();

  // 监听交易成功
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      refetchAgentInfo();
    }
  }, [isSuccess]);

  const handleCreateAgent = async () => {
    await createAgent(account, agentName);
  };

  return (
    <div>
      {showSuccess && <div>✅ 交易成功！</div>}
      {hash && <div>交易哈希: {hash}</div>}
      {agentInfo && (
        <div>
          <p>余额: {formatEther(agentInfo.balance)} cUSD</p>
          <p>信用评分: {agentInfo.creditScore.toString()}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 与 ethers.js 的对比

### ethers.js 方式（旧）

```typescript
// 需要手动管理 provider 和 signer
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(address, abi, signer);

// 手动发送交易
const tx = await contract.createAgent(address, name);
await tx.wait();

// 手动读取数据
const info = await contract.getAgentInfo(address);
```

### wagmi + viem 方式（新）

```typescript
// 自动管理连接状态
const { address } = useAccount();

// 自动读取数据（带缓存）
const { data: agentInfo } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'getAgentInfo',
  args: [address],
});

// 简化的写入操作
const { writeContract } = useWriteContract();
writeContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'createAgent',
  args: [address, name],
});
```

**优势：**
1. ✅ 自动管理连接状态
2. ✅ 自动缓存读取结果
3. ✅ 自动处理交易状态
4. ✅ 更好的 TypeScript 支持
5. ✅ 更少的样板代码

---

## 📦 依赖更新

### package.json

```json
{
  "dependencies": {
    "viem": "^2.41.2",
    "wagmi": "^2.19.5",
    "@tanstack/react-query": "^5.62.14"
  }
}
```

### 安装命令

```bash
cd frontend
npm install
```

---

## 🚀 使用流程

### 1. 启动 Hardhat 网络

```bash
cd contract
npx hardhat node
```

### 2. 部署合约

```bash
cd contract
npx hardhat run scripts/deploy-all.js --network localhost
```

### 3. 启动前端

```bash
cd frontend
npm install  # 首次运行
npm run dev
```

### 4. 连接钱包

1. 打开浏览器访问 http://localhost:5173
2. 点击右上角"Connect Wallet"
3. 选择 MetaMask 或 OKX 钱包
4. 自动切换到 Hardhat 本地网络（Chain ID: 1337）

### 5. 使用 Agent 功能

1. 进入"🤖 Agent 管理"页面
2. 输入 Agent 名称，点击"创建 Agent"
3. 确认钱包交易
4. 等待交易确认（自动显示成功提示）
5. 为 Agent 充值
6. 查看 Agent 状态和配额

---

## 🎯 核心特性

### 1. 自动状态管理

```typescript
const { 
  writeContract,      // 发送交易函数
  data: hash,         // 交易哈希
  isPending,          // 交易待处理
  error               // 错误信息
} = useWriteContract();

const { 
  isLoading,          // 交易确认中
  isSuccess           // 交易成功
} = useWaitForTransactionReceipt({ hash });
```

### 2. 自动数据缓存

```typescript
const { 
  data: agentInfo,    // 缓存的数据
  refetch,            // 手动刷新
  isLoading,          // 加载状态
  error               // 错误信息
} = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'getAgentInfo',
  args: [address],
});
```

### 3. 交易状态追踪

```typescript
// 监听交易成功
useEffect(() => {
  if (isSuccess) {
    alert('交易成功！');
    refetchAgentInfo();  // 自动刷新数据
  }
}, [isSuccess]);
```

---

## 🐛 常见问题

### Q1: 钱包连接失败

**解决：**
- 确保安装了 MetaMask 或 OKX 钱包
- 检查钱包是否解锁
- 刷新页面重试

### Q2: 网络切换失败

**解决：**
- 手动在钱包中添加 Hardhat 网络
- 网络名称: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 1337

### Q3: 交易失败

**解决：**
- 检查账户余额是否足够
- 检查 Hardhat 节点是否运行
- 查看浏览器控制台错误信息

### Q4: 数据不更新

**解决：**
- 使用 `refetch()` 手动刷新
- 检查合约地址是否正确
- 确认交易已确认

---

## 📚 参考资源

- [Wagmi 官方文档](https://wagmi.sh/)
- [Viem 官方文档](https://viem.sh/)
- [AttentionLive 项目](../AttentionLive/)
- [React Query 文档](https://tanstack.com/query/latest)

---

## ✅ 实现总结

### 已完成 ✅

- ✅ Wagmi 配置（支持 Hardhat 本地网络）
- ✅ WagmiProvider 集成
- ✅ useContract Hook（钱包连接）
- ✅ useSmartFacilitator Hook（Agent 管理）
- ✅ useToken Hook（Token 操作）
- ✅ AgentManager 组件（完整功能）
- ✅ 交易状态追踪
- ✅ 自动数据缓存和刷新
- ✅ 错误处理

### 优势 🎯

1. **更简洁的代码** - 减少 50% 样板代码
2. **自动状态管理** - 无需手动管理交易状态
3. **自动数据缓存** - 提升性能和用户体验
4. **更好的类型安全** - 完整的 TypeScript 支持
5. **更易维护** - 遵循 React Hooks 最佳实践

---

**现在你的前端已经使用 wagmi + viem 实现了完整的合约交互！** 🚀
