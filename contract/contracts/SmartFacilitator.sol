// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SmartFacilitator
 * @dev AI Agent 财务治理中间件 - TRON 挑战2
 */
contract SmartFacilitator is Ownable {
    
    // ============ 数据结构 ============
    
    struct PaymentPolicy {
        uint256 singleLimit;        // 单次支付限额（USDT，6 位小数）
        uint256 dailyLimit;         // 每日配额
        uint256 monthlyLimit;       // 每月配额
        bool enabled;               // 策略启用状态
        uint256 dailySpent;         // 今日已花费
        uint256 monthlySpent;       // 本月已花费
        uint256 lastResetDay;       // 上次重置日期（天）
        uint256 lastResetMonth;     // 上次重置月份
    }
    
    struct Payment {
        address agent;              // AI Agent 地址
        address recipient;          // 接收方地址
        uint256 amount;             // 支付金额
        uint256 timestamp;          // 时间戳
        string service;             // x402 服务名称
        bool approved;              // 是否批准
        string reason;              // 拒绝原因（如果有）
    }
    
    struct AgentInfo {
        address owner;              // Agent 所有者
        string name;                // Agent 名称
        uint256 balance;            // Agent 余额
        uint256 totalSpent;         // 累计花费
        uint256 transactionCount;   // 交易次数
        bool active;                // 是否激活
        uint256 creditScore;        // 信用评分（0-1000）
    }
    
    // ============ 状态变量 ============
    
    IERC20 public usdt;                                      // USDT 代币合约
    
    mapping(address => AgentInfo) public agents;             // Agent 信息
    mapping(address => PaymentPolicy) public policies;       // 支付策略
    mapping(address => mapping(address => bool)) public whitelist;  // 白名单
    mapping(address => mapping(address => bool)) public blacklist;  // 黑名单
    mapping(address => Payment[]) public paymentHistory;     // 支付历史
    
    uint256 public totalAgents;                              // Agent 总数
    uint256 public totalPayments;                            // 总支付次数
    uint256 public totalVolume;                              // 总交易量
    
    // ============ 事件 ============
    
    event AgentCreated(address indexed agent, address indexed owner, string name);
    event PolicyUpdated(address indexed agent, uint256 singleLimit, uint256 dailyLimit);
    event PaymentApproved(address indexed agent, address indexed recipient, uint256 amount, string service);
    event PaymentRejected(address indexed agent, address indexed recipient, uint256 amount, string reason);
    event WhitelistUpdated(address indexed agent, address indexed target, bool added);
    event BlacklistUpdated(address indexed agent, address indexed target, bool added);
    event FundsDeposited(address indexed agent, uint256 amount);
    event FundsWithdrawn(address indexed agent, uint256 amount);
    
    // ============ 构造函数 ============
    
    constructor(address _usdt) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
    }
    
    // ============ Agent 管理 ============
    
    /**
     * @dev 创建新的 AI Agent
     */
    function createAgent(address _agent, string memory _name) external {
        require(agents[_agent].owner == address(0), "Agent already exists");
        
        agents[_agent] = AgentInfo({
            owner: msg.sender,
            name: _name,
            balance: 0,
            totalSpent: 0,
            transactionCount: 0,
            active: true,
            creditScore: 500  // 初始信用分 500
        });
        
        // 设置默认策略
        policies[_agent] = PaymentPolicy({
            singleLimit: 10 * 10**6,      // 10 USDT
            dailyLimit: 100 * 10**6,      // 100 USDT
            monthlyLimit: 1000 * 10**6,   // 1000 USDT
            enabled: true,
            dailySpent: 0,
            monthlySpent: 0,
            lastResetDay: block.timestamp / 1 days,
            lastResetMonth: block.timestamp / 30 days
        });
        
        totalAgents++;
        emit AgentCreated(_agent, msg.sender, _name);
    }
    
    /**
     * @dev 为 Agent 充值
     */
    function depositFunds(address _agent, uint256 _amount) external {
        require(agents[_agent].owner == msg.sender, "Not agent owner");
        require(_amount > 0, "Amount must be greater than 0");
        
        require(usdt.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        agents[_agent].balance += _amount;
        emit FundsDeposited(_agent, _amount);
    }
    
    /**
     * @dev 从 Agent 提款
     */
    function withdrawFunds(address _agent, uint256 _amount) external {
        require(agents[_agent].owner == msg.sender, "Not agent owner");
        require(agents[_agent].balance >= _amount, "Insufficient balance");
        
        agents[_agent].balance -= _amount;
        require(usdt.transfer(msg.sender, _amount), "Transfer failed");
        
        emit FundsWithdrawn(_agent, _amount);
    }
    
    // ============ 支付策略管理 ============
    
    /**
     * @dev 更新支付策略
     */
    function updatePolicy(
        address _agent,
        uint256 _singleLimit,
        uint256 _dailyLimit,
        uint256 _monthlyLimit
    ) external {
        require(agents[_agent].owner == msg.sender, "Not agent owner");
        
        PaymentPolicy storage policy = policies[_agent];
        policy.singleLimit = _singleLimit;
        policy.dailyLimit = _dailyLimit;
        policy.monthlyLimit = _monthlyLimit;
        
        emit PolicyUpdated(_agent, _singleLimit, _dailyLimit);
    }
    
    /**
     * @dev 添加/移除白名单
     */
    function updateWhitelist(address _agent, address _target, bool _add) external {
        require(agents[_agent].owner == msg.sender, "Not agent owner");
        whitelist[_agent][_target] = _add;
        emit WhitelistUpdated(_agent, _target, _add);
    }
    
    /**
     * @dev 添加/移除黑名单
     */
    function updateBlacklist(address _agent, address _target, bool _add) external {
        require(agents[_agent].owner == msg.sender, "Not agent owner");
        blacklist[_agent][_target] = _add;
        emit BlacklistUpdated(_agent, _target, _add);
    }
    
    // ============ 支付执行 ============
    
    /**
     * @dev 执行支付（核心功能）
     */
    function executePayment(
        address _agent,
        address _recipient,
        uint256 _amount,
        string memory _service
    ) external returns (bool) {
        require(agents[_agent].active, "Agent not active");
        require(agents[_agent].balance >= _amount, "Insufficient balance");
        
        // 检查支付策略
        (bool approved, string memory reason) = checkPaymentPolicy(_agent, _recipient, _amount);
        
        Payment memory payment = Payment({
            agent: _agent,
            recipient: _recipient,
            amount: _amount,
            timestamp: block.timestamp,
            service: _service,
            approved: approved,
            reason: reason
        });
        
        paymentHistory[_agent].push(payment);
        totalPayments++;
        
        if (!approved) {
            emit PaymentRejected(_agent, _recipient, _amount, reason);
            return false;
        }
        
        // 执行支付
        agents[_agent].balance -= _amount;
        agents[_agent].totalSpent += _amount;
        agents[_agent].transactionCount++;
        
        // 更新配额
        PaymentPolicy storage policy = policies[_agent];
        _resetLimitsIfNeeded(_agent);
        policy.dailySpent += _amount;
        policy.monthlySpent += _amount;
        
        totalVolume += _amount;
        
        require(usdt.transfer(_recipient, _amount), "Transfer failed");
        
        emit PaymentApproved(_agent, _recipient, _amount, _service);
        return true;
    }
    
    /**
     * @dev 检查支付是否符合策略
     */
    function checkPaymentPolicy(
        address _agent,
        address _recipient,
        uint256 _amount
    ) public view returns (bool approved, string memory reason) {
        PaymentPolicy memory policy = policies[_agent];
        
        if (!policy.enabled) {
            return (false, "Policy disabled");
        }
        
        // 检查黑名单
        if (blacklist[_agent][_recipient]) {
            return (false, "Recipient in blacklist");
        }
        
        // 检查白名单（如果启用）
        // 注意：这里简化处理，实际可能需要更复杂的逻辑
        
        // 检查单次限额
        if (_amount > policy.singleLimit) {
            return (false, "Exceeds single payment limit");
        }
        
        // 检查日限额（需要考虑重置）
        uint256 currentDay = block.timestamp / 1 days;
        uint256 dailySpent = (currentDay == policy.lastResetDay) ? policy.dailySpent : 0;
        if (dailySpent + _amount > policy.dailyLimit) {
            return (false, "Exceeds daily limit");
        }
        
        // 检查月限额
        uint256 currentMonth = block.timestamp / 30 days;
        uint256 monthlySpent = (currentMonth == policy.lastResetMonth) ? policy.monthlySpent : 0;
        if (monthlySpent + _amount > policy.monthlyLimit) {
            return (false, "Exceeds monthly limit");
        }
        
        return (true, "");
    }
    
    /**
     * @dev 重置限额（如果需要）
     */
    function _resetLimitsIfNeeded(address _agent) internal {
        PaymentPolicy storage policy = policies[_agent];
        uint256 currentDay = block.timestamp / 1 days;
        uint256 currentMonth = block.timestamp / 30 days;
        
        if (currentDay > policy.lastResetDay) {
            policy.dailySpent = 0;
            policy.lastResetDay = currentDay;
        }
        
        if (currentMonth > policy.lastResetMonth) {
            policy.monthlySpent = 0;
            policy.lastResetMonth = currentMonth;
        }
    }
    
    // ============ 查询函数 ============
    
    /**
     * @dev 获取 Agent 信息
     */
    function getAgentInfo(address _agent) external view returns (AgentInfo memory) {
        return agents[_agent];
    }
    
    /**
     * @dev 获取支付历史
     */
    function getPaymentHistory(address _agent) external view returns (Payment[] memory) {
        return paymentHistory[_agent];
    }
    
    /**
     * @dev 获取支付历史数量
     */
    function getPaymentCount(address _agent) external view returns (uint256) {
        return paymentHistory[_agent].length;
    }
    
    /**
     * @dev 获取当前配额使用情况
     */
    function getQuotaUsage(address _agent) external view returns (
        uint256 dailySpent,
        uint256 dailyLimit,
        uint256 monthlySpent,
        uint256 monthlyLimit
    ) {
        PaymentPolicy memory policy = policies[_agent];
        
        uint256 currentDay = block.timestamp / 1 days;
        uint256 currentMonth = block.timestamp / 30 days;
        
        dailySpent = (currentDay == policy.lastResetDay) ? policy.dailySpent : 0;
        dailyLimit = policy.dailyLimit;
        monthlySpent = (currentMonth == policy.lastResetMonth) ? policy.monthlySpent : 0;
        monthlyLimit = policy.monthlyLimit;
    }
}
