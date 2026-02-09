/**
 * 模拟数据服务
 * 替代后端API，直接在前端生成数据
 */

// 收益计算模拟数据
export const mockYieldData = {
  vault_stats: {
    tvl: 2500000,
    assets_value: 2100000,
    cash_balance: 400000,
    total_investors: 156,
    days_running: 180
  },
  monthly_revenue: {
    trading_profit: 45000,
    rental_income: 28000,
    total: 73000
  },
  fees: {
    management_fee: 4166.67,
    performance_fee: 8600,
    total_fees: 12766.67
  },
  net_revenue: 60233.33,
  returns: {
    monthly_return: 2.41,
    apy: 28.92
  }
};

export const mockAssets = [
  {
    name: "黄金价格预测模型",
    icon: "🥇",
    quantity: 12,
    unit_value: 85000,
    total_value: 1020000,
    percentage: 48.57
  },
  {
    name: "比特币交易信号",
    icon: "₿",
    quantity: 8,
    unit_value: 65000,
    total_value: 520000,
    percentage: 24.76
  },
  {
    name: "股票市场分析",
    icon: "📈",
    quantity: 15,
    unit_value: 25000,
    total_value: 375000,
    percentage: 17.86
  },
  {
    name: "外汇交易策略",
    icon: "💱",
    quantity: 6,
    unit_value: 30833,
    total_value: 185000,
    percentage: 8.81
  }
];

// 计算投资者收益
export function calculateInvestorYield(amount: number, days: number) {
  const dailyReturn = mockYieldData.returns.apy / 365 / 100;
  const totalReturn = amount * dailyReturn * days;
  const managementFee = amount * 0.02 / 365 * days;
  const performanceFee = totalReturn * 0.2;
  const netReturn = totalReturn - managementFee - performanceFee;
  
  return {
    investment: amount,
    days: days,
    revenue: {
      gross: totalReturn,
      management_fee: managementFee,
      performance_fee: performanceFee,
      net: netReturn,
      total: netReturn,
      return_rate: (netReturn / amount) * 100,
      apy: (netReturn / amount) * (365 / days) * 100
    },
    final_value: amount + netReturn
  };
}

// 资产管理 - 产品列表
export const mockProducts = [
  {
    id: "model_001",
    name: "黄金价格预测模型 (PPO Ultimate)",
    category: "量化模型",
    description: "基于强化学习的黄金价格预测模型，历史胜率 68%",
    price: 85000,
    rental_price: 8500,
    stock: 12,
    performance: {
      win_rate: 68,
      sharpe_ratio: 2.3,
      max_drawdown: 12,
      total_return: 156
    },
    icon: "🥇"
  },
  {
    id: "model_002",
    name: "比特币交易信号",
    category: "量化模型",
    description: "实时比特币交易信号，基于技术指标和链上数据",
    price: 65000,
    rental_price: 6500,
    stock: 8,
    performance: {
      win_rate: 62,
      sharpe_ratio: 1.9,
      max_drawdown: 18,
      total_return: 142
    },
    icon: "₿"
  },
  {
    id: "model_003",
    name: "股票市场分析",
    category: "量化模型",
    description: "多因子股票选择模型，适合中长期投资",
    price: 25000,
    rental_price: 2500,
    stock: 15,
    performance: {
      win_rate: 58,
      sharpe_ratio: 1.6,
      max_drawdown: 15,
      total_return: 98
    },
    icon: "📈"
  },
  {
    id: "model_004",
    name: "外汇交易策略",
    category: "量化模型",
    description: "主要货币对交易策略，日内交易为主",
    price: 30833,
    rental_price: 3083,
    stock: 6,
    performance: {
      win_rate: 55,
      sharpe_ratio: 1.4,
      max_drawdown: 20,
      total_return: 85
    },
    icon: "💱"
  }
];

