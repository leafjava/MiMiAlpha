import { TRON_API, TRONSCAN_API, getHeaders } from '../config/tron';

export interface TronTransaction {
  txID: string;
  block_timestamp: number;
  raw_data: {
    contract: Array<{
      parameter: {
        value: {
          owner_address: string;
          to_address: string;
          amount?: number;
        };
      };
      type: string;
    }>;
  };
  ret: Array<{
    contractRet: string;
  }>;
}

// TronScan 交易格式
export interface TronScanTransaction {
  hash: string;
  block: number;
  timestamp: number;
  ownerAddress: string;
  toAddress: string;
  contractType: number;
  confirmed: boolean;
  contractData?: {
    amount?: number;
    asset_name?: string;
  };
  cost?: {
    net_fee?: number;
    energy_fee?: number;
  };
}

export interface TronAccount {
  address: string;
  balance: number;
  create_time: number;
  latest_opration_time: number;
  account_resource?: {
    energy_usage: number;
    frozen_balance_for_energy: {
      frozen_balance: number;
    };
  };
}

export class TronService {
  // 获取账户信息（使用 TronScan API）
  static async getAccount(address: string): Promise<any> {
    try {
      const response = await fetch(TRONSCAN_API.getAccount(address));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch account:', error);
      return null;
    }
  }

  // 获取交易历史（使用 TronScan API，数据更详细）
  static async getTransactions(address: string, limit = 20): Promise<TronScanTransaction[]> {
    try {
      const response = await fetch(TRONSCAN_API.getTransactions(address, limit));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  }

  // 获取 TRC20 交易
  static async getTRC20Transactions(address: string, limit = 20): Promise<any[]> {
    try {
      const response = await fetch(TRONSCAN_API.getTRC20Transfers(address, limit));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.token_transfers || [];
    } catch (error) {
      console.error('Failed to fetch TRC20 transactions:', error);
      return [];
    }
  }

  // 格式化地址（显示前6位和后4位）
  static formatAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // 格式化金额（Sun 转 TRX）
  static sunToTrx(sun: number): number {
    return sun / 1_000_000;
  }

  // 格式化时间戳
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString('zh-CN');
  }

  // 分析资金流动
  static async analyzeFundFlow(address: string): Promise<{
    total_in: number;
    total_out: number;
    transaction_count: number;
    unique_addresses: Set<string>;
  }> {
    const transactions = await this.getTransactions(address, 100);
    
    let totalIn = 0;
    let totalOut = 0;
    const uniqueAddresses = new Set<string>();
    
    transactions.forEach(tx => {
      const amount = tx.contractData?.amount || 0;
      
      if (tx.ownerAddress === address) {
        // 转出
        totalOut += amount;
        if (tx.toAddress) {
          uniqueAddresses.add(tx.toAddress);
        }
      } else if (tx.toAddress === address) {
        // 转入
        totalIn += amount;
        uniqueAddresses.add(tx.ownerAddress);
      }
    });
    
    return {
      total_in: this.sunToTrx(totalIn),
      total_out: this.sunToTrx(totalOut),
      transaction_count: transactions.length,
      unique_addresses: uniqueAddresses,
    };
  }

  // 检测可疑模式
  static detectSuspiciousPatterns(transactions: TronScanTransaction[]): string[] {
    const patterns: string[] = [];
    
    if (transactions.length === 0) {
      return patterns;
    }
    
    // 检测高频交易
    if (transactions.length > 50) {
      const timeSpan = transactions[0].timestamp - transactions[transactions.length - 1].timestamp;
      const avgInterval = timeSpan / transactions.length;
      
      if (avgInterval < 60000) { // 小于1分钟
        patterns.push('检测到高频交易（平均间隔小于1分钟）');
      }
    }
    
    // 检测小额高频转账
    const smallAmountCount = transactions.filter(tx => {
      const amount = tx.contractData?.amount || 0;
      return this.sunToTrx(amount) < 10;
    }).length;
    
    if (smallAmountCount > transactions.length * 0.7) {
      patterns.push('检测到大量小额转账（可能是洗钱行为）');
    }
    
    // 检测未确认交易
    const unconfirmedCount = transactions.filter(tx => !tx.confirmed).length;
    
    if (unconfirmedCount > transactions.length * 0.2) {
      patterns.push('检测到大量未确认交易（可能存在异常）');
    }
    
    // 检测深夜交易（可疑时间模式）
    const nightTransactions = transactions.filter(tx => {
      const hour = new Date(tx.timestamp).getHours();
      return hour >= 2 && hour <= 5;
    }).length;
    
    if (nightTransactions > transactions.length * 0.5) {
      patterns.push('检测到异常交易时间模式（大量深夜交易）');
    }
    
    return patterns;
  }

  // 分析地址关联
  static async analyzeAddressRelations(address: string): Promise<Array<{
    address: string;
    relation_type: string;
    interaction_count: number;
    total_value: number;
    risk_level: 'low' | 'medium' | 'high';
  }>> {
    const transactions = await this.getTransactions(address, 100);
    const relationMap = new Map<string, { count: number; total: number }>();
    
    transactions.forEach(tx => {
      const amount = tx.contractData?.amount || 0;
      
      let relatedAddress = '';
      if (tx.ownerAddress === address && tx.toAddress) {
        relatedAddress = tx.toAddress;
      } else if (tx.toAddress === address) {
        relatedAddress = tx.ownerAddress;
      }
      
      if (relatedAddress) {
        const existing = relationMap.get(relatedAddress) || { count: 0, total: 0 };
        relationMap.set(relatedAddress, {
          count: existing.count + 1,
          total: existing.total + amount,
        });
      }
    });
    
    // 转换为数组并排序
    const relations = Array.from(relationMap.entries())
      .map(([addr, data]) => ({
        address: addr,
        relation_type: this.getRelationType(data.count, data.total),
        interaction_count: data.count,
        total_value: this.sunToTrx(data.total),
        risk_level: this.assessRiskLevel(data.count, data.total),
      }))
      .sort((a, b) => b.interaction_count - a.interaction_count)
      .slice(0, 10); // 只返回前10个
    
    return relations;
  }

  // 获取关系类型
  private static getRelationType(count: number, total: number): string {
    const trxAmount = this.sunToTrx(total);
    
    if (count > 20) {
      return '频繁交易对手';
    } else if (count > 10) {
      return '常规交易对手';
    } else if (trxAmount > 10000) {
      return '大额交易对手';
    } else if (count >= 5 && count <= 10) {
      return '资金中转地址';
    } else if (count < 5 && trxAmount > 1000) {
      return '可疑关联地址';
    } else {
      return '偶尔交易';
    }
  }

  // 评估风险等级
  private static assessRiskLevel(count: number, total: number): 'low' | 'medium' | 'high' {
    const trxAmount = this.sunToTrx(total);
    
    // 高风险：大额且低频（可能是洗钱）或超高频
    if ((trxAmount > 100000 && count < 10) || count > 100) {
      return 'high';
    } 
    // 中风险：中等金额或中等频率
    else if (trxAmount > 10000 || count > 20) {
      return 'medium';
    } 
    // 低风险：小额且低频
    else {
      return 'low';
    }
  }

  // 检查地址是否有效
  static isValidAddress(address: string): boolean {
    // TRON 地址以 T 开头，长度为 34
    return address.startsWith('T') && address.length === 34;
  }
}

