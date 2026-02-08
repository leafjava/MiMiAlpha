"""
x402 解析 API 测试脚本
"""

import requests
import json
import time

BASE_URL = "http://localhost:8008"

def print_section(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_health():
    """测试健康检查"""
    print_section("1. 健康检查")
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_simulate_transactions():
    """测试模拟交易"""
    print_section("2. 模拟 x402 交易")
    
    # 模拟不同类型的交易
    transactions = [
        {
            "agent": "Agent_Quant_BTC",
            "service_type": "quant-signal-btc",
            "amount": 500000000,  # 500 USDT
            "metadata": {
                "timeframe": "1h",
                "confidence": 88,
                "signal_type": "trend",
                "target_price": 52000
            }
        },
        {
            "agent": "Agent_Quant_ETH",
            "service_type": "quant-signal-eth",
            "amount": 300000000,  # 300 USDT
            "metadata": {
                "timeframe": "4h",
                "confidence": 85,
                "signal_type": "breakout",
                "target_price": 3200
            }
        },
        {
            "agent": "Agent_Gold_Trader",
            "service_type": "quant-signal-gold",
            "amount": 400000000,  # 400 USDT
            "metadata": {
                "timeframe": "1d",
                "confidence": 92,
                "signal_type": "reversal",
                "target_price": 2100
            }
        },
        {
            "agent": "Agent_HFT",
            "service_type": "quant-strategy-hft",
            "amount": 1000000000,  # 1000 USDT
            "metadata": {
                "expected_return": 15,
                "risk_level": "high"
            }
        }
    ]
    
    for i, tx in enumerate(transactions, 1):
        print(f"\n模拟交易 {i}:")
        print(f"  Agent: {tx['agent']}")
        print(f"  服务: {tx['service_type']}")
        print(f"  金额: {tx['amount'] / 1e6} USDT")
        
        response = requests.post(f"{BASE_URL}/api/x402/simulate", json=tx)
        result = response.json()
        
        if result['success']:
            log = result['audit_log']
            print(f"\n  ✅ 审计日志已生成:")
            print(f"  日志ID: {log['log_id']}")
            print(f"  人类可读: {log['human_readable']}")
        
        time.sleep(0.5)

def test_parse_transaction():
    """测试解析交易"""
    print_section("3. 解析 x402 交易")
    
    data = {
        "tx_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "agent": "Agent_Test"
    }
    
    response = requests.post(f"{BASE_URL}/api/x402/parse-transaction", json=data)
    result = response.json()
    
    if result['success']:
        log = result['audit_log']
        print(f"\n解析结果:")
        print(f"  交易哈希: {log['tx_hash']}")
        print(f"  Agent: {log['agent']}")
        print(f"  服务: {log['service']}")
        print(f"  金额: {log['amount']} USDT")
        print(f"  人类可读: {log['human_readable']}")

def test_audit_logs():
    """测试获取审计日志"""
    print_section("4. 获取审计日志")
    
    response = requests.get(f"{BASE_URL}/api/x402/audit-logs?limit=10")
    result = response.json()
    
    print(f"总日志数: {result['total']}")
    print(f"\n最近的审计日志:")
    
    for log in result['logs'][-5:]:  # 显示最近 5 条
        print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"时间: {log['timestamp']}")
        print(f"Agent: {log['agent']}")
        print(f"服务: {log['service']}")
        print(f"金额: {log['amount']} USDT")
        print(f"描述: {log['human_readable']}")

def test_filter_logs():
    """测试过滤审计日志"""
    print_section("5. 过滤审计日志")
    
    # 按 Agent 过滤
    print("\n按 Agent 过滤 (Agent_Trading_Bot):")
    response = requests.get(f"{BASE_URL}/api/x402/audit-logs?agent=Agent_Trading_Bot&limit=5")
    result = response.json()
    print(f"  找到 {result['total']} 条日志")
    
    # 按服务类型过滤
    print("\n按服务类型过滤 (quant-signal-btc):")
    response = requests.get(f"{BASE_URL}/api/x402/audit-logs?service_type=quant-signal-btc&limit=5")
    result = response.json()
    print(f"  找到 {result['total']} 条日志")

def test_generate_report():
    """测试生成审计报告"""
    print_section("6. 生成审计报告")
    
    data = {
        "agent": "Agent_Trading_Bot",
        "start_date": "2026-02-01",
        "end_date": "2026-02-28"
    }
    
    response = requests.post(f"{BASE_URL}/api/x402/generate-report", json=data)
    result = response.json()
    
    if result['success']:
        report = result['report']
        stats = report['statistics']
        ai = report['ai_analysis']
        
        print(f"\n📊 审计报告")
        print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"Agent: {report['agent']}")
        print(f"时间范围: {report['period']['start']} 至 {report['period']['end']}")
        print(f"\n统计数据:")
        print(f"  总交易数: {stats['total_transactions']}")
        print(f"  总支出: ${stats['total_amount']:.2f}")
        print(f"  使用的服务: {len(stats['services_used'])}")
        
        print(f"\n服务明细:")
        for service, data in stats['services_used'].items():
            print(f"  {service}:")
            print(f"    - 调用次数: {data['count']}")
            print(f"    - 总支出: ${data['amount']:.2f}")
        
        print(f"\nAI 分析:")
        print(f"  摘要: {ai.get('summary', 'N/A')}")
        if ai.get('insights'):
            print(f"  洞察:")
            for insight in ai['insights']:
                print(f"    - {insight}")
        if ai.get('alerts'):
            print(f"  警报:")
            for alert in ai['alerts']:
                print(f"    ⚠️  {alert}")

