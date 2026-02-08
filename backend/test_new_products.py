"""
测试新增虚拟商品
"""
import requests
import json

BASE_URL = "http://localhost:8004"

def test_new_products():
    """测试新增的5个商品"""
    print("\n" + "="*60)
    print("🧪 测试新增虚拟商品")
    print("="*60)
    
    # 获取所有商品
    response = requests.get(f"{BASE_URL}/api/assets/products")
    data = response.json()
    
    print(f"\n✅ 商品总数: {len(data['products'])} 种")
    
    # 新增商品列表
    new_products = [
        "vizard_ai",
        "spline_pro",
        "92ziyuan",
        "666root",
        "kebaiwan"
    ]
    
    print("\n📦 新增商品详情:")
    print("-" * 60)
    
    for product in data['products']:
        if product['id'] in new_products:
            print(f"\n{product['icon']} {product['name']}")
            print(f"  ID: {product['id']}")
            print(f"  分类: {product['category']}")
            print(f"  批发价: ${product['wholesale_price']}")
            print(f"  零售价: ${product['retail_price']}")
            print(f"  租赁价: ${product['rental_price_per_day']}/天")
            print(f"  利润率: {product['profit_margin']}%")
            print(f"  库存: {product['stock']} 件")
            print(f"  月销量: {product['sold_this_month']} 件")
            print(f"  支持租赁: {'✅' if product['supports_rental'] else '❌'}")
            print(f"  描述: {product['description']}")
    
    # 统计分类
    print("\n" + "="*60)
    print("📊 分类统计")
    print("="*60)
    
    categories = {}
    for product in data['products']:
        cat = product['category']
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(product['name'])
    
    for cat, products in categories.items():
        print(f"\n{cat}: {len(products)} 种")
        for p in products:
            print(f"  - {p}")
    
    # 测试新商品定价
    print("\n" + "="*60)
    print("💰 测试新商品智能定价")
    print("="*60)
    
    for product_id in new_products[:2]:  # 测试前2个
        print(f"\n测试商品: {product_id}")
        response = requests.post(
            f"{BASE_URL}/api/assets/pricing",
            json={"product_id": product_id}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ 定价建议获取成功")
            print(f"  商品: {data['product_name']}")
            print(f"  当前零售价: ${data['current_pricing']['retail']}")
            print(f"  建议零售价: ${data['suggested_pricing']['retail']}")
            print(f"  定价策略: {data['pricing_strategy']}")
        else:
            print(f"❌ 定价建议获取失败")
    
    # 测试新商品订单
    print("\n" + "="*60)
    print("🛒 测试新商品订单创建")
    print("="*60)
    
    # 测试购买
    print("\n📦 测试购买订单:")
    response = requests.post(
        f"{BASE_URL}/api/assets/order",
        json={
            "product_id": "vizard_ai",
            "type": "purchase",
            "quantity": 1
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 订单创建成功")
        print(f"  订单号: {data['order_id']}")
        print(f"  商品: {data['product_name']}")
        print(f"  总价: ${data['total_price']}")
    else:
        print(f"❌ 订单创建失败")
    
    # 测试租赁
    print("\n⏰ 测试租赁订单:")
    response = requests.post(
        f"{BASE_URL}/api/assets/order",
        json={
            "product_id": "spline_pro",
            "type": "rental",
            "quantity": 1,
            "rental_days": 7
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 订单创建成功")
        print(f"  订单号: {data['order_id']}")
        print(f"  商品: {data['product_name']}")
        print(f"  租赁天数: {data['rental_days']}")
        print(f"  总价: ${data['total_price']}")
    else:
        print(f"❌ 订单创建失败")

def test_yield_assets():
    """测试收益计算中的资产组成"""
    print("\n" + "="*60)
    print("📊 测试资产组成更新")
    print("="*60)
    
    response = requests.get("http://localhost:8005/api/yield/assets")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ 资产总价值: ${data['total_assets_value']:,}")
        print(f"\n📦 资产明细 ({len(data['assets'])} 项):")
        
        for asset in data['assets']:
            print(f"\n{asset['icon']} {asset['name']}")
            print(f"  数量: {asset['quantity']}")
            print(f"  单价: ${asset['unit_value']}")
            print(f"  总值: ${asset['total_value']:,}")
            print(f"  占比: {asset['percentage']}%")
        
        print(f"\n📊 分类统计:")
        for cat, value in data['categories'].items():
            print(f"  {cat}: ${value:,}")
    else:
        print(f"❌ 资产组成获取失败")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧪 新增虚拟商品测试")
    print("="*60)
    print("确保以下服务已启动:")
    print("- 资产管理 API: http://localhost:8004")
    print("- 收益计算 API: http://localhost:8005")
    print("="*60)
    
    try:
        test_new_products()
        test_yield_assets()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60)
        print("\n新增商品:")
        print("1. 🎬 Vizard AI - AI 视频工具")
        print("2. 🎨 Spline Pro - 3D 设计工具")
        print("3. 📚 92资源站会员 - 资源下载")
        print("4. 🔓 666ROOT会员 - 安卓破解")
        print("5. 📖 课百万会员 - 在线课程")
        print("\n商品总数: 11 种")
        print("分类总数: 6 类")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ 错误: 无法连接到 API 服务")
        print("请确保已启动:")
        print("- python asset_management_api.py")
        print("- python yield_calculation_api.py")
    except Exception as e:
        print(f"\n❌ 测试失败: {str(e)}")
