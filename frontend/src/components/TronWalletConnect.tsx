import { useState, useEffect } from 'react';
import './TronWalletConnect.css';

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
    okxwallet?: {
      tronLink?: {
        ready?: boolean;
        tronWeb?: any;
        request?: (args: { method: string }) => Promise<any>;
      };
    };
  }
}

interface TronWalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function TronWalletConnect({ onConnect, onDisconnect }: TronWalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [walletType, setWalletType] = useState<'tronlink' | 'okx' | null>(null);

  // 检测钱包
  const detectWallet = async () => {
    // 检查 TronLink
    if (window.tronWeb && window.tronWeb.ready) {
      return 'tronlink';
    }
    
    // 检查 OKX
    if (window.okxwallet?.tronLink) {
      return 'okx';
    }
    
    // 等待钱包加载
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (window.tronWeb && window.tronWeb.ready) {
      return 'tronlink';
    }
    
    if (window.okxwallet?.tronLink) {
      return 'okx';
    }
    
    return null;
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      const wallet = await detectWallet();
      
      if (!wallet) {
        alert('请安装 TronLink 或 OKX 钱包！');
        return;
      }

      setWalletType(wallet);

      // 请求连接
      if (wallet === 'tronlink') {
        if (!window.tronWeb || !window.tronWeb.ready) {
          alert('请先解锁 TronLink 钱包！');
          return;
        }

        const tronWeb = window.tronWeb;
        const userAddress = tronWeb.defaultAddress.base58;
        
        if (!userAddress) {
          alert('请在 TronLink 中选择一个账户！');
          return;
        }

        // 检查网络
        const fullNode = tronWeb.fullNode.host;
        let networkName = 'Unknown';
        
        if (fullNode.includes('nile')) {
          networkName = 'Nile Testnet';
        } else if (fullNode.includes('shasta')) {
          networkName = 'Shasta Testnet';
        } else if (fullNode.includes('api.trongrid.io')) {
          networkName = 'Mainnet';
        }

        // 获取余额
        const balanceInSun = await tronWeb.trx.getBalance(userAddress);
        const balanceInTRX = tronWeb.fromSun(balanceInSun);

        setAddress(userAddress);
        setNetwork(networkName);
        setBalance(balanceInTRX);
        setIsConnected(true);

        if (onConnect) {
          onConnect(userAddress);
        }

        console.log('✅ TronLink 连接成功:', {
          address: userAddress,
          network: networkName,
          balance: balanceInTRX + ' TRX'
        });

      } else if (wallet === 'okx') {
        // OKX 钱包连接
        if (window.okxwallet?.tronLink?.request) {
          await window.okxwallet.tronLink.request({ method: 'tron_requestAccounts' });
        }

        const tronWeb = window.tronWeb || window.okxwallet?.tronLink?.tronWeb;
        
        if (!tronWeb) {
          alert('OKX 钱包未正确加载！');
          return;
        }

        const userAddress = tronWeb.defaultAddress?.base58 || tronWeb.address?.base58;
        
        if (!userAddress) {
          alert('请在 OKX 钱包中选择一个 TRON 账户！');
          return;
        }

        // 检查网络
        const fullNode = tronWeb.fullNode?.host || tronWeb.fullNode;
        let networkName = 'Unknown';
        
        if (typeof fullNode === 'string') {
          if (fullNode.includes('nile')) {
            networkName = 'Nile Testnet';
          } else if (fullNode.includes('shasta')) {
            networkName = 'Shasta Testnet';
          } else if (fullNode.includes('api.trongrid.io')) {
            networkName = 'Mainnet';
          }
        }

        // 获取余额
        try {
          const balanceInSun = await tronWeb.trx.getBalance(userAddress);
          const balanceInTRX = tronWeb.fromSun(balanceInSun);
          setBalance(balanceInTRX);
        } catch (e) {
          console.error('获取余额失败:', e);
          setBalance('0');
        }

        setAddress(userAddress);
        setNetwork(networkName);
        setIsConnected(true);

        if (onConnect) {
          onConnect(userAddress);
        }

        console.log('✅ OKX 钱包连接成功:', {
          address: userAddress,
          network: networkName,
          balance: balance + ' TRX'
        });
      }

    } catch (error) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败: ' + (error as Error).message);
    }
  };

  // 断开连接
  const disconnectWallet = () => {
    setAddress('');
    setIsConnected(false);
    setNetwork('');
    setBalance('0');
    setWalletType(null);
    
    if (onDisconnect) {
      onDisconnect();
    }
  };

  // 监听账户变化
  useEffect(() => {
    const handleAccountsChanged = () => {
      console.log('账户已更改，重新连接...');
      if (isConnected) {
        connectWallet();
      }
    };

    if (window.tronWeb) {
      window.addEventListener('message', (e) => {
        if (e.data.message && e.data.message.action === 'accountsChanged') {
          handleAccountsChanged();
        }
      });
    }

    return () => {
      window.removeEventListener('message', handleAccountsChanged);
    };
  }, [isConnected]);

  // 格式化地址
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="tron-wallet-connect">
      {!isConnected ? (
        <button className="connect-button" onClick={connectWallet}>
          <span className="wallet-icon">🔗</span>
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="wallet-address">
              <span className="address-icon">👤</span>
              <span className="address-text">{formatAddress(address)}</span>
            </div>
            <div className="wallet-network">
              <span className="network-icon">🌐</span>
              <span className="network-text">{network}</span>
            </div>
            <div className="wallet-balance">
              <span className="balance-icon">💰</span>
              <span className="balance-text">{parseFloat(balance).toFixed(2)} TRX</span>
            </div>
          </div>
          <button className="disconnect-button" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
      
      {!isConnected && (
        <div className="wallet-hint">
          <p>请确保已安装 TronLink 或 OKX 钱包</p>
          <p>并切换到 <strong>Nile 测试网</strong></p>
        </div>
      )}
    </div>
  );
}