// 处理订单
export function processOrder(productId: string, type: 'purchase' | 'rental', quantity: number, rentalDays: number = 0) {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    throw new Error('产品不存在');
  }
  
  const price = type === 'purchase' ? product.price : product.rental_price;
  const totalCost = price * quantity * (type === 'rental' ? rentalDays / 30 : 1);
  
  return {
    success: true,
    order_id: `ORD${Date.now()}`,
    product: product.name,
    type: type === 'purchase' ? '购买' : '租赁',
    quantity,
    rental_days: type === 'rental' ? rentalDays : 0,
    unit_price: price,
    total_cost: totalCost,
    message: `订单创建成功！总计: ${totalCost.toLocaleString()} cUSD`
  };
}

// 信用评分
export function analyzeCreditScore(address: string) {
  // 生成模拟的信用评分
  const baseScore = 650 + Math.floor(Math.random() * 200);
  
  return {
    address,
    credit_score: baseScore,
    rating: baseScore >= 750 ? 'AAA' : baseScore >= 700 ? 'AA' : baseScore >= 650 ? 'A' : 'BBB',
    factors: {
      transaction_history: Math.floor(Math.random() * 30) + 70,
      account_age: Math.floor(Math.random() * 25) + 65,
      balance_stability: Math.floor(Math.random() * 30) + 60,
      network_reputation: Math.floor(Math.random() * 35) + 55
    },
    risk_level: baseScore >= 700 ? 'low' : baseScore >= 650 ? 'medium' : 'high',
    recommendations: [
      '保持稳定的交易频率',
      '增加账户余额',
      '参与更多DeFi协议'
    ]
  };
}

// 风险评估
export function assessRisk(amount: number, description: string) {
  const riskScore = Math.floor(Math.random() * 40) + 30; // 30-70
  
  return {
    risk_score: riskScore,
    risk_level: riskScore < 40 ? 'low' : riskScore < 60 ? 'medium' : 'high',
    risk_factors: [
      { factor: '交易金额', score: Math.min(amount / 10000 * 10, 30), weight: 0.3 },
      { factor: '历史记录', score: Math.floor(Math.random() * 20) + 10, weight: 0.25 },
      { factor: '市场波动', score: Math.floor(Math.random() * 15) + 10, weight: 0.25 },
      { factor: '对手方风险', score: Math.floor(Math.random() * 20) + 5, weight: 0.2 }
    ],
    recommendations: [
      riskScore > 60 ? '建议降低交易金额' : '风险可控',
      '建议设置止损',
      '分散投资降低风险'
    ],
    analysis: `基于当前市场条件和历史数据，该交易的风险评分为 ${riskScore}/100。${
      riskScore < 40 ? '风险较低，可以考虑执行。' :
      riskScore < 60 ? '风险中等，建议谨慎操作。' :
      '风险较高，建议重新评估或降低金额。'
    }`
  };
}

// 争议仲裁
export function analyzeDispute(disputeType: string, description: string, amount: number) {
  const resolutionOptions = [
    { option: '全额退款', probability: 0.3, reasoning: '证据充分，支持买方' },
    { option: '部分退款 (50%)', probability: 0.4, reasoning: '双方都有责任' },
    { option: '维持原判', probability: 0.2, reasoning: '卖方证据更充分' },
    { option: '需要更多证据', probability: 0.1, reasoning: '信息不足' }
  ];
  
  return {
    dispute_id: `DIS${Date.now()}`,
    type: disputeType,
    amount,
    analysis: {
      severity: amount > 10000 ? 'high' : amount > 5000 ? 'medium' : 'low',
      estimated_resolution_time: '3-5 个工作日',
      resolution_options: resolutionOptions,
      recommended_action: resolutionOptions[0].option
    },
    next_steps: [
      '收集相关证据',
      '联系双方进行调解',
      '如无法调解，提交仲裁委员会'
    ]
  };
}

// 支付治理
export function analyzeGovernance(proposalType: string, description: string) {
  return {
    proposal_id: `GOV${Date.now()}`,
    type: proposalType,
    analysis: {
      feasibility: Math.floor(Math.random() * 30) + 70,
      impact: Math.floor(Math.random() * 30) + 60,
      risk: Math.floor(Math.random() * 40) + 20,
      community_support: Math.floor(Math.random() * 35) + 55
    },
    recommendation: '建议通过',
    voting_period: '7 天',
    required_quorum: '10%',
    estimated_outcome: 'likely_pass'
  };
}
