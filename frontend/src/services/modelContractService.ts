// 量化模型合约交互服务
// 使用 TronWeb 与智能合约交互

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

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

  constructor() {
    this.tronWeb = null;
  }

  // 初始化 TronWeb
  async initialize(): Promise<boolean> {
    try {
      // 检查 TronLink 是否安装
      if (window.tronWeb && window.tronWeb.ready) {
        this.tronWeb = window.tronWeb;
        return true;
      }

      // 等待 TronLink 加载
      await this.waitForTronWeb();
      
      if (window.tronWeb && window.tronWeb.ready) {
        this.tronWeb = window.tronWeb;
        return true;
      }

      throw new Error('TronLink 未安装或未登录');
    } catch (error) {
      console.error('初始化 TronWeb 失败:', error);
      return false;
    }
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
    if (!this.tronWeb) {
      await this.initialize();
    }

    if (this.tronWeb && this.tronWeb.defaultAddress.base58) {
      return this.tronWeb.defaultAddress.base58;
    }

    return null;
  }

  // 获取 USDT 余额
  async getUSDTBalance(address: string): Promise<number> {
    try {
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
      if (!this.tronWeb) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: '请先安装并登录 TronLink 钱包' };
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
      if (!this.tronWeb) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: '请先安装并登录 TronLink 钱包' };
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
