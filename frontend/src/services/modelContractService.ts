// 量化模型合约交互服务
// 支持 TronLink 和 OKX 钱包

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
    // OKX 可能直接注入 tronWeb
    okxTronWeb?: any;
  }
}

// 本地测试模式（不需要真实钱包）
// 设置为 true：使用模拟模式，无需钱包
// 设置为 false：使用真实钱包（TronLink 或 OKX）
const LOCAL_TEST_MODE = true; // 暂时改回测试模式，等钱包问题解决后再改为 false

// USDT TRC20 合约地址（Nile 测试网）
const USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'; // Nile testnet USDT

// 模型合约 ABI（简化版）
const MODEL_CONTRACT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "amount", "type": "uint256"}
    ],
    "name": "purchaseSignal",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "subscribe",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "user", "type": "address"}],
    "name": "isSubscribed",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
];

// USDT TRC20 ABI
const USDT_ABI = [
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

export class ModelContractService {
  private tronWeb: any;
  private walletType: 'tronlink' | 'okx' | 'local' | null = null;

  constructor() {
    this.tronWeb = null;
  }

  // 初始化 TronWeb（支持 TronLink、OKX 钱包和本地测试）
  async initialize(): Promise<boolean> {
    try {
      // 本地测试模式
      if (LOCAL_TEST_MODE) {
        console.log('🧪 本地测试模式已启用');
        this.walletType = 'local';
        return true;
      }

      console.log('🔍 开始检测钱包...');
      console.log('window.okxwallet:', window.okxwallet);
      console.log('window.tronWeb:', window.tronWeb);
      console.log('window.tronLink:', window.tronLink);

      // 方法1: 检查 OKX 钱包的 tronLink 接口
      if (window.okxwallet?.tronLink) {
        console.log('✅ 检测到 OKX 钱包 (tronLink 接口)');
        
        // 等待 OKX 钱包完全加载
        await this.waitForOKXWallet();
        
        // OKX 钱包可能通过 window.tronWeb 注入
        if (window.tronWeb) {
          this.tronWeb = window.tronWeb;
          this.walletType = 'okx';
          console.log('✅ OKX 钱包初始化成功（通过 window.tronWeb）');
          return true;
        }
        
        // 或者通过 okxwallet.tronLink.tronWeb
        if (window.okxwallet.tronLink.tronWeb) {
          this.tronWeb = window.okxwallet.tronLink.tronWeb;
          this.walletType = 'okx';
          console.log('✅ OKX 钱包初始化成功（通过 okxwallet.tronLink.tronWeb）');
          return true;
        }
      }

      // 方法2: 检查 OKX 直接注入的 tronWeb
      if (window.okxTronWeb) {
        console.log('✅ 检测到 OKX 钱包 (直接注入)');
        this.tronWeb = window.okxTronWeb;
        this.walletType = 'okx';
        return true;
      }

      // 方法3: 检查 TronLink 钱包
      if (window.tronWeb && window.tronWeb.ready) {
        console.log('✅ 检测到 TronLink 钱包');
        this.tronWeb = window.tronWeb;
        this.walletType = 'tronlink';
        return true;
      }

      // 等待钱包加载
      console.log('⏳ 等待钱包加载...');
      await this.waitForTronWeb();
      
      if (window.tronWeb) {
        this.tronWeb = window.tronWeb;
        this.walletType = window.okxwallet ? 'okx' : 'tronlink';
        console.log(`✅ 钱包初始化成功: ${this.walletType}`);
        return true;
      }

      console.error('❌ 未检测到任何钱包');
      throw new Error('未检测到 TronLink 或 OKX 钱包，请安装其中之一');
    } catch (error) {
      console.error('初始化钱包失败:', error);
      return false;
    }
  }

  // 等待 OKX 钱包加载
  private waitForOKXWallet(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const check = setInterval(() => {
        attempts++;
        
        // OKX 钱包通常会注入 window.tronWeb
        if (window.tronWeb || window.okxwallet?.tronLink?.tronWeb) {
          console.log(`✅ OKX 钱包加载完成 (尝试 ${attempts} 次)`);
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          console.log('⚠️ OKX 钱包加载超时，但继续尝试');
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  // 等待 TronWeb 加载
  private waitForTronWeb(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const check = setInterval(() => {
        attempts++;
        
        if (window.tronWeb && window.tronWeb.ready) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  // 获取当前用户地址
  async getCurrentAddress(): Promise<string | null> {
    if (!this.tronWeb && !LOCAL_TEST_MODE) {
      await this.initialize();
    }

    // 本地测试模式返回模拟地址
    if (LOCAL_TEST_MODE) {
      return 'TTestAddress1234567890abcdefghijk';
    }

    if (this.tronWeb) {
      // 尝试多种方式获取地址
      try {
        // 方式1: defaultAddress.base58 (TronLink 标准)
        if (this.tronWeb.defaultAddress?.base58) {
          const addr = this.tronWeb.defaultAddress.base58;
          console.log('✅ 获取地址成功 (defaultAddress.base58):', addr);
          return typeof addr === 'string' ? addr : null;
        }
        
        // 方式2: 直接调用 address 属性
        if (this.tronWeb.address) {
          const addr = this.tronWeb.address;
          console.log('✅ 获取地址成功 (address):', addr);
          // 如果是对象，尝试转换
          if (typeof addr === 'object' && addr.base58) {
            return addr.base58;
          }
          return typeof addr === 'string' ? addr : null;
        }
        
        // 方式3: 使用 tronWeb.trx.getAccount
        if (this.tronWeb.trx?.getAccount) {
          const account = await this.tronWeb.trx.getAccount();
          if (account && account.address) {
            const addr = this.tronWeb.address.fromHex(account.address.toString());
            console.log('✅ 获取地址成功 (getAccount):', addr);
            return addr;
          }
        }
        
        // 方式4: 调用 request 方法 (OKX 可能需要)
        if (this.tronWeb.request) {
          const accounts = await this.tronWeb.request({ method: 'tron_requestAccounts' });
          if (accounts && accounts.length > 0) {
            console.log('✅ 获取地址成功 (request):', accounts[0]);
            return accounts[0];
          }
        }
        
        console.error('❌ 无法获取地址，tronWeb 对象:', this.tronWeb);
      } catch (error) {
        console.error('❌ 获取地址失败:', error);
      }
    }

    return null;
  }

  // 获取钱包类型
  getWalletType(): string {
    if (LOCAL_TEST_MODE) return '本地测试模式';
    if (this.walletType === 'okx') return 'OKX 钱包';
    if (this.walletType === 'tronlink') return 'TronLink 钱包';
    return '未连接';
  }

  // 获取 USDT 余额
  async getUSDTBalance(address: string): Promise<number> {
    try {
      // 本地测试模式返回模拟余额
      if (LOCAL_TEST_MODE) {
        return 10000; // 模拟 10000 USDT
      }

      if (!this.tronWeb) {
        await this.initialize();
      }

      const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
      const balance = await contract.balanceOf(address).call();
      
      // USDT 有 6 位小数
      return Number(balance) / 1_000_000;
    } catch (error) {
      console.error('获取 USDT 余额失败:', error);
      return 0;
    }
  }

  // 授权 USDT 给模型合约
  async approveUSDT(modelContract: string, amount: number): Promise<boolean> {
    try {
      if (!this.tronWeb) {
        await this.initialize();
      }

      const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
      
      // 转换为 USDT 最小单位（6 位小数）
      const amountInSun = Math.floor(amount * 1_000_000);
      
      const tx = await contract.approve(modelContract, amountInSun).send({
        feeLimit: 100_000_000, // 100 TRX
      });

      console.log('USDT 授权成功:', tx);
      return true;
    } catch (error) {
      console.error('USDT 授权失败:', error);
      throw error;
    }
  }

  // 购买单次信号
  async purchaseSignal(
    modelContract: string,
    providerAddress: string,
    amount: number
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      // 本地测试模式模拟交易
      if (LOCAL_TEST_MODE) {
        console.log('🧪 本地测试：模拟购买信号', { modelContract, providerAddress, amount });
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        return {
          success: true,
          txId: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        };
      }

      if (!this.tronWeb) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: `请先安装并登录 ${this.walletType === 'okx' ? 'OKX' : 'TronLink'} 钱包` };
        }
      }

      // 检查余额
      const userAddress = await this.getCurrentAddress();
      if (!userAddress) {
        return { success: false, error: '无法获取钱包地址' };
      }

      const balance = await this.getUSDTBalance(userAddress);
      if (balance < amount) {
        return { 
          success: false, 
          error: `USDT 余额不足。当前余额: ${balance.toFixed(2)} USDT，需要: ${amount} USDT` 
        };
      }

      // 方案1: 直接转账给提供者（简化版）
      const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
      const amountInSun = Math.floor(amount * 1_000_000);
      
      const tx = await contract.transfer(providerAddress, amountInSun).send({
        feeLimit: 100_000_000, // 100 TRX
      });

      console.log('购买信号成功:', tx);
      
      return {
        success: true,
        txId: tx,
      };
    } catch (error: any) {
      console.error('购买信号失败:', error);
      return {
        success: false,
        error: error.message || '交易失败',
      };
    }
  }

  // 订阅模型（月度）
  async subscribeModel(
    modelContract: string,
    providerAddress: string,
    amount: number
  ): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      // 本地测试模式模拟交易
      if (LOCAL_TEST_MODE) {
        console.log('🧪 本地测试：模拟订阅模型', { modelContract, providerAddress, amount });
        await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟网络延迟
        return {
          success: true,
          txId: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        };
      }

      if (!this.tronWeb) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: `请先安装并登录 ${this.walletType === 'okx' ? 'OKX' : 'TronLink'} 钱包` };
        }
      }

      // 检查余额
      const userAddress = await this.getCurrentAddress();
      if (!userAddress) {
        return { success: false, error: '无法获取钱包地址' };
      }

      const balance = await this.getUSDTBalance(userAddress);
      if (balance < amount) {
        return { 
          success: false, 
          error: `USDT 余额不足。当前余额: ${balance.toFixed(2)} USDT，需要: ${amount} USDT` 
        };
      }

      // 方案1: 直接转账给提供者（简化版）
      const contract = await this.tronWeb.contract(USDT_ABI, USDT_CONTRACT);
      const amountInSun = Math.floor(amount * 1_000_000);
      
      const tx = await contract.transfer(providerAddress, amountInSun).send({
        feeLimit: 100_000_000, // 100 TRX
      });

      console.log('订阅成功:', tx);
      
      return {
        success: true,
        txId: tx,
      };
    } catch (error: any) {
      console.error('订阅失败:', error);
      return {
        success: false,
        error: error.message || '交易失败',
      };
    }
  }

  // 检查是否已订阅
  async checkSubscription(
    modelContract: string,
    userAddress: string
  ): Promise<boolean> {
    try {
      if (!this.tronWeb) {
        await this.initialize();
      }

      // 这里应该调用合约的 isSubscribed 方法
      // 简化版：返回 false
      return false;
    } catch (error) {
      console.error('检查订阅状态失败:', error);
      return false;
    }
  }

  // 格式化交易哈希为 TronScan 链接
  getTronScanLink(txId: string, isTestnet: boolean = true): string {
    const baseUrl = isTestnet 
      ? 'https://nile.tronscan.org/#/transaction/'
      : 'https://tronscan.org/#/transaction/';
    return `${baseUrl}${txId}`;
  }

  // 格式化地址
  formatAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// 导出单例
export const modelContractService = new ModelContractService();
