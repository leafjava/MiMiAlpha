#!/usr/bin/env python3
"""
测试所有 OpenAI 服务是否正常工作
"""
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()

# 服务配置
SERVICES = [
    {
        'name': 'AI 助手服务',
        'port': 8000,
        'health_endpoint': '/health',
        'test_endpoint': '/v1/assistant/chat',
        'test_data': {
            'messages': [
                {'role': 'user', 'content': '你好，请简单介绍一下你自己'}
            ]
        }
    },
    {
        'name': '风险评估服务',
        'port': 5003,
        'health_endpoint': '/health',
        'test_endpoint': '/api/risk/assess',
        'test_data': {
            'amount': '1000',
            'description': '购买笔记本电脑',
            'buyer_address': '0x1234567890123456789012345678901234567890',
            'seller_address': '0x0987654321098765432109876543210987654321'
        }
    },
    {
        'name': '争议仲裁服务',
        'port': 5004,
        'health_endpoint': '/health',
        'test_endpoint': '/api/dispute/analyze',
        'test_data': {
            'dispute_type': 'not_received',
            'amount': '500',
            'description': '购买手机',
            'buyer_claim': '未收到商品',
            'seller_response': '已发货',
            'buyer_evidence': [
                {'type': 'text', 'content': '订单已超过30天未收到'}
            ],
            'seller_evidence': [],
            'chat_history': ['买家：什么时候发货？', '卖家：已经发货了']
        }
    },
    {
        'name': '支付治理服务',
        'port': 8006,
        'health_endpoint': '/health',
        'test_endpoint': '/api/governance/check-payment',
        'test_data': {
            'agent_address': '0x1234567890123456789012345678901234567890',
            'recipient': '0x0987654321098765432109876543210987654321',
            'amount': 5000000,
            'service': 'Test API Service'
        }
    }
]

def test_service(service):
    """测试单个服务"""
    print(f"\n{'='*60}")
    print(f"测试 {service['name']} (端口 {service['port']})")
    print('='*60)
    
    base_url = f"http://localhost:{service['port']}"
    
    # 1. 健康检查
    print(f"\n1️⃣  健康检查: {base_url}{service['health_endpoint']}")
    try:
        response = requests.get(f"{base_url}{service['health_endpoint']}", timeout=5)
        if response.ok:
            data = response.json()
            print(f"   ✅ 服务正常")
            print(f"   📊 状态: {data.get('status', 'N/A')}")
            print(f"   🤖 模型: {data.get('model', 'N/A')}")
            print(f"   🔑 API状态: {data.get('api_status', 'N/A')}")
        else:
            print(f"   ❌ 健康检查失败: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ 无法连接到服务: {e}")
        return False
    
    # 2. 功能测试
    print(f"\n2️⃣  功能测试: {base_url}{service['test_endpoint']}")
    try:
        response = requests.post(
            f"{base_url}{service['test_endpoint']}",
            json=service['test_data'],
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.ok:
            data = response.json()
            print(f"   ✅ 功能测试通过")
            
            # 显示关键信息
            if 'choices' in data:  # AI 助手
                content = data['choices'][0]['message']['content']
                print(f"   💬 AI 回复: {content[:100]}...")
            elif 'risk_score' in data:  # 风险评估
                print(f"   📊 风险评分: {data['risk_score']}")
                print(f"   🎯 风险等级: {data['risk_level_text']}")
            elif 'responsibility' in data:  # 争议仲裁
                print(f"   ⚖️  责任判定: {data['responsibility_text']}")
                print(f"   📋 处理方案: {data['resolution_text']}")
                print(f"   🎯 置信度: {data['confidence']}%")
            elif 'approved' in data:  # 支付治理
                print(f"   ✅ 审批结果: {'通过' if data['approved'] else '拒绝'}")
                print(f"   🎯 风险等级: {data.get('risk_level', 'N/A')}")
            
            return True
        else:
            print(f"   ❌ 功能测试失败: {response.status_code}")
            print(f"   📄 响应: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"   ❌ 测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("\n" + "="*60)
    print("🧪 OpenAI 服务测试")
    print("="*60)
    
    # 检查环境变量
    api_key = os.getenv('OPENAI_API_KEY', '')
    if not api_key or api_key == 'sk-your-api-key-here':
        print("\n⚠️  警告: OPENAI_API_KEY 未配置或使用默认值")
        print("   请在 .env 文件中设置正确的 API Key")
        return
    else:
        print(f"\n✅ OpenAI API Key 已配置: {api_key[:20]}...")
    
    print(f"🤖 使用模型: {os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')}")
    print(f"🔗 API 地址: {os.getenv('OPENAI_BASE_URL', 'https://api.openai.com/v1')}")
    
    # 测试所有服务
    results = {}
    for service in SERVICES:
        results[service['name']] = test_service(service)
    
    # 汇总结果
    print("\n" + "="*60)
    print("📊 测试结果汇总")
    print("="*60)
    
    for name, success in results.items():
        status = "✅ 通过" if success else "❌ 失败"
        print(f"   {status} - {name}")
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    print(f"\n总计: {passed}/{total} 个服务测试通过")
    
    if passed == total:
        print("\n🎉 所有服务测试通过！可以部署了！")
    else:
        print("\n⚠️  部分服务测试失败，请检查日志")
        print("\n💡 提示:")
        print("   1. 确保所有服务都已启动: ./start_all_openai.sh")
        print("   2. 检查 .env 文件中的 OPENAI_API_KEY")
        print("   3. 查看服务日志: tail -f logs/*.log")

if __name__ == '__main__':
    main()
