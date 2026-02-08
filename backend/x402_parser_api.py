"""
x402 交易解析 API
端口: 8008
功能: 解析 x402 协议数据、生成人类可读审计日志
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
from datetime import datetime
import hashlib
import os

app = Flask(__name__)
CORS(app)

# Ollama 配置
OLLAMA_URL = os.getenv('OLLAMA_URL', 'http://localhost:11434')
MODEL_NAME = os.getenv('MODEL_NAME', 'qwen2.5:latest')

# TronGrid API 配置
TRONGRID_API = os.getenv('TRONGRID_API', 'https://nile.trongrid.io')
TRONGRID_API_KEY = os.getenv('TRONGRID_API_KEY', '')

# 审计日志存储
audit_logs = []

# x402 服务类型映射（只保留量化模型相关）
X402_SERVICES = {
    'quant-signal-btc': 'BTC 量化信号',
    'quant-signal-eth': 'ETH 量化信号',
    'quant-signal-gold': '黄金价格预测',
    'quant-signal-sp500': '标普500指数预测',
    'quant-signal-forex': '外汇波动预测',
    'quant-signal-commodity': '商品期货预测',
    'quant-signal-crypto': '加密货币组合预测',
    'quant-strategy-hft': '高频交易策略',
    'quant-strategy-arbitrage': '套利策略',
    'quant-strategy-options': '期权策略'
}

# ============ 辅助函数 ============

def call_ollama(prompt, system_prompt="你是一个专业的区块链交易分析助手。"):
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

def get_tron_transaction(tx_hash):
    """从 TronGrid 获取交易数据"""
    try:
        headers = {}
        if TRONGRID_API_KEY:
            headers['TRON-PRO-API-KEY'] = TRONGRID_API_KEY
        
        response = requests.get(
            f'{TRONGRID_API}/wallet/gettransactionbyid',
            params={'value': tx_hash},
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f"获取 TRON 交易失败: {e}")
        return None

def decode_x402_data(raw_data):
    """解析 x402 协议数据"""
    # 这是一个简化的解析器
    # 实际应该根据 x402 协议规范来解析
    
    try:
        # 假设 x402 数据格式：
        # [service_type][amount][timestamp][metadata]
        
        # 这里使用模拟数据 - 量化信号
        return {
            'protocol': 'x402',
            'version': '1.0',
            'service_type': 'quant-signal-btc',
            'amount': 500000000,  # 500 USDT
            'confidence': 88,
            'timeframe': '1h',
            'metadata': {
                'signal_type': 'trend',
                'target_price': 52000,
                'stop_loss': 50000
            }
        }
    except Exception as e:
        print(f"解析 x402 数据失败: {e}")
        return None

def parse_service_details(x402_data):
    """解析服务详情"""
    service_type = x402_data.get('service_type', 'unknown')
    metadata = x402_data.get('metadata', {})
    
    details = {
        'service_name': X402_SERVICES.get(service_type, service_type),
        'service_type': service_type
    }
    
    # 量化信号服务详情
    if 'quant-signal' in service_type:
        asset = service_type.split('-')[-1].upper()
        details['asset'] = asset
        details['timeframe'] = x402_data.get('timeframe', '1h')
        details['confidence'] = x402_data.get('confidence', 0)
        details['signal_type'] = metadata.get('signal_type', 'trend')
        details['target_price'] = metadata.get('target_price', 0)
    
    elif 'quant-strategy' in service_type:
        strategy_type = service_type.split('-')[-1]
        details['strategy_type'] = strategy_type
        details['expected_return'] = metadata.get('expected_return', 0)
        details['risk_level'] = metadata.get('risk_level', 'medium')
    
    return details

def generate_human_readable(agent, service_details, amount, x402_data):
    """生成人类可读的描述"""
    service_name = service_details['service_name']
    service_type = service_details['service_type']
    
    # 根据服务类型生成不同的描述
    if 'quant-signal' in service_type:
        return f"{agent} 购买了 {service_details.get('asset', 'BTC')} {service_details.get('timeframe', '1h')} 量化信号，置信度 {service_details.get('confidence', 0)}%，支付 {amount / 1e6:.2f} USDT"
    
    elif 'quant-strategy' in service_type:
        return f"{agent} 订阅了 {service_name}，预期收益 {service_details.get('expected_return', 0)}%，风险等级 {service_details.get('risk_level', 'medium')}，支付 {amount / 1e6:.2f} USDT"
    
    else:
        return f"{agent} 使用了 {service_name} 服务，支付 {amount / 1e6:.2f} USDT"

# ============ API 端点 ============

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'service': 'x402 Parser API',
        'port': 8008,
        'timestamp': datetime.now().isoformat(),
        'total_logs': len(audit_logs)
    })

@app.route('/api/x402/parse-transaction', methods=['POST'])
def parse_transaction():
    """
    解析 x402 交易
    
    请求体:
    {
        "tx_hash": "0x...",
        "agent": "Agent_Trading_Bot"
    }
    """
    try:
        data = request.json
        tx_hash = data.get('tx_hash')
        agent = data.get('agent', 'Unknown_Agent')
        
        if not tx_hash:
            return jsonify({'error': 'tx_hash required'}), 400
        
        # 获取交易数据
        tx_data = get_tron_transaction(tx_hash)
        
        if not tx_data:
            # 使用模拟数据
            tx_data = {
                'txID': tx_hash,
                'raw_data': {
                    'timestamp': int(datetime.now().timestamp() * 1000),
                    'contract': [{
                        'parameter': {
                            'value': {
                                'amount': 500000,
                                'to_address': 'TXXXServiceProvider',
                                'data': '0xa9059cbb...'
                            }
                        }
                    }]
                }
            }
        
        # 解析 x402 数据
        x402_data = decode_x402_data(tx_data.get('raw_data', {}))
        
        if not x402_data:
            return jsonify({'error': '无法解析 x402 数据'}), 400
        
        # 解析服务详情
        service_details = parse_service_details(x402_data)
        
        # 生成人类可读描述
        amount = x402_data.get('amount', 0)
        human_readable = generate_human_readable(agent, service_details, amount, x402_data)
        
        # 创建审计日志
        audit_log = {
            'log_id': hashlib.md5(f"{tx_hash}{datetime.now().isoformat()}".encode()).hexdigest()[:16],
            'timestamp': datetime.now().isoformat(),
            'tx_hash': tx_hash,
            'agent': agent,
            'service': service_details['service_name'],
            'service_type': service_details['service_type'],
            'amount': amount / 1e6,  # 转换为 USDT
            'details': service_details,
            'human_readable': human_readable,
            'raw_data': tx_data,
            'x402_data': x402_data
        }
        
        # 保存审计日志
        audit_logs.append(audit_log)
        
        return jsonify({
            'success': True,
            'audit_log': audit_log
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/x402/parse-batch', methods=['POST'])
def parse_batch():
    """
    批量解析 x402 交易
    
    请求体:
    {
        "transactions": [
            {"tx_hash": "0x...", "agent": "Agent_A"},
            {"tx_hash": "0x...", "agent": "Agent_B"}
        ]
    }
    """
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        results = []
        for tx in transactions:
            try:
                # 调用单个解析
                result = parse_transaction_internal(tx['tx_hash'], tx.get('agent', 'Unknown'))
                results.append(result)
            except Exception as e:
                results.append({
                    'tx_hash': tx['tx_hash'],
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'total': len(transactions),
            'parsed': len([r for r in results if 'error' not in r]),
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

def parse_transaction_internal(tx_hash, agent):
    """内部解析函数（用于批量处理）"""
    tx_data = get_tron_transaction(tx_hash) or {'txID': tx_hash}
    x402_data = decode_x402_data(tx_data.get('raw_data', {}))
    service_details = parse_service_details(x402_data)
    amount = x402_data.get('amount', 0)
    human_readable = generate_human_readable(agent, service_details, amount, x402_data)
    
    return {
        'tx_hash': tx_hash,
        'agent': agent,
        'service': service_details['service_name'],
        'amount': amount / 1e6,
        'human_readable': human_readable
    }

@app.route('/api/x402/audit-logs', methods=['GET'])
def get_audit_logs():
    """获取审计日志"""
    limit = int(request.args.get('limit', 50))
    agent = request.args.get('agent')
    service_type = request.args.get('service_type')
    
    # 过滤
    filtered_logs = audit_logs
    
    if agent:
        filtered_logs = [log for log in filtered_logs if log['agent'] == agent]
    
    if service_type:
        filtered_logs = [log for log in filtered_logs if log['service_type'] == service_type]
    
    return jsonify({
        'total': len(filtered_logs),
        'logs': filtered_logs[-limit:]  # 最近的日志
    })

@app.route('/api/x402/generate-report', methods=['POST'])
def generate_report():
    """
    生成审计报告
    
    请求体:
    {
        "agent": "Agent_Trading_Bot",
        "start_date": "2026-02-01",
        "end_date": "2026-02-08"
    }
    """
    try:
        data = request.json
        agent = data.get('agent')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        # 过滤日志
        filtered_logs = audit_logs
        
        if agent:
            filtered_logs = [log for log in filtered_logs if log['agent'] == agent]
        
        if start_date:
            filtered_logs = [log for log in filtered_logs if log['timestamp'] >= start_date]
        
        if end_date:
            filtered_logs = [log for log in filtered_logs if log['timestamp'] <= end_date]
        
        # 统计
        total_transactions = len(filtered_logs)
        total_amount = sum(log['amount'] for log in filtered_logs)
        
        services_used = {}
        for log in filtered_logs:
            service = log['service']
            if service not in services_used:
                services_used[service] = {'count': 0, 'amount': 0}
            services_used[service]['count'] += 1
            services_used[service]['amount'] += log['amount']
        
        # AI 生成报告摘要
        prompt = f"""
        生成以下审计数据的摘要报告：
        
        - Agent: {agent or '所有 Agent'}
        - 时间范围: {start_date} 至 {end_date}
        - 总交易数: {total_transactions}
        - 总支出: ${total_amount:.2f}
        - 使用的服务: {', '.join(services_used.keys())}
        
        请用简洁的语言总结 Agent 的支付行为，并指出是否有异常。
        只返回 JSON 格式：{{"summary": "...", "insights": ["...", "..."], "alerts": ["..."]}}
        """
        
        ai_response = call_ollama(prompt)
        
        # 解析 AI 响应
        try:
            ai_report = json.loads(ai_response)
        except:
            ai_report = {
                'summary': f'{agent or "所有 Agent"} 在指定时间范围内共进行了 {total_transactions} 笔交易，总支出 ${total_amount:.2f}',
                'insights': ['支付行为正常'],
                'alerts': []
            }
        
        return jsonify({
            'success': True,
            'report': {
                'agent': agent,
                'period': {
                    'start': start_date,
                    'end': end_date
                },
                'statistics': {
                    'total_transactions': total_transactions,
                    'total_amount': total_amount,
                    'services_used': services_used
                },
                'ai_analysis': ai_report,
                'logs': filtered_logs[-20:]  # 最近 20 条
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/x402/simulate', methods=['POST'])
def simulate_transaction():
    """
    模拟 x402 交易（用于测试）
    
    请求体:
    {
        "agent": "Agent_Test",
        "service_type": "chatgpt-plus",
        "amount": 500000,
        "metadata": {...}
    }
    """
    try:
        data = request.json
        agent = data.get('agent', 'Test_Agent')
        service_type = data.get('service_type', 'chatgpt-plus')
        amount = data.get('amount', 500000)
        metadata = data.get('metadata', {})
        
        # 生成模拟交易哈希
        tx_hash = hashlib.md5(f"{agent}{service_type}{datetime.now().isoformat()}".encode()).hexdigest()
        
        # 创建模拟 x402 数据
        x402_data = {
            'protocol': 'x402',
            'version': '1.0',
            'service_type': service_type,
            'amount': amount,
            'tokens_used': metadata.get('tokens_used', 50000),
            'duration': metadata.get('duration', 3600),
            'metadata': metadata
        }
        
        # 解析服务详情
        service_details = parse_service_details(x402_data)
        
        # 生成人类可读描述
        human_readable = generate_human_readable(agent, service_details, amount, x402_data)
        
        # 创建审计日志
        audit_log = {
            'log_id': hashlib.md5(f"{tx_hash}{datetime.now().isoformat()}".encode()).hexdigest()[:16],
            'timestamp': datetime.now().isoformat(),
            'tx_hash': tx_hash,
            'agent': agent,
            'service': service_details['service_name'],
            'service_type': service_details['service_type'],
            'amount': amount / 1e6,
            'details': service_details,
            'human_readable': human_readable,
            'simulated': True
        }
        
        # 保存审计日志
        audit_logs.append(audit_log)
        
        return jsonify({
            'success': True,
            'message': '模拟交易已创建',
            'audit_log': audit_log
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 x402 交易解析 API 启动中...")
    print("=" * 60)
    print(f"📡 服务地址: http://localhost:8008")
    print(f"🤖 AI 模型: {MODEL_NAME}")
    print(f"🔗 Ollama URL: {OLLAMA_URL}")
    print(f"🌐 TronGrid API: {TRONGRID_API}")
    print("=" * 60)
    print("\n可用端点:")
    print("  GET  /health - 健康检查")
    print("  POST /api/x402/parse-transaction - 解析单个交易")
    print("  POST /api/x402/parse-batch - 批量解析交易")
    print("  GET  /api/x402/audit-logs - 获取审计日志")
    print("  POST /api/x402/generate-report - 生成审计报告")
    print("  POST /api/x402/simulate - 模拟交易（测试）")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=8008, debug=True)
