"""
Hackathon AI 助手服务器 - 使用 Ollama 本地推理
基于 coconut-RustSentinel 的实现，适配 Hackathon 项目
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import os
from datetime import datetime
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

app = Flask(__name__)
CORS(app)

# Ollama API 配置
OLLAMA_API = os.getenv("OLLAMA_API", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:4b-instruct-2507-q4_K_M")

print("=" * 60)
print("Hackathon AI 助手服务器")
print(f"推理引擎: Ollama")
print(f"模型: {MODEL_NAME}")
print(f"API: {OLLAMA_API}")
print("=" * 60)

@app.route('/health', methods=['GET'])
def health():
    """健康检查接口"""
    # 检查 Ollama 是否运行
    try:
        response = requests.get("http://localhost:11434", timeout=2)
        ollama_status = "running" if response.status_code == 200 else "error"
    except:
        ollama_status = "not running"
    
    return jsonify({
        "status": "ok",
        "engine": "Ollama",
        "model": MODEL_NAME,
        "ollama_status": ollama_status,
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
    
    # 构建完整的对话提示词
    prompt = f"System: {system_prompt}\n\n"
    
    for msg in messages:
        role = msg.get('role', '')
        content = msg.get('content', '')
        if role == 'user':
            prompt += f"User: {content}\n\n"
        elif role == 'assistant':
            prompt += f"Assistant: {content}\n\n"
    
    prompt += "请用中文简洁、专业地回答用户的问题。\n\nAssistant: "
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到 AI 助手请求")
    print(f"问题长度: {len(messages[-1].get('content', ''))} 字符")
    print("开始推理...")
    
    start_time = time.time()
    
    try:
        # 调用 Ollama API
        response = requests.post(
            OLLAMA_API,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,      # 对话使用适中的温度
                    "num_predict": 800,      # 限制回答长度
                    "top_p": 0.9,
                    "top_k": 40
                }
            },
            timeout=120  # 2 分钟超时
        )
        
        inference_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            assistant_response = result.get('response', '').strip()
            
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
                    "prompt_tokens": len(prompt),
                    "completion_tokens": len(assistant_response),
                    "total_tokens": len(prompt) + len(assistant_response)
                },
                "model": MODEL_NAME,
                "inference_time": round(inference_time, 2)
            })
        else:
            error_msg = f"Ollama API 错误: {response.status_code}"
            print(f"❌ {error_msg}")
            return jsonify({"error": error_msg}), 500
            
    except requests.exceptions.Timeout:
        error_msg = "推理超时（120秒），请稍后重试"
        print(f"❌ {error_msg}")
        return jsonify({"error": error_msg}), 504
    except requests.exceptions.ConnectionError:
        error_msg = "无法连接到 Ollama 服务，请确保 Ollama 正在运行"
        print(f"❌ {error_msg}")
        return jsonify({"error": error_msg}), 503
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
    print("🚀 Hackathon AI 助手服务器启动成功！")
    print("="*60)
    print(f"📡 API 地址: http://localhost:8000")
    print(f"🔗 健康检查: http://localhost:8000/health")
    print(f"💬 对话接口: http://localhost:8000/v1/assistant/chat")
    print("="*60)
    
    # 检查 Ollama 是否运行
    print("\n🔍 检查 Ollama 服务状态...")
    try:
        response = requests.get("http://localhost:11434", timeout=2)
        if response.status_code == 200:
            print("✅ Ollama 服务正常运行")
            
            # 尝试获取模型列表
            try:
                models_response = requests.get("http://localhost:11434/api/tags", timeout=2)
                if models_response.status_code == 200:
                    models = models_response.json().get('models', [])
                    model_names = [m.get('name', '') for m in models]
                    
                    if MODEL_NAME in model_names:
                        print(f"✅ 模型 {MODEL_NAME} 已就绪")
                    else:
                        print(f"⚠️  警告: 模型 {MODEL_NAME} 未找到")
                        print(f"   可用模型: {', '.join(model_names) if model_names else '无'}")
                        print(f"   请运行: ollama pull {MODEL_NAME}")
            except:
                pass
        else:
            print("⚠️  警告: Ollama 服务响应异常")
    except:
        print("❌ 错误: 无法连接到 Ollama")
        print("   请确保 Ollama 正在运行")
        print("   启动命令: ollama serve")
        print(f"   拉取模型: ollama pull {MODEL_NAME}")
    
    print("\n" + "="*60)
    print("服务器运行中... 按 Ctrl+C 停止")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=8000, debug=False)
