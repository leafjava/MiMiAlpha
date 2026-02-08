"""
虚拟商品资产管理 API
管理虚拟商品库存、定价、采购、销售和租赁
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import random

load_dotenv()

app = Flask(__name__)
CORS(app)

# Ollama API 配置
OLLAMA_API = os.getenv("OLLAMA_API", "http://localhost:11434/api/generate")
MODEL_NAME = os.getenv("MODEL_NAME", "qwen3:4b-instruct-2507-q4_K_M")

# 虚拟商品类型定义
VIRTUAL_GOODS = {
    "chatgpt_plus": {
        "name": "ChatGPT Plus",
        "category": "AI工具",
        "wholesale_price": 15.0,
        "retail_price": 25.0,
        "rental_price_per_day": 2.0,
        "profit_margin": 0.67,
        "rental_margin": 3.0,
        "icon": "🤖",
        "description": "OpenAI ChatGPT Plus 会员，支持 GPT-4 和更快响应"
    },
    "claude_pro": {
        "name": "Claude Pro",
        "category": "AI工具",
        "wholesale_price": 18.0,
        "retail_price": 28.0,
        "rental_price_per_day": 2.5,
        "profit_margin": 0.56,
        "rental_margin": 3.17,
        "icon": "🧠",
        "description": "Anthropic Claude Pro 会员，200K 上下文窗口"
    },
    "vpn_premium": {
        "name": "VPN Premium",
        "category": "网络工具",
        "wholesale_price": 3.0,
        "retail_price": 8.0,
        "rental_price_per_day": 0.5,
        "profit_margin": 1.67,
        "rental_margin": 4.0,
        "icon": "🔒",
        "description": "高速 VPN 服务，支持全球节点"
    },
    "steam_card_50": {
        "name": "Steam $50 礼品卡",
        "category": "游戏",
        "wholesale_price": 47.5,
        "retail_price": 50.0,
        "rental_price_per_day": 0,
        "profit_margin": 0.05,
        "rental_margin": 0,
        "icon": "🎮",
        "description": "Steam 平台 $50 美元礼品卡"
    },
    "netflix_4k": {
        "name": "Netflix 4K",
        "category": "流媒体",
        "wholesale_price": 12.0,
        "retail_price": 20.0,
        "rental_price_per_day": 1.5,
        "profit_margin": 0.67,
        "rental_margin": 2.75,
        "icon": "🎬",
        "description": "Netflix 4K 高级会员，支持 4 屏同看"
    },
    "spotify_premium": {
        "name": "Spotify Premium",
        "category": "流媒体",
        "wholesale_price": 8.0,
        "retail_price": 15.0,
        "rental_price_per_day": 1.0,
        "profit_margin": 0.88,
        "rental_margin": 2.75,
        "icon": "🎵",
        "description": "Spotify 高级会员，无广告高音质"
    }
}

# 模拟库存数据
inventory = {}

def init_inventory():
    """初始化库存数据"""
    global inventory
    for product_id, product in VIRTUAL_GOODS.items():
        inventory[product_id] = {
            "stock": random.randint(10, 100),
            "sold_this_month": random.randint(5, 50),
            "rented_count": random.randint(0, 30) if product["rental_price_per_day"] > 0 else 0,
            "last_purchase_date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            "avg_sales_per_day": round(random.uniform(1, 10), 2)
        }

init_inventory()

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        "status": "ok",
        "service": "Asset Management API",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/assets/products', methods=['GET'])
def get_products():
    """获取所有虚拟商品列表"""
    products = []
    for product_id, product in VIRTUAL_GOODS.items():
        inv = inventory.get(product_id, {})
        products.append({
            "id": product_id,
            "name": product["name"],
            "category": product["category"],
            "icon": product["icon"],
            "description": product["description"],
            "wholesale_price": product["wholesale_price"],
            "retail_price": product["retail_price"],
            "rental_price_per_day": product["rental_price_per_day"],
            "profit_margin": round(product["profit_margin"] * 100, 1),
            "stock": inv.get("stock", 0),
            "sold_this_month": inv.get("sold_this_month", 0),
            "rented_count": inv.get("rented_count", 0),
            "supports_rental": product["rental_price_per_day"] > 0
        })
    
    return jsonify({"products": products})

@app.route('/api/assets/inventory', methods=['GET'])
def get_inventory():
    """获取库存总览"""
    total_value = 0
    total_items = 0
    low_stock_items = []
    
    for product_id, inv in inventory.items():
        product = VIRTUAL_GOODS[product_id]
        stock = inv["stock"]
        value = stock * product["wholesale_price"]
        total_value += value
        total_items += stock
        
        if stock < 10:
            low_stock_items.append({
                "id": product_id,
                "name": product["name"],
                "stock": stock,
                "icon": product["icon"]
            })
    
    return jsonify({
        "total_value": round(total_value, 2),
        "total_items": total_items,
        "product_types": len(VIRTUAL_GOODS),
        "low_stock_items": low_stock_items,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/assets/pricing', methods=['POST'])
def suggest_pricing():
    """AI 智能定价建议"""
    data = request.json
    product_id = data.get('product_id')
    
    if product_id not in VIRTUAL_GOODS:
        return jsonify({"error": "商品不存在"}), 404
    
    product = VIRTUAL_GOODS[product_id]
    inv = inventory.get(product_id, {})
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到定价建议请求: {product['name']}")
    
    # 基础定价分析
    stock = inv.get("stock", 0)
    sold = inv.get("sold_this_month", 0)
    avg_sales = inv.get("avg_sales_per_day", 0)
    
    # 库存周转率
    days_of_stock = stock / max(avg_sales, 0.1)
    
    # 定价建议
    base_retail = product["retail_price"]
    base_rental = product["rental_price_per_day"]
    
    # 根据库存调整价格
    if stock < 10:
        # 库存低，提价
        suggested_retail = base_retail * 1.2
        suggested_rental = base_rental * 1.3
        pricing_strategy = "库存紧张，建议提价"
    elif stock > 50:
        # 库存高，降价促销
        suggested_retail = base_retail * 0.9
        suggested_rental = base_rental * 0.85
        pricing_strategy = "库存充足，建议促销"
    else:
        # 正常定价
        suggested_retail = base_retail
        suggested_rental = base_rental
        pricing_strategy = "库存正常，保持现价"
    
    # AI 分析
    ai_analysis = ""
    try:
        prompt = f"""你是一个虚拟商品定价专家。请分析以下商品的定价策略：

