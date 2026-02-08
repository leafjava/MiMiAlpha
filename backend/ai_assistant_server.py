"""
Hackathon AI 助手服务器 - 使用 OpenAI API
基于 coconut-RustSentinel 的实现，适配 Hackathon 项目
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import time
import os
from datetime import datetime
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenAI API 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# 初始化 OpenAI 客户端
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL) if OPENAI_API_KEY else None

print("=" * 60)
print("Hackathon AI 助手服务器")
print(f"推理引擎: OpenAI")
print(f"模型: {OPENAI_MODEL}")
print(f"API: {OPENAI_BASE_URL}")
print("=" * 60)

@app.route('/health', methods=['GET'])
def health():
    """健康检查接口"""
    api_status = "configured" if client else "not configured"
    
    return jsonify({
        "status": "ok",
        "engine": "OpenAI",
        "model": OPENAI_MODEL,
        "api_status": api_status,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/v1/assistant/chat', methods=['POST'])
def assistant_chat():
    """
    AI 助手对话接口
    用于回答用户关于 Hackathon 去中心化交易平台的问题
    """
    data = request.json
    messages = data.get('messages', [])
    
    if not messages:
        return jsonify({"error": "消息不能为空"}), 400
    
    # 构建 MiMiAlpha 平台专用提示词
    system_prompt = """你是 MiMiAlpha 量化交易平台的智能客服助手。请用简洁、友好、专业的中文回答用户问题。

# MiMiAlpha 平台介绍
MiMiAlpha 是一个基于 Conflux 区块链的去中心化量化交易平台，提供AI驱动的量化模型市场和智能投资服务。

# 主要功能
1. **量化模型市场**
   - 浏览和购买专业量化交易模型
   - 实时查看模型表现和历史收益
   - 支持模型订阅和一次性购买

2. **AI模型服务**
   - 黄金价格预测模型（PPO Ultimate）
   - 比特币交易信号模型
   - 股票市场分析模型
   - 自定义量化策略

3. **投资池功能**
   - 参与量化投资池
   - 自动化收益分配
   - 透明的资金管理

4. **多钱包支持**
   - MetaMask（狐狸钱包）- EVM 兼容
   - OKX Wallet - EVM 兼容  
   - Fluent Wallet - Conflux 原生钱包

5. **多网络支持**
   - Conflux eSpace Testnet（用于 MetaMask/OKX）
   - Conflux Core Testnet（用于 Fluent）

# 使用流程（详细步骤）

## 1. 连接钱包
- 点击页面右上角"Connect Wallet"按钮
- 系统会自动检测已安装的钱包
- 选择你的钱包（MetaMask/OKX/Fluent）
- 在钱包弹窗中授权连接
- 如果网络不正确，系统会提示切换到测试网

## 2. 浏览量化模型
- 进入"模型市场"页面
- 查看各类量化交易模型
- 查看模型详情：
  * 历史收益率
  * 胜率和夏普比率
  * 实时交易信号
  * 用户评价

## 3. 购买/订阅模型
- 选择心仪的模型
- 选择购买方式：
  * 一次性购买（永久使用）
  * 按月订阅（灵活续费）
- 在钱包中确认支付
- 等待区块链确认（通常 3-10 秒）

## 4. 使用模型
- 购买后可查看实时交易信号
- 根据信号进行交易决策
- 查看历史信号和收益统计

## 5. 参与投资池
- 进入"投资池"页面
- 选择合适的投资池
- 输入投资金额
- 确认投资
- 自动获得收益分配

# 支持的网络详情

## Conflux eSpace Testnet（用于 MetaMask/OKX）
- Chain ID: 71
- RPC URL: https://evmtestnet.confluxrpc.com
- 区块浏览器: https://evmtestnet.confluxscan.io
- 测试币水龙头: https://efaucet.confluxnetwork.org/

## Conflux Core Testnet（用于 Fluent）
- Network ID: 1
- RPC URL: https://test.confluxrpc.com
- 区块浏览器: https://testnet.confluxscan.io
- 测试币水龙头: https://faucet.confluxnetwork.org/

# 常见问题解答

**Q: 如何使用量化模型？**
A: 购买或订阅模型后，可以在模型详情页查看实时交易信号。信号包含入场价格、止损、止盈等信息，您可以根据信号进行交易决策。

**Q: 模型收益如何计算？**
A: 每个模型都有历史收益统计，包括胜率、夏普比率、总盈利等指标。您可以在模型详情页查看完整的历史表现。

