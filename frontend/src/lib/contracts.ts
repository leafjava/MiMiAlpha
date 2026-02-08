// 合约地址
import contractAddresses from '../contracts/contract-addresses.json';

export const MOCK_ERC20_ADDRESS = contractAddresses.contracts.MockERC20 as `0x${string}`;
export const ESCROW_ADDRESS = contractAddresses.contracts.Escrow as `0x${string}`;
export const SMART_FACILITATOR_ADDRESS = contractAddresses.contracts.SmartFacilitator as `0x${string}`;

// 合约 ABI
import MockERC20ABI from '../contracts/MockERC20.json';
import SmartFacilitatorABI from '../contracts/SmartFacilitator.json';

export const MockERC20Abi = MockERC20ABI.abi;
export const SmartFacilitatorAbi = SmartFacilitatorABI.abi;