商品名称: {product['name']}
批发价: ${product['wholesale_price']}
当前零售价: ${base_retail}
当前租赁价: ${base_rental}/天
当前库存: {stock} 件
本月销量: {sold} 件
日均销量: {avg_sales} 件
库存周转: {days_of_stock:.1f} 天

请给出简洁的定价建议（80字以内），包括：
1. 零售价是否合理
2. 租赁价是否有竞争力
3. 是否需要调价"""

        response = requests.post(
            OLLAMA_API,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 150
                }
            },
            timeout=30
        )
        
        if response.status_code == 200:
            ai_analysis = response.json().get('response', '').strip()
            print(f"✅ AI 定价分析完成")
    except Exception as e:
        print(f"⚠️  AI 分析失败: {str(e)}")
        ai_analysis = "AI 分析暂时不可用"
    
    result = {
        "product_id": product_id,
        "product_name": product["name"],
        "current_pricing": {
            "retail": base_retail,
            "rental_per_day": base_rental
        },
        "suggested_pricing": {
            "retail": round(suggested_retail, 2),
            "rental_per_day": round(suggested_rental, 2)
        },
        "pricing_strategy": pricing_strategy,
        "inventory_status": {
            "stock": stock,
            "days_of_stock": round(days_of_stock, 1),
            "sold_this_month": sold
        },
        "ai_analysis": ai_analysis,
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"✅ 定价建议完成: {pricing_strategy}")
    
    return jsonify(result)

@app.route('/api/assets/purchase', methods=['POST'])
def purchase_suggestion():
    """AI 采购建议"""
    data = request.json
    budget = data.get('budget', 1000)
    
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 收到采购建议请求，预算: ${budget}")
    
    suggestions = []
    
    for product_id, product in VIRTUAL_GOODS.items():
        inv = inventory.get(product_id, {})
        stock = inv.get("stock", 0)
        avg_sales = inv.get("avg_sales_per_day", 0)
        days_of_stock = stock / max(avg_sales, 0.1)
        
        # 需要补货
        if days_of_stock < 15:
            # 计算建议采购量
            target_days = 30
            suggested_quantity = int(avg_sales * target_days - stock)
            suggested_quantity = max(suggested_quantity, 10)
            
            cost = suggested_quantity * product["wholesale_price"]
            
            if cost <= budget:
                priority = "高" if days_of_stock < 7 else "中"
                suggestions.append({
                    "product_id": product_id,
                    "product_name": product["name"],
                    "icon": product["icon"],
                    "current_stock": stock,
                    "days_of_stock": round(days_of_stock, 1),
                    "suggested_quantity": suggested_quantity,
                    "cost": round(cost, 2),
                    "priority": priority,
                    "reason": f"库存仅够 {days_of_stock:.1f} 天，建议补货"
                })
    
    # 按优先级排序
    suggestions.sort(key=lambda x: (x["priority"] == "高", -x["days_of_stock"]), reverse=True)
    
    total_cost = sum(s["cost"] for s in suggestions)
    
    result = {
        "budget": budget,
        "suggestions": suggestions,
        "total_cost": round(total_cost, 2),
        "remaining_budget": round(budget - total_cost, 2),
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"✅ 采购建议完成: {len(suggestions)} 个商品需要补货")
    
    return jsonify(result)

@app.route('/api/assets/order', methods=['POST'])
def create_order():
    """创建订单（购买或租赁）"""
    data = request.json
    product_id = data.get('product_id')
    order_type = data.get('type', 'purchase')  # purchase 或 rental
    quantity = data.get('quantity', 1)
    rental_days = data.get('rental_days', 0)
    
    if product_id not in VIRTUAL_GOODS:
        return jsonify({"error": "商品不存在"}), 404
    
    product = VIRTUAL_GOODS[product_id]
    inv = inventory.get(product_id, {})
    
    if inv.get("stock", 0) < quantity:
        return jsonify({"error": "库存不足"}), 400
    
    # 计算价格
    if order_type == 'purchase':
        unit_price = product["retail_price"]
        total_price = unit_price * quantity
    else:  # rental
        if product["rental_price_per_day"] == 0:
            return jsonify({"error": "该商品不支持租赁"}), 400
        unit_price = product["rental_price_per_day"]
        total_price = unit_price * rental_days * quantity
    
    # 生成订单
    order = {
        "order_id": f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "product_id": product_id,
        "product_name": product["name"],
        "type": order_type,
        "quantity": quantity,
        "rental_days": rental_days if order_type == 'rental' else 0,
        "unit_price": unit_price,
        "total_price": round(total_price, 2),
        "status": "pending",
        "created_at": datetime.now().isoformat()
    }
    
    print(f"✅ 订单创建成功: {order['order_id']}")
    
    return jsonify(order)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("📦 虚拟商品资产管理 API 启动")
    print("="*60)
    print(f"📡 API 地址: http://localhost:8004")
    print(f"🔗 健康检查: http://localhost:8004/health")
    print(f"📦 商品列表: http://localhost:8004/api/assets/products")
    print(f"📊 库存总览: http://localhost:8004/api/assets/inventory")
    print(f"💰 智能定价: http://localhost:8004/api/assets/pricing")
    print(f"🛒 采购建议: http://localhost:8004/api/assets/purchase")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=8004, debug=False)