def test_batch_parse():
    """测试批量解析"""
    print_section("7. 批量解析交易")
    
    transactions = [
        {"tx_hash": f"0xbatch{i:04d}", "agent": f"Agent_{i}"}
        for i in range(5)
    ]
    
    data = {"transactions": transactions}
    
    response = requests.post(f"{BASE_URL}/api/x402/parse-batch", json=data)
    result = response.json()
    
    print(f"批量解析结果:")
    print(f"  总数: {result['total']}")
    print(f"  成功: {result['parsed']}")
    print(f"  失败: {result['total'] - result['parsed']}")

def test_comprehensive_scenario():
    """测试综合场景"""
    print_section("8. 综合场景测试")
    
    print("场景: AI Agent 一天的支付活动\n")
    
    # 模拟一天的交易
    daily_transactions = [
        # 早上：购买 BTC 信号
        {"agent": "Agent_Quant", "service_type": "quant-signal-btc", "amount": 300000000, "metadata": {"timeframe": "1h", "confidence": 88}},
        {"agent": "Agent_Quant", "service_type": "quant-signal-eth", "amount": 400000000, "metadata": {"timeframe": "4h", "confidence": 85}},
        
        # 中午：购买黄金信号
        {"agent": "Agent_Gold_Trader", "service_type": "quant-signal-gold", "amount": 500000000, "metadata": {"timeframe": "1d", "confidence": 92}},
        
        # 下午：订阅高频策略
        {"agent": "Agent_HFT", "service_type": "quant-strategy-hft", "amount": 1000000000, "metadata": {"expected_return": 15, "risk_level": "high"}},
        
        # 晚上：购买外汇信号
        {"agent": "Agent_Forex", "service_type": "quant-signal-forex", "amount": 200000000, "metadata": {"timeframe": "4h", "confidence": 80}},
    ]
    
    print("模拟交易中...")
    for tx in daily_transactions:
        requests.post(f"{BASE_URL}/api/x402/simulate", json=tx)
        time.sleep(0.3)
    
    print("✅ 交易模拟完成\n")
    
    # 生成报告
    print("生成审计报告...")
    report_data = {
        "start_date": "2026-02-01",
        "end_date": "2026-02-28"
    }
    
    response = requests.post(f"{BASE_URL}/api/x402/generate-report", json=report_data)
    result = response.json()
    
    if result['success']:
        stats = result['report']['statistics']
        print(f"\n📊 今日支付摘要:")
        print(f"  总交易: {stats['total_transactions']} 笔")
        print(f"  总支出: ${stats['total_amount']:.2f}")
        print(f"  使用服务: {', '.join(stats['services_used'].keys())}")

def test_human_readable_examples():
    """测试人类可读格式示例"""
    print_section("9. 人类可读格式示例")
    
    examples = [
        {
            "name": "BTC 量化信号",
            "data": {
                "agent": "Agent_BTC_Trader",
                "service_type": "quant-signal-btc",
                "amount": 500000000,
                "metadata": {"timeframe": "1h", "confidence": 88, "target_price": 52000}
            }
        },
        {
            "name": "ETH 量化信号",
            "data": {
                "agent": "Agent_ETH_Trader",
                "service_type": "quant-signal-eth",
                "amount": 300000000,
                "metadata": {"timeframe": "4h", "confidence": 85, "target_price": 3200}
            }
        },
        {
            "name": "高频交易策略",
            "data": {
                "agent": "Agent_HFT",
                "service_type": "quant-strategy-hft",
                "amount": 1000000000,
                "metadata": {"expected_return": 15, "risk_level": "high"}
            }
        }
    ]
    
    for example in examples:
        print(f"\n{example['name']}:")
        print(f"  原始数据: {json.dumps(example['data'], ensure_ascii=False)}")
        
        response = requests.post(f"{BASE_URL}/api/x402/simulate", json=example['data'])
        result = response.json()
        
        if result['success']:
            print(f"  ✅ 人类可读: {result['audit_log']['human_readable']}")

if __name__ == "__main__":
    print("=" * 60)
    print("  x402 解析 API 测试")
    print("=" * 60)
    
    try:
        test_health()
        test_simulate_transactions()
        test_parse_transaction()
        test_audit_logs()
        test_filter_logs()
        test_generate_report()
        test_batch_parse()
        test_comprehensive_scenario()
        test_human_readable_examples()
        
        print("\n" + "=" * 60)
        print("  ✅ 所有测试完成!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请确保 x402 解析 API 正在运行 (端口 8008)")
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
