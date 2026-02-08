import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

export function useContract() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // 连接钱包
  const connectWallet = async () => {
    const injectedConnector = connectors.find(c => c.type === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  // 切换到 Hardhat 本地网络
  const switchToHardhat = async () => {
    try {
      await switchChain({ chainId: 1337 });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
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
