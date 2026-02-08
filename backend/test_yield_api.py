"""
测试收益计算 API
"""
import requests
import json

BASE_URL = "http://localhost:8005"

def test_health():
    """测试健康检查"""
    print("\n" + "="*60)
    print("测试 1: 健康检查")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_yield_overview():
    """测试收益总览"""
    print("\n" + "="*60)
    print("测试 2: 收益总览")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/yield/overview")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n💰 Vault 统计:")
    print(f"  TVL: ${data['vault_stats']['tvl']:,}")
    print(f"  资产价值: ${data['vault_stats']['assets_value']:,}")
    print(f"  现金余额: ${data['vault_stats']['cash_balance']:,}")
    print(f"  投资者数量: {data['vault_stats']['total_investors']}")
    print(f"  运行天数: {data['vault_stats']['days_running']}")
    
    print(f"\n💵 月度收益:")
    print(f"  批发零售套利: ${data['monthly_revenue']['trading_profit']:,}")
    print(f"  分时租赁收入: ${data['monthly_revenue']['rental_income']:,}")
    print(f"  总收益: ${data['monthly_revenue']['total']:,}")
    
    print(f"\n💳 费用:")
    print(f"  管理费: ${data['fees']['management_fee']:.2f}")
    print(f"  表现费: ${data['fees']['performance_fee']:.2f}")
    print(f"  总费用: ${data['fees']['total_fees']:.2f}")
    
    print(f"\n💎 净收益: ${data['net_revenue']:,}")
    
    print(f"\n📈 收益率:")
    print(f"  月化收益率: {data['returns']['monthly_return']}%")
    print(f"  年化收益率 (APY): {data['returns']['apy']}%")

def test_yield_history():
    """测试历史收益"""
    print("\n" + "="*60)
    print("测试 3: 历史收益（最近30天）")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/yield/history?days=30")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n📊 统计数据:")
    print(f"  周期: {data['period_days']} 天")
    print(f"  平均日收益率: {data['statistics']['avg_daily_return']}%")
    print(f"  最高日收益率: {data['statistics']['max_daily_return']}%")
    print(f"  最低日收益率: {data['statistics']['min_daily_return']}%")
    print(f"  累计收益率: {data['statistics']['total_return']}%")
    
    print(f"\n📈 最近5天数据:")
    for day_data in data['data'][-5:]:
        print(f"  {day_data['date']}: {day_data['daily_return']}% (累计: {day_data['cumulative_return']}%)")

def test_asset_composition():
    """测试资产组成"""
    print("\n" + "="*60)
    print("测试 4: 资产组成")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/yield/assets")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n💼 总资产价值: ${data['total_assets_value']:,}")
    
    print(f"\n📦 资产明细:")
    for asset in data['assets']:
        print(f"\n{asset['icon']} {asset['name']}")
        print(f"  数量: {asset['quantity']}")
        print(f"  单价: ${asset['unit_value']}")
        print(f"  总值: ${asset['total_value']:,}")
        print(f"  占比: {asset['percentage']}%")
    
    print(f"\n📊 分类统计:")
    for category, value in data['categories'].items():
        print(f"  {category}: ${value:,}")

def test_investor_yield():
    """测试投资者收益计算"""
    print("\n" + "="*60)
    print("测试 5: 投资者收益计算")
    print("="*60)
    
    test_data = {
        "amount": 1000,
        "days": 30
    }
    
    response = requests.post(
        f"{BASE_URL}/api/yield/investor",
        json=test_data
    )
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n💰 投资信息:")
    print(f"  投资金额: ${data['investment']['amount']}")
    print(f"  投资天数: {data['investment']['days']}")
    print(f"  份额占比: {data['investment']['share_percentage']}%")
    
    print(f"\n💵 收益情况:")
    print(f"  日收益: ${data['revenue']['daily']}")
    print(f"  总收益: ${data['revenue']['total']}")
    print(f"  收益率: {data['revenue']['return_rate']}%")
    print(f"  年化收益率 (APY): {data['revenue']['apy']}%")
    
    print(f"\n💎 最终价值: ${data['final_value']}")

def test_transparency_report():
    """测试透明度报告"""
    print("\n" + "="*60)
    print("测试 6: 透明度报告")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/yield/transparency")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n📋 报告信息:")
    print(f"  Vault 地址: {data['vault_address']}")
    print(f"  报告日期: {data['report_date']}")
    print(f"  TVL: ${data['tvl']:,}")
    print(f"  净资产价值: ${data['net_asset_value']:,}")
    print(f"  投资者数量: {data['total_investors']}")
    
    print(f"\n💼 资产分布:")
    for key, value in data['asset_breakdown'].items():
        print(f"  {key}: ${value:,}")
    
    print(f"\n💵 收益来源:")
    for key, info in data['revenue_sources'].items():
        print(f"  {key}: ${info['amount']:,} ({info['percentage']}%)")
    
    print(f"\n💳 费用结构:")
    print(f"  管理费: {data['fee_structure']['management_fee']['rate']}")
    print(f"    本月收取: ${data['fee_structure']['management_fee']['collected_this_month']}")
    print(f"  表现费: {data['fee_structure']['performance_fee']['rate']}")
    print(f"    本月收取: ${data['fee_structure']['performance_fee']['collected_this_month']}")
    
    print(f"\n📈 表现指标:")
    for key, value in data['performance_metrics'].items():
        print(f"  {key}: {value}")
    
    print(f"\n🔒 风险指标:")
    for key, value in data['risk_metrics'].items():
        print(f"  {key}: {value}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 收益计算 API 测试")
    print("="*60)
    print("确保 API 服务已启动: python yield_calculation_api.py")
    print("="*60)
    
    try:
        test_health()
        test_yield_overview()
        test_yield_history()
        test_asset_composition()
        test_investor_yield()
        test_transparency_report()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请确保已启动: python yield_calculation_api.py")
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
