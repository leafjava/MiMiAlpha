"""
AI Agent 支付治理 API - OpenAI 版本
端口: 8006
功能: 支付策略检查、限额控制、黑白名单管理
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenAI API 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# 初始化 OpenAI 客户端（新版本）
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL) if OPENAI_API_KEY else None

# 模拟数据库（实际应使用真实数据库）
agents_db = {}
policies_db = {}
payment_history = {}

# ============ 辅助函数 ============

def call_openai(prompt, system_prompt="你是一个专业的 AI Agent 财务治理助手。"):
    """调用 OpenAI API"""
    if not client:
        return "AI 分析功能未配置（缺少 API Key）"
    
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=300
        )
        
        return response.choices[0].message.content.strip()
            
    except Exception as e:
        return f"AI 分析异常: {str(e)}"

# ============ API 端点 ============

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    api_status = "configured" if OPENAI_API_KEY else "not configured"
    
    return jsonify({
        'status': 'healthy',
        'service': 'Payment Governance API (OpenAI)',
        'model': OPENAI_MODEL,
        'api_status': api_status,
        'port': 8006,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/governance/check-payment', methods=['POST'])
def check_payment():
    """
    检查 AI Agent 支付是否符合策略
    
    请求体:
    {
        "agent_address": "0x...",
        "recipient": "0x...",
        "amount": 5000000,  // 5 USDT (6 位小数)
        "service": "DeepL Translation API"
    }
    """
    try:
        data = request.json
        agent_address = data.get('agent_address')
        recipient = data.get('recipient')
        amount = data.get('amount', 0)
        service = data.get('service', 'Unknown')
        
        # 获取策略
        policy = policies_db.get(agent_address, {
            'single_limit': 10 * 10**6,
            'daily_limit': 100 * 10**6,
            'monthly_limit': 1000 * 10**6,
            'whitelist': [],
            'blacklist': [],
            'enabled': True
        })
        
        # 检查黑名单
        if recipient in policy.get('blacklist', []):
            return jsonify({
                'approved': False,
                'reason': '接收方在黑名单中',
                'risk_level': 'high',
                'recommendation': '拒绝支付'
            })
        
        # 检查单次限额
        if amount > policy['single_limit']:
            return jsonify({
                'approved': False,
                'reason': f'超过单次支付限额 ({policy["single_limit"] / 10**6} USDT)',
                'risk_level': 'high',
                'recommendation': '需要用户二次确认'
            })
        
        # 检查日限额
        today = datetime.now().strftime('%Y-%m-%d')
        daily_spent = sum(
            p['amount'] for p in payment_history.get(agent_address, [])
            if p['date'] == today
        )
        
        if daily_spent + amount > policy['daily_limit']:
            return jsonify({
                'approved': False,
                'reason': f'超过每日限额 ({policy["daily_limit"] / 10**6} USDT)',
                'daily_spent': daily_spent / 10**6,
                'daily_limit': policy['daily_limit'] / 10**6,
                'risk_level': 'medium',
                'recommendation': '等待明天或提高限额'
            })
        
        # AI 风险评估
        prompt = f"""
        分析以下 AI Agent 支付请求的风险：
        
        - Agent: {agent_address}
        - 接收方: {recipient}
        - 金额: {amount / 10**6} USDT
        - 服务: {service}
        - 历史交易: {len(payment_history.get(agent_address, []))} 笔
        - 今日已花费: {daily_spent / 10**6} USDT
        
        请评估风险等级（low/medium/high）并给出建议。
        只返回 JSON 格式：{{"risk_level": "...", "analysis": "..."}}
        """
        
        ai_response = call_openai(prompt)
        
        # 解析 AI 响应
        try:
            ai_analysis = json.loads(ai_response)
        except:
            ai_analysis = {
                'risk_level': 'low',
                'analysis': ai_response if "失败" not in ai_response else '正常支付请求'
            }
        
        return jsonify({
            'approved': True,
            'reason': '通过所有检查',
            'risk_level': ai_analysis.get('risk_level', 'low'),
            'ai_analysis': ai_analysis.get('analysis', ''),
            'daily_spent': daily_spent / 10**6,
            'daily_limit': policy['daily_limit'] / 10**6,
            'remaining_quota': (policy['daily_limit'] - daily_spent) / 10**6
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'approved': False
        }), 500

@app.route('/api/governance/set-policy', methods=['POST'])
def set_policy():
    """
    设置 AI Agent 支付策略
    
    请求体:
    {
        "agent_address": "0x...",
        "single_limit": 10000000,  // 10 USDT
        "daily_limit": 100000000,  // 100 USDT
        "monthly_limit": 1000000000,  // 1000 USDT
        "whitelist": ["0x..."],
        "blacklist": ["0x..."]
    }
    """
    try:
        data = request.json
        agent_address = data.get('agent_address')
        
        policies_db[agent_address] = {
            'single_limit': data.get('single_limit', 10 * 10**6),
            'daily_limit': data.get('daily_limit', 100 * 10**6),
            'monthly_limit': data.get('monthly_limit', 1000 * 10**6),
            'whitelist': data.get('whitelist', []),
            'blacklist': data.get('blacklist', []),
            'enabled': data.get('enabled', True),
            'updated_at': datetime.now().isoformat()
        }
        
        return jsonify({
            'success': True,
            'message': '策略已更新',
            'policy': policies_db[agent_address]
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/governance/get-policy', methods=['GET'])
def get_policy():
    """获取 AI Agent 支付策略"""
    agent_address = request.args.get('agent_address')
    
    if not agent_address:
        return jsonify({'error': 'agent_address required'}), 400
    
    policy = policies_db.get(agent_address, {
        'single_limit': 10 * 10**6,
        'daily_limit': 100 * 10**6,
        'monthly_limit': 1000 * 10**6,
        'whitelist': [],
        'blacklist': [],
        'enabled': True
    })
    
    return jsonify({
        'agent_address': agent_address,
        'policy': policy
    })

@app.route('/api/governance/record-payment', methods=['POST'])
def record_payment():
    """记录支付（用于统计）"""
    try:
        data = request.json
        agent_address = data.get('agent_address')
        
        if agent_address not in payment_history:
            payment_history[agent_address] = []
        
        payment_history[agent_address].append({
            'recipient': data.get('recipient'),
            'amount': data.get('amount'),
            'service': data.get('service'),
            'date': datetime.now().strftime('%Y-%m-%d'),
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'success': True,
            'message': '支付已记录'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/governance/stats', methods=['GET'])
def get_stats():
    """获取统计信息"""
    agent_address = request.args.get('agent_address')
    
    if not agent_address:
        return jsonify({'error': 'agent_address required'}), 400
    
    history = payment_history.get(agent_address, [])
    today = datetime.now().strftime('%Y-%m-%d')
    
    daily_payments = [p for p in history if p['date'] == today]
    daily_spent = sum(p['amount'] for p in daily_payments)
    
    total_spent = sum(p['amount'] for p in history)
    
    return jsonify({
        'agent_address': agent_address,
        'total_payments': len(history),
        'total_spent': total_spent / 10**6,
        'daily_payments': len(daily_payments),
        'daily_spent': daily_spent / 10**6,
        'recent_payments': history[-10:]  # 最近 10 笔
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 AI Agent 支付治理 API 启动中...（OpenAI 版本）")
    print("=" * 60)
    print(f"📡 服务地址: http://localhost:8006")
    print(f"🤖 AI 模型: {OPENAI_MODEL}")
    print("=" * 60)
    print("\n可用端点:")
    print("  GET  /health - 健康检查")
    print("  POST /api/governance/check-payment - 检查支付")
    print("  POST /api/governance/set-policy - 设置策略")
    print("  GET  /api/governance/get-policy - 获取策略")
    print("  POST /api/governance/record-payment - 记录支付")
    print("  GET  /api/governance/stats - 获取统计")
    print("=" * 60)
    
    if not OPENAI_API_KEY:
        print("\n⚠️  警告: OPENAI_API_KEY 未配置")
        print("   AI 风险评估功能将不可用")
        print("   请在 .env 文件中设置 OPENAI_API_KEY\n")
    else:
        print(f"\n✅ OpenAI API Key 已配置（{OPENAI_API_KEY[:10]}...）\n")
    
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=8006, debug=False)
