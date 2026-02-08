import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wagmi';
import { Conflux } from 'js-conflux-sdk';
import EscrowArtifact from './contracts/Escrow.json';
import MockERC20Artifact from './contracts/MockERC20.json';
import ContractAddresses from './contracts/contract-addresses.json';

interface AppContextType {
    conflux: Conflux | null;
    account: string;
    balance: string; // CFX balance
    connectWallet: () => Promise<void>;
    escrowContract: any; // Conflux Contract Object
    tokenContract: any;
    loading: boolean;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// 创建 QueryClient 实例
const queryClient = new QueryClient();

// Helper to detect wallet type
const detectWalletType = () => {
    if (typeof window === 'undefined') return null;
    
    // 检测 OKX 钱包
    if (window.okxwallet) {
        return 'okx';
    }
    
    // 检测 MetaMask
    if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
            return 'metamask';
        }
        // 处理多钱包情况
        if (window.ethereum.providers?.length) {
            const metamaskProvider = window.ethereum.providers.find(
                (p: any) => p.isMetaMask && !p.isOkxWallet
            );
            if (metamaskProvider) {
                return 'metamask';
            }
            const okxProvider = window.ethereum.providers.find(
                (p: any) => p.isOkxWallet
            );
            if (okxProvider) {
                return 'okx';
            }
        }
        return 'ethereum'; // 通用 EVM 钱包
    }
    
    // 检测 Fluent 钱包（Conflux 原生）
    if (window.conflux && window.conflux.isFluent) {
        return 'fluent';
    }
    
    return null;
};

function AppProviderInner({ children }: { children: ReactNode }) {
    const [conflux, setConflux] = useState<Conflux | null>(null);
    const [account, setAccount] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const [escrowContract, setEscrowContract] = useState<any>(null);
    const [tokenContract, setTokenContract] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Initialize SDK with Public RPC for reading data
        const sdk = new Conflux({
            url: "https://test.confluxrpc.com",
            networkId: 1,
        });
        setConflux(sdk);

        // Setup initial contracts (read-only until account connected)
        const escrow = sdk.Contract({
            abi: EscrowArtifact.abi,
            address: ContractAddresses.contracts.Escrow
        });
        setEscrowContract(escrow);

        const token = sdk.Contract({
            abi: MockERC20Artifact.abi,
            address: ContractAddresses.contracts.MockERC20
        });
        setTokenContract(token);

    }, []);

    const connectWallet = async () => {
        const walletType = detectWalletType();
        
        if (!walletType) {
            alert("未检测到钱包！请安装 MetaMask、OKX 钱包或 Fluent 钱包。");
            return;
        }

        console.log('🔍 检测到钱包类型:', walletType);
        setLoading(true);

        try {
            let provider: any;
            let accounts: string[] = [];

            // 根据钱包类型选择不同的连接方式
            if (walletType === 'okx') {
                provider = window.okxwallet;
                console.log('✅ 使用 OKX 钱包');
            } else if (walletType === 'metamask' || walletType === 'ethereum') {
                provider = window.ethereum;
                // 处理多钱包冲突
                if (window.ethereum?.providers?.length) {
                    const metamaskProvider = window.ethereum.providers.find(
                        (p: any) => p.isMetaMask && !p.isOkxWallet
                    );
                    if (metamaskProvider) {
                        provider = metamaskProvider;
                        console.log('✅ 使用 MetaMask（从多钱包中选择）');
                    }
                }
                console.log('✅ 使用 MetaMask/以太坊钱包');
            } else if (walletType === 'fluent') {
                // Fluent 钱包使用原有逻辑
                provider = window.conflux;
                accounts = await provider.request({ method: "cfx_requestAccounts" });
                
                if (accounts.length > 0) {
                    const chainId = await provider.request({ method: "cfx_chainId" });
                    if (chainId !== "0x1") {
                        try {
                            await provider.request({
                                method: "wallet_switchConfluxChain",
                                params: [{ chainId: "0x1" }]
                            });
                            accounts = await provider.request({ method: "cfx_accounts" });
                        } catch (switchError) {
                            alert("请切换到 Conflux 测试网！");
                            return;
                        }
                    }

                    const acc = accounts[0];
                    setAccount(acc);

                    if (conflux) {
                        const bal = await conflux.cfx.getBalance(acc);
                        setBalance((Number(bal) / 1e18).toFixed(4));
                    }
                }
                setLoading(false);
                return;
            }

            // EVM 钱包连接逻辑（MetaMask、OKX）
            if (provider) {
                // 请求账户访问
                accounts = await provider.request({ 
                    method: 'eth_requestAccounts' 
                });

                if (accounts.length > 0) {
                    // 检查并切换到 Conflux eSpace 测试网
                    const chainId = await provider.request({ method: 'eth_chainId' });
                    const targetChainId = '0x47'; // 71 in hex (Conflux eSpace Testnet)
                    
                    if (chainId !== targetChainId) {
                        try {
                            await provider.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: targetChainId }],
                            });
                        } catch (switchError: any) {
                            // 如果链不存在，尝试添加
                            if (switchError.code === 4902) {
                                try {
                                    await provider.request({
                                        method: 'wallet_addEthereumChain',
                                        params: [{
                                            chainId: targetChainId,
                                            chainName: 'Conflux eSpace Testnet',
                                            nativeCurrency: {
                                                name: 'CFX',
                                                symbol: 'CFX',
                                                decimals: 18
                                            },
                                            rpcUrls: ['https://evmtestnet.confluxrpc.com'],
                                            blockExplorerUrls: ['https://evmtestnet.confluxscan.io']
                                        }],
                                    });
                                } catch (addError) {
                                    alert('添加 Conflux eSpace 测试网失败！');
                                    return;
                                }
                            } else {
                                alert('请切换到 Conflux eSpace 测试网！');
                                return;
                            }
                        }
                    }

                    const acc = accounts[0];
                    setAccount(acc);

                    // 获取余额
                    const balanceHex = await provider.request({
                        method: 'eth_getBalance',
                        params: [acc, 'latest'],
                    });
                    const balanceWei = parseInt(balanceHex, 16);
                    setBalance((balanceWei / 1e18).toFixed(4));

                    console.log('✅ 钱包连接成功:', acc);
                }
            }

        } catch (error: any) {
            console.error("连接失败:", error);
            if (error.code !== 4001) { // 4001 = 用户拒绝
                alert('连接失败: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppContext.Provider value={{ conflux, account, balance, connectWallet, escrowContract, tokenContract, loading }}>
            {children}
        </AppContext.Provider>
    );
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <AppProviderInner>
                    {children}
                </AppProviderInner>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export const useApp = () => useContext(AppContext);

// Declare window.conflux and window.ethereum
declare global {
    interface Window {
        conflux?: any;
        ethereum?: any;
        okxwallet?: any;
        tronWeb?: any;
        tronLink?: any;
        okxTronWeb?: any;
    }
}
