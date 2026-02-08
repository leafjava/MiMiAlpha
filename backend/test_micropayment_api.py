"""
微支付聚合 API 测试脚本
"""

import requests
import json
import time

BASE_URL = "http://localhost:8007"

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

def test_add_payments():
    """测试添加微支付"""
    print_section("2. 添加微支付到聚合队列")
    
    agent_address = "0x1234567890abcdef"
    
    # 添加 10 笔微支付
    for i in range(10):
        payment = {
            "agent_address": agent_address,
            "recipient": f"0xRecipient{i % 3}",  # 3 个不同的接收方
            "amount": 100000,  # 0.1 USDT
            "service": f"ChatGPT API Call #{i+1}"
        }
        
        response = requests.post(f"{BASE_URL}/api/micropayment/add", json=payment)
        result = response.json()
        
        print(f"\n第 {i+1} 笔支付:")
        print(f"  队列大小: {result.get('queue_size')}")
        print(f"  是否结算: {result.get('settled')}")
        
        if result.get('settled'):
            batch = result.get('batch')
            print(f"  ✅ 批次已结算!")
            print(f"  批次ID: {batch['batch_id']}")
            print(f"  聚合支付数: {batch['total_payments']}")
            print(f"  Energy 节省: {batch['energy_savings']['energy_saved']}")
        
        time.sleep(0.5)

def test_queue_status():
    """测试查看队列状态"""
    print_section("3. 查看队列状态")
    
    response = requests.get(f"{BASE_URL}/api/micropayment/queue")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_force_settle():
    """测试强制结算"""
    print_section("4. 强制结算")
    
    data = {
        "agent_address": "0x1234567890abcdef"
    }
    
    response = requests.post(f"{BASE_URL}/api/micropayment/force-settle", json=data)
    result = response.json()
    
    print(f"结算结果: {json.dumps(result, indent=2, ensure_ascii=False)}")

def test_batches():
    """测试查看批次"""
    print_section("5. 查看已结算批次")
    
    response = requests.get(f"{BASE_URL}/api/micropayment/batches?limit=5")
    result = response.json()
    
    print(f"总批次数: {result['total_batches']}")
    print(f"\n最近的批次:")
    for batch in result['batches']:
        print(f"\n批次ID: {batch['batch_id']}")
        print(f"  时间: {batch['timestamp']}")
        print(f"  聚合支付数: {batch['total_payments']}")
        print(f"  Energy 节省: {batch['energy_savings']['energy_saved']}")
        print(f"  成本节省: ${batch['energy_savings']['cost_saved']:.4f}")
        print(f"  节省率: {batch['energy_savings']['savings_rate']:.1f}%")

def test_stats():
    """测试统计信息"""
    print_section("6. 查看统计信息")
    
    response = requests.get(f"{BASE_URL}/api/micropayment/stats")
    result = response.json()
    
    print(f"统计数据:")
    print(f"  总支付数: {result['energy_stats']['total_payments']}")
    print(f"  总批次数: {result['energy_stats']['total_batches']}")
    print(f"  总节省 Energy: {result['energy_stats']['energy_saved']}")
    print(f"  总节省成本: ${result['energy_stats']['cost_saved']:.4f}")
    print(f"  平均批次大小: {result['average_batch_size']:.1f}")

def test_analyze():
    """测试 AI 分析"""
    print_section("7. AI 分析 Energy 节省")
    
    data = {
        "num_payments": 1000,
        "time_period": "daily"
    }
    
    response = requests.post(f"{BASE_URL}/api/micropayment/analyze", json=data)
    result = response.json()
    
    print(f"\n节省分析:")
    savings = result['savings']
    print(f"  支付笔数: 1000")
    print(f"  传统方式 Energy: {savings['traditional_energy']}")
    print(f"  聚合方式 Energy: {savings['aggregated_energy']}")
    print(f"  节省 Energy: {savings['energy_saved']}")
    print(f"  节省成本: ${savings['cost_saved']:.2f}")
    print(f"  节省率: {savings['savings_rate']:.1f}%")
    
    print(f"\nAI 分析:")
    ai = result['ai_analysis']
    print(f"  摘要: {ai.get('summary', 'N/A')}")
    print(f"  建议: {ai.get('recommendation', 'N/A')}")

def test_high_frequency():
    """测试高频微支付场景"""
    print_section("8. 高频微支付场景测试")
    
    agent_address = "0xHighFrequencyAgent"
    
    print("模拟 100 笔高频微支付...")
    
    for i in range(100):
        payment = {
            "agent_address": agent_address,
            "recipient": f"0xProvider{i % 5}",
            "amount": 10000,  # 0.01 USDT
            "service": f"API Call #{i+1}"
        }
        
        response = requests.post(f"{BASE_URL}/api/micropayment/add", json=payment)
        
        if (i + 1) % 10 == 0:
            print(f"  已添加 {i+1} 笔...")
    
    print("\n✅ 100 笔微支付已添加")
    
    # 查看队列状态
    response = requests.get(f"{BASE_URL}/api/micropayment/queue?agent_address={agent_address}")
    result = response.json()
    print(f"\n队列状态:")
    print(f"  队列大小: {result['queue_size']}")
    print(f"  应该结算: {result['should_settle']}")
    
    # 强制结算
    if result['queue_size'] > 0:
        print("\n强制结算剩余支付...")
        settle_response = requests.post(
            f"{BASE_URL}/api/micropayment/force-settle",
            json={"agent_address": agent_address}
        )
        settle_result = settle_response.json()
        
        if settle_result['success']:
            batch = settle_result['batch']
            print(f"✅ 结算成功!")
            print(f"  批次ID: {batch['batch_id']}")
            print(f"  聚合支付数: {batch['total_payments']}")
            print(f"  Energy 节省率: {batch['energy_savings']['savings_rate']:.1f}%")

if __name__ == "__main__":
    print("=" * 60)
    print("  微支付聚合 API 测试")
    print("=" * 60)
    
    try:
        test_health()
        test_add_payments()
        test_queue_status()
        test_force_settle()
        test_batches()
        test_stats()
        test_analyze()
        test_high_frequency()
        
        print("\n" + "=" * 60)
        print("  ✅ 所有测试完成!")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请确保微支付聚合 API 正在运行 (端口 8007)")
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
