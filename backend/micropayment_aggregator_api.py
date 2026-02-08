"""
微支付聚合 API
端口: 8007
功能: 高频微支付聚合、批量结算、Energy 优化
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from datetime import datetime, timedelta
from collections import defaultdict
import threading
import time
import os

app = Flask(__name__)
CORS(app)

# Ollama 配置
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
MODEL_NAME = os.getenv('MODEL_NAME', 'qwen2.5:latest')

# 聚合配置
BATCH_SIZE = 50  # 聚合阈值（笔数）
BATCH_TIMEOUT = 300  # 时间阈值（秒，5分钟）

# 数据存储
pending_payments = defaultdict(list)  # 待聚合的支付
settled_batches = []  # 已结算的批次
energy_stats = {
    'total_payments': 0,
    'total_batches': 0,
    'energy_saved': 0,
    'cost_saved': 0
}

# ============ 辅助函数 ============

def call_ollama(prompt, system_prompt="你是一个专业的区块链支付优化助手。"):
    """调用 Ollama API"""
    try:
        response = requests.post(
            f'{OLLAMA_URL}/api/generate',
            json={
                'model': MODEL_NAME,
                'prompt': prompt,
                'system': system_prompt,
                'stream': False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json()['response']
        else:
            return f"Ollama 调用失败: {response.status_code}"
    except Exception as e:
        return f"Ollama 调用异常: {str(e)}"

def calculate_energy_savings(num_payments):
    """计算 Energy 节省"""
    # 假设每笔链上交易消耗 280 Energy
    ENERGY_PER_TX = 280
    ENERGY_COST_PER_UNIT = 0.0001  # USDT
    
    # 传统方式：每笔都上链
    traditional_energy = num_payments * ENERGY_PER_TX
    traditional_cost = traditional_energy * ENERGY_COST_PER_UNIT
    
    # 聚合方式：只需 1 笔链上交易
    aggregated_energy = ENERGY_PER_TX
    aggregated_cost = aggregated_energy * ENERGY_COST_PER_UNIT
    
    # 节省
    energy_saved = traditional_energy - aggregated_energy
    cost_saved = traditional_cost - aggregated_cost
    savings_rate = (energy_saved / traditional_energy * 100) if traditional_energy > 0 else 0
    
    return {
        'traditional_energy': traditional_energy,
        'traditional_cost': traditional_cost,
        'aggregated_energy': aggregated_energy,
        'aggregated_cost': aggregated_cost,
        'energy_saved': energy_saved,
        'cost_saved': cost_saved,
        'savings_rate': savings_rate
    }

def should_settle(agent_address):
    """判断是否应该结算"""
    payments = pending_payments[agent_address]
    
    if not payments:
        return False
    
    # 检查数量阈值
    if len(payments) >= BATCH_SIZE:
        return True
    
    # 检查时间阈值
    oldest_payment = min(payments, key=lambda p: p['timestamp'])
    time_elapsed = (datetime.now() - datetime.fromisoformat(oldest_payment['timestamp'])).total_seconds()
    
    if time_elapsed >= BATCH_TIMEOUT:
        return True
    
    return False

def batch_settle(agent_address):
    """批量结算"""
    payments = pending_payments[agent_address]
    
    if not payments:
        return None
    
    # 按接收方聚合
    aggregated = defaultdict(lambda: {'amount': 0, 'services': [], 'count': 0})
    
    for payment in payments:
        recipient = payment['recipient']
        aggregated[recipient]['amount'] += payment['amount']
        aggregated[recipient]['services'].append(payment['service'])
        aggregated[recipient]['count'] += 1
    
    # 计算 Energy 节省
    savings = calculate_energy_savings(len(payments))
    
    # 创建批次记录
    batch = {
        'batch_id': f"batch_{int(time.time())}",
        'agent_address': agent_address,
        'timestamp': datetime.now().isoformat(),
        'total_payments': len(payments),
        'aggregated_transfers': len(aggregated),
        'recipients': dict(aggregated),
        'energy_savings': savings,
        'status': 'settled'
    }
    
    # 更新统计
    energy_stats['total_payments'] += len(payments)
    energy_stats['total_batches'] += 1
    energy_stats['energy_saved'] += savings['energy_saved']
    energy_stats['cost_saved'] += savings['cost_saved']
    
    # 保存批次
    settled_batches.append(batch)
    
    # 清空待处理队列
    pending_payments[agent_address] = []
    
    return batch

# 后台定时检查线程
def background_settler():
    """后台定时检查并结算超时的批次"""
    while True:
        try:
            for agent_address in list(pending_payments.keys()):
                if should_settle(agent_address):
                    batch = batch_settle(agent_address)
                    if batch:
                        print(f"✅ 自动结算批次: {batch['batch_id']}, 聚合 {batch['total_payments']} 笔支付")
            
            time.sleep(60)  # 每分钟检查一次
        except Exception as e:
            print(f"❌ 后台结算异常: {e}")
            time.sleep(60)

# 启动后台线程
settler_thread = threading.Thread(target=background_settler, daemon=True)
settler_thread.start()

# ============ API 端点 ============

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'service': 'MicroPayment Aggregator API',
        'port': 8007,
        'timestamp': datetime.now().isoformat(),
        'pending_agents': len(pending_payments),
        'total_pending': sum(len(p) for p in pending_payments.values())
    })

@app.route('/api/micropayment/add', methods=['POST'])
def add_payment():
    """
    添加微支付到聚合队列
    
    请求体:
    {
        "agent_address": "0x...",
        "recipient": "0x...",
        "amount": 100000,  // 0.1 USDT
        "service": "ChatGPT API Call"
    }
    """
    try:
        data = request.json
        agent_address = data.get('agent_address')
        recipient = data.get('recipient')
        amount = data.get('amount', 0)
        service = data.get('service', 'Unknown')
        
        # 添加到队列
        payment = {
            'recipient': recipient,
            'amount': amount,
            'service': service,
            'timestamp': datetime.now().isoformat()
        }
        
        pending_payments[agent_address].append(payment)
        
        # 检查是否需要结算
        should_settle_now = should_settle(agent_address)
        batch = None
        
        if should_settle_now:
            batch = batch_settle(agent_address)
        
        return jsonify({
            'success': True,
            'message': '微支付已添加到聚合队列',
            'queue_size': len(pending_payments[agent_address]),
            'batch_threshold': BATCH_SIZE,
            'settled': should_settle_now,
            'batch': batch
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/micropayment/force-settle', methods=['POST'])
def force_settle():
    """
    强制结算指定 Agent 的待处理支付
    
    请求体:
    {
        "agent_address": "0x..."
    }
    """
    try:
        data = request.json
        agent_address = data.get('agent_address')
        
        if not agent_address:
            return jsonify({'error': 'agent_address required'}), 400
        
        batch = batch_settle(agent_address)
        
        if not batch:
            return jsonify({
                'success': False,
                'message': '没有待结算的支付'
            })
        
        return jsonify({
            'success': True,
            'message': '批次已结算',
            'batch': batch
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/micropayment/queue', methods=['GET'])
def get_queue():
    """获取待处理队列状态"""
    agent_address = request.args.get('agent_address')
    
    if agent_address:
        payments = pending_payments.get(agent_address, [])
        return jsonify({
            'agent_address': agent_address,
            'queue_size': len(payments),
            'payments': payments,
            'should_settle': should_settle(agent_address)
        })
    else:
        # 返回所有队列
        queue_summary = {}
        for addr, payments in pending_payments.items():
            queue_summary[addr] = {
                'queue_size': len(payments),
                'should_settle': should_settle(addr),
                'oldest_payment': min(payments, key=lambda p: p['timestamp'])['timestamp'] if payments else None
            }
        
        return jsonify({
            'total_agents': len(pending_payments),
            'total_pending': sum(len(p) for p in pending_payments.values()),
            'queues': queue_summary
        })

@app.route('/api/micropayment/batches', methods=['GET'])
def get_batches():
    """获取已结算的批次"""
    limit = int(request.args.get('limit', 10))
    
    return jsonify({
        'total_batches': len(settled_batches),
        'batches': settled_batches[-limit:]  # 最近的批次
    })

@app.route('/api/micropayment/stats', methods=['GET'])
def get_stats():
    """获取统计信息"""
    return jsonify({
        'energy_stats': energy_stats,
        'pending_payments': sum(len(p) for p in pending_payments.values()),
        'settled_batches': len(settled_batches),
        'average_batch_size': energy_stats['total_payments'] / energy_stats['total_batches'] if energy_stats['total_batches'] > 0 else 0,
        'average_savings_per_batch': energy_stats['energy_saved'] / energy_stats['total_batches'] if energy_stats['total_batches'] > 0 else 0
    })

@app.route('/api/micropayment/analyze', methods=['POST'])
def analyze_savings():
    """
    AI 分析 Energy 节省效果
    
    请求体:
    {
        "num_payments": 1000,
        "time_period": "daily"
    }
    """
    try:
        data = request.json
        num_payments = data.get('num_payments', 1000)
        time_period = data.get('time_period', 'daily')
        
        # 计算节省
        savings = calculate_energy_savings(num_payments)
        
        # AI 分析
        prompt = f"""
        分析以下微支付聚合的 Energy 节省效果：
        
        - 支付笔数: {num_payments}
        - 时间周期: {time_period}
        - 传统方式 Energy: {savings['traditional_energy']}
        - 聚合方式 Energy: {savings['aggregated_energy']}
        - 节省 Energy: {savings['energy_saved']}
        - 节省成本: ${savings['cost_saved']:.2f}
        - 节省率: {savings['savings_rate']:.1f}%
        
        请用简洁的语言总结节省效果，并给出优化建议。
        只返回 JSON 格式：{{"summary": "...", "recommendation": "..."}}
        """
        
        ai_response = call_ollama(prompt)
        
        # 解析 AI 响应
        try:
            ai_analysis = json.loads(ai_response)
        except:
            ai_analysis = {
                'summary': f'通过聚合 {num_payments} 笔微支付，节省了 {savings["savings_rate"]:.1f}% 的 Energy',
                'recommendation': '继续使用微支付聚合以降低链上成本'
            }
        
        return jsonify({
            'savings': savings,
            'ai_analysis': ai_analysis
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 微支付聚合 API 启动中...")
    print("=" * 60)
    print(f"📡 服务地址: http://localhost:8007")
    print(f"🤖 AI 模型: {MODEL_NAME}")
    print(f"🔗 Ollama URL: {OLLAMA_URL}")
    print(f"📦 批次大小: {BATCH_SIZE} 笔")
    print(f"⏱️  超时时间: {BATCH_TIMEOUT} 秒")
    print("=" * 60)
    print("\n可用端点:")
    print("  GET  /health - 健康检查")
    print("  POST /api/micropayment/add - 添加微支付")
    print("  POST /api/micropayment/force-settle - 强制结算")
    print("  GET  /api/micropayment/queue - 查看队列")
    print("  GET  /api/micropayment/batches - 查看批次")
    print("  GET  /api/micropayment/stats - 查看统计")
    print("  POST /api/micropayment/analyze - AI 分析")
    print("=" * 60)
    print("\n🔄 后台结算线程已启动")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=8007, debug=True)