**Q: 如何获取测试币？**
A: 访问对应网络的水龙头网站，输入你的钱包地址即可免费领取测试币。eSpace 用户访问 https://efaucet.confluxnetwork.org/，Core 用户访问 https://faucet.confluxnetwork.org/

**Q: 购买模型需要多长时间确认？**
A: Conflux 网络确认速度很快，通常 3-10 秒即可完成一笔交易。

**Q: 交易费用是多少？**
A: 在测试网上，交易费用（Gas Fee）非常低，通常不到 0.001 CFX。测试币可以免费从水龙头获取。

**Q: 支持哪些代币？**
A: 目前主要支持 CFX（Conflux 原生代币）和 USDT。未来会支持更多代币。

**Q: 资金安全吗？**
A: 所有资金由智能合约托管，采用多重安全机制。您的私钥始终由您自己控制，平台无法访问。

**Q: 可以在主网使用吗？**
A: 目前仅支持测试网。请勿在主网使用真实资产，这是一个演示项目。

**Q: 模型信号准确吗？**
A: 所有模型都经过历史数据回测，并显示真实的历史表现。但请注意，过去的表现不代表未来收益，投资有风险。

**Q: 钱包连接失败怎么办？**
A: 
1. 确保已安装对应的钱包扩展
2. 检查钱包是否已解锁
3. 尝试刷新页面重新连接
4. 确保网络连接正常

**Q: 交易卡住了怎么办？**
A: 
1. 检查区块浏览器确认交易状态
2. 如果交易失败，可以重试
3. 确保钱包中有足够的 Gas Fee

# 技术栈
- 前端: React 19 + TypeScript + Vite
- 区块链: Conflux eSpace + Conflux Core
- 钱包连接: Wagmi (EVM) + js-conflux-sdk (Core)
- 智能合约: Solidity
- AI模型: PPO (Proximal Policy Optimization)

# 回答规则
1. 直接、准确地回答问题，给出具体步骤和数字
2. 如果问题涉及操作步骤，按顺序列出
3. 提供相关的链接和资源
4. 保持友好、专业的语气
5. 每个回答控制在 150-300 字以内
6. 如果问题超出范围，建议用户查看文档或联系技术支持
7. 重点介绍量化交易和AI模型的优势"""
    
    # 构建消息列表（OpenAI格式）
    openai_messages = [{"role": "system", "content": system_prompt}]
    
    for msg in messages:
        role = msg.get('role', '')
        content = msg.get('content', '')
        if role in ['user', 'assistant']:
            openai_messages.append({"role": role, "content": content})
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到 AI 助手请求")
    print(f"问题长度: {len(messages[-1].get('content', ''))} 字符")
    print("开始推理...")
    
    start_time = time.time()
    
    try:
        if not client:
            return jsonify({"error": "OpenAI API 未配置"}), 503
        
        # 调用 OpenAI API
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=openai_messages,
            temperature=0.7,
            max_tokens=800
        )
        
        inference_time = time.time() - start_time
        
        assistant_response = response.choices[0].message.content.strip()
        
        print(f"✅ 推理完成，耗时: {inference_time:.2f} 秒")
        print(f"响应长度: {len(assistant_response)} 字符")
        
        return jsonify({
            "choices": [{
                "message": {
                    "role": "assistant",
                    "content": assistant_response
                },
                "finish_reason": "stop"
            }],
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            },
            "model": OPENAI_MODEL,
            "inference_time": round(inference_time, 2)
        })
            
    except Exception as e:
        error_msg = f"服务器错误: {str(e)}"
        print(f"❌ {error_msg}")
        return jsonify({"error": error_msg}), 500

@app.route('/v1/chat/completions', methods=['POST'])
def chat_completions():
    """
    OpenAI 兼容的聊天接口
    可以用于其他需要 OpenAI API 格式的场景
    """
    return assistant_chat()

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Hackathon AI 助手服务器启动（OpenAI 版本）")
    print("="*60)
    print(f"📡 API 地址: http://localhost:8000")
    print(f"🔗 健康检查: http://localhost:8000/health")
    print(f"💬 对话接口: http://localhost:8000/v1/assistant/chat")
    print(f"🤖 AI 模型: {OPENAI_MODEL}")
    print("="*60)
    
    if not client:
        print("\n⚠️  警告: OPENAI_API_KEY 未配置")
        print("   AI 功能将不可用")
        print("   请在 .env 文件中设置 OPENAI_API_KEY\n")
    else:
        print(f"\n✅ OpenAI API Key 已配置\n")
    
    print("="*60)
    print("服务器运行中... 按 Ctrl+C 停止")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=8000, debug=False)

