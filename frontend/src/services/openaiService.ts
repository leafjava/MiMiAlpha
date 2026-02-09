/**
 * OpenAI 服务 - 前端直接调用
 * 注意：生产环境中不应该在前端暴露API Key
 * 这里仅用于演示和快速开发
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 调用 OpenAI Chat API
 */
export async function callOpenAI(messages: Message[]): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API Key 未配置，使用模拟响应');
    return getMockResponse(messages[messages.length - 1].content);
  }

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API 错误: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API 调用失败:', error);
    // 降级到模拟响应
    return getMockResponse(messages[messages.length - 1].content);
  }
}

/**
 * 模拟响应（当API不可用时）
 */
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('量化') || lowerMessage.includes('模型')) {
    return '我们的量化交易模型基于先进的机器学习算法，包括强化学习（PPO）和深度神经网络。这些模型经过大量历史数据训练，能够识别市场模式并生成交易信号。您可以在模型市场中浏览不同类型的模型，每个模型都有详细的历史表现数据供您参考。';
  }
  
  if (lowerMessage.includes('收益') || lowerMessage.includes('apy')) {
    return '我们的投资池当前年化收益率（APY）约为 28.92%。收益主要来自两部分：量化交易利润（约占 62%）和模型订阅收入（约占 38%）。我们采用透明的费用结构：2% 年化管理费 + 20% 超额收益表现费。所有收益数据都可以在投资池页面实时查看。';
  }
  
  if (lowerMessage.includes('风险') || lowerMessage.includes('安全')) {
    return '我们非常重视资金安全。所有资金由智能合约托管，采用多重签名机制。我们还提供实时风险评估功能，会根据市场波动、交易历史等多个维度评估风险。建议您：1) 分散投资 2) 设置止损 3) 定期查看风险报告。';
  }
  
  if (lowerMessage.includes('钱包') || lowerMessage.includes('连接')) {
    return '我们支持三种钱包：MetaMask（狐狸钱包）、OKX Wallet 和 Fluent Wallet。前两者用于 Conflux eSpace 测试网，Fluent 用于 Conflux Core 测试网。连接步骤：1) 点击右上角"Connect Wallet" 2) 选择您的钱包 3) 在钱包中授权连接 4) 系统会自动切换到正确的网络。';
  }
  
  if (lowerMessage.includes('测试币') || lowerMessage.includes('水龙头')) {
    return '您可以从以下水龙头免费获取测试币：\n\n• Conflux eSpace 测试网：https://efaucet.confluxnetwork.org/\n• Conflux Core 测试网：https://faucet.confluxnetwork.org/\n\n输入您的钱包地址即可领取。测试币仅用于测试，没有实际价值。';
  }
  
  if (lowerMessage.includes('购买') || lowerMessage.includes('订阅')) {
    return '购买模型很简单：1) 在模型市场选择您感兴趣的模型 2) 点击"查看详情" 3) 选择购买方式（一次性购买或按月订阅）4) 在钱包中确认交易 5) 等待区块链确认（通常 3-10 秒）。购买后您可以立即查看模型的实时交易信号。';
  }
  
  // 默认响应
  return '您好！我是 MiMiAlpha 的智能助手。我可以帮您了解：\n\n• 量化交易模型和策略\n• 投资池收益和风险\n• 钱包连接和使用\n• 模型购买和订阅\n• 平台功能和操作\n\n请问您想了解什么？';
}

/**
 * AI 助手对话（带系统提示词）
 */
export async function chatWithAI(userMessage: string, conversationHistory: Message[] = []): Promise<string> {
  const systemPrompt: Message = {
    role: 'system',
    content: `你是 MiMiAlpha 量化交易平台的智能客服助手。请用简洁、友好、专业的中文回答用户问题。

# MiMiAlpha 平台介绍
MiMiAlpha 是一个基于 Conflux 区块链的去中心化量化交易平台，提供AI驱动的量化模型市场和智能投资服务。

# 主要功能
1. 量化模型市场 - 浏览和购买专业量化交易模型
2. AI模型服务 - 黄金、比特币、股票等多种预测模型
3. 投资池功能 - 参与量化投资池，自动化收益分配
4. 多钱包支持 - MetaMask、OKX Wallet、Fluent Wallet

# 回答规则
1. 直接、准确地回答问题
2. 每个回答控制在 150-300 字以内
3. 保持友好、专业的语气
4. 重点介绍量化交易和AI模型的优势`
  };

  const messages: Message[] = [
    systemPrompt,
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  return await callOpenAI(messages);
}
