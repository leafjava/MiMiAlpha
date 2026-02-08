// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ModelSubscription
 * @dev 模型订阅合约 - 用户可以订阅AI模型服务
 */
contract ModelSubscription is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    
    uint256 public modelCount;
    uint256 public subscriptionCount;
    uint256 public platformFeeRate = 300; // 3% = 300 basis points
    
    enum SubscriptionStatus {
        Active,
        Expired,
        Cancelled,
        Refunded
    }
    
    struct Model {
        uint256 id;
        string name;
        string description;
        uint256 price; // USDT price per duration
        uint256 duration; // Duration in days
        address provider;
        uint256 subscribers;
        bool active;
    }
    
    struct Subscription {
        uint256 id;
        address subscriber;
        uint256 modelId;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        SubscriptionStatus status;
    }
    
    mapping(uint256 => Model) public models;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public userSubscriptions;
    mapping(uint256 => uint256[]) public modelSubscriptions;
    
    event ModelRegistered(uint256 indexed modelId, string name, uint256 price);
    event SubscriptionCreated(uint256 indexed subscriptionId, address indexed subscriber, uint256 indexed modelId);
    event SubscriptionRenewed(uint256 indexed subscriptionId);
    event SubscriptionCancelled(uint256 indexed subscriptionId, address indexed subscriber);
    
    constructor(address _usdtToken) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
    }
    
    /**
     * @dev 注册新模型
     */
    function registerModel(
        string memory name,
        string memory description,
        uint256 price,
        uint256 duration
    ) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        
        modelCount++;
        
        models[modelCount] = Model({
            id: modelCount,
            name: name,
            description: description,
            price: price,
            duration: duration,
            provider: msg.sender,
            subscribers: 0,
            active: true
        });
        
        emit ModelRegistered(modelCount, name, price);
        return modelCount;
    }
    
    /**
     * @dev 创建订阅
     */
    function createSubscription(uint256 modelId, uint256 duration) external nonReentrant returns (uint256) {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        Model storage model = models[modelId];
        require(model.active, "Model is not active");
        require(duration > 0, "Duration must be greater than 0");
        
        uint256 totalPrice = model.price * duration / model.duration;
        require(totalPrice > 0, "Invalid price calculation");
        
        // 转账 USDT
        require(
            usdtToken.transferFrom(msg.sender, address(this), totalPrice),
            "USDT transfer failed"
        );
        
        // 计算平台费用
        uint256 platformFee = (totalPrice * platformFeeRate) / 10000;
        uint256 providerAmount = totalPrice - platformFee;
        
        // 支付给模型提供者
        require(
            usdtToken.transfer(model.provider, providerAmount),
            "Provider payment failed"
        );
        
        subscriptionCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (duration * 1 days);
        
        subscriptions[subscriptionCount] = Subscription({
            id: subscriptionCount,
            subscriber: msg.sender,
            modelId: modelId,
            startTime: startTime,
            endTime: endTime,
            price: totalPrice,
            status: SubscriptionStatus.Active
        });
        
        userSubscriptions[msg.sender].push(subscriptionCount);
        modelSubscriptions[modelId].push(subscriptionCount);
        model.subscribers++;
        
        emit SubscriptionCreated(subscriptionCount, msg.sender, modelId);
        return subscriptionCount;
    }
    
    /**
     * @dev 续订订阅
     */
    function renewSubscription(uint256 subscriptionId) external nonReentrant {
        require(subscriptionId > 0 && subscriptionId <= subscriptionCount, "Invalid subscription ID");
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not subscription owner");
        require(
            subscription.status == SubscriptionStatus.Active || 
            subscription.status == SubscriptionStatus.Expired,
            "Cannot renew this subscription"
        );
        
        Model storage model = models[subscription.modelId];
        require(model.active, "Model is not active");
        
        // 转账 USDT
        require(
            usdtToken.transferFrom(msg.sender, address(this), model.price),
            "USDT transfer failed"
        );
        
        // 计算平台费用
        uint256 platformFee = (model.price * platformFeeRate) / 10000;
        uint256 providerAmount = model.price - platformFee;
        
        // 支付给模型提供者
        require(
            usdtToken.transfer(model.provider, providerAmount),
            "Provider payment failed"
        );
        
        // 更新订阅时间
        uint256 newStartTime = block.timestamp > subscription.endTime ? block.timestamp : subscription.endTime;
        subscription.startTime = newStartTime;
        subscription.endTime = newStartTime + (model.duration * 1 days);
        subscription.status = SubscriptionStatus.Active;
        
        emit SubscriptionRenewed(subscriptionId);
    }
    
    /**
     * @dev 取消订阅
     */
    function cancelSubscription(uint256 subscriptionId) external nonReentrant {
        require(subscriptionId > 0 && subscriptionId <= subscriptionCount, "Invalid subscription ID");
        Subscription storage subscription = subscriptions[subscriptionId];
        require(subscription.subscriber == msg.sender, "Not subscription owner");
        require(subscription.status == SubscriptionStatus.Active, "Subscription not active");
        
        // 计算退款金额（50%）
        uint256 remainingTime = subscription.endTime > block.timestamp ? 
            subscription.endTime - block.timestamp : 0;
        
        if (remainingTime > 0) {
            uint256 totalDuration = subscription.endTime - subscription.startTime;
            uint256 refundAmount = (subscription.price * remainingTime * 50) / (totalDuration * 100);
            
            if (refundAmount > 0) {
                require(
                    usdtToken.transfer(msg.sender, refundAmount),
                    "Refund transfer failed"
                );
                subscription.status = SubscriptionStatus.Refunded;
            } else {
                subscription.status = SubscriptionStatus.Cancelled;
            }
        } else {
            subscription.status = SubscriptionStatus.Cancelled;
        }
        
        Model storage model = models[subscription.modelId];
        if (model.subscribers > 0) {
            model.subscribers--;
        }
        
        emit SubscriptionCancelled(subscriptionId, msg.sender);
    }
    
    /**
     * @dev 获取模型信息
     */
    function getModel(uint256 modelId) external view returns (Model memory) {
        require(modelId > 0 && modelId <= modelCount, "Invalid model ID");
        return models[modelId];
    }
    
    /**
     * @dev 获取订阅信息
     */
    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory) {
        require(subscriptionId > 0 && subscriptionId <= subscriptionCount, "Invalid subscription ID");
        return subscriptions[subscriptionId];
    }
    
    /**
     * @dev 获取用户的所有订阅
     */
    function getUserSubscriptions(address user) external view returns (uint256[] memory) {
        return userSubscriptions[user];
    }
    
    /**
     * @dev 获取模型总数
     */
    function getModelCount() external view returns (uint256) {
        return modelCount;
    }
    
    /**
     * @dev 更新平台费率（仅管理员）
     */
    function setPlatformFeeRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = newRate;
    }
    
    /**
     * @dev 提取平台费用（仅管理员）
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        require(usdtToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
