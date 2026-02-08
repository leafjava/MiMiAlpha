import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { MOCK_ERC20_ADDRESS, MockERC20Abi } from '../lib/contracts';
import { useAccount } from 'wagmi';

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

  // 等待交易确认
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // 转账
  const transfer = async (to: string, amount: string) => {
    try {
      writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: MockERC20Abi,
        functionName: 'transfer',
        args: [to as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  };

  // 授权
  const approve = async (spender: string, amount: string) => {
    try {
      writeContract({
        address: MOCK_ERC20_ADDRESS,
        abi: MockERC20Abi,
        functionName: 'approve',
        args: [spender as `0x${string}`, parseEther(amount)],
      });
    } catch (error) {
      console.error('Approve failed:', error);
      throw error;
    }
  };

  const balance = balanceData ? formatEther(balanceData as bigint) : '0';

  return {
    balance,
    refetchBalance,
    transfer,
    approve,
    loading: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
