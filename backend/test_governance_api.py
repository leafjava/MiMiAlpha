"""
测试支付治理 API
"""

import requests
import json

BASE_URL = 'http://localhost:8006'

def test_health():
    """测试健康检查"""
    print("\n" + "="*60)
    print("测试 1: 健康检查")
    print("="*60)
    
    response = requests.get(f'{BASE_URL}/health')
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_set_policy():
    """测试设置策略"""
    print("\n" + "="*60)
    print("测试 2: 设置支付策略")
    print("="*60)
    
    data = {
        'agent_address': '0xAgent123',
        'single_limit': 10 * 10**6,    # 10 USDT
        'daily_limit': 100 * 10**6,    # 100 USDT
        'monthly_limit': 1000 * 10**6, # 1000 USDT
        'whitelist': ['0xDeepL', '0xOpenAI'],
        'blacklist': ['0xScammer']
    }
    
    response = requests.post(f'{BASE_URL}/api/governance/set-policy', json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_check_payment_normal():
    """测试正常支付"""
    print("\n" + "="*60)
    print("测试 3: 检查正常支付（应通过）")
    print("="*60)
    
    data = {
        'agent_address': '0xAgent123',
        'recipient': '0xDeepL',
        'amount': 5 * 10**6,  # 5 USDT
        'service': 'DeepL Translation API'
    }
    
    response = requests.post(f'{BASE_URL}/api/governance/check-payment', json=data)
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"批准: {result.get('approved')}")
    print(f"原因: {result.get('reason')}")
    print(f"风险等级: {result.get('risk_level')}")
    print(f"完整响应: {json.dumps(result, indent=2, ensure_ascii=False)}")

def test_check_payment_exceed_limit():
    """测试超限支付"""
    print("\n" + "="*60)
    print("测试 4: 检查超限支付（应拒绝）")
    print("="*60)
    
    data = {
        'agent_address': '0xAgent123',
        'recipient': '0xOpenAI',
        'amount': 50 * 10**6,  # 50 USDT（超过单次限额 10）
        'service': 'OpenAI GPT-4 API'
    }
    
    response = requests.post(f'{BASE_URL}/api/governance/check-payment', json=data)
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"批准: {result.get('approved')}")
    print(f"原因: {result.get('reason')}")
    print(f"风险等级: {result.get('risk_level')}")

def test_check_payment_blacklist():
    """测试黑名单支付"""
    print("\n" + "="*60)
    print("测试 5: 检查黑名单支付（应拒绝）")
    print("="*60)
    
    data = {
        'agent_address': '0xAgent123',
        'recipient': '0xScammer',
        'amount': 1 * 10**6,  # 1 USDT
        'service': 'Suspicious Service'
    }
    
    response = requests.post(f'{BASE_URL}/api/governance/check-payment', json=data)
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"批准: {result.get('approved')}")
    print(f"原因: {result.get('reason')}")
    print(f"风险等级: {result.get('risk_level')}")

def test_record_payment():
    """测试记录支付"""
    print("\n" + "="*60)
    print("测试 6: 记录支付")
    print("="*60)
    
    data = {
        'agent_address': '0xAgent123',
        'recipient': '0xDeepL',
        'amount': 5 * 10**6,
        'service': 'DeepL Translation API'
    }
    
    response = requests.post(f'{BASE_URL}/api/governance/record-payment', json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_get_stats():
    """测试获取统计"""
    print("\n" + "="*60)
    print("测试 7: 获取统计信息")
    print("="*60)
    
    response = requests.get(f'{BASE_URL}/api/governance/stats?agent_address=0xAgent123')
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

if __name__ == '__main__':
    print("\n" + "🧪 开始测试支付治理 API")
    print("请确保 API 服务已启动在 http://localhost:8006\n")
    
    try:
        test_health()
        test_set_policy()
        test_check_payment_normal()
        test_check_payment_exceed_limit()
        test_check_payment_blacklist()
        test_record_payment()
        test_get_stats()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请先运行: start_governance_api.bat")
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
