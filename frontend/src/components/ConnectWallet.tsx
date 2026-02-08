import { useState, useEffect } from 'react';
import { Wallet, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Window interface is declared in AppContext.tsx

// 检测钱包类型的辅助函数
const getWalletIcon = () => {
    if (typeof window === 'undefined') return null;
    
    if (window.okxwallet?.tronLink) {
        return '🦊 OKX';
    }
    if (window.tronWeb && window.tronLink) {
        return '🔴 TronLink';
    }
    return '🔗';
};

export const ConnectWallet = () => {
    const { t } = useTranslation();
    const [account, setAccount] = useState<string>('');
    const [balance, setBalance] = useState<string>('0');
    const [network, setNetwork] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const walletIcon = getWalletIcon();

    // 检测并连接钱包
    const connectWallet = async () => {
        setLoading(true);
        try {
            // 等待钱包加载
            await new Promise(resolve => setTimeout(resolve, 500));

            // 检查 TronLink
            if (window.tronWeb && window.tronWeb.ready) {
                const tronWeb = window.tronWeb;
                const userAddress = tronWeb.defaultAddress.base58;
                
                if (!userAddress) {
                    alert('请在 TronLink 中选择一个账户！');
                    setLoading(false);
                    return;
                }

                // 检查网络
                const fullNode = tronWeb.fullNode.host;
                let networkName = 'Unknown';
                
                if (fullNode.includes('nile')) {
                    networkName = 'Nile';
                } else if (fullNode.includes('shasta')) {
                    networkName = 'Shasta';
                } else if (fullNode.includes('api.trongrid.io')) {
                    networkName = 'Mainnet';
                }

                // 获取余额
                const balanceInSun = await tronWeb.trx.getBalance(userAddress);
                const balanceInTRX = tronWeb.fromSun(balanceInSun);

                setAccount(userAddress);
                setNetwork(networkName);
                setBalance(parseFloat(balanceInTRX).toFixed(2));

                console.log('✅ TronLink 连接成功:', {
                    address: userAddress,
                    network: networkName,
                    balance: balanceInTRX + ' TRX'
                });

            } else if (window.okxwallet?.tronLink) {
                // OKX 钱包
                if (window.okxwallet.tronLink.request) {
                    await window.okxwallet.tronLink.request({ method: 'tron_requestAccounts' });
                }

                const tronWeb = window.tronWeb || window.okxwallet.tronLink.tronWeb;
                
                if (!tronWeb) {
                    alert('OKX 钱包未正确加载！');
                    setLoading(false);
                    return;
                }

                const userAddress = tronWeb.defaultAddress?.base58 || tronWeb.address?.base58;
                
                if (!userAddress) {
                    alert('请在 OKX 钱包中选择一个 TRON 账户！');
                    setLoading(false);
                    return;
                }

                // 检查网络
                const fullNode = tronWeb.fullNode?.host || tronWeb.fullNode;
                let networkName = 'Unknown';
                
                if (typeof fullNode === 'string') {
                    if (fullNode.includes('nile')) {
                        networkName = 'Nile';
                    } else if (fullNode.includes('shasta')) {
                        networkName = 'Shasta';
                    } else if (fullNode.includes('api.trongrid.io')) {
                        networkName = 'Mainnet';
                    }
                }

                // 获取余额
                try {
                    const balanceInSun = await tronWeb.trx.getBalance(userAddress);
                    const balanceInTRX = tronWeb.fromSun(balanceInSun);
                    setBalance(parseFloat(balanceInTRX).toFixed(2));
                } catch (e) {
                    console.error('获取余额失败:', e);
                    setBalance('0');
                }

                setAccount(userAddress);
                setNetwork(networkName);

                console.log('✅ OKX 钱包连接成功:', {
                    address: userAddress,
                    network: networkName
                });

            } else {
                alert('请安装 TronLink 或 OKX 钱包！\n\n确保钱包已切换到 TRON Nile 测试网。');
            }

        } catch (error) {
            console.error('连接钱包失败:', error);
            alert('连接钱包失败: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // 监听账户变化
    useEffect(() => {
        const handleAccountsChanged = () => {
            console.log('账户已更改，重新连接...');
            if (account) {
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
    }, [account]);

    if (account) {
        return (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="badge badge-created" style={{ 
                    background: 'rgba(255, 69, 58, 0.2)', 
                    color: '#ff453a',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 500
                }}>
                    {balance} TRX
                </span>
                {network && (
                    <span className="badge" style={{ 
                        background: 'rgba(52, 199, 89, 0.2)', 
                        color: '#34c759',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                    }}>
                        {network}
                    </span>
                )}
                <button className="flex-between" disabled style={{ 
                    gap: '0.5rem', 
                    opacity: 1, 
                    cursor: 'default',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                }}>
                    <Wallet size={18} />
                    {walletIcon && <span style={{ marginRight: '0.25rem' }}>{walletIcon}</span>}
                    {account.slice(0, 6)}...{account.slice(-4)}
                </button>
            </div>
        );
    }

    return (
        <button 
            onClick={connectWallet} 
            disabled={loading} 
            className="flex-between" 
            style={{ 
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                background: loading ? 'rgba(255, 165, 0, 0.3)' : 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
            }}
        >
            <LogIn size={18} />
            {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
    );
};
