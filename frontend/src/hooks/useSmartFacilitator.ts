import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { SMART_FACILITATOR_ADDRESS, MOCK_ERC20_ADDRESS, SmartFacilitatorAbi, MockERC20Abi } from '../lib/contracts';
import { useAccount } from 'wagmi';

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}

export interface AgentInfo {
  owner: string;
  name: string;
  balance: bigint;
  totalSpent: bigint;
  transactionCount: bigint;
  active: boolean;
  creditScore: bigint;
}

export interface QuotaUsage {
  dailySpent: bigint;
  dailyLimit: bigint;
  monthlySpent: bigint;
  monthlyLimit: bigint;
}

export function useSmartFacilitator() {
  const { address } = useAccount();

  // 写入合约
  const { 
    writeContract, 
    data: hash, 
    isPending,
    error: writeError 
  } = useWriteContract();

  // 等待交易确认
  const { 
    isLoading: isConfirming, 
    isSuccess 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // 读取 Agent 信息
  const { data: agentInfoData, refetch: refetchAgentInfo } = useReadContract({
    address: SMART_FACILITATOR_ADDRESS,
    abi: SmartFacilitatorAbi,
    functionName: 'getAgentInfo',
    args: address ? [address] : undefined,
  });

  // 读取配额使用情况
  const { data: quotaData, refetch: refetchQuota } = useReadContract({
    address: SMART_FACILITATOR_ADDRESS,
    abi: SmartFacilitatorAbi,
    functionName: 'getQuotaUsage',
    args: address ? [address] : undefined,
  });

  // 读取统计信息
  const { data: totalAgentsData } = useReadContract({
    address: SMART_FACILITATOR_ADDRESS,
    abi: SmartFacilitatorAbi,
    functionName: 'totalAgents',
  });

  const { data: totalPaymentsData } = useReadContract({
    address: SMART_FACILITATOR_ADDRESS,
    abi: SmartFacilitatorAbi,
    functionName: 'totalPayments',
  });

  // 创建 AI Agent
  const createAgent = async (agentAddress: string, agentName: string) => {
    try {
      writeContract({
        address: SMART_FACILITATOR_ADDRESS,
        abi: SmartFacilitatorAbi,
        functionName: 'createAgent',
        args: [agentAddress as `0x${string}`, agentName],
      });
    } catch (error) {
      console.error('Create agent failed:', error);
      throw error;
    }
  };

  // 为 Agent 充值（需要先授权）
  const depositFunds = async (agentAddress: string, amount: string) => {
    try {
      const amountWei = parseEther(amount);
      
      // 先授权
      writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: MockERC20Abi,
        functionName: 'approve',
        args: [SMART_FACILITATOR_ADDRESS, amountWei],
      });

      // 等待授权完成后再充值
      // 注意：这里需要用户手动点击两次，或者使用更复杂的状态管理
      // 简化版本：直接调用充值，假设已授权
      setTimeout(() => {
        writeContract({
          address: SMART_FACILITATOR_ADDRESS,
          abi: SmartFacilitatorAbi,
          functionName: 'depositFunds',
          args: [agentAddress as `0x${string}`, amountWei],
        });
      }, 2000);
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    }
  };

  // 执行支付 - 使用 TRX 直接支付
  const executePayment = async (
    agentAddress: string,
    recipientAddress: string,
    amount: string,
    service: string
  ) => {
    try {
      console.log('📝 [useSmartFacilitator] executePayment 参数:', {
        agentAddress,
        recipientAddress,
        amount,
        service
      });

      // 检查 TronWeb
      if (!window.tronWeb || !window.tronWeb.ready) {
        throw new Error('TronLink 未连接');
      }

      const tronWeb = window.tronWeb;
      
      // 转换金额为 sun (1 TRX = 1,000,000 sun)
      const amountInSun = tronWeb.toSun(amount);
      
      console.log('💰 发送 TRX:', {
        from: agentAddress,
        to: recipientAddress,
        amount: amount + ' TRX',
        amountInSun: amountInSun
      });

      // 直接发送 TRX
      const transaction = await tronWeb.trx.sendTransaction(
        recipientAddress,
        amountInSun,
        {
          from: agentAddress
        }
      );

      console.log('✅ [useSmartFacilitator] 交易已发送:', transaction);
      
      // 返回交易哈希
      return transaction.txid || transaction.transaction?.txID;
      
    } catch (error) {
      console.error('❌ [useSmartFacilitator] Execute payment failed:', error);
      throw error;
    }
  };

  // 格式化 Agent 信息
  const agentInfo: AgentInfo | null = agentInfoData ? {
    owner: (agentInfoData as any)[0],
    name: (agentInfoData as any)[1],
    balance: (agentInfoData as any)[2],
    totalSpent: (agentInfoData as any)[3],
    transactionCount: (agentInfoData as any)[4],
    active: (agentInfoData as any)[5],
    creditScore: (agentInfoData as any)[6],
  } : null;

  // 格式化配额信息
  const quotaUsage: QuotaUsage | null = quotaData ? {
    dailySpent: (quotaData as any)[0],
    dailyLimit: (quotaData as any)[1],
    monthlySpent: (quotaData as any)[2],
    monthlyLimit: (quotaData as any)[3],
  } : null;

  const stats = {
    totalAgents: totalAgentsData ? Number(totalAgentsData) : 0,
    totalPayments: totalPaymentsData ? Number(totalPaymentsData) : 0,
  };

  return {
    createAgent,
    depositFunds,
    executePayment,
    agentInfo,
    quotaUsage,
    stats,
    refetchAgentInfo,
    refetchQuota,
    loading: isPending || isConfirming,
    isSuccess,
    error: writeError,
    hash,
  };
}
