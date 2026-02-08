import { useState, useEffect } from 'react';

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
    okxwallet?: {
      tronLink?: any;
    };
  }
}

export function useContract() {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number>(0);

  // 检查TronLink连接状态
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 检查 TronLink
        if (window.tronWeb && window.tronWeb.ready) {
          const tronWeb = window.tronWeb;
          const userAddress = tronWeb.defaultAddress?.base58;
          
          if (userAddress) {
            setAddress(userAddress);
            setIsConnected(true);
            
            // 检查网络
            const fullNode = tronWeb.fullNode?.host || '';
            if (fullNode.includes('nile')) {
              setChainId(3448148188); // Nile testnet
            } else if (fullNode.includes('shasta')) {
              setChainId(2494104990); // Shasta testnet
            } else {
              setChainId(728126428); // Mainnet
            }
            
            return;
          }
        }
        
        // 检查 OKX
        if (window.okxwallet?.tronLink) {
          const tronWeb = window.tronWeb || window.okxwallet.tronLink.tronWeb;
          if (tronWeb) {
            const userAddress = tronWeb.defaultAddress?.base58 || tronWeb.address?.base58;
            
            if (userAddress) {
              setAddress(userAddress);
              setIsConnected(true);
              
              const fullNode = tronWeb.fullNode?.host || tronWeb.fullNode || '';
              if (typeof fullNode === 'string') {
                if (fullNode.includes('nile')) {
                  setChainId(3448148188);
                } else if (fullNode.includes('shasta')) {
                  setChainId(2494104990);
                } else {
                  setChainId(728126428);
                }
              }
              
              return;
            }
          }
        }
        
        // 未连接
        setAddress('');
        setIsConnected(false);
        setChainId(0);
        
      } catch (error) {
        console.error('检查连接状态失败:', error);
        setIsConnected(false);
      }
    };

    // 初始检查
    checkConnection();

    // 定期检查连接状态
    const interval = setInterval(checkConnection, 2000);

    // 监听账户变化
    const handleAccountsChanged = () => {
      checkConnection();
    };

    if (window.tronWeb) {
      window.addEventListener('message', (e) => {
        if (e.data.message && e.data.message.action === 'accountsChanged') {
          handleAccountsChanged();
        }
      });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleAccountsChanged);
    };
  }, []);

  // 连接钱包
  const connectWallet = async () => {
    try {
      // 等待钱包加载
      await new Promise(resolve => setTimeout(resolve, 500));

      // 检查 TronLink
      if (window.tronWeb && window.tronWeb.ready) {
        const tronWeb = window.tronWeb;
        const userAddress = tronWeb.defaultAddress.base58;
        
        if (!userAddress) {
          alert('请在 TronLink 中选择一个账户！');
          return;
        }

        setAddress(userAddress);
        setIsConnected(true);
        
        console.log('✅ TronLink 连接成功:', userAddress);
        return;
      }

      // 检查 OKX
      if (window.okxwallet?.tronLink) {
        if (window.okxwallet.tronLink.request) {
          await window.okxwallet.tronLink.request({ method: 'tron_requestAccounts' });
        }

        const tronWeb = window.tronWeb || window.okxwallet.tronLink.tronWeb;
        
        if (!tronWeb) {
          alert('OKX 钱包未正确加载！');
          return;
        }

        const userAddress = tronWeb.defaultAddress?.base58 || tronWeb.address?.base58;
        
        if (!userAddress) {
          alert('请在 OKX 钱包中选择一个 TRON 账户！');
          return;
        }

        setAddress(userAddress);
        setIsConnected(true);
        
        console.log('✅ OKX 钱包连接成功:', userAddress);
        return;
      }

      alert('请安装 TronLink 或 OKX 钱包！\n\n确保钱包已切换到 TRON Nile 测试网。');
      
    } catch (error) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败: ' + (error as Error).message);
    }
  };

  // 断开连接
  const disconnect = () => {
    setAddress('');
    setIsConnected(false);
    setChainId(0);
  };

  // 切换到 Nile 测试网（提示用户手动切换）
  const switchToHardhat = async () => {
    alert('请在 TronLink 钱包中手动切换到 Nile 测试网');
  };

  return {
    account: address,
    isConnected,
    chainId,
    connectWallet,
    disconnect,
    switchToHardhat,
    isHardhatNetwork: chainId === 3448148188, // Nile testnet
  };
}
