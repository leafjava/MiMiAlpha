"""
测试资产管理 API
"""
import requests
import json

BASE_URL = "http://localhost:8004"

def test_health():
    """测试健康检查"""
    print("\n" + "="*60)
    print("测试 1: 健康检查")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

def test_get_products():
    """测试获取商品列表"""
    print("\n" + "="*60)
    print("测试 2: 获取虚拟商品列表")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/assets/products")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"商品数量: {len(data['products'])}")
    print("\n商品列表:")
    for product in data['products']:
        print(f"\n{product['icon']} {product['name']}")
        print(f"  分类: {product['category']}")
        print(f"  零售价: ${product['retail_price']}")
        print(f"  租赁价: ${product['rental_price_per_day']}/天")
        print(f"  库存: {product['stock']} 件")
        print(f"  月销量: {product['sold_this_month']} 件")

def test_get_inventory():
    """测试获取库存总览"""
    print("\n" + "="*60)
    print("测试 3: 获取库存总览")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/api/assets/inventory")
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"总价值: ${data['total_value']}")
    print(f"总数量: {data['total_items']} 件")
    print(f"商品种类: {data['product_types']} 种")
    
    if data['low_stock_items']:
        print("\n⚠️  低库存商品:")
        for item in data['low_stock_items']:
            print(f"  {item['icon']} {item['name']}: {item['stock']} 件")

def test_pricing_suggestion():
    """测试智能定价建议"""
    print("\n" + "="*60)
    print("测试 4: AI 智能定价建议")
    print("="*60)
    
    test_data = {
        "product_id": "chatgpt_plus"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/assets/pricing",
        json=test_data
    )
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n商品: {data['product_name']}")
    print(f"\n当前定价:")
    print(f"  零售价: ${data['current_pricing']['retail']}")
    print(f"  租赁价: ${data['current_pricing']['rental_per_day']}/天")
    print(f"\n建议定价:")
    print(f"  零售价: ${data['suggested_pricing']['retail']}")
    print(f"  租赁价: ${data['suggested_pricing']['rental_per_day']}/天")
    print(f"\n定价策略: {data['pricing_strategy']}")
    print(f"\n库存状态:")
    print(f"  当前库存: {data['inventory_status']['stock']} 件")
    print(f"  库存天数: {data['inventory_status']['days_of_stock']} 天")
    print(f"  月销量: {data['inventory_status']['sold_this_month']} 件")
    print(f"\n🤖 AI 分析:")
    print(f"  {data['ai_analysis']}")

def test_purchase_suggestion():
    """测试采购建议"""
    print("\n" + "="*60)
    print("测试 5: AI 采购建议")
    print("="*60)
    
    test_data = {
        "budget": 5000
    }
    
    response = requests.post(
        f"{BASE_URL}/api/assets/purchase",
        json=test_data
    )
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"\n预算: ${data['budget']}")
    print(f"建议采购商品数: {len(data['suggestions'])}")
    print(f"总成本: ${data['total_cost']}")
    print(f"剩余预算: ${data['remaining_budget']}")
    
    print("\n📦 采购建议:")
    for suggestion in data['suggestions']:
        print(f"\n{suggestion['icon']} {suggestion['product_name']}")
        print(f"  优先级: {suggestion['priority']}")
        print(f"  当前库存: {suggestion['current_stock']} 件")
        print(f"  库存天数: {suggestion['days_of_stock']} 天")
        print(f"  建议采购: {suggestion['suggested_quantity']} 件")
        print(f"  采购成本: ${suggestion['cost']}")
        print(f"  原因: {suggestion['reason']}")

def test_create_order():
    """测试创建订单"""
    print("\n" + "="*60)
    print("测试 6: 创建订单")
    print("="*60)
    
    # 测试购买订单
    print("\n📦 测试购买订单:")
    purchase_data = {
        "product_id": "chatgpt_plus",
        "type": "purchase",
        "quantity": 2
    }
    
    response = requests.post(
        f"{BASE_URL}/api/assets/order",
        json=purchase_data
    )
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"订单号: {data['order_id']}")
    print(f"商品: {data['product_name']}")
    print(f"类型: {data['type']}")
    print(f"数量: {data['quantity']}")
    print(f"单价: ${data['unit_price']}")
    print(f"总价: ${data['total_price']}")
    
    # 测试租赁订单
    print("\n⏰ 测试租赁订单:")
    rental_data = {
        "product_id": "vpn_premium",
        "type": "rental",
        "quantity": 1,
        "rental_days": 7
    }
    
    response = requests.post(
        f"{BASE_URL}/api/assets/order",
        json=rental_data
    )
    data = response.json()
    
    print(f"状态码: {response.status_code}")
    print(f"订单号: {data['order_id']}")
    print(f"商品: {data['product_name']}")
    print(f"类型: {data['type']}")
    print(f"数量: {data['quantity']}")
    print(f"租赁天数: {data['rental_days']}")
    print(f"单价: ${data['unit_price']}/天")
    print(f"总价: ${data['total_price']}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 资产管理 API 测试")
    print("="*60)
    print("确保 API 服务已启动: python asset_management_api.py")
    print("="*60)
    
    try:
        test_health()
        test_get_products()
        test_get_inventory()
        test_pricing_suggestion()
        test_purchase_suggestion()
        test_create_order()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请确保已启动: python asset_management_api.py")
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
